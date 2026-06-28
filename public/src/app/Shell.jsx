// Shell — shared top bar + persona switch, used by the full app (Root.jsx)
// and by the standalone Disputa / Fases pages. Exported to window so each
// page script can mount it.

function TopBar({ persona, setPersona, onHome, homeHref, onSettings, initial }) {
  const Logo = (
    <span style={{
      width: 28, height: 28, borderRadius: 8, background: '#0A0A0A', color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox="0 0 64 64" width="17" height="17" aria-hidden="true" style={{ display: 'block' }}>
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 8 L54 20 L54 44 L32 56 L10 44 L10 20 Z"></path>
          <path d="M32 8 L32 32 M54 20 L32 32 M54 44 L32 32 M32 56 L32 32 M10 44 L32 32 M10 20 L32 32"></path>
        </g>
        <g fill="currentColor">
          <circle cx="32" cy="8" r="5"></circle>
          <circle cx="54" cy="20" r="5"></circle>
          <circle cx="54" cy="44" r="5"></circle>
          <circle cx="32" cy="56" r="5"></circle>
          <circle cx="10" cy="44" r="5"></circle>
          <circle cx="10" cy="20" r="5"></circle>
          <circle cx="32" cy="32" r="6" fill="#5B8DE8"></circle>
        </g>
      </svg>
    </span>
  );
  const brand = <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em', color: '#0A0A0A' }}>Dalivim</span>;
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(250,250,250,0.82)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid #EDEDEF',
    }}>
      <div style={{
        maxWidth: 720, margin: '0 auto', padding: '14px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        {homeHref
          ? <a href={homeHref} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>{Logo}{brand}</a>
          : <button type="button" onClick={onHome} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>{Logo}{brand}</button>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PersonaSwitch persona={persona} setPersona={setPersona}/>
          <button type="button" onClick={onSettings} aria-label="Configurações" title="Configurações"
            disabled={!onSettings}
            style={{
              all: 'unset', cursor: onSettings ? 'pointer' : 'default',
              width: 32, height: 32, borderRadius: 9999, background: '#1E4BA0', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500,
            }}>{initial || 'D'}</button>
        </div>
      </div>
    </header>
  );
}

function PersonaSwitch({ persona, setPersona }) {
  const opts = [{ k: 'comprador', l: 'Cliente' }, { k: 'vendedor', l: 'Prestador' }];
  return (
    <div className="dv-persona" style={{ display: 'inline-flex', background: '#F0F0F1', borderRadius: 9999, padding: 3 }}>
      {opts.map(o => {
        const on = persona === o.k;
        return (
          <button key={o.k} type="button" onClick={() => setPersona(o.k)} style={{
            all: 'unset', cursor: 'pointer', padding: '6px 14px', borderRadius: 9999,
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            color: on ? '#0A0A0A' : '#71717A', background: on ? '#fff' : 'transparent',
            boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none', transition: 'all 160ms',
          }}>{o.l}</button>
        );
      })}
    </div>
  );
}

// Small "Abrir no app" affordance for the standalone pages.
function OpenInApp({ href }) {
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22,
      fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: '#71717A',
      textDecoration: 'none', transition: 'color 140ms',
    }}
    onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
    onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>
      <Icon name="arrow-left" size={16}/> Voltar ao app
    </a>
  );
}

Object.assign(window, { TopBar, PersonaSwitch, OpenInApp });
