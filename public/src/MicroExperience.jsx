// Micro-experience card — 3 step wizard with final screen
// Lives inside the hero. On final step, replaces the card content in the same space.

const TIPO_OPTIONS = [
  { key: 'servico',  label: 'Serviço',  icon: 'briefcase', headline: 'Medo de não receber pelo seu serviço?', ctaNoun: 'serviço',
    sub: 'Freelance, design, programação, consultoria.' },
  { key: 'produto',  label: 'Produto',  icon: 'package',   headline: 'Medo de pagar e não receber o produto?', ctaNoun: 'produto',
    sub: 'Compra e venda de itens físicos.' },
  { key: 'outro',    label: 'Outro',    icon: 'handshake', headline: 'Medo de não receber o que foi combinado?', ctaNoun: 'acordo',
    sub: 'Qualquer acordo que precise de garantia.' },
];

const ACORDO_OPTIONS = [
  { key: 'eu_pago',     label: 'Eu pago primeiro',                sub: 'Dalivim retém até a entrega', icon: 'arrow-right' },
  { key: 'outro_entrega', label: 'A outra pessoa entrega primeiro', sub: 'Libero após conferir',        icon: 'arrow-left' },
  { key: 'combinar',    label: 'Ainda vamos combinar',            sub: 'Decidimos depois',            icon: 'clock' },
];

// ---------- REWRITE HEADLINE ----------
// Typewriter-style. Deletes current phrase, then types the next.
// No layout jump: phrases share a fixed invisible sizer (the longest phrase).
// ---------- WORD LOOP ----------
// Only the third word rewrites: pagar / vender / trabalhar.
// Keeps "Medo de ___ e não receber?" stable around it.
function LoopingFearLine({ locked, frozenHeadline }) {
  const words = ['pagar', 'vender', 'trabalhar'];
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState(words[0]);
  const [phase, setPhase] = useState('hold'); // hold | deleting | typing

  useEffect(() => {
    if (locked) return;
    let timeout;
    if (phase === 'hold') {
      timeout = setTimeout(() => setPhase('deleting'), 2000);
    } else if (phase === 'deleting') {
      if (text.length === 0) {
        const next = (wordIdx + 1) % words.length;
        setWordIdx(next);
        setPhase('typing');
      } else {
        timeout = setTimeout(() => setText(t => t.slice(0, -1)), 42);
      }
    } else if (phase === 'typing') {
      const target = words[wordIdx];
      if (text.length >= target.length) {
        setPhase('hold');
      } else {
        timeout = setTimeout(() => setText(target.slice(0, text.length + 1)), 70);
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, text, wordIdx, locked]);

  if (locked && frozenHeadline) {
    return <span key="locked">{frozenHeadline}</span>;
  }

  // Natural inline flow — no sizer. The rest of the sentence breathes with the word.
  return (
    <span style={{
      color: '#1E4BA0',
      whiteSpace: 'pre',
      transition: 'color 200ms',
    }}>
      {text}
      <span style={{
        display: 'inline-block', width: '0.06em', height: '0.82em',
        background: 'currentColor', verticalAlign: '-0.08em',
        marginLeft: '0.02em', opacity: 0.85,
        animation: 'dv-caret 900ms steps(1) infinite',
      }}/>
    </span>
  );
}

// ---------- TWO-BEAT HERO HEADLINE ----------
function HeroHeadline({ tipo, size = 'clamp(36px, 5vw, 64px)', muted = '#A1A1AA', headlineOverride, resolutionText = 'Sem problema. A gente garante.', animated = false }) {
  const frozen = tipo ? TIPO_OPTIONS.find(o => o.key === tipo)?.headline : null;

  // Split resolutionText so we can color the last sentence blue.
  // Convention: everything before the first period stays muted; everything after it is highlighted.
  const splitIdx = resolutionText.indexOf('.');
  const firstPart = splitIdx >= 0 ? resolutionText.slice(0, splitIdx + 1) : '';
  const secondPart = splitIdx >= 0 ? resolutionText.slice(splitIdx + 1).trim() : resolutionText;

  return (
    <h1 style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 500, fontSize: size,
      lineHeight: 1.05, letterSpacing: '-0.028em',
      margin: 0, color: '#0A0A0A',
      textAlign: 'center',
      maxWidth: 900,
    }}>
      <div style={{ display: 'block', whiteSpace: 'nowrap' }}>
        {frozen ? (
          <span>{frozen}</span>
        ) : (
          <>Medo de <LoopingFearLine/> e não receber?</>
        )}
      </div>
      <div style={{ display: 'block' }}>
        {firstPart && <span style={{ color: muted }}>{firstPart} </span>}
        <span style={{ color: '#1E4BA0' }}>{secondPart}</span>
      </div>
    </h1>
  );
}

