# Minimalist Shitposting Portal Specification

## Overview

A pure, unfiltered microblogging platform built on Internet Computer with radical simplicity at its core. Users post short thoughts (max 500 characters) in reverse chronological order with full transparency and edit history.

## Core Principles

- **KISS (Keep It Simple, Stupid)**: Every feature must justify its complexity
- **Minimalist Design**: No algorithms, no social features, no bloat
- **Transparency**: All edits are visible, all posts are public
- **No Monetization**: Free forever, no ads, no premium tiers

## Technical Architecture

### Platform
- **Blockchain**: Internet Computer (IC)
- **Architecture**: Single canister deployment
- **Authentication**: Internet Identity
- **Frontend**: Responsive web interface
- **Protocol**: HTTPS only

### Data Model

```
User {
  principal: Principal (from Internet Identity)
  username: string (unique, immutable after creation)
  created_at: timestamp
  post_count: nat
}

Post {
  id: nat (sequential per user, starting at 1)
  author: Principal
  content: string (max 500 chars)
  created_at: timestamp
  updated_at: timestamp
  versions: [PostVersion]
}

PostVersion {
  content: string
  timestamp: timestamp
}
```

## Features

### Core Functionality

1. **Authentication**
   - Login via Internet Identity
   - First-time users choose username (permanent)
   - No profile pages, no user settings

2. **Posting**
   - Text-only input, 500 character maximum
   - Posts appear instantly (no drafts)
   - Each post gets unique URL: `domain.com/username/post-id`
   - Post IDs are sequential integers per user

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

### Canister Methods

```
// User Management
create_username(username: Text) -> Result<(), Error>

// Posting
create_post(content: Text) -> Result<Nat, Error>
edit_post(post_id: Nat, content: Text) -> Result<(), Error>
delete_post(post_id: Nat) -> Result<(), Error>

// Reading
get_user_posts(username: Text) -> Vec<Post>
get_post(username: Text, post_id: Nat) -> Result<Post, Error>
get_post_history(username: Text, post_id: Nat) -> Vec<PostVersion>

// Admin
admin_delete_post(username: Text, post_id: Nat) -> Result<(), Error>

// Export
export_user_data() -> Text  // Returns Markdown
```

### Frontend Requirements

- Single HTML page + minimal CSS
- No JavaScript frameworks (vanilla JS only)
- Mobile-first responsive design
- Monospace font for true plaintext aesthetic
- High contrast, readable typography
- No images, no icons, text only

### Upgrade Strategy

- Stable memory for data persistence
- Pre/post upgrade hooks for migrations
- Accepted downtime during upgrades
- No versioning complexity

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

1. **Concurrent Posts**: Last write wins for post ID assignment
2. **Empty Posts**: Not allowed (minimum 1 character)
3. **Unicode**: Full UTF-8 support, emoji counted as characters
4. **Rate Limiting**: None - true chaos mode
5. **Canister Storage**: No limits until IC enforces them
6. **URL Collisions**: Not possible due to sequential IDs
7. **Username Squatting**: First-come, first-served
8. **Post ID Gaps**: Preserved to maintain URL stability

## Success Metrics

Success is defined by:
- Platform remains online
- Posts load quickly
- Users can post without friction
- No feature creep over time

## Future Considerations

The following are noted but not planned:
- Multi-canister architecture (only if single canister hits IC limits)
- Backup/archive strategy (only if storage becomes issue)
- Federation with other instances (violates simplicity)

## Summary

This platform is aggressively simple. It does one thing: lets people post short thoughts publicly with a permanent address. No more, no less. Every decision should be evaluated against this core purpose and the principle of minimalism.