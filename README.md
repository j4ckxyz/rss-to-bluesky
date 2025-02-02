# RSS to Bluesky Bot

A Node.js bot that automatically posts RSS feed updates to Bluesky with proper link embedding and image previews. Supports multiple accounts and RSS feeds.

## Features

- Post RSS feed updates to Bluesky with rich link previews
- Support for multiple accounts and RSS feeds
- Automatic posting with configurable intervals
- Duplicate post detection
- Image processing and thumbnail generation
- Reliable operation with PM2 process management

## Prerequisites

- Node.js (v16 or higher)
- npm
- PM2 (`npm install -g pm2`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rss-to-bluesky-bot.git
cd rss-to-bluesky-bot
