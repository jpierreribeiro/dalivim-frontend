import type { MetadataRoute } from 'next';

// Static robots.txt, emitted to /robots.txt by `next build` (output: 'export').
// Public marketing/legal pages are crawlable; the private app-like flows and
// their static .html bundles are blocked. /Landing.html is intentionally NOT
// disallowed so crawlers can read its <meta robots="noindex"> + canonical → /.
const SITE_URL = 'https://dalivim.com.br';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app',
          '/app/',
          '/onboarding',
          '/onboarding/',
          '/disputa',
          '/disputa/',
          '/fases',
          '/fases/',
          '/auth/',
          '/App.html',
          '/Onboarding.html',
          '/Disputa.html',
          '/Fases.html',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
