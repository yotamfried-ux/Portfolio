'use client'

import { useRef, useState, type FormEvent } from 'react'
import type { Locale } from '@/lib/locale'
import { draftEmail } from '@/lib/contact'

export function ContactForm({ locale, email }: { locale: Locale; email?: string }) {
  const he = locale === 'he'
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')
  const nameField = useRef<HTMLInputElement>(null)
  const replyField = useRef<HTMLInputElement>(null)
  const messageField = useRef<HTMLTextAreaElement>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameField.current?.value.trim()
    const reply = replyField.current?.value.trim()
    const message = messageField.current?.value.trim()
    if (!name || !reply || !message) {
      setStatus(he ? 'יש למלא את כל השדות.' : 'Fill in each field to prepare your message.')
      return
    }
    const body = `${message}\n\n${name}\n${reply}`
    setStatus(he ? 'הטיוטה מוכנה.' : 'Your draft is ready.')
    setDraft(body)
    if (email) window.location.href = draftEmail(email, he ? 'פנייה דרך תיק העבודות' : 'Portfolio enquiry', body)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft)
      setStatus(he ? 'הטיוטה הועתקה.' : 'Draft copied.')
    } catch {
      setStatus(he ? 'אפשר לסמן את הטיוטה ולהעתיק אותה ידנית.' : 'Select the draft to copy it manually.')
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <h2>{he ? 'כתיבת הודעה' : 'Write a message'}</h2>
    <p>{email
      ? (he ? 'הטיוטה תיפתח בתוכנת הדואר שלכם.' : 'Your draft opens in your email app.')
      : (he ? 'כתובת ליצירת קשר עדיין לא פורסמה. אפשר להכין ולהעתיק טיוטה כאן.' : 'A contact address is pending approval. You can prepare and copy a draft here.')}</p>
    <div className="contact-fields">
      <label>{he ? 'שם' : 'Name'}<input ref={nameField} required maxLength={100} autoComplete="name" /></label>
      <label>{he ? 'כתובת אימייל' : 'Email'}<input ref={replyField} type="email" required maxLength={254} autoComplete="email" dir="ltr" /></label>
    </div>
    <label>{he ? 'הודעה' : 'Message'}<textarea ref={messageField} required maxLength={2000} rows={6} /></label>
    <button className="button button-primary" type="submit">{email ? (he ? 'פתיחה בתוכנת הדואר' : 'Open email app') : (he ? 'הכנת טיוטה' : 'Prepare draft')}<span className="arrow arrow-diagonal" aria-hidden="true" /></button>
    {draft && <div className="draft">
      <label>{he ? 'טיוטת ההודעה' : 'Message draft'}<textarea readOnly value={draft} rows={5} /></label>
      <button className="button button-secondary" type="button" onClick={copy}>{he ? 'העתקת הטיוטה' : 'Copy draft'}</button>
    </div>}
    <p className="form-status" role="status">{status}</p>
  </form>
}
