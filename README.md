# Simple Thoughts Platform

A minimalist microblogging platform with email OTP authentication that stores posts in JSON files.

## Local Development

```bash
npm install

# Create .env file with your email settings
cp .env.example .env
# Edit .env with your Gmail credentials

npm start
```

Visit http://localhost:3000

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use your email and app password in .env

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

### Option 4: Deploy Anywhere
- Any VPS with Node.js
- Heroku free tier (if available)
- Your own server

## Features
- 500 character posts
- Edit history with version tracking
- Delete posts
- Multi-user support with unique usernames
- Email OTP authentication (no passwords)
- User profiles at domain.com/username
- Persistent JSON storage
- Session-based authentication