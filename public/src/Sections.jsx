// Sections shared by all three variations: HowItWorks, Scenarios, Testimonials, FAQ, Footer
// Simple, institutional, paper on paper.

// ---------- SCENARIO ILLUSTRATIONS ----------
// Spot illustrations drawn in-line — mono line-art on paper, reads like a print textbook.

function IlloFreelancer({ accent = '#0A0A0A' }) {
  // Browser window with a wireframe layout — "building a site for a client"
  return (
    <svg viewBox="0 0 220 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <g stroke="#0A0A0A" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="28" y="30" width="164" height="86" rx="4" fill="#fff" />
        <line x1="28" y1="44" x2="192" y2="44" />
        <circle cx="36" cy="37" r="1.3" fill="#0A0A0A" stroke="none" />
        <circle cx="42" cy="37" r="1.3" fill="#0A0A0A" stroke="none" />
        <circle cx="48" cy="37" r="1.3" fill="#0A0A0A" stroke="none" />
        <rect x="40" y="54" width="62" height="6" rx="1" fill={accent} stroke="none" />
        <rect x="40" y="66" width="96" height="3" rx="1" fill="#D4D4D8" stroke="none" />
        <rect x="40" y="73" width="72" height="3" rx="1" fill="#D4D4D8" stroke="none" />
        <rect x="40" y="88" width="34" height="20" rx="2" />
        <rect x="78" y="88" width="34" height="20" rx="2" />
        <rect x="116" y="88" width="34" height="20" rx="2" />
      </g>
      {/* Cursor arrow */}
      <g transform="translate(162 108)">
        <path d="M0 0 L0 12 L3.2 9 L6 14 L8 13 L5.3 8 L9.5 7 Z" fill="#0A0A0A" />
      </g>
    </svg>);

}

function IlloPessoa({ accent = '#0A0A0A' }) {
  // Two chat bubbles — stranger to stranger, with a question mark
  return (
    <svg viewBox="0 0 220 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <g strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* Outgoing (light) */}
        <path d="M34 38 h108 a10 10 0 0 1 10 10 v14 a10 10 0 0 1 -10 10 h-92 l-10 8 v-8 a10 10 0 0 1 -10 -10 v-14 a10 10 0 0 1 10 -10 z"
        fill="#fff" stroke="#0A0A0A" />
        <rect x="50" y="50" width="74" height="4" rx="1" fill="#D4D4D8" stroke="none" />
        <rect x="50" y="58" width="50" height="4" rx="1" fill="#D4D4D8" stroke="none" />
        {/* Incoming (dark) */}
        <path d="M76 80 h88 a10 10 0 0 1 10 10 v10 a10 10 0 0 1 -10 10 h-78 l-10 8 v-8 h-0 a10 10 0 0 1 -10 -10 v-10 a10 10 0 0 1 10 -10 z"
        fill="#0A0A0A" stroke="#0A0A0A" />
        <rect x="92" y="92" width="60" height="4" rx="1" fill="#fff" stroke="none" />
        <rect x="92" y="100" width="42" height="4" rx="1" fill="#fff" stroke="none" />
      </g>
      {/* Floating ? */}
      <g transform="translate(180 30)">
        <circle cx="0" cy="0" r="12" fill={accent} stroke="none" />
        <text x="0" y="5" fontFamily="Space Grotesk, serif" fontSize="15" fontWeight="600" textAnchor="middle" fill="#fff">?</text>
      </g>
    </svg>);

}

