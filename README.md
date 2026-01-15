# The Random Crap

A minimalist microblogging platform using GitHub for authentication and Gists for storage. Post your random thoughts - completely serverless!

**Live Demo**: [https://serverl0rd.github.io/the-random-crap](https://serverl0rd.github.io/the-random-crap)

## Features

- **GitHub Authentication** - Sign in with your GitHub username and personal access token
- **Gist Storage** - Your posts are stored in your own public GitHub Gist
- **Public Profiles** - Share your profile at `serverl0rd.github.io/the-random-crap/username`
- **Post Management** - Create, edit, delete posts with full version history
- **Cross-Device Sync** - Access your posts from any device
- **Zero Infrastructure** - No servers, databases, or hosting costs
- **Minimalist Design** - Clean, monospace aesthetic

## Quick Start

### 1. Get a GitHub Token
1. Go to [GitHub Token Settings](https://github.com/settings/tokens/new?scopes=gist&description=The%20Random%20Crap%20App)
2. Generate a new token with **gist** scope
3. Copy the token

### 2. Sign In
1. Visit [the-random-crap](https://serverl0rd.github.io/the-random-crap)
2. Click **Sign In**
3. Enter your GitHub username and token
4. Start posting!

### 3. Share Your Profile
Your public profile is available at:
```
https://serverl0rd.github.io/the-random-crap/YOUR_USERNAME
```

## How It Works

| What You See | What's Happening |
|--------------|------------------|
| Sign In | GitHub token validation |
| Your Posts | Stored in a public GitHub Gist |
| Public Profile | Fetches posts from GitHub API |
| Edit/Delete | Updates your Gist |

## Local Development

```bash
git clone https://github.com/serverl0rd/the-random-crap.git
cd the-random-crap
npm install
npm run serve
# Visit http://localhost:8000
```

## Tech Stack

- **Frontend**: Pure HTML/CSS/JS (no frameworks)
- **Auth**: GitHub API
- **Storage**: GitHub Gists API
- **Hosting**: GitHub Pages

## Public Profile Features

When someone visits your profile (`/username`):
- Clean, read-only view of your posts
- No edit/delete buttons visible
- Centered title: `@username's crap`
- Animated loading indicator
- Works without authentication

## Troubleshooting

**Can't sign in?**
- Ensure your GitHub token has "gist" scope
- Check that your username matches your GitHub username exactly

**Posts not loading?**
- GitHub API has rate limits for unauthenticated requests
- Try refreshing after a few seconds

**Profile shows "No posts"?**
- Make sure you've created at least one post while signed in
- Your Gist needs to be public (happens automatically)

## License

MIT License - Fork and use freely!

## Credits

Created by [@ServerLord](https://github.com/serverl0rd) (Atharva Kulkarni)
