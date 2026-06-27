// Hero — Tazapay-style centered text hero: badges row, big two-tone headline,
// subhead, support line, two CTAs, decorative converging-arc with party bubbles.

// One badge only — the rest of the trust signals appear later in the page.
function HeroBadge() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 9,
        padding: '7px 14px 7px 9px',
        background: '#fff', border: '1px solid #E4E4E7', borderRadius: 9999,
        boxShadow: '0 1px 2px rgba(10,10,10,0.04)'
      }}>
        <span style={{
          width: 24, height: 24, borderRadius: 9999,
          background: '#F0F7F3', color: '#16794C',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}><Icon name="shield-check" size={14} /></span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#27272A' }}>
          Pix protegido por escrow
        </span>
      </span>
    </div>);

}

// Hero closure: a concrete product preview — a live custody status card.
// Ends the hero on the product, not an abstraction.
function HeroPreview() {
  const Row = ({ icon, who, status, done }) =>
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '13px 0', borderTop: '1px solid #F0F0F2'
  }}>
      <span style={{
      width: 30, height: 30, borderRadius: 9999, flexShrink: 0,
      background: '#F4F4F5', color: '#52525B',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
    }}><Icon name={icon} size={15} /></span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#27272A', flex: 1 }}>{who}</span>
      <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: "'Inter', sans-serif", fontSize: 12.5,
      color: done ? '#16794C' : '#A1A1AA'
    }}>
        {done && <Icon name="check" size={13} strokeWidth={2.5} />}{status}
      </span>
    </div>;

  return (
    <div style={{
      width: '100%', maxWidth: 440, margin: '12px auto 0',
      background: '#fff', border: '1px solid #ECECEF', borderRadius: 22,
      padding: '24px 26px 22px', textAlign: 'left',
      boxShadow: '0 1px 2px rgba(10,10,10,0.04), 0 40px 80px -44px rgba(30,75,160,0.28)'
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 9,
          fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717A'
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 7, background: '#EEF3FB', color: '#1E4BA0',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}><Icon name="shield-check" size={12} /></span>
          Custódia
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 500, color: '#16794C'
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 9999, background: '#16794C',
            boxShadow: '0 0 0 3px rgba(22,121,76,0.16)',
            animation: 'dv-pulse-dot 2s ease-in-out infinite'
          }} />
          ativa
        </span>
      </div>

      {/* amount */}
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 38, letterSpacing: '-0.022em', lineHeight: 1,
        color: '#0A0A0A', fontVariantNumeric: 'tabular-nums'
      }}>R$ 3.000,00</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A', margin: '7px 0 18px' }}>
        Pagamento reservado · fora da operação da Dalivim
      </div>

      {/* parties */}
      <Row icon="user" who="Comprador" status="confirmou" done />
      <Row icon="store" who="Vendedor" status="aguardando entrega" />

      {/* status footer */}
      <div style={{
        marginTop: 18, padding: '12px 14px',
        background: '#F3F7FC', border: '1px solid #DCE7F6',
        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#1E4BA0'
      }}>
        <Icon name="lock" size={14} />
        Valor liberado só com a aprovação dos dois lados.
      </div>
    </div>);

}

