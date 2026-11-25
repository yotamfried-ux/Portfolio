'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/locale'
import { videoSrc, type Media } from '@/lib/media'

type VideoAsset = NonNullable<Media['previewVideo']>
type PreviewPreference = 'automatic' | 'play' | 'pause'

const minimumVisibleRatio = 0.35

export function Video({ asset, poster, mode, locale }: {
  asset: VideoAsset; poster?: string; mode: 'preview' | 'demo'; locale: Locale
}) {
  const root = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const pausedByScroll = useRef(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [preference, setPreference] = useState<PreviewPreference>('automatic')
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)
  const preview = mode === 'preview'
  const he = locale === 'he'

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(motion.matches)
    sync()
    motion.addEventListener('change', sync)
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.intersectionRatio >= minimumVisibleRatio)
    }, { threshold: minimumVisibleRatio })
    if (root.current) observer.observe(root.current)
    return () => {
      motion.removeEventListener('change', sync)
      observer.disconnect()
    }
  }, [])

  // Both modes autoplay (muted, silent clips) unless the visitor pauses or prefers reduced motion.
  const wantsPlay = preference === 'play' || (preference === 'automatic' && !reduced)
  const shouldPlay = visible && wantsPlay
  // The video mounts the first time it should play and then stays: scrolling away only pauses it,
  // so the last frame remains on screen instead of falling back to the poster.
  if (shouldPlay && !started) setStarted(true)
  const mounted = !failed && started

  useEffect(() => {
    const player = video.current
    if (!mounted || !player) return
    if (shouldPlay) {
      let cancelled = false
      void player.play().catch(() => {
        if (!cancelled) setPreference('pause')
      })
      return () => { cancelled = true }
    }
    pausedByScroll.current = true
    player.pause()
  }, [mounted, shouldPlay])

  // Browsers (power saving, a background tab) can pause a muted clip on their own. That is not the
  // visitor's choice: resume when the tab is visible again instead of staying paused.
  useEffect(() => {
    if (!mounted || !shouldPlay) return
    const resume = () => {
      const player = video.current
      if (!document.hidden && player?.paused) void player.play().catch(() => undefined)
    }
    document.addEventListener('visibilitychange', resume)
    return () => document.removeEventListener('visibilitychange', resume)
  }, [mounted, shouldPlay])

  return <div ref={root} className="video-layer">
    {mounted && <video ref={video} className={preview ? 'video-preview' : undefined}
      src={videoSrc(asset, locale)} muted loop={preview} playsInline controls={!preview}
      aria-label={he ? 'סרטון הפרויקט' : 'Project video'} preload="metadata" poster={poster}
      onLoadedData={event => { event.currentTarget.dataset.ready = 'true' }}
      onPlaying={event => { event.currentTarget.dataset.ready = 'true' }}
      onPlay={() => { pausedByScroll.current = false; if (preference === 'pause') setPreference('play') }}
      onPause={() => {
        if (pausedByScroll.current) { pausedByScroll.current = false; return }
        if (document.hidden) return
        setPreference('pause')
      }}
      onError={() => setFailed(true)}>
      {asset.captions && <track kind="captions" src={asset.captions[locale]} srcLang={locale} label={he ? 'כתוביות' : 'Captions'} default />}
    </video>}
    {failed ? <p className="media-control" role="status">{he ? 'לא הצלחנו לטעון את הסרטון.' : 'The video couldn’t load.'}</p>
      : (preview || !mounted) && <button className="media-control" type="button" onClick={() => {
        setPreference(shouldPlay ? 'pause' : 'play')
      }}>
        {mounted && wantsPlay ? (he ? 'השהיית הסרטון' : 'Pause video') : (he ? 'ניגון הסרטון' : 'Play video')}
      </button>}
  </div>
}
