import { MetadataRoute } from 'next'

const SITE_URL = 'https://nimila.online'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