function HeroWithMicro({ variant = 'v1', tweaks = {} }) {
  return (
    <section style={{
      position: 'relative',
      paddingTop: 116, paddingBottom: 64,
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 60%, #F4F7FB 100%)',
      overflow: 'hidden',
      borderBottom: '1px solid #E4E4E7'
    }}>
      <Container style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center'
        }}>
          <HeroBadge />

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(40px, 6.4vw, 88px)',
            lineHeight: 1.0, letterSpacing: '-0.03em',
            margin: '28px 0 0', color: '#0A0A0A', maxWidth: 980, textWrap: 'balance'
          }}>
            Negocie sem precisar{' '}
            <span style={{
              background: 'linear-gradient(90deg, #1E4BA0 0%, #16794C 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent'
            }}>confiar.</span>
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 400,
            fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.5,
            color: '#52525B', margin: '22px 0 0', maxWidth: 560
          }}>
            O dinheiro fica protegido na Dalivim e só é liberado quando
            o combinado é cumprido.
          </p>

          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 34 }}>
            <a href="Onboarding.html" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 16,
              background: '#0A0A0A', color: '#fff',
              padding: '16px 28px', borderRadius: 9999, textDecoration: 'none',
              transition: 'background 200ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1f1f24'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#0A0A0A'}>
              Criar negociação protegida</a>
            <a href="#fluxo" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 15.5,
              color: '#0A0A0A', textDecoration: 'none',
              transition: 'gap 200ms, color 200ms'
            }}
            onMouseEnter={(e) => {e.currentTarget.style.gap = '11px';e.currentTarget.style.color = '#1E4BA0';}}
            onMouseLeave={(e) => {e.currentTarget.style.gap = '7px';e.currentTarget.style.color = '#0A0A0A';}}>
              Como funciona</a>
          </div>

          <div style={{ width: '100%', marginTop: 52 }}>
            <HeroPreview />
          </div>
        </div>
      </Container>
    </section>);

}

// Standalone wizard section (the interactive simulation moved out of the hero).
function SimulacaoSection({ variant = 'v2' }) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState('servico');
  const [value, setValue] = useState(1500);
  const [acordo, setAcordo] = useState('pagamento');
  const reset = () => {setStep(1);setTipo('servico');setAcordo('pagamento');};

  return (
    <section id="simular" style={{
      padding: '120px 0', background: '#FAFAFA', borderBottom: '1px solid #E4E4E7'
    }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow color="#1E4BA0">Teste agora, em 30 segundos</Eyebrow>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(30px, 3.6vw, 46px)', letterSpacing: '-0.022em',
            lineHeight: 1.08, margin: '14px 0 0', color: '#0A0A0A', textWrap: 'balance'
          }}>
            Monte uma negociação protegida.
          </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MicroExperienceControlled
            variant={variant}
            step={step} setStep={setStep}
            tipo={tipo} setTipo={setTipo}
            value={value} setValue={setValue}
            acordo={acordo} setAcordo={setAcordo}
            reset={reset} />
          
        </div>
      </Container>
    </section>);

}

// ---- Step wrapper: fade + slide on change ----
function StepSwitch({ step, children }) {
  return (
    <div key={step} style={{
      animation: 'dv-step-in 360ms cubic-bezier(0.2,0.8,0.2,1)'
    }}>{children}</div>);

}

// ---- Live fee breakdown ----
function FeeBreakdown({ value }) {
  const fee = Math.max(3, Math.round(value * 0.029));
  const net = value - fee;
  const anim = useAnimatedNumber(value, 450);
  const animFee = useAnimatedNumber(fee, 450);
  const animNet = useAnimatedNumber(net, 450);
  const Row = ({ k, v, strong, color }) =>
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    padding: '10px 0',
    fontFamily: "'Inter', sans-serif", fontSize: 14,
    color: strong ? '#0A0A0A' : '#52525B'
  }}>
      <span>{k}</span>
      <span style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontVariantNumeric: 'tabular-nums',
      fontSize: strong ? 18 : 14, fontWeight: strong ? 500 : 400,
      color: color || (strong ? '#0A0A0A' : '#52525B'),
      letterSpacing: strong ? '-0.01em' : 0
    }}>{v}</span>
    </div>;

  return (
    <div style={{
      marginTop: 18, padding: '4px 16px',
      background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: 12
    }}>
      <Row k="Você paga" v={formatBRL(anim)} />
      <div style={{ borderTop: '1px dashed #E4E4E7' }} />
      <Row k="Taxa Dalivim (2,9%)" v={`− ${formatBRL(animFee)}`} />
      <div style={{ borderTop: '1px dashed #E4E4E7' }} />
      <Row k="Valor protegido" v={formatBRL(animNet)} strong color="#1E4BA0" />
    </div>);

}

