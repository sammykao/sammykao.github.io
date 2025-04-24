import { NextResponse } from 'next/server';

// Define types for Medium posts
interface MediumPost {
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
}

// Medium usernames are available in the RSS feed by adding /feed to their profile
// Example: https://medium.com/feed/@yourusername
export async function GET() {
  try {
    // Get username from environment variable or use a default
    const mediumUsername = process.env.MEDIUM_USERNAME || 'yourname';
    
    // Fetch the RSS feed directly
    const response = await fetch(`https://medium.com/feed/@${mediumUsername}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Medium feed: ${response.status}`);
    }
    
    const xml = await response.text();
    const result = await parseXML(xml);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return NextResponse.json({ error: 'Failed to fetch Medium posts' }, { status: 500 });
  }
}

// Simple XML parser for Medium RSS feed
async function parseXML(xml: string) {
  // This is a simple regex-based approach for demonstration
  
  const items: MediumPost[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>\s*<!\[CDATA\[(.*?)\]\]>\s*<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
  const descriptionRegex = /<description>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/;
  const contentRegex = /<content:encoded>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/content:encoded>/;
  
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    
    const titleMatch = titleRegex.exec(itemContent);
    const linkMatch = linkRegex.exec(itemContent);
    const pubDateMatch = pubDateRegex.exec(itemContent);
    const descriptionMatch = descriptionRegex.exec(itemContent);
    const contentMatch = contentRegex.exec(itemContent);
    
    if (titleMatch && linkMatch && pubDateMatch) {
      const summary = contentMatch
        ? contentMatch[1].substring(0, 300)
        : descriptionMatch
          ? descriptionMatch[1].substring(0, 300)
          : '';
      
      items.push({
        title: titleMatch[1],
        link: linkMatch[1],
        publishedAt: pubDateMatch[1],
        summary: summary,
      });
    }
  }
  
  return {
    posts: items,
  };
} 