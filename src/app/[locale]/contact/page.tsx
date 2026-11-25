import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact-form'
import { CopyEmail } from '@/components/copy-email'
import { Arrow, Site } from '@/components/site'
import { defaultPublicEmail, publicEmail } from '@/lib/contact'
import { isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'
import { publicProfiles } from '@/lib/profiles'

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
  const t = labels[locale]
  const email = publicEmail(process.env.PUBLIC_CONTACT_EMAIL ?? defaultPublicEmail)
  const { github, linkedin, cv } = publicProfiles()
  const links = [[github, t.github], ...(linkedin ? [[linkedin, 'LinkedIn']] : []), ...(cv ? [[cv, locale === 'he' ? 'קורות חיים (PDF)' : 'CV (PDF)']] : [])]
  return <Site locale={locale} path="/contact"><div className="wrap contact-page">
    <div className="page-intro"><h1>{t.contactHeading}</h1><p>{description[locale]}</p></div>
    <div className="contact-layout">
      <ContactForm locale={locale} email={email} />
      <aside className="contact-card" aria-label={t.directContact}>
        <h2>{t.directContact}</h2>
        {email && <p><CopyEmail email={email} label={t.copyEmail} done={t.emailCopied} /></p>}
        <h3 className="eyebrow">{t.profiles}</h3>
        <ul className="contact-links">{links.map(([url, text]) => <li key={url}><a className="text-link" href={url} rel="noopener noreferrer" target="_blank">{text}<Arrow diagonal /></a></li>)}</ul>
        <dl className="contact-details">
          <div><dt>{t.location}</dt><dd>{t.locationValue}</dd></div>
          <div><dt>{t.languages}</dt><dd>{t.languagesValue}</dd></div>
        </dl>
      </aside>
    </div>
  </div></Site>
}
