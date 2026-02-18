// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kernelcook.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Generally keep crawlers out of user-specific or API routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}