function IlloServicos({ accent = '#0A0A0A' }) {
  // A document + "proposta" stamp — contracting a specialist
  return (
    <svg viewBox="0 0 220 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <g stroke="#0A0A0A" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Document */}
        <path d="M40 18 h78 l18 18 v82 h-96 z" fill="#fff" />
        <path d="M118 18 v18 h18" />
        {/* Lines */}
        <line x1="52" y1="50" x2="110" y2="50" />
        <line x1="52" y1="60" x2="124" y2="60" />
        <line x1="52" y1="70" x2="118" y2="70" />
        {/* Wavy signature */}
        <path d="M52 92 q6 -8 12 0 t12 0 t12 0 t12 0" />
        {/* Small logo mark */}
        <circle cx="120" cy="94" r="4" />
      </g>
      {/* Proposta stamp */}
      <g transform="translate(162 78) rotate(8)">
        <rect x="-34" y="-12" width="68" height="24" fill="none" stroke={accent} strokeWidth="1.2" strokeDasharray="2 2" />
        <text x="0" y="4" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2" textAnchor="middle" fill={accent} fontWeight="600">PROPOSTA</text>
      </g>
    </svg>);

}

function IlloAcordo({ accent = '#0A0A0A' }) {
  // Two parties connected through a check — direct agreement
  return (
    <svg viewBox="0 0 220 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <g strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Left card (you) */}
        <rect x="18" y="48" width="58" height="40" rx="4" stroke="#0A0A0A" fill="#fff" />
        <circle cx="28" cy="60" r="3.5" stroke="#0A0A0A" />
        <line x1="38" y1="60" x2="68" y2="60" stroke="#0A0A0A" />
        <line x1="26" y1="74" x2="60" y2="74" stroke="#D4D4D8" />
        {/* Right card (them) — filled */}
        <rect x="144" y="48" width="58" height="40" rx="4" fill="#0A0A0A" stroke="#0A0A0A" />
        <circle cx="154" cy="60" r="3.5" fill="#fff" stroke="#fff" />
        <line x1="164" y1="60" x2="192" y2="60" stroke="#fff" />
        <line x1="152" y1="74" x2="184" y2="74" stroke="#52525B" />
        {/* Connector with check */}
        <line x1="76" y1="68" x2="96" y2="68" stroke="#0A0A0A" strokeDasharray="3 3" />
        <line x1="124" y1="68" x2="144" y2="68" stroke="#0A0A0A" strokeDasharray="3 3" />
        <circle cx="110" cy="68" r="12" fill="#fff" stroke="#0A0A0A" />
        <path d="M104 68 l4 4 l8 -8" stroke={accent} strokeWidth="1.8" />
      </g>
    </svg>);

}

