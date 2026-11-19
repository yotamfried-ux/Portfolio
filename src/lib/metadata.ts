import type { Metadata } from 'next'
import { href, labels, type Locale } from './locale'

export const siteUrl = new URL(process.env.SITE_URL || 'https://portfolio.d2ryf.com')
export const homeDescription = {
  en: 'Selected work by Yotam Friedman in applied AI, product engineering, and data.',
  he: 'עבודות נבחרות של יותם פרידמן בבינה מלאכותית יישומית, הנדסת מוצר ונתונים.',
}

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const canonical = href(locale, path)
  const image = locale === 'he' ? '/media/social-he.jpg' : '/media/social-en.jpg'
  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: { canonical, languages: { en: href('en', path), he: href('he', path), 'x-default': href('en', path) } },
    openGraph: {
      type: 'website', siteName: labels[locale].name, title, description, url: canonical,
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: labels[locale].name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}
