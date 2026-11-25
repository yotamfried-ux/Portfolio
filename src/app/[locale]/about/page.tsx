import { notFound } from 'next/navigation'
import { Certificate, ContactBand, ProfileLinks, Site } from '@/components/site'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const bio = {
  en: 'I’m Yotam Friedman, a software engineer based in Israel. I build full-stack applications, computer vision and video pipelines, and AI workflow experiments, and I analyze data with Python.',
  he: 'אני יותם פרידמן, מפתח תוכנה מישראל. אני בונה אפליקציות מקצה לקצה, תהליכי ראייה ממוחשבת ועיבוד וידאו וניסויים בתהליכי עבודה עם בינה מלאכותית, ומנתח נתונים ב־Python.',
}
const sub = {
  en: 'Full-stack products, computer vision pipelines, and applied AI.',
  he: 'מוצרים מקצה לקצה, תהליכי ראייה ממוחשבת ובינה מלאכותית יישומית.',
}
const principles = {
  en: [
    ['End-to-end ownership', 'From the data model and backend to a responsive interface with full right-to-left and left-to-right support.'],
    ['Built to verify', 'Contract tests, workflow validation, and written evidence, so others can check how a system behaves.'],
    ['Practical AI', 'Computer vision and AI agents where they remove a concrete manual step.'],
  ],
  he: [
    ['אחריות מקצה לקצה', 'ממודל הנתונים והשרת ועד ממשק רספונסיבי עם תמיכה מלאה בעברית ובאנגלית, מימין לשמאל ומשמאל לימין.'],
    ['נבנה כך שאפשר לבדוק', 'בדיקות חוזה, אימות תהליכי עבודה ותיעוד מסודר, כדי שאחרים יוכלו לבדוק איך המערכת מתנהגת.'],
    ['בינה מלאכותית שימושית', 'ראייה ממוחשבת וסוכני בינה מלאכותית במקומות שבהם הם מייתרים שלב ידני מוגדר.'],
  ],
}
const stack = {
  en: [['Full-stack', 'TypeScript, Next.js, PostgreSQL'], ['AI & video', 'Python, computer vision, FFmpeg, AI agent workflows'], ['Data', 'Python, scikit-learn, MongoDB, SQL']],
  he: [['פיתוח מקצה לקצה', 'TypeScript, Next.js, PostgreSQL'], ['בינה מלאכותית ווידאו', 'Python, ראייה ממוחשבת, FFmpeg, תהליכי עבודה עם סוכני בינה מלאכותית'], ['נתונים', 'Python, scikit-learn, MongoDB, SQL']],
}
const codeNote = {
  en: 'My product codebases are proprietary, so they are not public. Each project page includes a short, non-sensitive excerpt, and I’m happy to walk through the full code live in technical interviews.',
  he: 'קוד המקור של המוצרים שלי סגור ולכן לא מפורסם. בכל עמוד פרויקט יש קטע קצר שאינו רגיש, ואשמח לעבור על הקוד המלא בהדגמה חיה בראיונות טכניים.',
}
const titles = { en: { how: 'How I work', stack: 'Core stack', links: 'Profiles' }, he: { how: 'איך אני עובד', stack: 'טכנולוגיות עיקריות', links: 'פרופילים' } }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata(locale, '/about', `${labels[locale].about} | ${labels[locale].name}`, bio[locale])
}

export default async function About({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = titles[locale]
  return <Site locale={locale} path="/about"><div className="wrap about-page">
    <div className="page-intro"><h1>{labels[locale].aboutHeading}</h1><p className="about-sub">{sub[locale]}</p><p>{bio[locale]}</p><ProfileLinks locale={locale} /></div>
    <section className="capabilities" aria-label={t.how}>
      <h2>{t.how}</h2>
      <div className="capability-grid">{principles[locale].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <section className="core-stack" aria-label={t.stack}>
      <h2>{t.stack}</h2>
      <dl>{stack[locale].map(([group, items]) => <div key={group}><dt>{group}</dt><dd lang="en" dir="ltr">{items}</dd></div>)}</dl>
    </section>
    <section className="code-policy" aria-label={locale === 'he' ? 'על קוד המקור' : 'About the source code'}>
      <h2>{locale === 'he' ? 'על קוד המקור' : 'About the source code'}</h2><p>{codeNote[locale]}</p>
    </section>
    <Certificate locale={locale} /><ContactBand locale={locale} />
  </div></Site>
}