// ---------- OPTION BUTTON ----------
function OptionButton({ children, selected, onClick, icon, sub }) {
  const [hover, setHover] = useState(false);
  const active = selected || hover;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'Inter', sans-serif",
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '18px 22px',
        background: selected ? '#EFF4FB' : '#fff',
        color: selected ? '#15356E' : '#0A0A0A',
        border: selected ? '2px solid #1E4BA0'
              : hover ? '1.5px solid #1E4BA0'
              : '1.5px solid #E4E4E7',
        borderRadius: 14,
        textAlign: 'left',
        cursor: 'pointer',
        flex: 1,
        minHeight: 68,
        transform: hover && !selected ? 'translateY(-1px) scale(1.005)' : 'none',
        boxShadow: hover && !selected ? '0 8px 24px -12px rgba(30,75,160,0.25)' : 'none',
        transition: 'all 220ms cubic-bezier(0.2,0.6,0.2,1)',
      }}
    >
      <span style={{
        width: 40, height: 40, borderRadius: 12,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? '#fff' : '#F4F4F5',
        color: selected ? '#1E4BA0' : '#0A0A0A',
        transition: 'background 220ms',
        flexShrink: 0,
      }}>
        <Icon name={icon} size={20}/>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.2 }}>{children}</span>
        {sub && <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.65, lineHeight: 1.3 }}>{sub}</span>}
      </span>
      {selected && <Icon name="check" size={16}/>}
    </button>
  );
}

// ---------- STEP HEADER ----------
function StepHeader({ step, total, question, sub }) {
  // Intentional non-linear progress so the bar never feels empty.
  // Step 1 starts filled at 30% (you already started), 65% midway, 100% at the last.
  const pctMap = { 1: 30, 2: 65, 3: 100, 4: 100 };
  const pct = pctMap[step] ?? (step / total) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22,
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: '#52525B',
          whiteSpace: 'nowrap',
        }}>Configuração · {step}/{total}</span>
        <div style={{ flex: 1, height: 4, background: '#F4F4F5', borderRadius: 9999, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #1E4BA0 0%, #3D6BC4 100%)',
            borderRadius: 9999,
            transition: 'width 520ms cubic-bezier(0.2,0.9,0.2,1)',
          }}/>
        </div>
      </div>
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 'clamp(20px, 2.1vw, 24px)', letterSpacing: '-0.016em', lineHeight: 1.2,
        margin: 0, color: '#0A0A0A',
      }}>{question}</h3>
      {sub && <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.5,
        color: '#71717A', margin: '8px 0 0',
      }}>{sub}</p>}
    </div>
  );
}

// ---------- VALUE SLIDER + INPUT ----------
function ValueField({ value, onChange }) {
  const animated = useAnimatedNumber(value, 450);
  const min = 50, max = 20000;
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div>
      {/* big number + lock */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12,
        padding: '18px 22px',
        background: '#F4F4F5',
        borderRadius: 14,
        border: '1.5px solid #E4E4E7',
        marginBottom: 16,
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1,
          color: '#0A0A0A', fontVariantNumeric: 'tabular-nums',
        }}>{formatBRL(animated)}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
          color: '#1E4BA0',
          marginLeft: 'auto',
        }}>
          <Icon name="lock" size={14}/>protegido
        </span>
      </div>

      {/* slider */}
      <div style={{ padding: '8px 4px 18px' }}>
        <input
          type="range" min={min} max={max} step={50} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: '100%', accentColor: '#1E4BA0', cursor: 'pointer',
            background: `linear-gradient(to right, #1E4BA0 0%, #1E4BA0 ${pct}%, #E4E4E7 ${pct}%, #E4E4E7 100%)`,
            height: 4, borderRadius: 9999, appearance: 'none', WebkitAppearance: 'none',
          }}
          className="dv-range"
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Inter', sans-serif", fontSize: 12,
          color: '#A1A1AA', marginTop: 10,
        }}>
          <span>R$ 50</span>
          <button
            onClick={() => {
              const input = prompt('Digite o valor em reais:', String(value));
              const n = Number(input);
              if (!Number.isNaN(n) && n > 0) onChange(Math.min(max, Math.max(min, Math.round(n))));
            }}
            style={{
              background: 'transparent', border: 'none', padding: 0,
              fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#0A0A0A',
              cursor: 'pointer', fontWeight: 500, textDecoration: 'underline',
            }}
          >Digitar valor</button>
          <span>R$ 20.000</span>
        </div>
      </div>

      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#71717A',
        margin: 0, textAlign: 'center',
      }}>
        Esse valor ficará protegido até a entrega.
      </p>
    </div>
  );
}

