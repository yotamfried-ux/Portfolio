import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/lib/locale'
import '@fontsource-variable/manrope'
import '@fontsource-variable/heebo'
import '../globals.css'

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}><body>{children}</body></html>
}
