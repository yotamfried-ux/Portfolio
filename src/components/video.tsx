'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/locale'
import type { Media } from '@/lib/media'

type VideoAsset = NonNullable<Media['previewVideo']>
type PreviewPreference = 'automatic' | 'play' | 'pause'

const minimumVisibleRatio = 0.35

export function Video({ asset, poster, mode, locale }: {
  asset: VideoAsset; poster?: string; mode: 'preview' | 'demo'; locale: Locale
}) {
  const root = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [previewPreference, setPreviewPreference] = useState<PreviewPreference>('automatic')
  const [demoRequested, setDemoRequested] = useState(false)
  const [failed, setFailed] = useState(false)
  const preview = mode === 'preview'
  const he = locale === 'he'

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.intersectionRatio >= minimumVisibleRatio)
    }, { threshold: minimumVisibleRatio })
    if (root.current) observer.observe(root.current)
    return () => {
      preference.removeEventListener('change', sync)
      observer.disconnect()
    }
  }, [])

  const wantsPreview = previewPreference === 'play' || (previewPreference === 'automatic' && !reduced)
  const showPreview = preview && visible && wantsPreview
  const mounted = !failed && (preview ? showPreview : demoRequested)

  useEffect(() => {
    const player = video.current
    if (!preview || !showPreview || !player) return
    let cancelled = false
    void player.play().catch(() => {
      if (!cancelled) setPreviewPreference('pause')
    })
    return () => { cancelled = true }
  }, [preview, showPreview, mounted])

  useEffect(() => {
    if (!preview && mounted) video.current?.focus()
  }, [preview, mounted])

  useEffect(() => {
    if (!preview && !visible) video.current?.pause()
  }, [preview, visible])

  return <div ref={root} className="video-layer">
    {mounted && <video ref={video} className={preview ? 'video-preview' : undefined}
      src={asset.src} muted={preview} loop={preview} playsInline autoPlay={!preview} controls={!preview}
      aria-label={he ? 'סרטון הפרויקט' : 'Project video'} preload="none" poster={poster}
      onPlaying={event => { event.currentTarget.dataset.playing = 'true' }}
      onPause={event => { delete event.currentTarget.dataset.playing }}
      onWaiting={event => { delete event.currentTarget.dataset.playing }}
      onError={() => setFailed(true)}>
      {asset.captions && <track kind="captions" src={asset.captions[locale]} srcLang={locale} label={he ? 'כתוביות' : 'Captions'} default />}
    </video>}
    {failed ? <p className="media-control" role="status">{he ? 'לא הצלחנו לטעון את הסרטון.' : 'The video couldn’t load.'}</p>
      : (preview || !mounted) && <button className="media-control" type="button" onClick={() => {
        if (preview) {
          setPreviewPreference(showPreview ? 'pause' : 'play')
        } else {
          setDemoRequested(true)
        }
      }}>
        {showPreview ? (he ? 'השהיית הסרטון' : 'Pause video') : (he ? 'ניגון הסרטון' : 'Play video')}
      </button>}
  </div>
}
