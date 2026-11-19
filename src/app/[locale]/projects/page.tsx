import { notFound } from 'next/navigation'
import { ContactBand, ProjectGrid, Site } from '@/components/site'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const description = {
  en: 'Five projects in computer vision, scheduling, agent workflows, machine learning, and data engineering.',
  he: 'חמישה פרויקטים בראייה ממוחשבת, ניהול תורים, תהליכי סוכנים, למידת מכונה והנדסת נתונים.',
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata(locale, '/projects', `${labels[locale].allWork} | ${labels[locale].name}`, description[locale])
}

export default async function Projects({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Site locale={locale} path="/projects"><div className="wrap">
    <div className="page-intro"><h1>{labels[locale].allWork}</h1><p>{description[locale]}</p></div>
    <ProjectGrid locale={locale} standalone />
    <ContactBand locale={locale} />
  </div></Site>
}
