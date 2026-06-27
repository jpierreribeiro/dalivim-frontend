// Dalivim app — shared UI primitives.
// Ink dominates, blue is interaction only, hairline borders, no decorative
// shadows. Big type, generous space.

// ── Money amount (Space Grotesk, tabular) ────────────────────────────
function Money({ value, size = 34, cents = true, color = '#0A0A0A', weight = 500 }) {
  return (
    <span style={{
      fontFamily: "'Space Grotesk', sans-serif", fontWeight: weight,
      fontSize: size, letterSpacing: '-0.02em', lineHeight: 1,
      fontVariantNumeric: 'tabular-nums', color, whiteSpace: 'nowrap',
    }}>{brl(value, { cents })}</span>
  );
}

// ── Primary / secondary buttons (pills) ──────────────────────────────
function PrimaryButton({ children, onClick, disabled, full, tone = 'action', size = 'lg', style = {} }) {
  const soft = tone === 'soft' && !disabled;
  const bg = disabled ? '#C4C4C9'
    : tone === 'ink' ? '#0A0A0A'
    : tone === 'danger' ? '#B42318'
    : soft ? '#FFFFFF'
    : '#1E4BA0';
  const fg = soft ? '#15356E' : '#fff';
  const border = soft ? '2px solid #1E4BA0' : '2px solid transparent';
  const pressBg = '#EFF4FB';
  const hover = disabled ? bg
    : tone === 'ink' ? '#1f1f24'
    : tone === 'danger' ? '#9a1d12'
    : soft ? '#F7FAFE'
    : '#153A82';
  const pad = size === 'lg' ? '16px 26px' : '12px 20px';
  const fs = size === 'lg' ? 16 : 14;
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = hover; }}
      onMouseLeave={e => { e.currentTarget.style.background = bg; }}
      onMouseDown={e => { if (soft) e.currentTarget.style.background = pressBg; }}
      onMouseUp={e => { if (soft) e.currentTarget.style.background = hover; }}
      style={{
        all: 'unset', boxSizing: 'border-box',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        width: full ? '100%' : 'auto', minHeight: size === 'lg' ? 54 : 44,
        padding: pad, borderRadius: 9999,
        background: bg, color: fg, border,
        boxShadow: soft ? '0 1px 2px rgba(10,10,10,0.05), 0 10px 24px -14px rgba(30,75,160,0.30)' : 'none',
        fontFamily: "'Inter', sans-serif", fontSize: fs, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 160ms cubic-bezier(0.2,0.6,0.2,1)',
        ...style,
      }}>{children}</button>
  );
}

function GhostButton({ children, onClick, full, style = {} }) {
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.background = '#F4F4F5'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      style={{
        all: 'unset', boxSizing: 'border-box',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : 'auto', minHeight: 48, padding: '12px 20px',
        borderRadius: 9999, background: 'transparent', color: '#52525B',
        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
        cursor: 'pointer', transition: 'background 140ms', ...style,
      }}>{children}</button>
  );
}

// Quiet text link for secondary actions ("Abrir disputa")
function QuietLink({ children, onClick, color = '#71717A' }) {
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
      onMouseLeave={e => e.currentTarget.style.color = color}
      style={{
        all: 'unset', cursor: 'pointer', color,
        fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
        transition: 'color 140ms', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>{children}</button>
  );
}

// ── Card surface ─────────────────────────────────────────────────────
function Card({ children, style = {}, pad = 24, onClick, hover }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: '#fff', borderRadius: 18,
        border: '1px solid ' + (h ? '#D4D4D8' : '#E7E7EA'),
        padding: pad, cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 160ms', ...style,
      }}>{children}</div>
  );
}

// ── Status pill ──────────────────────────────────────────────────────
function StatusPill({ status, size = 'md' }) {
  const meta = STATUS[status];
  const t = TONES[meta.tone];
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: sm ? '4px 10px' : '6px 12px', borderRadius: 9999,
      background: t.bg, color: t.fg,
      fontFamily: "'Inter', sans-serif", fontSize: sm ? 12 : 13, fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 9999, background: t.dot, flexShrink: 0 }}/>
      {meta.label}
    </span>
  );
}

// ── Eyebrow (classification stamp) ───────────────────────────────────
function Eyebrow({ children, color = '#A1A1AA', style = {} }) {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
      letterSpacing: '0.13em', textTransform: 'uppercase', color, ...style,
    }}>{children}</div>
  );
}

// ── Tipo glyph (chip) ────────────────────────────────────────────────
function TipoGlyph({ tipo, size = 44 }) {
  const m = TIPO_META[tipo] || TIPO_META.outro;
  return (
    <span style={{
      width: size, height: size, borderRadius: 13, flexShrink: 0,
      background: '#F4F4F5', color: '#52525B',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={m.icon} size={Math.round(size * 0.42)} strokeWidth={1.8}/>
    </span>
  );
}

// ── "Sua próxima ação" assistant banner ──────────────────────────────
// The line that lets anyone understand a screen in 5 seconds.
function NextActionBanner({ action, compact }) {
  const waiting = action.kind === 'wait';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 13,
      padding: compact ? '14px 16px' : '18px 20px',
      borderRadius: 14,
      background: waiting ? '#FAFAFA' : '#EFF4FB',
      border: waiting ? '1px solid #ECECEE' : '2px solid #1E4BA0',
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 9999, flexShrink: 0, marginTop: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: waiting ? '#F0F0F1' : '#fff',
        color: waiting ? '#A1A1AA' : '#1E4BA0',
      }}>
        <Icon name={waiting ? 'clock' : 'arrow-right'} size={15} strokeWidth={2}/>
      </span>
      <div style={{ minWidth: 0 }}>
        <Eyebrow color={waiting ? '#A1A1AA' : '#5277B8'} style={{ marginBottom: 3 }}>
          {waiting ? 'Sem ação no momento' : 'Sua próxima ação'}
        </Eyebrow>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: 500, lineHeight: 1.4,
          color: waiting ? '#52525B' : '#15356E',
        }}>{action.line}</div>
      </div>
    </div>
  );
}

// ── Mobile bottom action bar (thumb zone) ───────────────────────────
// One-handed use: the primary action lives in the lower-center comfort zone,
// not the top corner. Fixed to the bottom on phones, hidden on desktop (where
// the cursor reaches everywhere). Targets are ≥54px tall, well spaced.
function MobileBar({ children }) {
  return (
    <div className="dv-mobile-bar" style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 45,
      display: 'none', flexDirection: 'column', gap: 9,
      padding: '12px 18px calc(14px + env(safe-area-inset-bottom))',
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid #EDEDEF',
    }}>{children}</div>
  );
}

Object.assign(window, {
  Money, PrimaryButton, GhostButton, QuietLink, Card,
  StatusPill, Eyebrow, TipoGlyph, NextActionBanner, MobileBar,
});
