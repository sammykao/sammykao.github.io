'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { track } from '@vercel/analytics';

type Track = {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt: string;
};

type ApiResponse = {
  recentTracks?: Track[];
  isPlaying?: boolean;
  error?: string;
  debug?: any;
};

export default function SpotifyTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data: ApiResponse = await response.json();
        console.log('Spotify API response:', data);
        
        if (data.recentTracks) {
          setTracks(data.recentTracks);
        } else if (data.error) {
          setError(data.error);
          if (data.debug) setDebugInfo(data.debug);
        } else if (data.isPlaying === false) {
          setError('No recent tracks found');
          if (data.debug) setDebugInfo(data.debug);
        }
      } catch (error) {
        console.error('Error fetching Spotify tracks:', error);
        setError('Failed to fetch tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="h-6 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4 mb-4">
            <div className="h-14 w-14 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="font-medium tracking-tighter text-lg mb-4">Recent Tracks</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">{error}</p>
        {debugInfo && (
          <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded overflow-auto">
            <p className="font-semibold mb-1">Debug Info:</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  if (!tracks.length) {
    return (
      <div className="mt-8">
        <h2 className="font-medium tracking-tighter text-lg mb-4">Recent Tracks</h2>
        <p className="text-neutral-600 dark:text-neutral-400">No recently played tracks found.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-medium tracking-tighter text-lg mb-4">Recent Tracks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tracks.map((t, index) => (
          <Link 
            href={t.songUrl}
            key={t.playedAt + index}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('spotify_track_click', { track: t.title })}
            className="group flex items-center space-x-4 rounded-md border border-neutral-200 dark:border-neutral-800 p-2 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            {t.albumImageUrl ? (
              <div className="relative h-14 w-14 min-w-[56px] overflow-hidden">
                <Image
                  src={t.albumImageUrl}
                  alt={t.album}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : (
              <div className="h-14 w-14 min-w-[56px] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                <svg className="h-6 w-6 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate text-sm">{t.title}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{t.artist}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 