// ---------- SCENARIOS (replaces HowItWorks) ----------
function HowItWorks() {
  const cards = [
  { n: '01', eyebrow: 'Para freelancers', body: 'Criando um site para um cliente.', Illo: IlloFreelancer, tint: '#F5F4FF', accent: '#1E4BA0' },
  { n: '02', eyebrow: 'Pessoa a pessoa', body: 'Comprando algo de um desconhecido.', Illo: IlloPessoa, tint: '#FFF4EF', accent: '#C0450F' },
  { n: '03', eyebrow: 'Serviços contratados', body: 'Contratando um especialista para um projeto.', Illo: IlloServicos, tint: '#F0F7F3', accent: '#16794C' },
  { n: '04', eyebrow: 'Acordo direto', body: 'Fechando um acordo direto com alguém.', Illo: IlloAcordo, tint: '#F4F4F5', accent: '#27272A' }];

  return (
    <section id="how" style={{
      padding: '140px 0',
      background: '#fff', color: '#0A0A0A'
    }}>
      <Container>
        <div style={{ maxWidth: 760, marginBottom: 56 }}>
          <Eyebrow>Seus cenários</Eyebrow>
          <h2 style={{
            fontFamily: "'Space Grotesk', 'Playfair Display', serif", fontWeight: 400,
            fontSize: 'clamp(36px, 5.2vw, 68px)',
            letterSpacing: '-0.022em', lineHeight: 1.02,
            margin: '18px 0 20px', color: '#0A0A0A',
            textWrap: 'balance'
          }}>
            Reconheça sua situação.<br />
            <span style={{ color: '#A1A1AA' }}>A <span style={{ color: '#1E4BA0' }}>Dalivim</span> cabe aqui.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.6,
            color: '#71717A', margin: 0, maxWidth: 520
          }}>
            Selecione o contexto que descreve o seu próximo acordo. O fluxo de custódia se adapta ao tipo.
          </p>
        </div>

        <div className="dv-scenarios-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16
        }}>
          {cards.map(({ n, eyebrow, body, Illo, tint, accent }) =>
          <button key={n} type="button" className="dv-scenario-card" style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            background: '#fff',
            border: '1px solid #E4E4E7', borderRadius: 16,
            overflow: 'hidden',
            transition: 'all 260ms cubic-bezier(0.2, 0.6, 0.2, 1)',
            '--accent': accent
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = `0 18px 40px -22px ${accent}40, 0 2px 0 ${accent}12`;
            const arrow = e.currentTarget.querySelector('.dv-scenario-arrow');
            if (arrow) {arrow.style.transform = 'translate(2px, -2px)';arrow.style.opacity = '1';}
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E4E4E7';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            const arrow = e.currentTarget.querySelector('.dv-scenario-arrow');
            if (arrow) {arrow.style.transform = 'translate(0,0)';arrow.style.opacity = '0';}
          }}>
              {/* Illustration plate — tinted */}
              <div style={{
              background: tint,
              borderBottom: '1px solid #E4E4E7',
              position: 'relative',
              aspectRatio: '1 / 0.8',
              padding: '18px 20px',
              overflow: 'hidden'
            }}>
                {/* faint grid paper */}
                <div aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                maskImage: 'linear-gradient(180deg, transparent 0%, black 40%, black 100%)',
                WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 40%, black 100%)'
              }} />
                <span style={{
                position: 'absolute', top: 14, left: 18,
                fontFamily: 'ui-monospace, monospace', fontSize: 11,
                letterSpacing: '0.14em', color: accent, fontWeight: 500,
                zIndex: 2
              }}>{n}</span>
                <div style={{
                position: 'absolute', inset: '28px 14px 14px',
                zIndex: 2
              }}>
                  <Illo accent={accent} />
                </div>
              </div>

              {/* Copy */}
              <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: accent
                }}>{eyebrow}</div>
                  <span className="dv-scenario-arrow" style={{
                  display: 'inline-flex', color: accent,
                  opacity: 0, transform: 'translate(0,0)',
                  transition: 'transform 260ms cubic-bezier(0.2,0.6,0.2,1), opacity 180ms'
                }}>
                    <Icon name="arrow-right" size={14} />
                  </span>
                </div>
                <div style={{
                fontFamily: "'Space Grotesk', serif", fontSize: 17,
                lineHeight: 1.35, letterSpacing: '-0.012em',
                color: '#0A0A0A', textWrap: 'pretty'
              }}>{body}</div>
              </div>
            </button>
          )}
        </div>
      </Container>
    </section>);

}

// ---------- Scenario receipt cards (dark mock transaction cards) ----------

// Small status chip on the mock receipt
function TxChip({ label, color = '#7FD1A8' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 9px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 9999,
      fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: '#fff'
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 9999, background: color,
        boxShadow: `0 0 0 3px ${color}22`
      }} />
      {label}
    </span>);

}

