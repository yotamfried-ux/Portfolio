'use client'

import { useState } from 'react'

export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return <span className="copy-email">
    <a href={`mailto:${email}`} dir="ltr">{email}</a>
    <button className="button button-secondary" type="button" onClick={copy}>{label}</button>
    <span role="status" className="sr-only">{copied ? done : ''}</span>
    {copied && <span aria-hidden="true" className="copy-done">{done}</span>}
  </span>
}
