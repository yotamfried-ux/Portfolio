import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { MediaFrame } from '../src/components/media'
import { draftEmail, publicEmail } from '../src/lib/contact'
import { flaggedCount, etlRows } from '../src/lib/demo'
import { href } from '../src/lib/locale'
import { heroMedia, videoFor } from '../src/lib/media'
import { projectBySlug, projects } from '../src/lib/projects'

test('approved projects appear once, in order, with bilingual content', () => {
  assert.deepEqual(projects.map(project => project.slug), ['sportreel', 'tori', 'ai-agent-system', 'customer-churn-prediction', 'etl-pipeline'])
  for (const project of projects) {
    assert.equal(projectBySlug(project.slug), project)
    assert.ok(project.title.he && project.summary.he && project.next.he)
    assert.ok(project.steps.every(step => step.title.he && step.detail.he))
    assert.equal(project.demoStatus, 'illustrative')
    assert.equal(project.status === 'pending', project.stack.length === 0)
  }
  assert.equal(projectBySlug('unknown'), undefined)
})

test('projects without footage have posters or CSS art with no video request', () => {
  for (const media of [heroMedia, ...projects.filter(project => project.slug !== 'tori').map(project => project.media)]) {
    assert.ok(media.poster || media.fallback)
    assert.equal(media.isIllustration, true)
    if (media.poster) assert.ok(existsSync(`public${media.poster}`))
    for (const mode of ['preview', 'demo'] as const) {
      assert.equal(videoFor(media, mode), undefined)
      const html = renderToStaticMarkup(createElement(MediaFrame, { media, locale: 'he', mode }))
      assert.match(html, /<figcaption/)
      assert.ok(html.includes(media.attribution.he))
      assert.doesNotMatch(html, /<video|<source/)
    }
  }
})

test('Tori shares one authentic showcase, a poster, captions and the public app link', () => {
  const project = projectBySlug('tori')!
  const { media } = project
  assert.equal(project.liveAppUrl, 'https://turim.d2ryf.com/')
  assert.equal(media.previewVideo?.src, media.demoVideo?.src)
  assert.equal(media.previewVideo?.autoPlayPreview, false)
  assert.equal(media.demoVideo?.isIllustration, false)
  for (const path of [media.poster, media.demoVideo?.src, media.demoVideo?.captions.en, media.demoVideo?.captions.he]) {
    assert.ok(path && existsSync(`public${path}`), path)
  }
})

test('media modes select their own asset', () => {
  const previewVideo = { src: '/sample-preview.mp4', attribution: { en: 'Sample', he: 'דוגמה' }, isIllustration: true }
  const demoVideo = { ...previewVideo, src: '/sample-demo.mp4', captions: { en: '/sample.en.vtt', he: '/sample.he.vtt' }, transcript: { en: 'Sample', he: 'דוגמה' } }
  assert.equal(videoFor({ ...heroMedia, previewVideo, demoVideo }, 'preview'), previewVideo)
  assert.equal(videoFor({ ...heroMedia, previewVideo, demoVideo }, 'demo'), demoVideo)
})

test('locale routes and approved mailto draft are encoded predictably', () => {
  assert.equal(href('en'), '/')
  assert.equal(href('en', '/projects/tori'), '/projects/tori')
  assert.equal(href('he', '/projects/tori'), '/he/projects/tori')
  assert.equal(publicEmail(' a@example.com '), 'a@example.com')
  assert.equal(publicEmail('a@example.com?bcc=other@example.com'), undefined)
  assert.equal(draftEmail('a@example.com', 'A&B', 'x\ny'), 'mailto:a@example.com?subject=A%26B&body=x%0Ay')
})

test('synthetic demos handle thresholds and explicitly reject bad rows', () => {
  assert.equal(flaggedCount(0), 5)
  assert.equal(flaggedCount(57), 3)
  assert.equal(flaggedCount(100), 0)
  assert.equal(etlRows[1].find(row => row.id === 'A03')?.value, '')
  assert.deepEqual(etlRows[2].map(row => row.id), ['A01', 'A02'])
})
