import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Locale } from '@/lib/locale'
import { videoFor, videoSrc, type Media } from '@/lib/media'
import { Artwork } from './artwork'
import { Video } from './video'

export function MediaFrame({ media, locale, mode = 'preview', hero = false, caption = true }: {
  media: Media; locale: Locale; mode?: 'preview' | 'demo'; hero?: boolean; caption?: boolean
}) {
  const video = videoFor(media, mode)
  const he = locale === 'he'
  return <figure className={hero ? 'media-frame media-hero' : 'media-frame'} style={{ '--media-ratio': media.aspectRatio } as CSSProperties}>
    <div className="media-surface">
      {media.poster ? <Image src={media.poster} fill alt={media.alt[locale]}
        preload={hero} sizes={hero ? '100vw' : '(max-width: 760px) 100vw, 65vw'} />
        : <div className="media-artwork" role="img" aria-label={media.alt[locale]}><Artwork kind={media.fallback} /></div>}
      {video && <Video key={videoSrc(video, locale)} asset={video} poster={media.poster} mode={mode} locale={locale} />}
    </div>
    {caption && <figcaption className="media-caption">
      {video
        ? <>{media.attribution[locale]} · {video.isIllustration ? (he ? 'סרטון להמחשה' : 'Illustrative video') : (he ? 'תיעוד מצולם של הפרויקט' : 'Project footage')} · {video.attribution[locale]}</>
        : media.attribution[locale]}
    </figcaption>}
    {mode === 'demo' && video?.transcript && <details className="transcript"><summary>{he ? 'תמלול הסרטון' : 'Video transcript'}</summary><p>{video.transcript[locale]}</p></details>}
  </figure>
}
