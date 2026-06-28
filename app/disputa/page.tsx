import type { Metadata } from 'next';
import Frame from '../Frame';

// Private dispute (mediation) flow — not a public SEO page.
export const metadata: Metadata = {
  title: 'Disputa',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Frame src="/Disputa.html" title="Dalivim — Disputa" />;
}