// Mock receipt — "Protegido" (freelancer / buyer stuck)
function ReceiptProtegido() {
  return (
    <div style={{
      background: '#0A0A0A', color: '#fff',
      border: '1px solid #1F1F23', borderRadius: 16,
      padding: '18px 20px',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 20px 40px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)'
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: '0.12em', color: '#8A8A92' }}>TX-4193-KM7P</span>
        <TxChip label="Protegido" color="#1E4BA0" />
      </div>

      {/* big amount */}
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 30, letterSpacing: '-0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', marginBottom: 6
      }}>R$ 1.500,00</div>
      <div style={{ fontSize: 12, color: '#8A8A92', marginBottom: 18 }}>Aguardando entrega · fundos retidos</div>

      {/* rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid #1F1F23' }}>
        <ReceiptRow k="Método" v="Pix" />
        <ReceiptRow k="Custódia" v="ativa · 3d restantes" />
        <ReceiptRow k="Reembolso" v="disponível" vColor="#7FD1A8" />
      </div>
    </div>);

}

// Mock receipt — "Ativa" (freelancer now paid-up front)
function ReceiptAtiva() {
  return (
    <div style={{
      background: '#0A0A0A', color: '#fff',
      border: '1px solid #1F1F23', borderRadius: 16,
      padding: '18px 20px',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 20px 40px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: '0.12em', color: '#8A8A92' }}>TX-2774-BN2L</span>
        <TxChip label="Ativa" color="#7FD1A8" />
      </div>

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 30, letterSpacing: '-0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', marginBottom: 6
      }}>R$ 2.480,00</div>
      <div style={{ fontSize: 12, color: '#8A8A92', marginBottom: 18 }}>Pagamento recebido · aguardando entrega</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid #1F1F23' }}>
        <ReceiptRow k="Comprador" v={<>João P.&nbsp;—&nbsp;<span style={{ color: '#7FD1A8' }}>confirmado</span></>} />
        <ReceiptRow k="Recebido" v="17 abr · 14:22" />
        <ReceiptRow k="Status" v="pronto para iniciar" vColor="#fff" vWeight={500} />
      </div>

      {/* footer strip */}
      <div style={{
        marginTop: 16, padding: '10px 12px',
        background: 'rgba(127,209,168,0.08)',
        border: '1px solid rgba(127,209,168,0.18)',
        borderRadius: 10,
        fontSize: 12, color: '#B8E6CC',
        display: 'flex', alignItems: 'center', gap: 8
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 9999, background: '#7FD1A8' }} />
        Você pode começar o trabalho com segurança.
      </div>
    </div>);

}

// Mock receipt — diagram (C → DALIVIM → V) for "Acordo ativo"
function ReceiptAcordo() {
  return (
    <div style={{
      background: '#0A0A0A', color: '#fff',
      border: '1px solid #1F1F23', borderRadius: 16,
      padding: '18px 20px 22px',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 20px 40px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: '0.12em', color: '#8A8A92' }}>TX-9821-VRB3</span>
      </div>

      {/* diagram */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center', position: 'relative',
        marginBottom: 26
      }}>
        {/* dashed connector line */}
        <div style={{
          position: 'absolute', left: '15%', right: '15%', top: 18,
          height: 1.5,
          backgroundImage: 'repeating-linear-gradient(90deg, #3A3A42 0, #3A3A42 4px, transparent 4px, transparent 8px)',
          zIndex: 0
        }} />
        {[
        { big: 'C', label: 'Comprador', fill: '#0A0A0A', textColor: '#fff', border: '1.5px solid #3A3A42' },
        { big: 'Dalivim', label: 'Custódia', fill: '#1E4BA0', textColor: '#fff', border: 'none', pill: true },
        { big: 'V', label: 'Vendedor', fill: '#0A0A0A', textColor: '#fff', border: '1.5px solid #3A3A42' }].
        map((n, i) =>
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
            <span style={{
            ...(n.pill ? {
              padding: '6px 14px', borderRadius: 9999,
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 13, letterSpacing: '0.02em'
            } : {
              width: 36, height: 36, borderRadius: 9999,
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 15,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }),
            background: n.fill,
            color: n.textColor,
            border: n.border
          }}>{n.big}</span>
            <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#8A8A92'
          }}>{n.label}</span>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid #1F1F23', paddingTop: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 12, color: '#A1A1AA'
      }}>
        <span>Acordo ativo</span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: '#fff' }}>2 partes &nbsp;·&nbsp; 1 contrato</span>
      </div>
    </div>);

}

function ReceiptRow({ k, v, vColor, vWeight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #1F1F23',
      fontSize: 12.5
    }}>
      <span style={{ color: '#8A8A92' }}>{k}</span>
      <span style={{
        color: vColor || '#fff', fontWeight: vWeight || 400,
        fontFamily: typeof v === 'string' && /\d/.test(v) ? 'ui-monospace, monospace' : "'Inter', sans-serif"
      }}>{v}</span>
    </div>);

}

