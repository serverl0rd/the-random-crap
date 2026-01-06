# ServerLord's Vibe Invoice Generator Specification

## Overview

A minimalist multi-user microblogging platform branded as "ServerLord's Vibe Invoice Generator" with radical simplicity at its core. Users sign up with email OTP authentication and post short vibes (max 500 characters) in reverse chronological order with full transparency and edit history.

## Core Principles

- **KISS (Keep It Simple, Stupid)**: Every feature must justify its complexity
- **Minimalist Design**: No algorithms, no social features, no bloat
- **Transparency**: All edits are visible, all posts are public
- **No Monetization**: Free forever, no ads, no premium tiers

## Technical Architecture

### Platform
- **Backend**: Node.js with Express
- **Database**: JSON file storage (posts.json, users.json)
- **Authentication**: Email OTP (no passwords)
- **Email**: Nodemailer with Gmail
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Protocol**: HTTPS only

### Data Model

```json
{
  "posts": [
    {
      "id": 1,
      "content": "string (max 500 chars)",
      "created": "ISO 8601 timestamp",
      "edited": "ISO 8601 timestamp or false",
      "versions": [
        {
          "content": "string",
          "edited": "ISO 8601 timestamp"
        }
      ]
    }
  ],
  "nextId": 2
}
```

## Features

### Core Functionality

1. **Authentication**
   - Email OTP for signup and login
   - No passwords stored or required
   - Session tokens in memory and localStorage
   - Unique usernames (3-20 chars, alphanumeric + _ -)
   - User profiles at /username

2. **Posting**
   - Text-only input, 500 character maximum
   - Vibes appear instantly (no drafts)
   - Vibes are numbered sequentially
   - Newest vibes appear first

3. **Editing**
   - Edit button available on user's own posts
   - All versions stored permanently
   - Edited posts show indicator
   - Click indicator to view version history

4. **Deletion**
   - Delete button removes post from timeline
   - URL returns 404 after deletion
   - Post ID is not reused (gaps preserved)

5. **Viewing**
   - Homepage shows user's posts (newest first)
   - Individual post URLs show single post
   - No feed, no discovery, no recommendations
   - Navigation between posts via simple prev/next

### Admin Features

- Single admin principal defined at deployment
- Can delete any post (no trace remains)
- No other moderation tools

### Data Export

- Users can export all their posts as Markdown
- One file with all posts in chronological order
- Includes edit history in formatted blocks

## Security & Privacy

### Security Measures
- XSS protection on all text inputs
- Content-Security-Policy headers
- Text sanitization (no HTML, no scripts)
- HTTPS enforced

### Privacy Considerations
- All posts are public by design
- No analytics, no tracking
- Edit history cannot be deleted
- Admin deletions are permanent

## Technical Implementation Details

### URL Structure
- `/` - Homepage (login or user's posts)
- `/username/post-id` - Individual post
- `/export` - Download user's data
- `/login` - Internet Identity auth flow

### API Endpoints

```
POST /api/check-username      - Check username availability
POST /api/signup/send-otp     - Send OTP for signup
POST /api/signup/verify       - Verify OTP and create account
POST /api/login/send-otp      - Send OTP for login
POST /api/login/verify        - Verify OTP and login
GET  /api/posts/:username     - Get user's posts (public)
GET  /api/my-posts            - Get current user's posts
POST /api/post                - Create new post (auth required)
PUT  /api/post/:id            - Edit post (auth required)
DELETE /api/post/:id          - Delete post (auth required)
GET  /api/user/:username      - Get user info (public)
```

### Frontend Requirements

- Single HTML page + minimal CSS
- No JavaScript frameworks (vanilla JS only)
- Mobile-first responsive design
- Monospace font for true plaintext aesthetic
- High contrast, readable typography
- No images, no icons, text only

### Deployment

- Can run on any Node.js host
- JSON file persists data
- Environment variable for password
- Zero database setup required

## Non-Features (Explicitly Excluded)

- No following/followers
- No likes, comments, or reactions
- No hashtags or search
- No private posts
- No rich text or media
- No notifications
- No API for third parties
- No password reset (IC handles auth)
- No username changes
- No blocking or muting
- No scheduling posts
- No threading or replies
- No metrics or analytics

## Edge Cases & Decisions

1. **Concurrent Posts**: File system handles atomicity
2. **Empty Posts**: Not allowed (minimum 1 character)
3. **Unicode**: Full UTF-8 support, emoji counted as characters
4. **Rate Limiting**: None
5. **Storage**: Limited only by disk space
6. **Post ID Gaps**: Preserved when posts are deleted
7. **Session Management**: In-memory, clears on restart
8. **OTP Expiry**: 10 minutes
9. **Username Rules**: 3-20 chars, letters/numbers/_/-

## Success Metrics

Success is defined by:
- Platform remains online
- Posts load quickly
- Users can post without friction
- No feature creep over time

## Future Considerations

The following are noted but not planned:
- Database migration (JSON works fine)
- User discovery/search (find by direct URL only)
- API versioning (single version only)
- Federation with other instances (violates simplicity)

## Summary

This platform is aggressively simple. It does one thing: lets people post short vibes publicly with a permanent address. No more, no less. Every decision should be evaluated against this core purpose and the principle of minimalism.

## Credits

Created by [@ServerLord](https://serverlord.in) ([Atharva Kulkarni](https://atharvakulkarni.link))