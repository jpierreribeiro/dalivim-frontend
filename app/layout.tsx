import type { Metadata, Viewport } from 'next';
import './globals.css';

// Canonical production origin. Cloudflare Pages serves the static export here;
// every absolute URL (canonical, Open Graph, sitemap) is derived from this.
const SITE_URL = 'https://dalivim.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dalivim — Pix protegido por escrow | Pagamento seguro',
    template: '%s | Dalivim',
  },
  description:
    'Pagamento protegido por escrow via Pix. O dinheiro fica retido em conta segregada e só é liberado quando a entrega é confirmada — proteção para comprador e vendedor.',
  keywords: [
    'pix protegido',
    'pagamento seguro',
    'escrow pix',
    'compra e venda segura',
    'proteção para comprador e vendedor',
    'dinheiro protegido até a entrega',
    'intermediação segura de pagamento',
    'custódia de pagamento',
    'Dalivim',
  ],
  authors: [{ name: 'Dalivim' }],
  creator: 'Dalivim',
  publisher: 'Dalivim',
  applicationName: 'Dalivim',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Dalivim',
    title: 'Dalivim — Pix protegido por escrow | Pagamento seguro',
    description:
      'O dinheiro fica protegido na Dalivim e só é liberado quando o combinado é cumprido. Pix com garantia de entrega para comprador e vendedor.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dalivim — Pix protegido por escrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dalivim — Pix protegido por escrow | Pagamento seguro',
    description:
      'Negocie sem precisar confiar. O dinheiro fica em custódia e só é liberado quando a entrega é confirmada.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/assets/dalivim-mark.svg',
    shortcut: '/assets/dalivim-mark.svg',
    apple: '/assets/dalivim-mark.svg',
  },
  // Google Search Console — domain ownership (renders
  // <meta name="google-site-verification" content="…"> on every route's <head>).
  verification: { google: 'Ub2Gi4hLk8L0j9IBonP6k6RLaQx0AHMNEHF6zErEX2o' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