// ---- Currency input: big, centered, auto-formatted ----
function CurrencyInput({ value, onChange }) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => {setRaw(String(value));}, [value]);
  return (
    <div style={{
      border: '1.5px solid #E4E4E7', borderRadius: 16,
      padding: '22px 24px', background: '#fff',
      transition: 'border-color 200ms',
      display: 'flex', alignItems: 'center', gap: 10
    }}
    onFocus={(e) => e.currentTarget.style.borderColor = '#1E4BA0'}
    onBlur={(e) => e.currentTarget.style.borderColor = '#E4E4E7'}>
      
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 38, color: '#A1A1AA', letterSpacing: '-0.02em'
      }}>R$</span>
      <input
        inputMode="numeric"
        value={raw === '0' ? '' : raw}
        placeholder="500"
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '').slice(0, 7);
          setRaw(digits);
          onChange(Number(digits) || 0);
        }}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 38, letterSpacing: '-0.02em',
          color: '#0A0A0A', fontVariantNumeric: 'tabular-nums',
          minWidth: 0, width: '100%'
        }} />
      
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
        color: '#1E4BA0', whiteSpace: 'nowrap'
      }}>
        <Icon name="lock" size={15} />protegido
      </span>
    </div>);

}

// ---- Order selector: "quem vai primeiro?" ----
function OrderSelector({ value, onChange, tipo }) {
  // Phrasing adapts to the transaction type.
  // For serviço / outro → "entrega" is the work/deliverable
  // For produto → "produto"
  const noun = tipo === 'produto' ? 'produto' : tipo === 'servico' ? 'serviço' : 'acordo';
  const options = [
  {
    key: 'pagamento',
    title: 'Pagamento primeiro',
    sub: `Pagador envia o Pix. Você entrega o ${noun} sabendo que o dinheiro está garantido.`,
    iconL: 'arrow-right', iconR: 'package'
  },
  {
    key: 'entrega',
    title: 'Entrega primeiro',
    sub: `Você entrega o ${noun}. Pagador confirma e libera o valor já bloqueado em custódia.`,
    iconL: 'package', iconR: 'arrow-right'
  }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
      {options.map((o) => {
        const selected = value === o.key;
        return (
          <button key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px',
            background: selected ? '#EFF4FB' : '#fff',
            color: selected ? '#15356E' : '#0A0A0A',
            border: selected ? '2px solid #1E4BA0' : '1.5px solid #E4E4E7',
            borderRadius: 14,
            transition: 'all 220ms cubic-bezier(0.2,0.6,0.2,1)'
          }}
          onMouseEnter={(e) => {if (!selected) e.currentTarget.style.borderColor = '#1E4BA0';}}
          onMouseLeave={(e) => {if (!selected) e.currentTarget.style.borderColor = '#E4E4E7';}}>
            
            {/* (order pictogram removed) */}
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500, lineHeight: 1.2 }}>{o.title}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, lineHeight: 1.35, opacity: selected ? 0.7 : 0.6 }}>{o.sub}</span>
            </span>
            {selected && <Icon name="check" size={16} />}
          </button>);

      })}
    </div>);

}

// ---- Flow diagram: adapts to the chosen order ----
function FlowDiagram({ value, order = 'pagamento' }) {
  const paymentFirst = [
  { icon: 'pix', title: 'Pagamento realizado via Pix', sub: 'Pagador transfere o valor da transação.' },
  { icon: 'lock', title: 'Valor fica protegido', sub: 'Em conta segregada, fora da operação da Dalivim.' },
  { icon: 'package', title: 'Entrega confirmada', sub: 'Ambas as partes confirmam que tudo foi entregue.' },
  { icon: 'shield-check', title: 'Dinheiro liberado', sub: `${formatBRL(value)} vão para quem entregou.` }];

  const deliveryFirst = [
  { icon: 'lock', title: 'Pagador bloqueia valor', sub: `${formatBRL(value)} ficam em custódia antes de qualquer entrega.` },
  { icon: 'package', title: 'Vendedor entrega', sub: 'Sabendo que o dinheiro já está garantido.' },
  { icon: 'check', title: 'Pagador confirma', sub: 'Ambas as partes aprovam a entrega.' },
  { icon: 'shield-check', title: 'Dinheiro liberado', sub: `${formatBRL(value)} vão para quem entregou.` }];

  const steps = order === 'entrega' ? deliveryFirst : paymentFirst;

  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', position: 'relative' }}>
      {/* Connector line */}
      <div style={{
        position: 'absolute', left: 17, top: 20, bottom: 20,
        width: 1.5, background: 'repeating-linear-gradient(180deg, #D4D4D8 0, #D4D4D8 3px, transparent 3px, transparent 6px)'
      }} />
      {steps.map((s, i) =>
      <li key={i} style={{
        display: 'flex', gap: 14, padding: '10px 0',
        position: 'relative'
      }}>
          <span style={{
          width: 36, height: 36, borderRadius: 9999,
          background: '#fff', border: '1.5px solid #E4E4E7',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#1E4BA0', flexShrink: 0, zIndex: 1
        }}>
            <Icon name={s.icon} size={24} strokeWidth={2} />
          </span>
          <div style={{ paddingTop: 6 }}>
            <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500,
            color: '#0A0A0A', lineHeight: 1.3
          }}>{s.title}</div>
            <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A',
            marginTop: 2, lineHeight: 1.4
          }}>{s.sub}</div>
          </div>
        </li>
      )}
    </ol>);

}

