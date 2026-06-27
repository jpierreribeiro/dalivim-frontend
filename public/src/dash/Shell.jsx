// Dashboard shell — sidebar + main frame

const { useState, useEffect, useRef, useMemo } = React;

function DSidebar({ route, setRoute }) {
  const sections = [
    { id: 'overview', label: 'Visão geral', icon: 'layout' },
    { id: 'tx',       label: 'Transações',  icon: 'list' },
    { id: 'nova',     label: 'Nova transação', icon: 'plus', primary: true },
    { id: 'disputas', label: 'Disputas',    icon: 'shield-check', badge: 1 },
    { id: 'extrato',  label: 'Extrato',     icon: 'banknote' },
    { id: 'partes',   label: 'Contrapartes',icon: 'users' },
  ];
  const footer = [
    { id: 'settings', label: 'Configurações', icon: 'settings' },
    { id: 'help',     label: 'Ajuda',        icon: 'help' },
  ];

  return (
    <aside className="dv-sidebar dv-sb" style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
      background: '#fff', borderRight: '1px solid #E4E4E7',
      padding: '20px 14px 16px', display: 'flex', flexDirection: 'column',
      overflowY: 'auto', zIndex: 10,
    }}>
      {/* Brand */}
      <a href="Landing.html" style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 24px',
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8, background: '#0A0A0A',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 13,
        }}>D</span>
        <span className="dv-sb-brand-text" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>Dalivim</span>
      </a>

      {/* Sections */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sections.map(s => (
          <SbItem key={s.id} item={s} active={route === s.id} onClick={() => setRoute(s.id)}/>
        ))}
      </nav>

      <div style={{ flex: 1 }}/>

      {/* Footer nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 16 }}>
        {footer.map(s => (
          <SbItem key={s.id} item={s} active={route === s.id} onClick={() => setRoute(s.id)} compact/>
        ))}
      </nav>

      {/* User */}
      <div className="dv-sb-footer" style={{
        marginTop: 12, padding: '10px 8px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderTop: '1px solid #F4F4F5', paddingTop: 14,
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 9999, background: '#1E4BA0',
          color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500,
        }}>J</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#0A0A0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Jean Pereira</div>
          <div style={{ fontSize: 11.5, color: '#71717A' }}>Verificado · KYC</div>
        </div>
      </div>
    </aside>
  );
}

function SbItem({ item, active, onClick, compact }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="dv-sb-item"
      style={{
        all: 'unset',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 12px',
        borderRadius: 10,
        cursor: 'pointer',
        background: item.primary ? (active ? '#0A0A0A' : '#0A0A0A')
                  : active ? '#F4F4F5' : hover ? '#FAFAFA' : 'transparent',
        color: item.primary ? '#fff' : active ? '#0A0A0A' : '#52525B',
        transition: 'background 140ms, color 140ms',
        fontSize: 13.5, fontWeight: item.primary ? 500 : active ? 500 : 400,
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
      }}
    >
      <Icon name={item.icon} size={16} strokeWidth={active ? 2 : 1.6}/>
      <span className="dv-sb-label" style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span className="dv-sb-label" style={{
          background: '#C0450F', color: '#fff', fontSize: 10, fontWeight: 600,
          padding: '2px 7px', borderRadius: 9999,
        }}>{item.badge}</span>
      )}
    </button>
  );
}

function DTopbar({ title, subtitle, actions }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '28px 40px 20px',
      borderBottom: '1px solid #EDEDEF',
      background: '#FAFAFA',
      position: 'sticky', top: 0, zIndex: 5,
      gap: 20, flexWrap: 'wrap',
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 26, letterSpacing: '-0.018em', lineHeight: 1.15,
          margin: 0, color: '#0A0A0A',
        }}>{title}</h1>
        {subtitle && <p style={{
          fontSize: 13.5, color: '#71717A', margin: '4px 0 0', fontFamily: "'Inter', sans-serif",
        }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>
    </header>
  );
}

function DMain({ children }) {
  return (
    <main className="dv-main" style={{
      paddingLeft: 260, minHeight: '100vh',
      transition: 'padding 240ms cubic-bezier(0.2,0.6,0.2,1)',
    }}>
      {children}
    </main>
  );
}

// Shared UI primitives for dashboard
function DBadge({ state }) {
  const map = {
    'rascunho':        { bg: '#F4F4F5', fg: '#52525B', dot: '#A1A1AA', label: 'Rascunho' },
    'aguardando':      { bg: '#FEF6E7', fg: '#A15F00', dot: '#D97706', label: 'Aguardando pagamento' },
    'custodia':        { bg: '#EEF3FB', fg: '#1E4BA0', dot: '#1E4BA0', label: 'Em custódia' },
    'aguardando-entrega':{ bg: '#EEF3FB', fg: '#1E4BA0', dot: '#1E4BA0', label: 'Aguardando entrega' },
    'confirmada':      { bg: '#E8F2EC', fg: '#16794C', dot: '#16794C', label: 'Entrega confirmada' },
    'liberada':        { bg: '#E8F2EC', fg: '#16794C', dot: '#16794C', label: 'Liberada' },
    'disputa':         { bg: '#FDEDE7', fg: '#C0450F', dot: '#C0450F', label: 'Em disputa' },
    'cancelada':       { bg: '#F4F4F5', fg: '#71717A', dot: '#A1A1AA', label: 'Cancelada' },
  };
  const s = map[state] || map['rascunho'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 9999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: s.dot }}/>
      {s.label}
    </span>
  );
}

function DCard({ children, style, pad = 24 }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E4E7', borderRadius: 16,
      padding: pad, ...style,
    }}>{children}</div>
  );
}

function formatBRL(n) {
  return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

Object.assign(window, { DSidebar, DTopbar, DMain, DBadge, DCard, formatBRL });
