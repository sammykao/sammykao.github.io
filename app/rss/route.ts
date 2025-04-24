import { baseUrl } from 'app/sitemap'

export async function GET() {
  // Instead of local blog posts, we're now linking to Medium
  // So we return a simplified RSS feed that just points to Medium
  
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>Check out my articles on Medium</description>
        <item>
          <title>My Medium Articles</title>
          <link>https://medium.com/@${process.env.MEDIUM_USERNAME || 'user'}</link>
          <description>Read my latest articles on Medium</description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
