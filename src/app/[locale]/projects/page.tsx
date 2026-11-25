import { notFound } from 'next/navigation'
import { ContactBand, ProjectGrid, Site } from '@/components/site'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const description = {
  en: 'Selected work in computer vision, AI agents, machine learning, and booking software.',
  he: 'עבודות נבחרות בראייה ממוחשבת, סוכני בינה מלאכותית, למידת מכונה ותוכנות לקביעת תורים.',
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata(locale, '/projects', `${labels[locale].allWork} | ${labels[locale].name}`, description[locale])
}

export default async function Projects({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Site locale={locale} path="/projects"><div className="wrap projects-page">
    <div className="page-intro"><h1>{labels[locale].allWork}</h1><p>{description[locale]}</p></div>
    <ProjectGrid locale={locale} standalone />
    <ContactBand locale={locale} />
  </div></Site>
}
