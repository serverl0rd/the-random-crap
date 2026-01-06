const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('.'))

// Simple auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-please'
const sessions = new Map()

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

const DATA_FILE = process.env.DATA_PATH ? `${process.env.DATA_PATH}/posts.json` : 'posts.json'

// Initialize posts file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: [], nextId: 1 }))
}

// Login
app.post('/api/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    const token = generateToken()
    sessions.set(token, { loggedIn: true })
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Invalid password' })
  }
})

// Get all posts
app.get('/api/posts', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  res.json(data.posts)
})

// Create post
app.post('/api/post', requireAuth, (req, res) => {
  const content = req.body.content?.substring(0, 500)
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content required' })
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const post = {
    id: data.nextId++,
    content: content.trim(),
    created: new Date().toISOString(),
    edited: false,
    versions: []
  }
  
  data.posts.unshift(post)
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  res.json(post)
})

// Edit post
app.put('/api/post/:id', requireAuth, (req, res) => {
  const content = req.body.content?.substring(0, 500)
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content required' })
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const post = data.posts.find(p => p.id === parseInt(req.params.id))
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  post.versions.push({
    content: post.content,
    edited: post.edited || post.created
  })
  
  post.content = content.trim()
  post.edited = new Date().toISOString()
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  res.json(post)
})

// Delete post
app.delete('/api/post/:id', requireAuth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const index = data.posts.findIndex(p => p.id === parseInt(req.params.id))
  
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' })
  }

  data.posts.splice(index, 1)
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  res.json({ success: true })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => console.log(`Running on port ${PORT}`))