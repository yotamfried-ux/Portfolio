import { notFound } from 'next/navigation'
import { Capabilities, Certificate, ContactBand, Site } from '@/components/site'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const bio = {
  en: 'I’m Yotam Friedman. I work on applied AI, full-stack applications, and data engineering. I’m interested in what it takes to turn an experiment into a tool people can use.',
  he: 'אני יותם פרידמן. אני עוסק בבינה מלאכותית יישומית, בפיתוח תוכנה מקצה לקצה ובהנדסת נתונים. מעניין אותי מה נדרש כדי להפוך ניסוי לכלי שאפשר להשתמש בו בפועל.',
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
