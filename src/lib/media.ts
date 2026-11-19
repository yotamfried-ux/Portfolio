import type { Bilingual } from './locale'

type Illustration = 'sport' | 'booking' | 'agent' | 'churn' | 'etl'
type Video = { src: string; captions?: Bilingual; transcript?: Bilingual; attribution: Bilingual; isIllustration: boolean }

export type Media = {
  poster?: string
  fallback?: Illustration
  previewVideo?: Video
  demoVideo?: Video & { captions: Bilingual; transcript: Bilingual }
  alt: Bilingual
  attribution: Bilingual
  isIllustration: boolean
  aspectRatio?: string
}

export const heroMedia: Media = {
  poster: '/media/aerial-hero.webp',
  alt: { en: 'A winding alpine road through a misty forest', he: 'כביש הררי מתפתל בתוך יער ערפילי' },
  attribution: { en: 'AI-generated concept still', he: 'תמונת המחשה שנוצרה בבינה מלאכותית' },
  isIllustration: true,
}

export const projectMedia = {
  sportreel: {
    poster: '/media/sportreel.webp', fallback: 'sport',
    alt: { en: 'A cyclist on a forest road seen from above', he: 'רוכב אופניים בכביש ביער במבט מלמעלה' },
    attribution: heroMedia.attribution, isIllustration: true,
  },
  tori: {
    fallback: 'booking', alt: { en: 'Stylized calendar and booking slots', he: 'יומן ושעות פנויות באיור מסוגנן' },
    attribution: { en: 'Booking workflow illustration', he: 'המחשה של תהליך הזמנת תור' }, isIllustration: true,
  },
  'ai-agent-system': {
    fallback: 'agent', alt: { en: 'Connected agent workflow nodes', he: 'צמתים מחוברים בתהליך עבודה של סוכנים' },
    attribution: { en: 'Agent workflow illustration', he: 'המחשה של תהליך העבודה של סוכנים' }, isIllustration: true,
  },
  'customer-churn-prediction': {
    fallback: 'churn', alt: { en: 'Synthetic bars representing sample risk groups', he: 'עמודות סינתטיות המייצגות קבוצות סיכון לדוגמה' },
    attribution: { en: 'Synthetic data illustration', he: 'המחשה המבוססת על נתונים סינתטיים' }, isIllustration: true,
  },
  'etl-pipeline': {
    fallback: 'etl', alt: { en: 'A schematic connecting three pipeline stages', he: 'תרשים המחבר שלושה שלבים בתהליך עיבוד נתונים' },
    attribution: { en: 'Data pipeline illustration', he: 'המחשה של תהליך עיבוד נתונים' }, isIllustration: true,
  },
} satisfies Record<string, Media>

export function videoFor(media: Media, mode: 'preview' | 'demo') {
  return mode === 'preview' ? media.previewVideo : media.demoVideo
}
