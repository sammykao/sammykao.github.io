import { MediumPosts } from '../components/medium-posts'
import { Suspense } from 'react'

export const metadata = {
  title: 'Blog',
  description: 'My latest posts from Medium.',
}

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="font-bold text-3xl mb-3 tracking-tight">My Blog</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Collection of my thoughts, experiences, and insights from Medium.
        </p>
      </div>
      
      <div className="mb-8">
        <a 
          href={`https://medium.com/@${process.env.MEDIUM_USERNAME || 'yourname'}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Follow me on Medium
        </a>
      </div>
      
      <Suspense 
        fallback={
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-600 dark:border-t-neutral-300 mb-2"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading Medium posts...</p>
          </div>
        }
      >
        <MediumPosts />
      </Suspense>
    </section>
  )
}
