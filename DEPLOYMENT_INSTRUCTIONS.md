# GitHub Pages Deployment Instructions

This is a static web application with traditional signup/login that uses GitHub Gists for secure data storage.

## Automatic Deployment

The app automatically deploys to GitHub Pages when you push to the main branch.

### Setup Steps:

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "Deploy from a branch" → main

2. **Push your changes**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access your app**:
   - Visit `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`
   - Replace YOUR_USERNAME with your GitHub username
   - Replace REPOSITORY_NAME with your repository name

## User Authentication

The app provides familiar signup/login experience:

### **For New Users (Sign Up):**
1. Click "Sign Up" tab
2. Choose a unique username (3-20 characters)
3. Enter your email address
4. For password: [Create a GitHub token](https://github.com/settings/tokens/new?scopes=gist&description=The%20Random%20Crap%20App) with "gist" scope
5. Paste the token as your password
6. Click "Create Account"

### **For Existing Users (Login):**
1. Enter your username or email
2. Enter your password (GitHub token)
3. Click "Login"

### **Forgot Password:**
1. Click "Forgot Password?" below the password field
2. Enter your email address
3. Follow instructions to generate a new GitHub token
4. Use the new token as your new password

## Local Development

To run locally for testing:

```bash
# Using Python (recommended)
python3 -m http.server 8000
# Or for Python 2
python -m SimpleHTTPServer 8000

# Then visit http://localhost:8000
```

Or use the npm script:
```bash
npm run serve
```

## Features

- ✅ GitHub authentication (no passwords needed)
- ✅ Create, edit, delete posts
- ✅ View user profiles
- ✅ Edit history for posts
- ✅ Character limit (500 chars)
- ✅ No server required
- ✅ Data persists across devices/browsers
- ✅ Private data storage in GitHub Gists

## Data Persistence

- **Storage**: Data is stored in private GitHub Gists
- **Sharing**: Data persists across all your devices and browsers
- **Privacy**: Gists are private and only accessible to you
- **Backup**: Data is backed up by GitHub automatically
- **Access**: Use the same GitHub token on any device to access your data

## Security

- GitHub tokens are stored locally in your browser
- Gists created by the app are private by default
- Only the "gist" scope is required (minimal permissions)
- You can revoke token access at any time in GitHub settings

## Customization

Update these files to customize:
- `package.json`: Repository URL and homepage URL
- `index.html`: App title, styling, and footer links
- `.github/workflows/deploy.yml`: Deployment configuration

## Troubleshooting

- **Token Issues**: Ensure your token has the "gist" scope
- **Gist Access**: Check that your token hasn't expired
- **Data Loss**: Gists are automatically created - check your GitHub gists page
- **Multiple Devices**: Use the same GitHub token to access your data anywhere