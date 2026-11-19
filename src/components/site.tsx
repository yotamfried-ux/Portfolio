import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { href, labels, type Locale } from '@/lib/locale'
import { projects } from '@/lib/projects'
import { MediaFrame } from './media'

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? 'arrow arrow-diagonal' : 'arrow'} aria-hidden="true" />
}

export function Action({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return <Link href={to} className={secondary ? 'button button-secondary' : 'button button-primary'}>{children}<Arrow diagonal /></Link>
}

export function Header({ locale, path }: { locale: Locale; path: string }) {
  const t = labels[locale]
  const alternate = locale === 'en' ? 'he' : 'en'
  return <header className="site-header">
    <div className="wrap header-inner">
      <Link href={href(locale)} className="wordmark"><span className="monogram" aria-hidden="true">YF</span><span>{t.name}</span></Link>
      <nav aria-label={t.nav} className="site-nav">
        <Link href={href(locale, '/projects')} aria-current={path.startsWith('/projects') ? 'page' : undefined}>{t.work}</Link>
        <Link href={href(locale, '/about')} aria-current={path === '/about' ? 'page' : undefined}>{t.about}</Link>
        <Link href={href(locale, '/contact')} aria-current={path === '/contact' ? 'page' : undefined}>{t.contact}</Link>
      </nav>
      <Link className="language" href={href(alternate, path)} hrefLang={alternate} lang={alternate} dir={alternate === 'he' ? 'rtl' : 'ltr'}>{t.language}<Arrow diagonal /></Link>
    </div>
  </header>
}

export function Footer({ locale }: { locale: Locale }) {
  const t = labels[locale]
  return <footer className="site-footer"><div className="wrap footer-inner">
    <Link href={href(locale)} className="wordmark"><span className="monogram" aria-hidden="true">YF</span>{t.name}</Link>
    <span>{t.footer}</span><Link href={href(locale, '/contact')}>{t.contact} <Arrow diagonal /></Link>
  </div></footer>
}

export function Site({ locale, path = '', children }: { locale: Locale; path?: string; children: ReactNode }) {
  return <>
    <a className="skip-link" href="#content">{labels[locale].skip}</a>
    <Header locale={locale} path={path} />
    <main id="content" tabIndex={-1}>{children}</main>
    <Footer locale={locale} />
  </>
}

export function ProjectGrid({ locale, standalone = false }: { locale: Locale; standalone?: boolean }) {
  const t = labels[locale]
  const Heading = standalone ? 'h2' : 'h3'
  return <div className="project-grid">
    {projects.map((project, i) => <article className={i === 0 ? 'project-card project-lead' : 'project-card'} key={project.slug}>
      <MediaFrame media={project.media} locale={locale} />
      <div className="project-copy">
        <p className="eyebrow">{project.category[locale]}</p>
        <Heading className="project-title"><Link href={href(locale, `/projects/${project.slug}`)}>{project.title[locale]}<Arrow diagonal /></Link></Heading>
        <p>{project.summary[locale]}</p>
        {project.status === 'pending' && <p className="project-status">{t.pending}</p>}
      </div>
    </article>)}
  </div>
}

export function Capabilities({ locale }: { locale: Locale }) {
  const he = locale === 'he'
  const capabilities = he ? [
    ['בינה מלאכותית וראייה ממוחשבת', 'מעקב אחר מצולמים, מסגור וידאו ותיאום עבודה בין סוכני בינה מלאכותית.'],
    ['פיתוח מוצרים מקצה לקצה', 'ממשקי משתמש, מערכות לקביעת תורים וכלי ניהול לעסקים.'],
    ['נתונים ואוטומציה', 'ניתוח נתונים, הערכת מודלים ותהליכים לעיבוד נתונים.'],
  ] : [
    ['AI & computer vision', 'Subject tracking, video framing, and workflows that coordinate AI agents.'],
    ['Full-stack products', 'User interfaces, appointment booking, and tools for managing bookings.'],
    ['Data & automation', 'Data analysis, model evaluation, and data pipelines.'],
  ]
  return <section className="capabilities" aria-label={labels[locale].capabilities}>
    <h2>{labels[locale].capabilities}</h2>
    <div className="capability-grid">
      {capabilities.map(([title, text], i) => <article key={title}><div aria-hidden="true" className={`cap-icon cap-icon-${i}`}><i /><i /><i /></div><h3>{title}</h3><p>{text}</p></article>)}
    </div>
  </section>
}

const certificateImage = '/credentials/technion-big-data-analyst.webp'

export function Certificate({ locale }: { locale: Locale }) {
  const t = labels[locale]
  return <section className="credential" id="technion-certificate" aria-labelledby="technion-certificate-title">
    <div className="credential-copy">
      <p className="eyebrow">{t.education}</p>
      <h2 id="technion-certificate-title">{t.certificate}</h2>
      {locale === 'he' && <p lang="en"><bdi>Technion Certified Big Data Analyst</bdi></p>}
      <p>{t.certIssuer}</p>
      <p className="credential-detail">{t.certTraining} <span aria-hidden="true">·</span> <time dateTime="2026-01-21">{t.certDate}</time></p>
    </div>
    <figure className="credential-view">
      <Image src={certificateImage} width={1272} height={1800} sizes="(max-width: 700px) 260px, 220px" alt={t.certImage} />
      <figcaption><a className="text-link" href={certificateImage}>{t.certView}<Arrow diagonal /></a></figcaption>
    </figure>
  </section>
}

export function ContactBand({ locale }: { locale: Locale }) {
  return <section className="contact-band">
    <div><h2>{labels[locale].contactHeading}</h2>
      <p>{locale === 'he' ? 'יש לכם הצעת עבודה, רעיון לפרויקט או שאלה על העבודות שלי?' : 'Have a job opportunity, a project idea, or a question about my work?'}</p>
    </div>
    <Action to={href(locale, '/contact')}>{labels[locale].contact}</Action>
  </section>
}
