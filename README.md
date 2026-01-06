# The Random Crap

A minimalist microblogging platform with email OTP authentication that stores posts in JSON files. Post your random crap without filters!

## Local Development

```bash
npm install

# For development (OTPs logged to console)
echo "DEV_MODE=true" > .env
npm start

# For production (real emails)
cp .env.example .env
# Edit .env with your Gmail credentials
npm start
```

Visit http://localhost:3000

### Development Mode

In development mode, OTP codes are logged to the console instead of being emailed. Look for:
```
=== DEVELOPMENT MODE OTP ===
Email: test@example.com
OTP Code: 123456
Username: testuser
===========================
```

## Email Configuration

### Option 1: Resend (Recommended - Most Reliable)
1. Sign up at [resend.com](https://resend.com) (free)
2. Get your API key from the dashboard
3. Set environment variables:
   - `RESEND_API_KEY`: Your API key (starts with `re_`)
   - `FROM_EMAIL`: `onboarding@resend.dev` (or your verified domain)
4. That's it! No complex passwords or 2FA needed

### Option 2: Gmail (Can be unreliable)
1. Enable 2-factor authentication on your Google account
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Enter the 16-character password WITHOUT spaces
4. Set environment variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: The app password (no spaces!)

### Option 3: Development Mode
Set `DEV_MODE=true` to skip emails and show OTPs in console/logs

### Why Resend?
- Built specifically for developers
- 100 free emails/day
- Works instantly, no authentication issues
- Better deliverability than Gmail SMTP
- Simple API, no complex configuration

## Deployment Options

### Option 1: Render (Recommended - Free)
1. Push this code to GitHub
2. Go to [render.com](https://render.com)
3. Connect your GitHub account
4. Click "New Web Service"
5. Select your repository
6. Add these environment variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password (see below)
   - `DEV_MODE`: Set to `false` for production
7. Deploy!

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

## Credits

Created by [@ServerLord](https://serverlord.in) ([Atharva Kulkarni](https://atharvakulkarni.link))