export const metadata = {
  title: 'Dalivim — Pix protegido por escrow',
  description: 'Negocie sem precisar confiar. O dinheiro fica protegido na Dalivim e só é liberado quando o combinado é cumprido.',
  icons: { icon: '/assets/dalivim-mark.svg' },
  // Google Search Console — domain ownership (renders
  // <meta name="google-site-verification" content="…"> on every route's <head>).
  verification: { google: 'Ub2Gi4hLk8L0j9IBonP6k6RLaQx0AHMNEHF6zErEX2o' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
