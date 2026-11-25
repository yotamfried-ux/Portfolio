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
  attribution: { en: 'Illustration', he: 'תמונת המחשה' },
  isIllustration: true,
}

export const projectMedia = {
  sportreel: {
    poster: '/media/sportreel.webp', fallback: 'sport',
    alt: { en: 'A surfer riding a wave, seen from a drone high above the water', he: 'גולש רוכב על גל, מבט מרחפן שמעל המים' },
    attribution: { en: 'Frame from the original drone footage', he: 'פריים מצילומי הרחפן המקוריים' }, isIllustration: false,
    previewVideo: {
      src: { en: '/media/sportreel-preview-en.mp4', he: '/media/sportreel-preview-he.mp4' },
      attribution: { en: 'Motion walkthrough built from drone footage', he: 'סרטון הדגמה שנבנה מצילומי רחפן' },
      isIllustration: true,
    },
    demoVideo: {
      src: { en: '/media/sportreel-demo-en.mp4', he: '/media/sportreel-demo-he.mp4' },
      attribution: { en: 'Motion walkthrough built from drone footage', he: 'סרטון הדגמה שנבנה מצילומי רחפן' },
      transcript: {
        en: 'Drone footage in. Personal reels out. Lots of clips, many athletes: who is who? SportReel finds every athlete and follows each one. It links the same athlete across different clips, without face recognition. It picks the full ride and frames it for phones, vertical and ready to post: a personal reel for every athlete.',
        he: 'מעלים צילומי רחפן. מקבלים ריל אישי. המון קליפים והמון ספורטאים: מי זה מי? SportReel מאתר כל ספורטאי ועוקב אחרי כל אחד מהם. הוא מקשר את אותו ספורטאי בין קליפים שונים, בלי זיהוי פנים. הוא בוחר את הגלישה המלאה ומתאים אותה לטלפון, בפורמט אנכי ומוכן לפרסום: ריל אישי לכל ספורטאי.',
      },
      isIllustration: true,
    },
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
        he: 'פחות הודעות. יותר תורים. הלקוח בוחר שירות ויום, רואה רק שעות פנויות ומקבל אישור מיידי. אצלכם, התור כבר ביומן. תזכורות ורשימת המתנה פועלות אוטומטית, ואתם קובעים את הכללים. דוחות ברורים מראים את מצב העסק. הנתונים בדוחות הם נתוני דמו.',
      },
      isIllustration: true,
    },
  },
  'ai-agent-system': {
    fallback: 'agent', alt: { en: 'A diagram of connected steps in an agent workflow', he: 'תרשים של שלבים מחוברים בתהליך העבודה של הסוכנים' },
    attribution: { en: 'Agent workflow illustration', he: 'המחשה של תהליך עבודה עם סוכנים' }, isIllustration: true,
  },
  'customer-churn-prediction': {
    poster: '/media/customer-churn-prediction.webp', fallback: 'churn', alt: { en: 'The distribution of risk scores the churn model gave to customers who stayed and customers who left', he: 'התפלגות ציוני הסיכון שהמודל נתן ללקוחות שנשארו וללקוחות שעזבו' },
    attribution: { en: 'Chart from the model’s real test-set results', he: 'גרף מתוצאות הבדיקה האמיתיות של המודל' }, isIllustration: true,
    previewVideo: {
      src: { en: '/media/customer-churn-prediction-preview-en.mp4', he: '/media/customer-churn-prediction-preview-he.mp4' },
      attribution: { en: 'Motion walkthrough built from the project’s real test-set results', he: 'סרטון הדגמה שנבנה מתוצאות הבדיקה האמיתיות של הפרויקט' },
      isIllustration: true,
    },
    demoVideo: {
      src: { en: '/media/customer-churn-prediction-demo-en.mp4', he: '/media/customer-churn-prediction-demo-he.mp4' },
      attribution: { en: 'Motion walkthrough built from the project’s real test-set results', he: 'סרטון הדגמה שנבנה מתוצאות הבדיקה האמיתיות של הפרויקט' },
      transcript: {
        en: 'Customer churn prediction, the final project of the Big Data Analyst course at the Technion. The goal: spot a customer about to leave, before they leave. The data covers 7,043 telecom customers with 19 features, and 26.5% of them churned. Contract type, tenure and payment method separate churners from stayers. The data was cleaned and encoded, and 61 configurations across three model families were compared with scikit-learn. A random forest of 200 trees won, with 80.2% accuracy on customers it never saw, against 73.5% for guessing without a model. It found 193 of 374 churners, raised 98 false alarms, and reached an AUC of 0.84. In part B the model runs on a database: 25,000 records in MongoDB, a schema field fixed, 24,218 complete records scored and exported to CSV. Know who is about to leave, before they do.',
        he: 'חיזוי נטישת לקוחות, פרויקט הגמר בקורס אנליסט ביג דאטה בטכניון. המטרה: לזהות לקוח שעומד לעזוב, לפני שהוא עוזב. הנתונים כוללים 7,043 לקוחות של חברת תקשורת עם 19 מאפיינים, ו-26.5% מהם נטשו. סוג החוזה, הוותק ושיטת התשלום מבדילים בין נוטשים לנשארים. הנתונים נוקו וקודדו, ו-61 שילובי פרמטרים בשלוש משפחות מודלים הושוו בעזרת scikit-learn. המנצח היה יער אקראי של 200 עצים, עם דיוק של 80.2% על לקוחות שהמודל לא ראה, מול 73.5% בניחוש ללא מודל. הוא זיהה 193 מתוך 374 נוטשים, ייצר 98 התראות שווא והגיע ל-AUC של 0.84. בשלב ב׳ המודל רץ על מסד נתונים: 25,000 רשומות ב-MongoDB, תיקון שדה בסכמה, ו-24,218 רשומות שלמות שקיבלו ציון ויוצאו לקובץ CSV. לדעת מי עומד לעזוב, לפני שהוא עוזב.',
      },
      isIllustration: true,
    },
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
