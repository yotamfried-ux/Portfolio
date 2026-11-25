import { sendingConfigured, validateContact } from '@/lib/contact'

// Best-effort limit per server instance: 5 messages per 10 minutes per address.
const hits = new Map<string, number[]>()
const windowMs = 10 * 60 * 1000

function limited(key: string) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter(time => now - time < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 500) for (const [k, times] of hits) if (times.every(time => now - time >= windowMs)) hits.delete(k)
  return recent.length > 5
}

export async function POST(request: Request) {
  if (!sendingConfigured()) return Response.json({ error: 'unavailable' }, { status: 503 })
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== request.headers.get('host')) return Response.json({ error: 'forbidden' }, { status: 403 })
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (limited(address)) return Response.json({ error: 'rate_limited' }, { status: 429 })
  const parsed = validateContact(await request.json().catch(() => null))
  if (!parsed.ok) return Response.json({ error: 'invalid' }, { status: 400 })
  const { name, email, message } = parsed.value
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio contact <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `${message}\n\n${name}\n${email}`,
    }),
  }).catch(() => null)
  if (!response?.ok) return Response.json({ error: 'send_failed' }, { status: 502 })
  return Response.json({ ok: true })
}
