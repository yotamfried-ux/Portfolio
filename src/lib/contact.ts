export const defaultPublicEmail = 'yotam.fried@gmail.com'

export function publicEmail(value?: string) {
  const address = value?.trim()
  return address && /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(address) ? address : undefined
}

export function draftEmail(address: string, subject: string, body: string) {
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
