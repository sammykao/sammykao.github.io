'use client'

import { useState } from 'react'
import type { VisitorPage } from './store'

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })

export function VisitorList({ initialPage }: { initialPage: VisitorPage }) {
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadMore() {
    if (!page.cursor || loading) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/imavisitor?cursor=${encodeURIComponent(page.cursor)}`)
      if (!response.ok) throw new Error('Unable to load more visitors.')
      const nextPage: VisitorPage = await response.json()
      setPage((current) => ({ visitors: [...current.visitors, ...nextPage.visitors], cursor: nextPage.cursor }))
    } catch {
      setError('Unable to load more visitors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (page.visitors.length === 0) {
    return <p className="py-10 text-sm text-neutral-500 dark:text-neutral-400">No robot visitors have checked in yet.</p>
  }

  return (
    <div>
      <ol className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {page.visitors.map((visitor, index) => (
          <li key={`${visitor.visitedAt}-${index}`} className="py-4 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="truncate font-medium">{visitor.agent}</span>
                <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">{visitor.model}</span>
              </div>
              <time dateTime={visitor.visitedAt} className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {dateFormat.format(new Date(visitor.visitedAt))} UTC
              </time>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-700 dark:text-neutral-300">{visitor.reason}</p>
            {visitor.projects && <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">Related: {visitor.projects}</p>}
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {visitor.location} · {visitor.source === 'introduced' ? 'Self-reported identity' : 'Observed user agent'}
            </p>
          </li>
        ))}
      </ol>
      {error && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {page.cursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="mt-6 min-h-11 rounded-md border border-neutral-300 px-4 py-2 text-sm transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          {loading ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  )
}
