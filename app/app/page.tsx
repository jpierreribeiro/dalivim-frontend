import type { Metadata } from 'next';
import Frame from '../Frame';

// Private app surface — not a public SEO page.
export const metadata: Metadata = {
  title: 'App',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Frame src="/App.html" title="Dalivim — App" />;
}