// ---------- FINAL SCREEN ----------
function FinalScreen({ value, tipo, acordo, onReset, onCta }) {
  const tipoData = TIPO_OPTIONS.find(o => o.key === tipo);
  const ctaText = `Proteger meus ${formatBRL(value)}`;
  const animated = useAnimatedNumber(value, 600);

  return (
    <div style={{ animation: 'dv-fade-in 500ms cubic-bezier(0.2,0.6,0.2,1)' }}>
      {/* Shield + value card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '20px 22px',
        background: '#0A0A0A', color: '#fff',
        borderRadius: 18,
        marginBottom: 20,
      }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(30,75,160,0.2)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#6B98E8',
        }}>
          <Icon name="shield-check" size={22}/>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8A92',
            marginBottom: 4,
          }}>Em custódia</div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 28, letterSpacing: '-0.014em',
            fontVariantNumeric: 'tabular-nums',
          }}>{formatBRL(animated)}</div>
        </div>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12,
          color: '#7FD1A8', display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#7FD1A8', boxShadow: '0 0 0 4px rgba(127,209,168,0.18)' }}/>
          ativo
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 26, letterSpacing: '-0.018em', lineHeight: 1.15,
        margin: '0 0 10px', color: '#0A0A0A',
      }}>
        Seu dinheiro pode ficar protegido.
      </h3>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.55,
        color: '#52525B', margin: '0 0 20px',
      }}>
        {formatBRL(value)} fica protegido até o {tipoData?.ctaNoun || 'acordo'} ser entregue.
        Se algo der errado, você não perde o dinheiro.
      </p>

      {/* Bullets */}
      <ul style={{
        listStyle: 'none', padding: 0, margin: '0 0 24px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {[
          'Só libera quando ambos confirmam',
          'Pode abrir disputa se algo der errado',
          'Proteção contra golpes e não entrega',
        ].map((b, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#27272A',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 9999,
              background: '#E8F2EC',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#16794C', flexShrink: 0,
            }}>
              <Icon name="check" size={13} strokeWidth={2.5}/>
            </span>
            {b}
          </li>
        ))}
      </ul>

      {/* CTAs — carry the 30-sec test into onboarding so it isn't wasted. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <a
          href={'Onboarding.html?signup=1'
            + (tipo ? '&tipo=' + encodeURIComponent(tipo) : '')
            + (value ? '&valor=' + encodeURIComponent(value) : '')
            + (acordo ? '&acordo=' + encodeURIComponent(acordo) : '')}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 16,
            background: '#1E4BA0', color: '#fff',
            padding: '18px 28px', borderRadius: 9999,
            border: 'none', cursor: 'pointer',
            textDecoration: 'none',
            boxShadow: '0 0 0 0 rgba(30,75,160,0.35)',
            animation: 'dv-cta-pulse 2.2s cubic-bezier(0.2,0.6,0.2,1) infinite',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#153A82'}
          onMouseLeave={e => e.currentTarget.style.background = '#1E4BA0'}
        >
          {ctaText}
        </a>
        <button
          onClick={onReset}
          style={{
            background: 'transparent', border: 'none',
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A',
            padding: 8, cursor: 'pointer',
          }}
        >Ajustar detalhes</button>
      </div>

      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#A1A1AA',
        margin: '16px 0 0', textAlign: 'center',
      }}>
        Falta só 1 passo para proteger esse valor.
      </p>
    </div>
  );
}

// ---------- THE MAIN CARD ----------
function MicroExperience({ variant = 'default' }) {
  const [step, setStep] = useState(1); // 1,2,3; 4 = final
  const [tipo, setTipo] = useState(null);
  const [value, setValue] = useState(1500);
  const [acordo, setAcordo] = useState(null);

  const reset = () => { setStep(1); setTipo(null); setAcordo(null); };

  const cardStyle = {
    background: '#fff',
    border: '1.5px solid #E4E4E7',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxWidth: 540,
    boxSizing: 'border-box',
  };

  return (
    <div style={cardStyle}>
      {step === 1 && (
        <>
          <StepHeader step={1} total={3} question="O que você está negociando?"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TIPO_OPTIONS.map(o => (
              <OptionButton
                key={o.key}
                icon={o.icon}
                selected={tipo === o.key}
                onClick={() => { setTipo(o.key); setTimeout(() => setStep(2), 240); }}
              >{o.label}</OptionButton>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <StepHeader step={2} total={3} question="Qual o valor dessa negociação?"/>
          <ValueField value={value} onChange={setValue}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="ghost" onClick={() => setStep(1)}>
              <Icon name="arrow-left" size={14}/>Voltar
            </Button>
            <Button variant="dark" onClick={() => setStep(3)}>
              Continuar<Icon name="arrow-right" size={14}/>
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <StepHeader step={3} total={3} question="Como funciona esse acordo?"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACORDO_OPTIONS.map(o => (
              <OptionButton
                key={o.key}
                icon={o.icon}
                sub={o.sub}
                selected={acordo === o.key}
                onClick={() => { setAcordo(o.key); setTimeout(() => setStep(4), 260); }}
              >{o.label}</OptionButton>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <Button variant="ghost" onClick={() => setStep(2)}>
              <Icon name="arrow-left" size={14}/>Voltar
            </Button>
          </div>
        </>
      )}

      {step === 4 && (
        <FinalScreen
          value={value}
          tipo={tipo}
          acordo={acordo}
          onReset={reset}
          onCta={(e) => { /* real signup flow lives elsewhere */ }}
        />
      )}
    </div>
  );
}

Object.assign(window, { MicroExperience, HeroHeadline, TIPO_OPTIONS });
