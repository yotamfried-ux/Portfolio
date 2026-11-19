import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact-form'
import { Site } from '@/components/site'
import { publicEmail } from '@/lib/contact'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }
const description = {
  en: 'Tell me what you’re working on, what you need, or what you would like to discuss.',
  he: 'ספרו לי על מה אתם עובדים, מה דרוש לכם או על מה תרצו לדבר.',
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