// ---- Trust pills at the bottom of the card ----
function TrustPills() {
  const pills = [
  { icon: 'lock', label: 'Conta segregada' },
  { icon: 'pix', label: 'Pix' },
  { icon: 'shield-check', label: 'Disputa garantida' }];

  return (
    <div style={{
      marginTop: 22, paddingTop: 18, borderTop: '1px dashed #E4E4E7',
      display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'
    }}>
      {pills.map((p) =>
      <span key={p.label} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#71717A'
      }}>
          <Icon name={p.icon} size={17} color="#52525B" strokeWidth={2} />{p.label}
        </span>
      )}
    </div>);

}

// ---- Controlled micro-experience card — guided simulation ----
function MicroExperienceControlled({ step, setStep, tipo, setTipo, value, setValue, acordo, setAcordo, reset, variant }) {
  const isLedger = variant === 'v2';

  const cardStyle = {
    background: '#fff',
    border: isLedger ? '1px solid #D4D4D8' : '1px solid #E4E4E7',
    borderRadius: isLedger ? 16 : 32,
    padding: 'clamp(24px, 4vw, 44px) clamp(22px, 4vw, 48px) clamp(28px, 4vw, 40px)',
    width: '100%',
    maxWidth: 680,
    boxSizing: 'border-box',
    textAlign: 'left',
    position: 'relative',
    boxShadow: isLedger ?
    '0 1px 2px rgba(10,10,10,0.04), 0 20px 60px -20px rgba(10,10,10,0.18), 0 0 0 1px rgba(10,10,10,0.02)' :
    '0 1px 2px rgba(10,10,10,0.04), 0 12px 40px -8px rgba(10,10,10,0.08)'
  };

  const title = step === 4 ?
  'Seu dinheiro estaria protegido.' :
  step === 1 ? 'Vamos proteger esse acordo.' :
  step === 2 ? 'Vamos proteger esse acordo.' :
  'Vamos proteger esse acordo.';

  const kicker = step === 4 ? 'Simulação · pronto' : 'Simulação rápida';

  return (
    <div style={cardStyle}>
      {/* Ledger stripe for v2 — trust-bar */}
      {isLedger &&
      <div className="dv-trust-bar" style={{
        margin: 'calc(clamp(24px, 4vw, 44px) * -1) calc(clamp(22px, 4vw, 48px) * -1) 28px',
        padding: '14px clamp(18px, 3vw, 28px)',
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F4F4F5 100%)',
        borderBottom: '1px solid #E4E4E7',
        borderTopLeftRadius: 15, borderTopRightRadius: 15,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 12, flexWrap: 'wrap',
        fontFamily: "'Inter', sans-serif", fontSize: 12,
        color: '#52525B'
      }}>
          {/* Left: logo mark + institution label */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <img src="assets/dalivim-mark.svg" alt="" style={{
            width: 22, height: 22, flexShrink: 0
          }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, minWidth: 0 }}>
              <span style={{ fontWeight: 600, color: '#0A0A0A', fontSize: 12.5, letterSpacing: '-0.005em' }}>Dalivim · Custódia simulada</span>
              <span style={{ fontSize: 10.5, color: '#71717A', letterSpacing: '0.02em' }}>
                Conta segregada · BCB 4.658
              </span>
            </div>
          </div>

          {/* Right: live status + tx id */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 500, color: '#16794C'
          }}>
              <span style={{
              width: 6, height: 6, borderRadius: 9999, background: '#16794C',
              boxShadow: '0 0 0 3px rgba(22,121,76,0.18)',
              animation: 'dv-pulse-dot 2s ease-in-out infinite'
            }} />
              seguro
            </span>
            <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 11,
            color: '#71717A', letterSpacing: '0.04em',
            padding: '3px 8px', background: '#fff',
            border: '1px solid #E4E4E7', borderRadius: 6
          }}>
              #TX-{(value * 7 + 319).toString(16).toUpperCase().slice(0, 6)}
            </span>
          </div>
        </div>
      }

      {/* Card title (not ledger) */}
      {!isLedger &&
      <div style={{ marginBottom: 28 }}>
          <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1E4BA0',
          marginBottom: 10
        }}>{kicker}</div>
          <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 'clamp(26px, 2.6vw, 32px)',
          letterSpacing: '-0.018em', lineHeight: 1.1,
          margin: 0, color: '#0A0A0A'
        }}>{title}</h2>
        </div>
      }

      <StepSwitch step={step}>
        {step === 1 &&
        <>
            <StepHeader step={1} total={3}
          question="Vamos começar — o que você está negociando?"
          sub="Isso ajuda a configurar sua transação com segurança." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TIPO_OPTIONS.map((o) =>
            <OptionButton
              key={o.key} icon={o.icon} sub={o.sub}
              selected={tipo === o.key}
              onClick={() => {setTipo(o.key);setTimeout(() => setStep(2), 200);}}>
              {o.label}</OptionButton>
            )}
            </div>
          </>
        }

        {step === 2 &&
        <>
            <StepHeader step={2} total={3}
          question="Qual o valor da transação?"
          sub="O valor ficará protegido até a confirmação da entrega." />
            <CurrencyInput value={value} onChange={setValue} />
            <FeeBreakdown value={value} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button variant="dark" onClick={() => value >= 50 && setStep(3)}>
                Continuar
              </Button>
            </div>
          </>
        }

        {step === 3 &&
        <>
            <StepHeader step={3} total={3}
          question="Quem vai primeiro?"
          sub="Defina a ordem do acordo. O valor fica travado até o outro lado confirmar." />
            <OrderSelector value={acordo} onChange={setAcordo} tipo={tipo} />
            <div style={{
            padding: '18px 18px 10px',
            background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: 14,
            marginBottom: 20
          }}>
              <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#71717A', marginBottom: 14
            }}>Como vai funcionar</div>
              <FlowDiagram value={value} order={acordo} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="Onboarding.html"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 15,
              background: '#1E4BA0', color: '#fff',
              padding: '16px 24px', borderRadius: 9999,
              textDecoration: 'none', cursor: 'pointer',
              boxShadow: '0 0 0 0 rgba(30,75,160,0.4)',
              animation: 'dv-cta-pulse 2.4s cubic-bezier(0.2,0.6,0.2,1) infinite'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#153A82'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1E4BA0'}>
              Criar transação segura</a>
              <button onClick={() => setStep(2)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A',
              padding: 6
            }}>Voltar e ajustar o valor</button>
            </div>
            <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#A1A1AA',
            margin: '14px 0 0', textAlign: 'center'
          }}>Sem compromisso. Leva menos de 1 minuto.</p>
          </>
        }

        {step === 4 &&
        <FinalScreen value={value} tipo={tipo} acordo={acordo} onReset={reset} onCta={() => {}} />
        }
      </StepSwitch>

      <TrustPills />
    </div>);

}

Object.assign(window, { HeroWithMicro, MicroExperienceControlled, SimulacaoSection });