// ---------- SCENARIOS (reworked — fear + receipt + resolution) ----------
function Scenarios() {
  const cases = [
  {
    n: '01',
    fear: <>Você pagou… e a<br />outra pessoa sumiu?</>,
    Receipt: ReceiptProtegido,
    resolution: 'Com Dalivim, os fundos só são liberados depois da entrega. Se algo der errado, o dinheiro volta pra você.'
  },
  {
    n: '02',
    fear: <>Já entregou o trabalho e teve<br />que correr atrás do pagamento?</>,
    Receipt: ReceiptAtiva,
    resolution: 'Aqui, o pagamento é garantido antes de você começar. Dinheiro na custódia é dinheiro confirmado.'
  },
  {
    n: '03',
    fear: <>Fazer negócio com<br />estranhos sempre é um risco.</>,
    Receipt: ReceiptAcordo,
    resolution: <>Dalivim fica no meio, garantindo que os dois lados cumpram o combinado. <span style={{ color: '#0A0A0A', fontWeight: 500 }}>Neutro. Verificável. Irreversível.</span></>
  }];


  return (
    <section id="uses" style={{ padding: '140px 0', background: '#F4F4F5' }}>
      <Container>
        <div style={{ maxWidth: 680, marginBottom: 56 }}>
          <Eyebrow>Casos de uso</Eyebrow>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(34px, 4.4vw, 54px)',
            letterSpacing: '-0.022em', lineHeight: 1.05,
            margin: '16px 0 16px', color: '#0A0A0A',
            textWrap: 'balance'
          }}>
            Situações em que ninguém devia<br />
            <span style={{ color: '#A1A1AA' }}>confiar só na palavra.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#52525B',
            margin: 0, maxWidth: 520, lineHeight: 1.55
          }}>
            Três formas reais de ser enganado. Cada uma com o mesmo final — desde que a Dalivim esteja no meio.
          </p>
        </div>

        <div className="dv-uses-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20
        }}>
          {cases.map(({ n, fear, Receipt, resolution }) =>
          <article key={n} style={{
            background: '#fff',
            border: '1px solid #E4E4E7',
            borderRadius: 20,
            padding: 28,
            display: 'flex', flexDirection: 'column', gap: 22
          }}>
              {/* number */}
              <span style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 11,
              letterSpacing: '0.18em', color: '#A1A1AA', fontWeight: 500
            }}>{n}</span>

              {/* fear question */}
              <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 'clamp(19px, 1.6vw, 22px)',
              letterSpacing: '-0.014em', lineHeight: 1.25,
              margin: 0, color: '#0A0A0A'
            }}>{fear}</h3>

              {/* mock receipt */}
              <Receipt />

              {/* resolution line */}
              <div style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              paddingTop: 14, borderTop: '1px solid #E4E4E7',
              marginTop: 'auto'
            }}>
                <span style={{
                width: 22, height: 22, borderRadius: 9999,
                background: '#0A0A0A', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1
              }}>
                  <Icon name="check" size={12} strokeWidth={2.5} />
                </span>
                <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.55,
                color: '#52525B', margin: 0
              }}>{resolution}</p>
              </div>
            </article>
          )}
        </div>
      </Container>
    </section>);

}

