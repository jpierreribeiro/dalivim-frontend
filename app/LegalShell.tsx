// Shared chrome for the public legal pages (privacy policy, terms). Plain
// server component — static content, no client JS. Used to satisfy Google's
// OAuth consent screen (homepage / privacy / terms URLs) and linked from the
// footer and the signup screen.
import type { ReactNode } from 'react';

export default function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main style={{ minHeight: '100dvh', background: '#FAFAFA', color: '#0A0A0A', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ borderBottom: '1px solid #ECECEF', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#0A0A0A', fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 500, fontSize: 18, letterSpacing: '-0.01em' }}>Dalivim</a>
          <a href="/" style={{ textDecoration: 'none', color: '#71717A', fontSize: 14 }}>← Início</a>
        </div>
      </header>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(28px, 5vw, 56px) 22px 80px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(28px, 5vw, 40px)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>{title}</h1>
        <p style={{ color: '#A1A1AA', fontSize: 14, margin: '0 0 8px' }}>Última atualização: {updated}</p>
        <div style={{ fontSize: 15.5, lineHeight: 1.7, color: '#27272A' }}>{children}</div>
      </article>

      <footer style={{ borderTop: '1px solid #ECECEF' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '22px', display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13.5, color: '#8A8A92' }}>
          <a href="/privacidade" style={{ color: '#8A8A92', textDecoration: 'none' }}>Privacidade</a>
          <a href="/termos" style={{ color: '#8A8A92', textDecoration: 'none' }}>Termos</a>
          <a href="mailto:contato@dalivim.com.br" style={{ color: '#8A8A92', textDecoration: 'none' }}>contato@dalivim.com.br</a>
        </div>
      </footer>
    </main>
  );
}

// Shared section heading style helper.
export function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 500, fontSize: 19, letterSpacing: '-0.01em', margin: '30px 0 8px' }}>{children}</h2>;
}
