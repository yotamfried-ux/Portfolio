export const defaultPublicEmail = 'yotam.fried@gmail.com'

export function publicEmail(value?: string) {
  const address = value?.trim()
  return address && /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(address) ? address : undefined
}

export function draftEmail(address: string, subject: string, body: string) {
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export type ContactInput = { name: string; email: string; message: string }

export function validateContact(raw: unknown): { ok: true; value: ContactInput } | { ok: false } {
  if (!raw || typeof raw !== 'object') return { ok: false }
  const { name, email, message, website } = raw as Record<string, unknown>
  if (typeof website === 'string' && website.trim()) return { ok: false }
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') return { ok: false }
  const value = { name: name.trim(), email: email.trim(), message: message.trim() }
  const valid = value.name.length > 0 && value.name.length <= 100
    && value.message.length > 0 && value.message.length <= 2000
    && value.email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(value.email)
    && !/[\r\n]/.test(value.name)
  return valid ? { ok: true, value } : { ok: false }
}

export function sendingConfigured(env: Record<string, string | undefined> = process.env) {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL)
}