// ---------- CATEGORIAS (replaces testimonials — static, shows breadth) ----------
// ICP em primeiro plano: prestadores de serviço (programação, design, marketing,
// consultoria). Produtos/usados ficam como caso secundário, no fim.
const CATEGORIES = [
{
  icon: 'monitor', title: 'Programação & sites',
  body: 'Sites, apps e sistemas entregues por etapas. O pagamento é liberado a cada entrega aprovada — milestone por milestone.',
  example: 'Site institucional', value: 4500
},
{
  icon: 'gem', title: 'Design & identidade',
  body: 'Logo, identidade visual e UI. O cliente reserva o valor antes de você começar; você entrega sem medo de calote.',
  example: 'Identidade visual', value: 2800
},
{
  icon: 'users', title: 'Marketing & social',
  body: 'Gestão de redes, tráfego e conteúdo — muitas vezes mensal. Cobrança recorrente protegida, sem precisar cobrar no WhatsApp.',
  example: 'Social media · mês', value: 1800
},
{
  icon: 'briefcase', title: 'Consultoria & mentoria',
  body: 'Consultores, mentores e especialistas. O valor fica reservado e é liberado quando a sessão ou o pacote é cumprido.',
  example: 'Mentoria · pacote 4h', value: 1200
},
{
  icon: 'store', title: 'Produtos & usados',
  body: 'Também protege a venda de itens: celulares, notebooks e marketplace entre desconhecidos, dentro ou fora das redes.',
  example: 'iPhone 15 Pro', value: 6200
},
{
  icon: 'car', title: 'Veículos & itens de valor',
  body: 'Carros, motos, joias e colecionáveis. O valor fica retido até a transferência e a vistoria saírem do papel.',
  example: 'Honda CB 500', value: 28000
}];


function Categorias() {
  return (
    <section id="uses" style={{
      padding: '120px 0', background: '#FAFAFA',
      borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7'
    }}>
      <Container>
        <div style={{ maxWidth: 700, marginBottom: 56 }}>
          <Eyebrow>Feito para prestadores</Eyebrow>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(32px, 4.2vw, 52px)',
            letterSpacing: '-0.022em', lineHeight: 1.05,
            margin: '14px 0 16px', color: '#0A0A0A', textWrap: 'balance'
          }}>
            Para quem vive de entregar <span style={{ color: '#A1A1AA' }}>e quer receber.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.55,
            color: '#52525B', margin: 0, maxWidth: 560
          }}>
            De um projeto de design a uma consultoria mensal, a custódia garante que você receba pelo que entregar. E vale também para a venda de produtos e usados.
          </p>
        </div>

        <div className="dv-cat-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20
        }}>
          {CATEGORIES.map((c) =>
          <article key={c.title} style={{
            background: '#fff', border: '1px solid #ECECEF', borderRadius: 20,
            padding: 28, display: 'flex', flexDirection: 'column'
          }}>
              <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16
            }}>
                <span style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
              }}><Icon name={c.icon} size={52} /></span>
                <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                fontSize: 19, letterSpacing: '-0.012em', margin: 0, color: '#0A0A0A'
              }}>{c.title}</h3>
              </div>
              <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.55,
              color: '#52525B', margin: '0 0 22px'
            }}>{c.body}</p>

              <div style={{
              marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #ECECEF',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
            }}>
                <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A'
              }}>
                  <Icon name="shield-check" size={20} color="#1E8A5A" />{c.example}
                </span>
                <span style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#0A0A0A',
                fontVariantNumeric: 'tabular-nums'
              }}>{formatBRL(c.value)}</span>
              </div>
            </article>
          )}
        </div>
      </Container>
    </section>);

}

