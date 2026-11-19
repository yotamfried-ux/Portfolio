import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Action, Arrow, Capabilities, Certificate, ContactBand, ProjectGrid, Site } from '@/components/site'
import { MediaFrame } from '@/components/media'
import { isLocale, href, labels } from '@/lib/locale'
import { heroMedia } from '@/lib/media'
import { pageMetadata, homeDescription } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata(locale, '', locale === 'he' ? 'יותם פרידמן | בינה מלאכותית יישומית ופיתוח תוכנה' : 'Yotam Friedman | Applied AI & Product Engineering', homeDescription[locale])
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const he = locale === 'he'
  const t = labels[locale]
  return <Site locale={locale}>
    <section className="hero">
      <MediaFrame media={heroMedia} locale={locale} hero />
      <div className="wrap hero-inner">
        <p className="eyebrow hero-eyebrow"><i aria-hidden="true" />{he ? 'בינה מלאכותית יישומית והנדסת מוצר' : 'Applied AI & product engineering'}</p>
        <h1>{he ? <>תוכנה לעולם <br /><em>בתנועה.</em></> : <>Software for a <br /><em>world in motion.</em></>}</h1>
        <p className="hero-summary">{he
          ? 'אני יותם פרידמן. אני מפתח מוצרי תוכנה בתחומי הראייה הממוחשבת, מערכות הווב והנדסת הנתונים.'
          : 'I’m Yotam Friedman. I build computer vision tools, full-stack applications, and data pipelines.'}</p>
        <div className="actions"><Action to={href(locale, '/projects')}>{he ? 'לכל הפרויקטים' : 'Explore projects'}</Action>
          <Action to={href(locale, '/contact')} secondary>{t.contact}</Action></div>
      </div>
    </section>
    <div className="wrap">
      <section className="work-section">
        <div className="section-head"><h2>{t.selected}</h2><Link href={href(locale, '/projects')} className="text-link">{t.allWork}<Arrow diagonal /></Link></div>
        <ProjectGrid locale={locale} />
      </section>
      <Capabilities locale={locale} />
      <section className="about-short">
        <h2>{t.aboutHeading}</h2>
        <div><p>{he ? 'אני מפתח כלים שמקלים על עבודה מורכבת, כמו עריכת צילומי רחפן.' : 'I build tools that make complex work, such as editing drone footage, easier to manage.'}</p>
          <Link className="text-link" href={href(locale, '/about')}>{he ? 'עוד עליי' : 'More about me'}<Arrow diagonal /></Link></div>
      </section>
      <Certificate locale={locale} />
      <ContactBand locale={locale} />
    </div>
  </Site>
}
