import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return { rules: { userAgent: '*', allow: '/' }, sitemap: new URL('/sitemap.xml', siteUrl).href }
}
