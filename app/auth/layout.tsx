import type { Metadata } from 'next';

// Auth (OAuth callback) routes are private flows — keep them out of search.
export const metadata: Metadata = {
  title: 'Autenticação',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
