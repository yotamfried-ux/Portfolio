'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/locale'
import type { Media } from '@/lib/media'

type VideoAsset = NonNullable<Media['previewVideo']>

export function Video({ asset, poster, mode, locale }: {
  asset: VideoAsset; poster?: string; mode: 'preview' | 'demo'; locale: Locale
}) {
  const root = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [requested, setRequested] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [paused, setPaused] = useState(false)
  const he = locale === 'he'

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 })
    if (root.current) observer.observe(root.current)
    return () => {
      preference.removeEventListener('change', sync)
      observer.disconnect()
    }
  }, [])

  const mounted = !failed && (requested || (mode === 'preview' && visible && !reduced && !paused))
  useEffect(() => {
    const player = video.current
    if (!player) return
    if (!visible || paused || (reduced && !requested)) player.pause()
    else if (mode === 'preview' || requested) void player.play().catch(() => setPaused(true))
  }, [mode, mounted, paused, reduced, requested, visible])

  function toggle() {
    setRequested(true)
    setPaused(mounted && !paused)
  }

  return <div ref={root} className="video-layer">
    {mounted && <video ref={video} src={asset.src} muted={mode === 'preview'} loop={mode === 'preview'} playsInline
      controls={mode === 'demo'} preload="none" poster={poster} onError={() => setFailed(true)}>
      {asset.captions && <track kind="captions" src={asset.captions[locale]} srcLang={locale} label={he ? 'כתוביות' : 'Captions'} default />}
    </video>}
    {failed ? <p className="media-control" role="status">{he ? 'לא ניתן לטעון את הסרטון.' : 'Video unavailable.'}</p>
      : (mode === 'preview' || !mounted) && <button className="media-control" type="button" onClick={toggle}>
        {mounted && !paused ? (he ? 'השהיה' : 'Pause') : (he ? 'ניגון סרטון' : 'Play video')}
      </button>}
  </div>
}
