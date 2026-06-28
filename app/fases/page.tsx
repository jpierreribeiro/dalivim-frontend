import type { Metadata } from 'next';
import Frame from '../Frame';

// Private milestone (phased payment) flow — not a public SEO page.
export const metadata: Metadata = {
  title: 'Fases',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Frame src="/Fases.html" title="Dalivim — Fases" />;
}
