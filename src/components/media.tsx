import Image from 'next/image'
import type { CSSProperties } from 'react'
import { labels, type Locale } from '@/lib/locale'
import { videoFor, type Media } from '@/lib/media'
import { Artwork } from './artwork'
import { Arrow } from './arrow'
import { Video } from './video'

export function MediaFrame({ media, locale, mode = 'preview', hero = false, caption = true, liveAppUrl }: {
  media: Media; locale: Locale; mode?: 'preview' | 'demo'; hero?: boolean; caption?: boolean; liveAppUrl?: string
}) {
  const video = videoFor(media, mode)
  const he = locale === 'he'
  return <>
    <figure className={hero ? 'media-frame media-hero' : 'media-frame'} style={{ '--media-ratio': media.aspectRatio } as CSSProperties}>
      <div className="media-surface">
        {media.poster ? <Image src={media.poster} fill alt={media.alt[locale]}
          preload={hero} sizes={hero ? '100vw' : '(max-width: 760px) 100vw, 65vw'} />
          : <div className="media-artwork" role="img" aria-label={media.alt[locale]}><Artwork kind={media.fallback} /></div>}
        {video && <Video key={video.src} asset={video} poster={media.poster} mode={mode} locale={locale} />}
      </div>
      {(caption || liveAppUrl) && <figcaption className={liveAppUrl ? 'media-caption media-caption-live' : 'media-caption'}>
        {liveAppUrl && <a className="button button-primary" href={liveAppUrl}>{labels[locale].liveApp}<Arrow diagonal /></a>}
        {caption && <span>{video
          ? <>{video.isIllustration ? (he ? 'סרטון להמחשה' : 'Illustrative video') : (he ? 'תיעוד מצולם של הפרויקט' : 'Project footage')} · {video.attribution[locale]}</>
          : media.attribution[locale]}</span>}
      </figcaption>}
    </figure>
    {mode === 'demo' && video?.transcript && <details className="transcript"><summary>{he ? 'תמלול הסרטון' : 'Video transcript'}</summary><p>{video.transcript[locale]}</p></details>}
  </>
}
