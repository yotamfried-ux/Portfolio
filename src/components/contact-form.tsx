'use client'

import { useRef, useState, type FormEvent } from 'react'
import type { Locale } from '@/lib/locale'
import { draftEmail } from '@/lib/contact'

export function ContactForm({ locale, email, canSend = false }: { locale: Locale; email?: string; canSend?: boolean }) {
  const he = locale === 'he'
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')
  const nameField = useRef<HTMLInputElement>(null)
  const replyField = useRef<HTMLInputElement>(null)
  const messageField = useRef<HTMLTextAreaElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const [sending, setSending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameField.current?.value.trim()
    const reply = replyField.current?.value.trim()
    const message = messageField.current?.value.trim()
    if (!name || !reply || !message) {
      setStatus(he ? 'יש למלא את כל השדות.' : 'Fill in all fields to prepare your message.')
      return
    }
    const body = `${message}\n\n${name}\n${reply}`
    if (canSend) {
      setSending(true)
      setStatus(he ? 'שולח…' : 'Sending…')
      const sent = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: reply, message, website: honeypot.current?.value ?? '' }),
      }).then(response => response.ok).catch(() => false)
      setSending(false)
      if (sent) {
        event.currentTarget.reset()
        setStatus(he ? 'ההודעה נשלחה. אחזור אליכם בהקדם.' : 'Message sent. I will get back to you soon.')
        return
      }
      setStatus(he ? 'השליחה נכשלה. הטיוטה מוכנה למטה, אפשר להעתיק אותה או לשלוח במייל.' : 'Sending failed. Your draft is ready below to copy or send by email.')
      setDraft(body)
      return
    }
    setStatus(he ? 'הטיוטה מוכנה.' : 'Your draft is ready.')
    setDraft(body)
    if (email) window.location.href = draftEmail(email, he ? 'פנייה דרך תיק העבודות' : 'Portfolio inquiry', body)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft)
      setStatus(he ? 'הטיוטה הועתקה.' : 'Draft copied.')
    } catch {
      setStatus(he ? 'כדי להעתיק ידנית, סמנו את הטקסט בטיוטה והעתיקו אותו.' : 'Select the draft text to copy it manually.')
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <h2>{he ? 'כתיבת הודעה' : 'Write a message'}</h2>
    <p>{canSend
      ? (he ? 'ההודעה תישלח ישירות אליי.' : 'Your message is sent directly to me.')
      : email
      ? (he ? 'הטיוטה תיפתח בתוכנת הדוא״ל שלכם. משם אפשר לשלוח אותה.' : 'This opens a draft in your email app, where you can send it.')
      : (he ? 'אפשר להכין ולהעתיק טיוטה כאן. כתובת לקבלת פניות עדיין לא זמינה.' : 'You can prepare and copy a draft here. A contact address is not yet available.')}</p>
    <div className="contact-fields">
      <label>{he ? 'שם' : 'Name'}<input ref={nameField} required maxLength={100} autoComplete="name" /></label>
      <label>{he ? 'כתובת הדוא״ל שלכם' : 'Your email address'}<input ref={replyField} type="email" required maxLength={254} autoComplete="email" dir="ltr" /></label>
    </div>
    <label>{he ? 'הודעה' : 'Message'}<textarea ref={messageField} required maxLength={2000} rows={6} /></label>
    <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
    <button className="button button-primary" type="submit" disabled={sending}>{canSend ? (he ? 'שליחת ההודעה' : 'Send message') : email ? (he ? 'פתיחת טיוטה בתוכנת הדוא״ל' : 'Open draft in email app') : (he ? 'הכנת טיוטה' : 'Prepare draft')}<span className="arrow arrow-diagonal" aria-hidden="true" /></button>
    {draft && <div className="draft">
      <label>{he ? 'טיוטת ההודעה' : 'Message draft'}<textarea readOnly value={draft} rows={5} /></label>
      <button className="button button-secondary" type="button" onClick={copy}>{he ? 'העתקת טיוטה' : 'Copy draft'}</button>
    </div>}
    <p className="form-status" role="status">{status}</p>
  </form>
}
