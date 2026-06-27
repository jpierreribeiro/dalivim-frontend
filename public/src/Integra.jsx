// Integra — "FOCO NO FUTURO"-pattern feature section, in Dalivim's identity.
// Two-tone eyebrow + sparkle, two-line headline left, offset CTA right, and a
// large ink card with a central node fanning curved connectors out to the six
// guarantees that keep money safe. (The reference's blue gradient card becomes
// an ink surface — Dalivim alternates light/dark, never decorative gradient.)

function Integra() {
  // 6 protection guarantees — distinct from the use-case sections.
  const left = [
  { icon: 'lock', label: 'Conta segregada', sub: 'fora da operação' },
  { icon: 'check-circle', label: 'Liberação condicionada', sub: 'só com confirmação' },
  { icon: 'scale', label: 'Disputa garantida', sub: 'aprovar · contestar' }];

  const right = [
  { icon: 'refresh', label: 'Reembolso garantido', sub: 'se algo der errado' },
  { icon: 'pix', label: 'Pix instantâneo', sub: 'entra na hora' },
  { icon: 'users', label: 'Confirmação dupla', sub: 'os dois lados aprovam' }];

  // center-Y (%) for the three rows in the desktop diagram
  const ys = [16.5, 50, 83.5];

  const Pill = ({ icon, label, sub, side }) =>
  <span className="dv-mm-pill" style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 16px 10px 10px', borderRadius: 9999,
    border: '1px solid #ECECEF',
    flexDirection: side === 'right' ? 'row' : 'row',
    transition: 'border-color 200ms, background 200ms', background: "#fff",
    boxShadow: '0 1px 2px rgba(10,10,10,0.04)'
  }}>
      <span style={{
      width: 46, height: 46, flexShrink: 0, borderRadius: 13,
      background: '#F4F4F5', border: '1px solid #ECECEF',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
    }}><Icon name={icon} size={30} /></span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, whiteSpace: 'nowrap', color: "#71717A" }}>{sub}</span>
      </span>
    </span>;


  const CenterNode = () =>
  <span style={{
    width: 'clamp(96px, 13vw, 132px)', height: 'clamp(96px, 13vw, 132px)',
    borderRadius: 30, flexShrink: 0,
    background: '#0E0E10', border: '1px solid #2A2A2E',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', position: 'relative',
    boxShadow: '0 0 0 8px rgba(30,75,160,0.06), 0 24px 60px -20px rgba(30,75,160,0.5)'
  }}>
      {/* focal glow — the protected center */}
      <span aria-hidden style={{
      position: 'absolute', inset: -2, borderRadius: 32, pointerEvents: 'none',
      background: 'radial-gradient(closest-side, rgba(30,75,160,0.35), transparent 75%)'
    }} />
      <span style={{ position: 'relative', color: '#fff', width: '52%', height: '52%' }}>
        <DalivimMark />
      </span>
    </span>;


  return (
    <section style={{ padding: '140px 0', background: '#fff' }}>
      <Container>
        {/* Header row: eyebrow + two-line headline (left) · CTA (right) */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 28, flexWrap: 'wrap', marginBottom: 48
        }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18,
              flexWrap: 'nowrap', whiteSpace: 'nowrap'
            }}>
              <span style={{ color: '#A1A1AA' }}>Como protegemos</span>
              <span style={{ color: '#1E4BA0' }}>seu dinheiro</span>
              <span style={{ color: '#1E4BA0', fontWeight: 600 }}>+</span>
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 'clamp(30px, 4vw, 52px)', letterSpacing: '-0.026em',
              lineHeight: 1.04, margin: 0, color: '#0A0A0A', textWrap: 'balance'
            }}>
              Uma rede de garantias.<br />
              <span style={{ color: '#A1A1AA' }}>O dinheiro no centro de tudo.</span>
            </h2>
          </div>

          <a href="#simular" className="dv-mm-cta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0,
            fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 15,
            background: '#1E4BA0', color: '#fff',
            padding: '15px 24px', borderRadius: 9999, textDecoration: 'none',
            transition: 'background 200ms'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#153A82'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1E4BA0'}>
            Criar negociação protegida</a>
        </div>

        {/* Ink card */}
        <div style={{
          borderRadius: 'clamp(20px, 3vw, 36px)',
          padding: 'clamp(28px, 4vw, 56px)', overflow: 'hidden', position: 'relative', background: "#fff",
          border: '1px solid #ECECEF',
          boxShadow: '0 1px 2px rgba(10,10,10,0.04), 0 40px 90px -50px rgba(30,75,160,0.25)'
        }}>
          {/* ── Desktop: mind-map ── */}
          <div className="dv-mindmap-desktop" style={{
            position: 'relative', width: '100%', maxWidth: 1040, margin: '0 auto',
            aspectRatio: '1100 / 500'
          }}>
            {/* connectors */}
            <svg viewBox="0 0 1100 500" preserveAspectRatio="none" aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="mmStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#E4E4E7" />
                  <stop offset="0.5" stopColor="#9DBDF0" />
                  <stop offset="1" stopColor="#E4E4E7" />
                </linearGradient>
              </defs>
              {/* left connectors: card inner edge (313) → node left edge (486) */}
              <path d="M313 82.5  C 404 82.5  432 232 486 242" fill="none" stroke="#94B0DC" strokeWidth="2" />
              <path d="M313 250   C 396 250  430 250 486 250" fill="none" stroke="#94B0DC" strokeWidth="2" />
              <path d="M313 417.5 C 404 417.5 432 268 486 258" fill="none" stroke="#94B0DC" strokeWidth="2" />
              {/* right connectors: card inner edge (787) → node right edge (614) */}
              <path d="M787 82.5  C 696 82.5  668 232 614 242" fill="none" stroke="#94B0DC" strokeWidth="2" />
              <path d="M787 250   C 704 250  670 250 614 250" fill="none" stroke="#94B0DC" strokeWidth="2" />
              <path d="M787 417.5 C 696 417.5 668 268 614 258" fill="none" stroke="#94B0DC" strokeWidth="2" />
            </svg>

            {/* center node */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <CenterNode />
            </div>

            {/* left pills */}
            {left.map((p, i) =>
            <div key={p.label} style={{ position: 'absolute', left: '1.5%', top: ys[i] + '%', transform: 'translateY(-50%)', width: '27%' }}>
                <Pill {...p} side="left" />
              </div>
            )}
            {/* right pills */}
            {right.map((p, i) =>
            <div key={p.label} style={{ position: 'absolute', right: '1.5%', top: ys[i] + '%', transform: 'translateY(-50%)', width: '27%' }}>
                <Pill {...p} side="right" />
              </div>
            )}
          </div>

          {/* ── Mobile: center node + 2-col pill grid ── */}
          <div className="dv-mindmap-mobile" style={{ display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <CenterNode />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              {[...left, ...right].map((p) =>
              <Pill key={p.label} {...p} side="left" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>);

}

// Inline Dalivim network mark (currentColor)
function DalivimMark() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden style={{ display: 'block' }}>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 8 L54 20 L54 44 L32 56 L10 44 L10 20 Z" />
        <path d="M32 8 L32 32 M54 20 L32 32 M54 44 L32 32 M32 56 L32 32 M10 44 L32 32 M10 20 L32 32" />
      </g>
      <g fill="currentColor">
        <circle cx="32" cy="8" r="4" /><circle cx="54" cy="20" r="4" /><circle cx="54" cy="44" r="4" />
        <circle cx="32" cy="56" r="4" /><circle cx="10" cy="44" r="4" /><circle cx="10" cy="20" r="4" />
        <circle cx="32" cy="32" r="5.5" fill="#5B8DE8" />
      </g>
    </svg>);

}

Object.assign(window, { Integra });