import { createHash, randomUUID } from 'node:crypto'
import { BlobNotFoundError, get, head, list, put } from '@vercel/blob'

export type Visitor = {
  agent: string
  model: string
  reason: string
  projects?: string
  location: string
  visitedAt: string
  source: 'introduced' | 'observed'
}

export type VisitorPage = { visitors: Visitor[]; cursor?: string }

const pageSize = 50

// The pathname is the index: reversed timestamps make Blob's lexical listing newest first.
export async function readVisitors(cursor?: string): Promise<VisitorPage> {
  const page = await list({ prefix: 'visitors/', limit: pageSize, cursor })
  const visitors = await Promise.all(page.blobs.map(async ({ pathname }) => {
    const blob = await get(pathname, { access: 'private' })
    if (!blob?.stream) return null
    const { agent, model, reason, projects, location, visitedAt, source } = await new Response(blob.stream).json()
    const visitor: Visitor = { agent, model, reason, projects, location, visitedAt, source }
    return visitor
  }))

  return { visitors: visitors.filter((visitor): visitor is Visitor => visitor !== null), cursor: page.hasMore ? page.cursor : undefined }
}

export async function writeVisitor(request: Request, visitor: Omit<Visitor, 'location' | 'visitedAt'>): Promise<boolean> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''
  const now = Date.now()
  const visitedAt = new Date(now).toISOString()
  const encodedCity = request.headers.get('x-vercel-ip-city')
  let city = encodedCity
  if (encodedCity) {
    try {
      city = decodeURIComponent(encodedCity)
    } catch {
      city = null
    }
  }
  const country = request.headers.get('x-vercel-ip-country')
  const location = [city, country].filter(Boolean).join(', ').slice(0, 100) || 'Unknown location'
  const bucket = Math.floor(now / 3_600_000)
  const identity = createHash('sha256').update(`${ip}:${visitor.source}`).digest('hex')
  const marker = `visitor-limits/${bucket}/${identity}.txt`

  try {
    await put(marker, '1', { access: 'private', contentType: 'text/plain' })
  } catch (error) {
    try {
      await head(marker)
      return false
    } catch (lookupError) {
      if (lookupError instanceof BlobNotFoundError) throw error
      throw lookupError
    }
  }

  const reverseTime = String(9_999_999_999_999 - now).padStart(13, '0')
  const path = new URL(request.url).pathname
  await put(`visitors/${reverseTime}-${randomUUID()}.json`, JSON.stringify({
    ...visitor,
    location,
    visitedAt,
    userAgent,
    path,
  }), { access: 'private', contentType: 'application/json' })
  return true
}
