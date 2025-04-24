import { NextResponse } from 'next/server';

// Spotify API endpoints
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=20';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// You'll need to provide these from your Spotify Developer Dashboard
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  try {
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    
    console.log('Getting access token...');
    console.log('Client ID exists:', !!client_id);
    console.log('Client Secret exists:', !!client_secret);
    console.log('Refresh Token exists:', !!refresh_token);
    
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token response not OK:', response.status, errorText);
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Access token received');
    return data;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export async function GET() {
  try {
    console.log('Spotify API route called');
    
    // Validate environment variables
    if (!client_id || !client_secret || !refresh_token) {
      console.error('Missing required environment variables');
      return NextResponse.json({
        isPlaying: false,
        error: 'Missing Spotify configuration',
        debug: {
          clientIdExists: !!client_id,
          clientSecretExists: !!client_secret,
          refreshTokenExists: !!refresh_token
        }
      }, { status: 500 });
    }
    
    // Get access token
    const { access_token } = await getAccessToken();
    if (!access_token) {
      console.error('No access token received');
      return NextResponse.json({
        isPlaying: false,
        error: 'Failed to get access token',
      }, { status: 500 });
    }

    // Fetch recently played tracks
    console.log('Fetching recently played tracks...');
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log('API Response Status:', response.status);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      
      return NextResponse.json({ 
        isPlaying: false,
        error: `Spotify API error: ${response.status}`,
        debug: {
          status: response.status,
          message: errorText
        }
      }, { status: response.status >= 500 ? 502 : 400 });
    }

    // Parse the response data
    const data = await response.json();
    console.log('Data received from Spotify API:', JSON.stringify(data).slice(0, 200) + '...');
    
    if (!data.items || data.items.length === 0) {
      console.log('No items found in the response data');
      return NextResponse.json({ 
        isPlaying: false,
        error: 'No recently played tracks found',
        debug: {
          message: 'The items array is empty or missing',
          data: data
        }
      });
    }

    console.log(`Found ${data.items.length} recently played tracks`);
    
    // Map track data to our format
    const recentTracks = data.items.map(item => ({
      title: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      album: item.track.album.name,
      albumImageUrl: item.track.album.images[0]?.url,
      songUrl: item.track.external_urls.spotify,
      playedAt: item.played_at
    }));

    return NextResponse.json({ recentTracks });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json({ 
      isPlaying: false,
      error: 'Error fetching Spotify data',
      debug: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
} 