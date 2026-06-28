import type { MetadataRoute } from 'next';

// Static sitemap, emitted to /sitemap.xml by `next build` (output: 'export').
// Only public, indexable marketing/legal pages are listed. The app-like flows
// (/app, /onboarding, /disputa, /fases) and their .html bundles are intentionally
// excluded — they are noindexed and disallowed in robots.txt.
const SITE_URL = 'https://dalivim.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/termos/`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacidade/`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
