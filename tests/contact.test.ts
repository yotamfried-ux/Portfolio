import assert from 'node:assert/strict'
import test from 'node:test'
import { sendingConfigured, validateContact } from '../src/lib/contact'

test('validateContact accepts a normal message and trims it', () => {
  const result = validateContact({ name: ' Sample ', email: 'visitor@example.com', message: ' Hello ', website: '' })
  assert.deepEqual(result, { ok: true, value: { name: 'Sample', email: 'visitor@example.com', message: 'Hello' } })
})

test('validateContact rejects spam, bad addresses, header injection and oversize text', () => {
  const base = { name: 'Sample', email: 'visitor@example.com', message: 'Hello' }
  assert.equal(validateContact({ ...base, website: 'http://spam' }).ok, false)
  assert.equal(validateContact({ ...base, email: 'not-an-email' }).ok, false)
  assert.equal(validateContact({ ...base, name: 'A\nBcc: x@y.com' }).ok, false)
  assert.equal(validateContact({ ...base, message: 'x'.repeat(2001) }).ok, false)
  assert.equal(validateContact(null).ok, false)
})

test('sending is configured only with both a key and a destination', () => {
  assert.equal(sendingConfigured({}), false)
  assert.equal(sendingConfigured({ RESEND_API_KEY: 'k' }), false)
  assert.equal(sendingConfigured({ RESEND_API_KEY: 'k', CONTACT_TO_EMAIL: 'a@b.co' }), true)
})
