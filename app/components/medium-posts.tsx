'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MediumPost {
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
}

export function MediumPosts() {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/medium");
        if (!response.ok) {
          throw new Error("Failed to fetch Medium posts");
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError("Failed to fetch Medium posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Remove HTML tags from summary
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div 
            key={item}
            className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 animate-pulse"
          >
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg text-center">
        <p className="text-neutral-600 dark:text-neutral-400">No Medium posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article 
          key={index}
          className="group"
        >
          <Link 
            href={post.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col space-y-2"
          >
            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
            
            <time className="text-sm text-neutral-500 dark:text-neutral-400">
              {formatDate(post.publishedAt)}
            </time>
            
            <p className="text-neutral-700 dark:text-neutral-300">
              {stripHtml(post.summary).substring(0, 240)}
              {stripHtml(post.summary).length > 240 ? '...' : ''}
            </p>
            
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium pt-1">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
} 