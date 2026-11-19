import type { NextConfig } from 'next'

const config: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: '/', destination: '/en' },
      { source: '/projects', destination: '/en/projects' },
      { source: '/projects/:slug', destination: '/en/projects/:slug' },
      { source: '/about', destination: '/en/about' },
      { source: '/contact', destination: '/en/contact' },
    ]
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        ...((process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development')
          ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
      ],
    }]
  },
}
export default config
