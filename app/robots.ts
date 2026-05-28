// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Não indexar as API routes
    },
    sitemap: 'https://lifeprod.vercel.app/sitemap.xml',
  };
}