// ---------- CONTRAST: Sem escrow / Com a Dalivim ----------
// Visual-first. Two neutral cards separated by space (no table, no dividing
// lines, no green wall). A small flow at the top of each tells the story;
// big icons lead each point for instant reading. Only positives are green.
function ContrastFlow({ protectedFlow }) {
  const Node = ({ icon, label, tone = 'neutral' }) =>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <span style={{
        width: 46, height: 46, borderRadius: tone === 'shield' ? 13 : 9999,
        background: tone === 'shield' ? '#EEF3FB' : '#F4F4F5',
        border: tone === 'shield' ? '1px solid #C9DAF3' : '1px solid #E4E4E7',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}><Icon name={icon} size={28} /></span>
      <span style={{
      fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: tone === 'shield' ? '#1E4BA0' : '#71717A', whiteSpace: 'nowrap'
    }}>{label}</span>
    </div>;

  const Conn = ({ tag, danger }) =>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 30, padding: '0 4px' }}>
      <span style={{
      fontFamily: 'ui-monospace, monospace', fontSize: 10,
      letterSpacing: '0.06em', color: danger ? '#B4524A' : '#A1A1AA'
    }}>{tag}</span>
      <div style={{
      width: '100%', height: 2, borderRadius: 2,
      backgroundImage: `repeating-linear-gradient(90deg, ${danger ? '#E0C3C0' : '#C9D5EC'} 0, ${danger ? '#E0C3C0' : '#C9D5EC'} 4px, transparent 4px, transparent 9px)`
    }} />
    </div>;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '4px 4px 0', marginBottom: 30
    }}>
      {protectedFlow ?
      <>
          <Node icon="user" label="Comprador" />
          <Conn tag="paga" />
          <Node icon="shield-check" label="Dalivim" tone="shield" />
          <Conn tag="libera" />
          <Node icon="store" label="Vendedor" />
        </> :

      <>
          <Node icon="user" label="Comprador" />
          <Conn tag="Pix direto" danger />
          <Node icon="store" label="Vendedor" />
        </>
      }
    </div>);

}

function Contrast() {
  const cols = [
  {
    protectedFlow: false,
    label: 'Sem escrow',
    title: 'Você envia o Pix — e torce.',
    tone: 'neg',
    points: [
    'O dinheiro vai direto e não tem volta.',
    'O vendedor pode receber e sumir.',
    'Deu problema? Resta tentar resolver depois.']

  },
  {
    protectedFlow: true,
    label: 'Com a Dalivim',
    title: 'O Pix fica protegido até a entrega.',
    tone: 'pos',
    points: [
    'O valor fica retido num lugar neutro.',
    'O vendedor sabe que o dinheiro já está reservado.',
    'Aprovar, contestar ou reembolsar — com regras claras.']

  }];

  return (
    <section id="contraste" style={{ padding: '140px 0', background: '#FAFAFA', color: '#0A0A0A', borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7' }}>
      <Container maxWidth={1080}>
        <div style={{ maxWidth: 680, marginBottom: 64 }}>
          <Eyebrow color="#1E4BA0">A diferença</Eyebrow>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(34px, 4.4vw, 56px)',
            letterSpacing: '-0.022em', lineHeight: 1.05,
            margin: '16px 0 0', color: '#0A0A0A', textWrap: 'balance'
          }}>
            O mesmo Pix. <span style={{ color: '#A1A1AA' }}>Dois desfechos diferentes.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24
        }} className="dv-contrast-grid">
          {cols.map((c) => {
            const pos = c.tone === 'pos';
            return (
              <div key={c.label} style={{
                background: '#fff', border: '1px solid #ECECEF', borderRadius: 24,
                padding: 'clamp(26px, 3vw, 38px)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 20px 50px -30px rgba(10,10,10,0.15)'
              }}>
                <ContrastFlow protectedFlow={c.protectedFlow} />

                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: pos ? '#16794C' : '#A1A1AA', marginBottom: 10
                }}>{c.label}</div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                  fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.016em',
                  lineHeight: 1.2, margin: '0 0 24px', color: '#0A0A0A'
                }}>{c.title}</h3>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {c.points.map((p, i) =>
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <span style={{
                      width: 32, height: 32, borderRadius: 9999, flexShrink: 0, marginTop: -2,
                      background: pos ? '#F0F7F3' : '#F4F4F5',
                      color: pos ? '#16794C' : '#A1A1AA',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon name={pos ? 'check' : 'x'} size={17} strokeWidth={2.4} />
                      </span>
                      <span style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 'clamp(14.5px, 1.2vw, 16px)',
                      lineHeight: 1.45, color: pos ? '#0A0A0A' : '#52525B',
                      fontWeight: pos ? 500 : 400
                    }}>{p}</span>
                    </li>
                  )}
                </ul>
              </div>);

          })}
        </div>
      </Container>
    </section>);

}

Object.assign(window, { HowItWorks, Scenarios, Categorias, Contrast });