import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lab } from '@/components/lab'
import { MediaFrame } from '@/components/media'
import { Arrow, Site } from '@/components/site'
import { href, isLocale, labels } from '@/lib/locale'
import { pageMetadata } from '@/lib/metadata'
import { projectBySlug, projects } from '@/lib/projects'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const project = projectBySlug(slug)
  if (!isLocale(locale) || !project) notFound()
  return pageMetadata(locale, `/projects/${slug}`, `${project.title[locale]} | ${labels[locale].name}`, project.summary[locale])
}

export default async function CaseStudy({ params }: Props) {
  const { locale, slug } = await params
  const project = projectBySlug(slug)
  if (!isLocale(locale) || !project) notFound()
  const t = labels[locale]
  const next = projects[projects.indexOf(project) + 1]
  return <Site locale={locale} path={`/projects/${slug}`}>
    <article className="wrap case-study">
      <div className="page-intro">
        <Link href={href(locale, '/projects')} className="text-link back-link"><Arrow />{t.back}</Link>
        <p className="eyebrow case-category">{project.category[locale]}</p>
        <h1>{project.title[locale]}</h1>
        <p>{project.summary[locale]}</p>
        <p className="project-status">{t[project.status]}</p>
      </div>
      <MediaFrame media={project.media} locale={locale} mode="demo" />
      <div className="case-details">
        <section><h2>{t.problem}</h2><p>{project.problem[locale]}</p></section>
        <section><h2>{t.role}</h2><p>{project.role[locale]}</p></section>
        <section><h2>{t.solution}</h2><p>{project.solution[locale]}</p></section>
        <section><h2>{t.challenges}</h2><p>{project.challenges[locale]}</p></section>
      </div>
      <section className="case-lab"><h2>{t.lab}</h2><Lab project={{ slug: project.slug, steps: project.steps }} locale={locale} /></section>
      <section className="architecture">
        <div className="section-head"><h2>{t.architecture}</h2><p className="project-status">{t.illustrativeOverview}</p></div>
        <ol>{project.steps.map(step => <li key={step.title.en}><h3>{step.title[locale]}</h3><p>{step.detail[locale]}</p></li>)}</ol>
      </section>
      <div className="case-details">
        <section><h2>{project.status === 'verified' ? t.outcome : t.verification}</h2><p>{project.outcome[locale]}</p>
          {project.stack.length > 0 && <><h3 className="eyebrow stack-title">{t.stack}</h3><ul className="stack">{project.stack.map(item => <li key={item} lang="en" dir="ltr">{item}</li>)}</ul></>}
        </section>
        <section><h2>{t.next}</h2><p>{project.next[locale]}</p></section>
      </div>
      <Link className="next-project" href={href(locale, next ? `/projects/${next.slug}` : '/projects')}>
        <span>{next ? <><span className="eyebrow">{t.nextProject}</span>{next.title[locale]}</> : t.allWork}</span><Arrow diagonal />
      </Link>
    </article>
  </Site>
}
