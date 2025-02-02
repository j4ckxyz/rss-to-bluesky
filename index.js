const { BskyAgent, AppBskyFeedPost } = require("@atproto/api");
const Parser = require("rss-parser");
const config = require("./config");
const parser = new Parser();

// Convert config to settings format
const settings = config.ACCOUNTS.map(account => ({
    account: account.account,
    password: account.password,
    url: account.url,
    checkInterval: account.checkInterval || config.DEFAULT_CHECK_INTERVAL,
    description: account.description || account.account
}));

async function getFeedsWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const feed = await parser.parseURL(url);
            return feed.items.map((item) => ({
                title: item.title,
                link: item.link,
            }));
        } catch (error) {
            console.error(`Attempt ${i + 1} failed to fetch feed:`, error);
            if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 5000));
        }
    }
    throw new Error("Failed to fetch feeds after maximum retries");
}

async function post(agent, item) {
    try {
      let post = {
        $type: "app.bsky.feed.post",
        text: item.title,
        createdAt: new Date().toISOString(),
      };
  
      // Fetch and parse the webpage
      const response = await fetch(item.link);
      const html = await response.text();
      const dom = cheerio.load(html);
  
      // Get metadata
      let description = null;
      const description_ = dom('head > meta[property="og:description"]');
      if (description_) {
        description = description_.attr("content");
      }
  
      // Get image
      let image_url = null;
      const image_url_ = dom('head > meta[property="og:image"]');
      if (image_url_) {
        image_url = image_url_.attr("content");
      }
  
      if (image_url) {
        try {
          // Process and upload image
          const imageResponse = await fetch(image_url);
          const buffer = await imageResponse.arrayBuffer();
          const processedImage = await sharp(Buffer.from(buffer))
            .resize(800, null, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({
              quality: 80,
              progressive: true,
            })
            .toBuffer();
  
          const uploadedImage = await agent.uploadBlob(processedImage, { encoding: "image/jpeg" });
  
          // Add embed with image
          post.embed = {
            $type: "app.bsky.embed.external",
            external: {
              uri: item.link,
              title: item.title,
              description: description,
              thumb: uploadedImage.data.blob,
            }
          };
        } catch (imageError) {
          console.error("Error processing image:", imageError);
          // Continue without image if there's an error
          post.embed = {
            $type: "app.bsky.embed.external",
            external: {
              uri: item.link,
              title: item.title,
              description: description
            }
          };
        }
      } else {
        // No image, just add link embed
        post.embed = {
          $type: "app.bsky.embed.external",
          external: {
            uri: item.link,
            title: item.title,
            description: description
          }
        };
      }
  
      const res = AppBskyFeedPost.validateRecord(post);
      if (res.success) {
        console.log("Posting:", post.text);
        await agent.post(post);
        return true;
      } else {
        console.error("Post validation failed:", res.error);
        return false;
      }
    } catch (error) {
      console.error("Error posting to Bluesky:", error);
      return false;
    }
  }
  

async function getProcessedPosts(agent, account) {
    const processed = new Set();
    let cursor = "";

    try {
        for (let i = 0; i < 3; ++i) {
            const response = await agent.getAuthorFeed({
                actor: account,
                limit: 100,
                cursor: cursor,
            });
            
            cursor = response.cursor;
            for (const feed of response.data.feed) {
                processed.add(feed.post.record.text);
            }
        }
    } catch (error) {
        console.error("Error fetching processed posts:", error);
    }

    return processed;
}

async function main(setting) {
    try {
        const agent = new BskyAgent({ service: "https://bsky.social" });
        await agent.login({
            identifier: setting.account,
            password: setting.password,
        });

        const processed = await getProcessedPosts(agent, setting.account);
        const feeds = await getFeedsWithRetry(setting.url);

        for (const feed of feeds) {
            if (!processed.has(feed.title)) {
                await post(agent, feed);
                await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds between posts
            } else {
                console.log("Skipped (already posted):", feed.title);
            }
        }
    } catch (error) {
        console.error("Error in main process:", error);
    }
}

async function runContinuously() {
    while (true) {
        for (const setting of settings) {
            console.log("Processing:", setting.url);
            try {
                await main(setting);
            } catch (error) {
                console.error("Error processing setting:", error);
            }
        }
        console.log(`Waiting ${settings[0].checkInterval / 1000} seconds...`);
        await new Promise(r => setTimeout(r, settings[0].checkInterval));
    }
}

// Start the continuous process
runContinuously();
