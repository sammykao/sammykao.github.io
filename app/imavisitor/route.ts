import { readVisitors, writeVisitor } from '../visitors/store'

export async function GET(request: Request) {
  const cursor = new URL(request.url).searchParams.get('cursor')
  if (cursor && cursor.length > 2048) {
    return Response.json({ error: 'Invalid cursor' }, { status: 400 })
  }

  try {
    const page = await readVisitors(cursor || undefined)
    return Response.json(page, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' } })
  } catch {
    return Response.json({ error: 'Visitor log unavailable' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ error: 'Send JSON' }, { status: 415 })
  }

  if (Number(request.headers.get('content-length')) > 4096) {
    return Response.json({ error: 'Submission too large' }, { status: 413 })
  }

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > 4096) return Response.json({ error: 'Submission too large' }, { status: 413 })
    body = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return Response.json({ error: 'Expected an object' }, { status: 400 })
  }

  // Only named fields enter the public record; IP and location come from Vercel headers.
  const { agent, model, reason, projects } = body as Record<string, unknown>
  if (
    typeof agent !== 'string' || !agent.trim() || agent.length > 80 ||
    typeof model !== 'string' || !model.trim() || model.length > 80 ||
    typeof reason !== 'string' || !reason.trim() || reason.length > 240 ||
    (projects !== undefined && (typeof projects !== 'string' || projects.length > 240))
  ) {
    return Response.json({ error: 'Provide agent, model, reason, and optional public projects within field limits' }, { status: 400 })
  }

  try {
    const created = await writeVisitor(request, {
      agent: agent.trim(), model: model.trim(), reason: reason.trim(),
      ...(projects ? { projects: projects.trim() } : {}), source: 'introduced',
    })
    if (!created) return Response.json({ error: 'One introduction per IP per hour' }, { status: 429 })
    return Response.json({ ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'Visitor log unavailable' }, { status: 503 })
  }
}
