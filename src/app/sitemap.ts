import type { MetadataRoute } from 'next'
import { href, locales } from '@/lib/locale'
import { siteUrl } from '@/lib/metadata'
import { projects } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/projects', '/about', '/contact', ...projects.map(({ slug }) => `/projects/${slug}`)]
  return paths.flatMap(path => {
    const en = new URL(href('en', path), siteUrl).href
    const he = new URL(href('he', path), siteUrl).href
    return locales.map(locale => ({
      url: locale === 'he' ? he : en,
      alternates: { languages: { en, he, 'x-default': en } },
    }))
  })
}
