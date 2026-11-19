import type { Bilingual } from './locale'

type Illustration = 'sport' | 'booking' | 'agent' | 'churn' | 'etl'
type Video = { src: string; autoPlayPreview?: boolean; captions?: Bilingual; transcript?: Bilingual; attribution: Bilingual; isIllustration: boolean }

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
  alt: { en: 'A winding mountain road through a misty forest', he: 'כביש הררי מתפתל בתוך יער ערפילי' },
  attribution: { en: 'AI-generated illustration', he: 'תמונת המחשה שנוצרה בבינה מלאכותית' },
  isIllustration: true,
}

const toriShowcase: Video = {
  src: '/media/tori/showcase.mp4',
  autoPlayPreview: false,
  attribution: { en: 'Recorded with demo data', he: 'הוקלט עם נתוני הדגמה' },
  isIllustration: false,
}

export const projectMedia = {
  sportreel: {
    poster: '/media/sportreel.webp', fallback: 'sport',
    alt: { en: 'An overhead view of a cyclist on a forest road', he: 'מבט מלמעלה על רוכב אופניים בכביש שעובר ביער' },
    attribution: heroMedia.attribution, isIllustration: true,
  },
  tori: {
    poster: '/media/tori/poster.webp', aspectRatio: '16 / 9',
    alt: { en: 'Tori’s business calendar with a sample appointment', he: 'יומן העסק בתורי ובו תור לדוגמה' },
    attribution: toriShowcase.attribution, isIllustration: false,
    previewVideo: toriShowcase,
    demoVideo: {
      ...toriShowcase,
      captions: { en: '/media/tori/showcase.en.vtt', he: '/media/tori/showcase.he.vtt' },
      transcript: {
        en: 'The Tori showcase opens with a customer choosing a service, day, and time. The business calendar shows the new booking. The owner shortens working hours, and the available times update. A mobile customer completes a booking, and the last shot shows the appointment details beside the Tori logo.',
        he: 'הסרטון של תורי נפתח בבחירת שירות, יום ושעה. התור החדש מופיע ביומן העסק. בעל העסק מקצר את שעות הפעילות והשעות הפנויות מתעדכנות. לאחר מכן רואים קביעת תור בנייד, ובסיום מופיעים פרטי התור לצד הלוגו של תורי.',
      },
    },
  },
  'ai-agent-system': {
    fallback: 'agent', alt: { en: 'A diagram of connected steps in an agent workflow', he: 'תרשים של שלבים מחוברים בתהליך העבודה של הסוכנים' },
    attribution: { en: 'Agent workflow illustration', he: 'המחשה של תהליך עבודה עם סוכנים' }, isIllustration: true,
  },
  'customer-churn-prediction': {
    fallback: 'churn', alt: { en: 'A bar chart illustrating changes in sample risk scores', he: 'תרשים עמודות שממחיש הבדלים בין ציוני סיכון לדוגמה' },
    attribution: { en: 'Illustration using synthetic data', he: 'המחשה המבוססת על נתונים סינתטיים' }, isIllustration: true,
  },
  'etl-pipeline': {
    fallback: 'etl', alt: { en: 'A diagram linking data extraction, transformation, and loading', he: 'תרשים של שלבי החילוץ, העיבוד והטעינה של נתונים' },
    attribution: { en: 'Data pipeline illustration', he: 'המחשה של תהליך עיבוד נתונים' }, isIllustration: true,
  },
} satisfies Record<string, Media>

export function videoFor(media: Media, mode: 'preview' | 'demo') {
  return mode === 'preview' ? media.previewVideo : media.demoVideo
}
