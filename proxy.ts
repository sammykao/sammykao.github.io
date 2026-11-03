import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { writeVisitor } from './app/visitors/store'

const crawlerName = /\b(OAI-SearchBot|GPTBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|Googlebot|Bingbot|Amazonbot|Applebot|DuckDuckBot|Bytespider)\b/i
const clientName = /\b(curl|Wget|python-requests|python-httpx|Go-http-client|Scrapy|HeadlessChrome)\b/i

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next()
  const path = request.nextUrl.pathname
  const isContent = !path.startsWith('/_next/') && !path.startsWith('/imavisitor') &&
    (!/\.[^/]+$/.test(path) || path === '/robots.txt' || path === '/llms.txt')

  if ((request.method === 'GET' || request.method === 'HEAD') && isContent) {
    response.headers.set('Link', '</llms.txt>; rel="alternate"; type="text/plain"')
    response.headers.set('X-Robot-Guestbook', 'POST /imavisitor; fields=agent,model,reason,projects; details=/llms.txt')
    const userAgent = request.headers.get('user-agent')
    const agent = userAgent?.match(crawlerName)?.[0] || userAgent?.match(clientName)?.[0]
    if (agent && request.method === 'GET') {
      event.waitUntil(writeVisitor(request, {
        agent,
        model: 'Unknown model',
        reason: 'Purpose not supplied',
        source: 'observed',
      }).catch(() => undefined))
    }
  }

  return response
}

export const config = { matcher: '/:path*' }
