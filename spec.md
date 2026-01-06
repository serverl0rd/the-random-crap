# Minimalist Thoughts Platform Specification

## Overview

A personal microblogging platform with radical simplicity at its core. Post short thoughts (max 500 characters) in reverse chronological order with full transparency and edit history.

## Core Principles

- **KISS (Keep It Simple, Stupid)**: Every feature must justify its complexity
- **Minimalist Design**: No algorithms, no social features, no bloat
- **Transparency**: All edits are visible, all posts are public
- **No Monetization**: Free forever, no ads, no premium tiers

## Technical Architecture

### Platform
- **Backend**: Node.js with Express
- **Database**: JSON file storage
- **Authentication**: Simple password protection
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
   - Single password for access
   - Session tokens stored in localStorage
   - No user accounts or profiles

2. **Posting**
   - Text-only input, 500 character maximum
   - Posts appear instantly (no drafts)
   - Posts are numbered sequentially
   - Newest posts appear first

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
POST /api/login         - Authenticate with password
GET  /api/posts         - Get all posts (public)
POST /api/post          - Create new post (auth required)
PUT  /api/post/:id      - Edit post (auth required)
DELETE /api/post/:id    - Delete post (auth required)
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

## Success Metrics

Success is defined by:
- Platform remains online
- Posts load quickly
- Users can post without friction
- No feature creep over time

## Future Considerations

The following are noted but not planned:
- Database migration (JSON works fine)
- Multiple users (personal platform)
- API versioning (single version only)
- Federation with other instances (violates simplicity)

## Summary

This platform is aggressively simple. It does one thing: lets people post short thoughts publicly with a permanent address. No more, no less. Every decision should be evaluated against this core purpose and the principle of minimalism.