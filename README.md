```markdown
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
```

2. Install dependencies:
```bash
npm install
```

3. Create your configuration:
```bash
cp config.example.js config.js
```

4. Edit `config.js` with your Bluesky credentials and RSS feed URLs.

## PM2 Quick Guide

### Basic Commands

Start a new bot:
```bash
pm2 start index.js --name "your-bot-name"
```

### Common Management Commands

```bash
# View all processes
pm2 list

# View detailed status
pm2 status

# Stop a bot
pm2 stop your-bot-name

# Start a stopped bot
pm2 start your-bot-name

# Restart a bot
pm2 restart your-bot-name

# Delete a bot from PM2
pm2 delete your-bot-name
```

### When to Restart the Bot

Restart your bot after:
- Changing `config.js`
- Updating the code
- Adding new RSS feeds
- Modifying dependencies

Quick restart:
```bash
pm2 restart your-bot-name
```

### Monitoring

View logs:
```bash
# All logs
pm2 logs

# Specific bot logs
pm2 logs your-bot-name

# Clear logs
pm2 flush
```

Monitor resources:
```bash
pm2 monit
```

### Startup Configuration

Make PM2 start on boot:
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

## Configuration

Edit `config.js` to add your accounts and RSS feeds:

```javascript
module.exports = {
    DEFAULT_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
    ACCOUNTS: [
        {
            account: "your.bluesky.handle",
            password: "your-app-password",
            url: "https://your-rss-feed.com/feed",
            description: "Feed Description"
        }
    ]
};
```

## Testing

Run the test script to verify your configuration:
```bash
node test.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This format:
- Has consistent heading levels
- Groups related information
- Uses proper markdown formatting
- Is easier to read and follow
- Includes all necessary information in a logical order

Would you like me to adjust anything else?