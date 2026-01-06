# Simple Thoughts Platform

A minimalist microblogging platform that stores posts in a JSON file.

## Local Development

```bash
npm install
npm start
```

Visit http://localhost:3000

## Deployment Options

### Option 1: Render (Recommended - Free)
1. Push this code to GitHub
2. Go to [render.com](https://render.com)
3. Connect your GitHub account
4. Click "New Web Service"
5. Select your repository
6. Everything auto-configures from render.yaml

### Option 2: Glitch
1. Go to [glitch.com](https://glitch.com)
2. Click "New Project" → "Import from GitHub"
3. Paste your repo URL
4. It's automatically live!

### Option 3: Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Add a volume for persistent storage

### Option 4: Vercel (Requires Modifications)
Would need to switch from JSON file to a database like Vercel KV

## Features
- 500 character posts
- Edit history
- Delete posts
- No login required (single user)
- Persistent JSON storage