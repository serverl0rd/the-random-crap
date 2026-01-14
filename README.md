# The Random Crap

A minimalist static microblogging platform with traditional signup/login that secretly uses GitHub Gists for data storage. Post your random crap without filters - completely serverless with familiar authentication!

🌟 **Live Demo**: [https://serverl0rd.github.io/the-random-crap](https://serverl0rd.github.io/the-random-crap)

## ✨ Features

- 👤 **Traditional Authentication** - Familiar signup/login with username, email & password
- 💾 **Private Data Storage** - Each user gets their own private GitHub Gist
- 🌍 **Cross-Device Sync** - Access your data from any device with same credentials
- ✏️ **Full Post Management** - Create, edit, delete with complete version history
- 👥 **User Profiles** - Public profile pages at `/username`
- 📱 **Responsive Design** - Perfect on mobile and desktop
- 🚀 **Zero Infrastructure** - No servers, databases, or hosting costs
- 🔒 **Privacy First** - Your data is stored in your own private GitHub space
- 🔄 **Password Reset** - Easy password recovery system

## 🚀 Quick Start

### 1. **Visit the App**
Go to [https://serverl0rd.github.io/the-random-crap](https://serverl0rd.github.io/the-random-crap)

### 2. **Create Your Account**
1. Click **"Sign Up"**
2. Choose a username and enter your email
3. For password, [create a GitHub token](https://github.com/settings/tokens/new?scopes=gist&description=The%20Random%20Crap%20App) with "gist" scope
4. Paste the token as your password
5. Start posting!

### 3. **Login Anywhere**
- Use your **username** (or email) and **password** on any device
- Your posts automatically sync across all devices

## 🔧 How It Works (Behind the Scenes)

This app cleverly uses GitHub's infrastructure while providing a traditional user experience:

1. **"Password"** = GitHub Personal Access Token (users don't need to know this)
2. **"Account"** = Private GitHub Gist containing user data
3. **"Database"** = GitHub's Gist system handles all storage and sync
4. **"Login"** = Token validation + gist access

Users experience normal signup/login, but get the benefits of decentralized, private data storage!

## 🛠️ Local Development

```bash
# Clone and run locally
git clone https://github.com/serverl0rd/the-random-crap.git
cd the-random-crap

# Start local server
npm run serve
# or
python3 -m http.server 8000

# Visit http://localhost:8000
```

## 🎯 Why This Approach is Brilliant

### **For Users:**
- ✅ **Familiar experience** - Looks like any social app
- ✅ **Own their data** - Private GitHub Gist they control
- ✅ **Works everywhere** - Same credentials on all devices
- ✅ **Password recovery** - Standard reset process
- ✅ **No tracking** - No analytics or data collection

### **For Developers:**
- ✅ **Zero infrastructure costs** - GitHub handles everything
- ✅ **No user management** - GitHub authentication
- ✅ **No databases** - Gists provide storage
- ✅ **Auto scaling** - GitHub's global CDN
- ✅ **Built-in backup** - GitHub's reliability

## 📱 User Guide

### **Posting**
- Write up to 500 characters
- Edit or delete your posts anytime
- Full edit history is preserved

### **Profiles** 
- Your profile: Click "My Posts"
- Others' profiles: Visit `/username`
- All posts are public by design

### **Account Management**
- **Forgot Password?** Generate new GitHub token
- **Multi-device?** Same username/password everywhere
- **Data export?** Download your GitHub Gist

## 🔒 Security & Privacy

- **Your data** = Stored in your private GitHub Gist
- **Your password** = GitHub token (industry standard security)
- **Your privacy** = No tracking, analytics, or data collection
- **Your control** = You can export, delete, or move your data anytime

## 🛡️ Troubleshooting

**Can't Sign Up?**
- Ensure your GitHub token has "gist" scope
- Username must be 3-20 characters (letters, numbers, _, -)

**Can't Login?**
- Check username/email spelling
- Verify your GitHub token hasn't expired
- Try generating a new token

**Lost Password?**
1. Click "Reset Password"
2. Generate new GitHub token
3. Use same username/email with new token

## 🎨 For Developers

Want to fork this concept?

- **Frontend**: Pure HTML/CSS/JS (no frameworks)
- **Authentication**: GitHub API
- **Storage**: GitHub Gists API
- **Deployment**: Any static host (GitHub Pages, Netlify, etc.)

## 📄 License

MIT License - Fork, modify, and use freely!

## 👨‍💻 Credits

Created by [@ServerLord](https://serverlord.in) ([Atharva Kulkarni](https://atharvakulkarni.link))

This project demonstrates how to create **traditional web app experiences** using **modern decentralized infrastructure**.

---

⭐ **Star this repo** if you love the concept!