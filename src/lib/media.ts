import type { Bilingual } from './locale'

type Illustration = 'sport' | 'booking' | 'agent' | 'churn' | 'etl'
type Video = { src: string | Bilingual; captions?: Bilingual; transcript?: Bilingual; attribution: Bilingual; isIllustration: boolean }

export type Media = {
  poster?: string
  fallback?: Illustration
  previewVideo?: Video
  demoVideo?: Video & { captions?: Bilingual; transcript: Bilingual }
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

export const projectMedia = {
  sportreel: {
    poster: '/media/sportreel.webp', fallback: 'sport',
    alt: { en: 'An overhead view of a cyclist on a forest road', he: 'מבט מלמעלה על רוכב אופניים בכביש שעובר ביער' },
    attribution: heroMedia.attribution, isIllustration: true,
  },
  tori: {
    poster: '/media/tori.webp', fallback: 'booking',
    alt: { en: 'The Tori business calendar on a desktop monitor beside the booking confirmation on a phone', he: 'יומן העסק של תורי על מסך מחשב, לצד אישור קביעת התור בטלפון' },
    attribution: { en: 'Booking flow illustration', he: 'המחשה של תהליך קביעת תור' }, isIllustration: true,
    previewVideo: {
      src: { en: '/media/tori-preview-en.mp4', he: '/media/tori-preview-he.mp4' },
      attribution: { en: 'Motion promo composed from Tori screens', he: 'סרטון תדמית שנבנה ממסכי תורי' },
      isIllustration: true,
    },
    demoVideo: {
      src: { en: '/media/tori-demo-en.mp4', he: '/media/tori-demo-he.mp4' },
      attribution: { en: 'Motion walkthrough composed from Tori screens; reports use demo data', he: 'סרטון הדגמה שנבנה ממסכי תורי; נתוני הדוחות הם נתוני דמו' },
      transcript: {
        en: 'Fewer messages. More bookings. A customer picks a service and a day, sees only the free slots and gets instant confirmation. On the business side, the appointment is already in the calendar. Reminders and a smart waitlist work automatically, and you set the rules. Clear reports show how the business is doing. Report figures are demo data.',
        he: 'פחות הודעות. יותר תורים. הלקוח בוחר שירות ויום, רואה רק שעות פנויות ומקבל אישור מיידי. בצד העסק, התור כבר ביומן. תזכורות ורשימת המתנה פועלות אוטומטית, ואתם קובעים את הכללים. דוחות ברורים מראים מה קורה בעסק. הנתונים בדוחות הם נתוני דמו.',
      },
      isIllustration: true,
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

export function videoSrc(video: { src: string | Bilingual }, locale: 'en' | 'he') {
  return typeof video.src === 'string' ? video.src : video.src[locale]
}

export function videoFor(media: Media, mode: 'preview' | 'demo') {
  return mode === 'preview' ? media.previewVideo : media.demoVideo
}
