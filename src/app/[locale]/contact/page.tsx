import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact-form'
import { Site } from '@/components/site'
import { publicEmail } from '@/lib/contact'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const description = {
  en: 'Get in touch about a job opportunity, a project, or a question about my work.',
  he: 'אפשר לפנות אליי לגבי הצעת עבודה, פרויקט משותף או שאלה על אחת העבודות שלי.',
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata(locale, '/contact', `${labels[locale].contact} | ${labels[locale].name}`, description[locale])
}

export default async function Contact({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Site locale={locale} path="/contact"><div className="wrap contact-page">
    <div className="page-intro"><h1>{labels[locale].contactHeading}</h1><p>{description[locale]}</p></div>
    <ContactForm locale={locale} email={publicEmail(process.env.PUBLIC_CONTACT_EMAIL)} />
  </div></Site>
}
