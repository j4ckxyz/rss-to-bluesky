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


## PM2 Quick Guide

### Basic PM2 Commands

Start a new bot instance:
```bash
pm2 start index.js --name "your-bot-name"


## Common management commands to use:

# List all processes
pm2 list

# Stop bot
pm2 stop your-bot-name

# Start bot
pm2 start your-bot-name

# Restart bot
pm2 restart your-bot-name

# Delete bot from PM2
pm2 delete your-bot-name


## When should I restart the bot?
Restart your bot after:

Changing config.js
Updating the code
Adding new RSS feeds
Modifying dependencies

'pm2 restart your-bot-name'