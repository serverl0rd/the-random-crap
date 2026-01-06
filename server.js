require('dotenv').config()
const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.static('.'))

// Email configuration - use environment variables in production
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com'
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password'
const DEV_MODE = process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development'

// Create email transporter
const transporter = DEV_MODE ? null : nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
})

// In-memory stores
const sessions = new Map()
const otpStore = new Map() // email -> { otp, expires, username }

const DATA_FILE = process.env.DATA_PATH ? `${process.env.DATA_PATH}/posts.json` : 'posts.json'
const USERS_FILE = process.env.DATA_PATH ? `${process.env.DATA_PATH}/users.json` : 'users.json'

// Initialize files if they don't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: [] }))
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: {} }))
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  req.user = sessions.get(token)
  next()
}

// Check if username is available
app.post('/api/check-username', (req, res) => {
  const { username } = req.body
  if (!username || !username.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
    return res.status(400).json({ error: 'Invalid username format' })
  }
  
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  const available = !Object.values(users.users).some(u => u.username === username)
  res.json({ available })
})

// Send OTP for signup
app.post('/api/signup/send-otp', async (req, res) => {
  console.log('Signup OTP request received:', req.body)
  const { email, username } = req.body
  
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  
  if (!username || !username.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
    return res.status(400).json({ error: 'Invalid username format' })
  }
  
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  
  // Check if email already exists
  if (users.users[email]) {
    return res.status(400).json({ error: 'Email already registered' })
  }
  
  // Check if username is taken
  if (Object.values(users.users).some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already taken' })
  }
  
  const otp = generateOTP()
  otpStore.set(email, {
    otp,
    username,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    type: 'signup'
  })
  
  try {
    if (DEV_MODE) {
      console.log(`\n=== DEVELOPMENT MODE OTP ===`)
      console.log(`Email: ${email}`)
      console.log(`OTP Code: ${otp}`)
      console.log(`Username: ${username}`)
      console.log(`===========================\n`)
      res.json({ message: 'OTP sent to email (check console in dev mode)' })
    } else {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: 'Your Random Crap Signup Code',
        text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
      })
      res.json({ message: 'OTP sent to email' })
    }
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// Verify OTP and create account
app.post('/api/signup/verify', (req, res) => {
  const { email, otp } = req.body
  
  const stored = otpStore.get(email)
  if (!stored || stored.type !== 'signup') {
    return res.status(400).json({ error: 'No pending signup for this email' })
  }
  
  if (Date.now() > stored.expires) {
    otpStore.delete(email)
    return res.status(400).json({ error: 'OTP expired' })
  }
  
  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' })
  }
  
  // Create user
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  users.users[email] = {
    username: stored.username,
    created: new Date().toISOString(),
    postCount: 0
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  
  // Create session
  const token = generateToken()
  sessions.set(token, { email, username: stored.username })
  
  otpStore.delete(email)
  res.json({ token, username: stored.username })
})

// Send OTP for login
app.post('/api/login/send-otp', async (req, res) => {
  const { email } = req.body
  
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  
  if (!users.users[email]) {
    return res.status(400).json({ error: 'Email not registered' })
  }
  
  const otp = generateOTP()
  otpStore.set(email, {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
    type: 'login'
  })
  
  try {
    if (DEV_MODE) {
      console.log(`\n=== DEVELOPMENT MODE OTP ===`)
      console.log(`Email: ${email}`)
      console.log(`OTP Code: ${otp}`)
      console.log(`Type: Login`)
      console.log(`===========================\n`)
      res.json({ message: 'OTP sent to email (check console in dev mode)' })
    } else {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: 'Your Random Crap Login Code',
        text: `Your login code is: ${otp}\n\nThis code expires in 10 minutes.`,
        html: `<p>Your login code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
      })
      res.json({ message: 'OTP sent to email' })
    }
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// Verify OTP for login
app.post('/api/login/verify', (req, res) => {
  const { email, otp } = req.body
  
  const stored = otpStore.get(email)
  if (!stored || stored.type !== 'login') {
    return res.status(400).json({ error: 'No pending login for this email' })
  }
  
  if (Date.now() > stored.expires) {
    otpStore.delete(email)
    return res.status(400).json({ error: 'OTP expired' })
  }
  
  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' })
  }
  
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  const user = users.users[email]
  
  const token = generateToken()
  sessions.set(token, { email, username: user.username })
  
  otpStore.delete(email)
  res.json({ token, username: user.username })
})

// Get posts for a specific user
app.get('/api/posts/:username', (req, res) => {
  const { username } = req.params
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const userPosts = data.posts.filter(p => p.username === username)
  res.json(userPosts)
})

// Get current user's posts
app.get('/api/my-posts', requireAuth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const userPosts = data.posts.filter(p => p.username === req.user.username)
  res.json(userPosts)
})

// Create post
app.post('/api/post', requireAuth, (req, res) => {
  const content = req.body.content?.substring(0, 500)
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content required' })
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  
  // Get user's current post count
  const userPostCount = data.posts.filter(p => p.username === req.user.username).length
  
  const post = {
    id: userPostCount + 1,
    username: req.user.username,
    content: content.trim(),
    created: new Date().toISOString(),
    edited: false,
    versions: []
  }
  
  data.posts.unshift(post)
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  
  // Update user's post count
  users.users[req.user.email].postCount++
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  
  res.json(post)
})

// Edit post
app.put('/api/post/:id', requireAuth, (req, res) => {
  const content = req.body.content?.substring(0, 500)
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content required' })
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const post = data.posts.find(p => 
    p.username === req.user.username && p.id === parseInt(req.params.id)
  )
  
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
  const index = data.posts.findIndex(p => 
    p.username === req.user.username && p.id === parseInt(req.params.id)
  )
  
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' })
  }

  data.posts.splice(index, 1)
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  
  res.json({ success: true })
})

// Get user info
app.get('/api/user/:username', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  const user = Object.values(users.users).find(u => u.username === req.params.username)
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  res.json({ 
    username: user.username,
    created: user.created,
    postCount: user.postCount
  })
})

// Serve user pages
app.get('/:username', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/:username/:postId', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on port ${PORT}`)
  if (DEV_MODE) {
    console.log('🔧 Development mode enabled - OTPs will be logged to console instead of emailed')
  }
})