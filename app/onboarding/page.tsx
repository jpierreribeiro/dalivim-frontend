import type { Metadata } from 'next';
import Frame from '../Frame';

// Private onboarding/login flow — not a public SEO page.
export const metadata: Metadata = {
  title: 'Onboarding',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Frame src="/Onboarding.html" title="Dalivim — Onboarding" />;
}
