# The Random Crap

A minimalist static microblogging platform that uses GitHub for authentication and GitHub Gists for data storage. Post your random crap without filters - completely serverless!

🌟 **Live Demo**: [https://serverl0rd.github.io/the-random-crap](https://serverl0rd.github.io/the-random-crap)

## ✨ Features

- 🔐 **GitHub Authentication** - No passwords needed, just GitHub tokens
- 💾 **Persistent Storage** - Data stored in private GitHub Gists
- 🌍 **Cross-Device Sync** - Access your data from anywhere
- ✏️ **Post Management** - Create, edit, delete with full version history
- 👤 **User Profiles** - Personalized pages for each user
- 📱 **Responsive Design** - Works on mobile and desktop
- 🚀 **Static Deployment** - No server required, deploy to GitHub Pages
- 🔒 **Privacy First** - All data stored in private Gists

## 🚀 Quick Setup

### 1. Fork & Deploy
1. Fork this repository
2. Go to Settings → Pages
3. Set Source to "Deploy from a branch" → main
4. Your app will be live at `https://YOUR_USERNAME.github.io/the-random-crap`

### 2. Authentication
1. Visit your deployed app
2. Click the GitHub token link to create a token with "gist" scope
3. Paste the token and you're ready to go!

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/serverl0rd/the-random-crap.git
cd the-random-crap

# Start local server
npm run serve
# or
python3 -m http.server 8000

# Visit http://localhost:8000
```

## 🔧 How It Works

1. **Authentication**: Uses GitHub Personal Access Tokens (only "gist" scope needed)
2. **Data Storage**: Creates a private Gist to store all your posts
3. **Synchronization**: Data syncs across all devices using the same token
4. **Privacy**: Only you can access your private Gist data

## 📋 GitHub Token Setup

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new?scopes=gist&description=The%20Random%20Crap%20App)
2. Select **only** the "gist" scope
3. Generate and copy the token
4. Paste it into the app when prompted

## 🎯 Benefits Over Traditional Apps

- ✅ **No server costs** - Completely static
- ✅ **No database setup** - Uses GitHub's infrastructure
- ✅ **Automatic backups** - GitHub handles data safety
- ✅ **Version control** - Built-in post history
- ✅ **Global availability** - GitHub's CDN
- ✅ **No registration** - Uses existing GitHub accounts

## 🔒 Security & Privacy

- Tokens stored locally in your browser only
- Gists are private and encrypted by GitHub
- Minimal permissions required (just "gist" scope)
- You can revoke access anytime in GitHub settings
- No tracking or analytics


## 📱 Usage

1. **Create Posts**: Write up to 500 characters
2. **Edit History**: Full version tracking for all edits
3. **User Profiles**: Visit `/username` to see someone's posts
4. **Cross-Device**: Same token works on all your devices

## 🛡️ Troubleshooting

**Token Issues?**
- Ensure you selected the "gist" scope
- Check token hasn't expired
- Try generating a new token

**Data Missing?**
- Check your [GitHub Gists](https://gist.github.com) page
- Look for "The Random Crap - User Data"
- Use the same token on all devices

## 🎨 Customization

- Edit `index.html` to change styling or features
- Modify `package.json` for your repository URLs
- Update footer links and branding

## 📄 License

MIT License - Feel free to use and modify!

## 👨‍💻 Credits

Created by [@ServerLord](https://serverlord.in) ([Atharva Kulkarni](https://atharvakulkarni.link))

---

⭐ **Star this repo** if you find it useful!