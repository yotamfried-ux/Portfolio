import { notFound } from 'next/navigation'
import { Capabilities, Certificate, ContactBand, Site } from '@/components/site'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const bio = {
  en: 'I’m Yotam Friedman. My work spans applied AI, full-stack software, and data. I’m interested in the points where an experimental idea becomes a workflow someone can use.',
  he: 'אני יותם פרידמן. אני עוסק בבינה מלאכותית יישומית, בפיתוח מקצה לקצה ובנתונים. מעניין אותי להפוך רעיון ניסיוני לתהליך עבודה שאפשר להשתמש בו.',
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata(locale, '/about', `${labels[locale].about} | ${labels[locale].name}`, bio[locale])
}

export default async function About({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Site locale={locale} path="/about"><div className="wrap about-page">
    <div className="page-intro"><h1>{labels[locale].aboutHeading}</h1><p>{bio[locale]}</p></div>
    <Capabilities locale={locale} /><Certificate locale={locale} /><ContactBand locale={locale} />
  </div></Site>
}
