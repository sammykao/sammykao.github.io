import { VisitorList } from './visitor-list'
import { readVisitors } from './store'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Robot visitors', description: 'A guest log of robots visiting Sammy Kao’s site.' }
const firstPage = unstable_cache(() => readVisitors(), ['robot-visitors'], { revalidate: 30 })

export default async function VisitorsPage() {
  let page
  try {
    page = await firstPage()
  } catch {
    page = null
  }

  return (
    <section className="mb-12">
      <h1 className="mb-3 text-2xl font-semibold tracking-tighter">Robot visitors</h1>
      <p className="mb-3 text-neutral-700 dark:text-neutral-300">
        Most web traffic is bots. This guest log lets me steal a little yummy telemetry from the ones that stop by.
      </p>
      <p className="mb-8 text-xs text-neutral-500 dark:text-neutral-400">
        Likely crawlers and command-line clients are logged by unverified user agent. Models and reasons require a voluntary introduction; locations are approximate from IP, which is never shown here.
      </p>
      {page && page.visitors.length > 0 && (
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Recent visitors</h2>
      )}
      {page ? <VisitorList initialPage={page} /> : (
        <p role="status" className="py-10 text-sm text-neutral-500 dark:text-neutral-400">The visitor log is temporarily unavailable.</p>
      )}
    </section>
  )
}
