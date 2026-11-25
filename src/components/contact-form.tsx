'use client'

import { useRef, useState, type FormEvent } from 'react'
import type { Locale } from '@/lib/locale'
import { draftEmail } from '@/lib/contact'

type Field = 'name' | 'reply' | 'message'
type Errors = Partial<Record<Field, string>>
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxMessage = 2000

export function ContactForm({ locale, email, canSend = false }: { locale: Locale; email?: string; canSend?: boolean }) {
  const he = locale === 'he'
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [count, setCount] = useState(0)
  const [sending, setSending] = useState(false)
  const nameField = useRef<HTMLInputElement>(null)
  const replyField = useRef<HTMLInputElement>(null)
  const messageField = useRef<HTMLTextAreaElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const refs = { name: nameField, reply: replyField, message: messageField }

  const text = {
    name: he ? 'נא למלא שם.' : 'Enter your name.',
    replyEmpty: he ? 'נא למלא כתובת דוא״ל.' : 'Enter your email address.',
    replyBad: he ? 'הכתובת נראית לא תקינה. לדוגמה: name@example.com' : 'This email address looks incomplete. Example: name@example.com',
    message: he ? 'נא לכתוב הודעה.' : 'Write a message.',
  }

  function check(field: Field): string | undefined {
    const value = refs[field].current?.value.trim() ?? ''
    if (field === 'name') return value ? undefined : text.name
    if (field === 'message') return value ? undefined : text.message
    if (!value) return text.replyEmpty
    return emailPattern.test(value) ? undefined : text.replyBad
  }

  function validate(field: Field) {
    setErrors(current => ({ ...current, [field]: check(field) }))
  }

  function clearIfFixed(field: Field) {
    if (errors[field] && !check(field)) setErrors(current => ({ ...current, [field]: undefined }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const found: Errors = {}
    for (const field of ['name', 'reply', 'message'] as Field[]) found[field] = check(field)
    setErrors(found)
    const firstInvalid = (['name', 'reply', 'message'] as Field[]).find(field => found[field])
    if (firstInvalid) {
      setStatus(he ? 'יש לתקן את השדות המסומנים.' : 'Please fix the highlighted fields.')
      refs[firstInvalid].current?.focus()
      return
    }
    const name = nameField.current!.value.trim()
    const reply = replyField.current!.value.trim()
    const message = messageField.current!.value.trim()
    const body = `${message}\n\n${name}\n${reply}`
    setSent(false)
    if (canSend) {
      setSending(true)
      setStatus(he ? 'שולח…' : 'Sending…')
      const ok = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: reply, message, website: honeypot.current?.value ?? '' }),
      }).then(response => response.ok).catch(() => false)
      setSending(false)
      if (ok) {
        form.reset()
        setCount(0)
        setDraft('')
        setSent(true)
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

  const invalid = (field: Field) => errors[field] ? { 'aria-invalid': true as const, 'aria-describedby': `${field}-error` } : {}
  const error = (field: Field) => errors[field] && <span className="field-error" id={`${field}-error`}>{errors[field]}</span>
  const required = he ? 'שדה חובה' : 'required'
  const star = <abbr className="req" title={required} aria-label={required}>*</abbr>

  return <form className="contact-form" onSubmit={submit} noValidate>
    <h2>{he ? 'כתיבת הודעה' : 'Write a message'}</h2>
    <p>{canSend
      ? (he ? 'ההודעה תישלח ישירות אליי.' : 'Your message is sent directly to me.')
      : email
      ? (he ? 'הטיוטה תיפתח בתוכנת הדוא״ל שלכם. משם אפשר לשלוח אותה.' : 'This opens a draft in your email app, where you can send it.')
      : (he ? 'אפשר להכין ולהעתיק טיוטה כאן. כתובת לקבלת פניות עדיין לא זמינה.' : 'You can prepare and copy a draft here. A contact address is not yet available.')}</p>
    <div className="contact-fields">
      <label><span>{he ? 'שם' : 'Name'} {star}</span><input ref={nameField} required maxLength={100} autoComplete="name" onBlur={() => validate('name')} onChange={() => clearIfFixed('name')} {...invalid('name')} />{error('name')}</label>
      <label><span>{he ? 'כתובת הדוא״ל שלכם' : 'Your email address'} {star}</span><input ref={replyField} type="email" inputMode="email" required maxLength={254} autoComplete="email" dir="ltr" onBlur={() => validate('reply')} onChange={() => clearIfFixed('reply')} {...invalid('reply')} />{error('reply')}</label>
    </div>
    <label><span>{he ? 'הודעה' : 'Message'} {star}</span><textarea ref={messageField} required maxLength={maxMessage} rows={6} onBlur={() => validate('message')} onChange={event => { setCount(event.target.value.length); clearIfFixed('message') }} {...invalid('message')} />
      <span className="field-meta">{error('message')}<span className="char-count" aria-hidden="true">{count}/{maxMessage}</span></span></label>
    <input className="hp" ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="form-actions">
      <button className="button button-primary" type="submit" disabled={sending}>{sending ? (he ? 'שולח…' : 'Sending…') : canSend ? (he ? 'שליחת ההודעה' : 'Send message') : email ? (he ? 'פתיחת טיוטה בתוכנת הדוא״ל' : 'Open draft in email app') : (he ? 'הכנת טיוטה' : 'Prepare draft')}<span className="arrow arrow-diagonal" aria-hidden="true" /></button>
      <span className="req-note"><span aria-hidden="true">* </span>{he ? 'שדות חובה' : 'Required fields'}</span>
    </div>
    {draft && <div className="draft">
      <label>{he ? 'טיוטת ההודעה' : 'Message draft'}<textarea readOnly value={draft} rows={5} /></label>
      <button className="button button-secondary" type="button" onClick={copy}>{he ? 'העתקת טיוטה' : 'Copy draft'}</button>
    </div>}
    <p className={`form-status${sent ? ' form-status-ok' : ''}`} role="status">{status}</p>
  </form>
}
