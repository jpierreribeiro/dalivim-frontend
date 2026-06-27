// EscrowFlow — the visual demonstration the critique asked for as #1 priority.
// "Show before explaining." A token of money travels Comprador → Dalivim (held)
// → Vendedor, pausing in custody so the invisible service becomes visible.
// Animated, but the static end-state reads fine (print / reduced-motion).

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const on = (e) => setReduce(e.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduce;
}

// Phase model -----------------------------------------------------------------
// 0 pay      token at comprador, about to send Pix
// 1 transit  token glides comprador → custódia
// 2 held     token rests in custódia, locked
// 3 deliver  vendedor delivers; both confirm
// 4 release  token glides custódia → vendedor, becomes "liberado"
const FLOW_PHASES = [
{ step: 0, left: '12%', caption: 'O comprador paga via Pix.', note: 'O dinheiro sai da conta — mas ainda não chega ao vendedor.' },
{ step: 1, left: '50%', caption: 'O valor entra na custódia da Dalivim.', note: 'Sai do comprador. Fica num lugar neutro.' },
{ step: 1, left: '50%', caption: 'Retido. Ninguém pode mexer.', note: 'Nem o comprador, nem o vendedor, nem a Dalivim.' },
{ step: 2, left: '50%', caption: 'O vendedor entrega — e os dois confirmam.', note: 'A entrega acontece com o pagamento já garantido.' },
{ step: 3, left: '88%', caption: 'Só então o dinheiro é liberado.', note: 'O vendedor recebe. O combinado foi cumprido.' }];


const FLOW_DURATIONS = [1900, 1500, 2400, 2200, 2600];

const FLOW_STEPS = ['Pix', 'Custódia', 'Entrega', 'Liberado'];

function FlowNode({ icon, label, sublabel, emphasis, active, state }) {
  const size = emphasis ? 'clamp(72px, 9vw, 92px)' : 'clamp(56px, 7vw, 72px)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
      <div style={{ ...{
          width: size, height: size, borderRadius: emphasis ? 22 : 9999,
          background: emphasis ? '#0A0A0A' : '#fff',
          color: emphasis ? '#fff' : '#27272A',
          border: emphasis ? '1px solid #0A0A0A' : '1.5px solid #E4E4E7',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
          boxShadow: emphasis ?
          '0 18px 40px -18px rgba(10,10,10,0.45)' :
          '0 4px 14px -8px rgba(10,10,10,0.16)',
          transition: 'transform 420ms cubic-bezier(0.2,0.7,0.2,1)',
          transform: active ? 'scale(1.05)' : 'scale(1)'
        }, background: "rgb(255, 255, 255)" }}>
        <Icon name={icon} size={emphasis ? 30 : 24} strokeWidth={1.8} />
        {/* lock badge appears while held */}
        {emphasis &&
        <span style={{
          position: 'absolute', right: -6, bottom: -6,
          width: 30, height: 30, borderRadius: 9999,
          background: state === 'held' ? '#1E4BA0' : '#27272A',
          color: '#fff', border: '2px solid #fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 360ms, transform 360ms cubic-bezier(0.2,0.7,0.2,1)',
          transform: state === 'held' ? 'scale(1)' : 'scale(0.86)'
        }}>
            <Icon name={state === 'released' ? 'lock-open' : 'lock'} size={14} strokeWidth={2.2} />
          </span>
        }
      </div>
      <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
          color: '#0A0A0A'
        }}>{label}</div>
        {sublabel && <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: '#71717A', marginTop: 2
        }}>{sublabel}</div>}
      </div>
    </div>);

}

function EscrowFlow() {
  const reduce = usePrefersReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduce) {setPhase(4);return;}
    const t = setTimeout(
      () => setPhase((p) => (p + 1) % FLOW_PHASES.length),
      FLOW_DURATIONS[phase] ?? 2000
    );
    return () => clearTimeout(t);
  }, [phase, reduce]);

  const ph = FLOW_PHASES[phase];
  const released = phase === 4;
  const custState = phase >= 1 && phase <= 3 ? 'held' : released ? 'released' : 'idle';
  const moving = phase === 1 || phase === 4;

  return (
    <section id="fluxo" style={{ padding: '128px 0 120px', background: '#FAFAFA', borderBottom: '1px solid #E4E4E7' }}>
      <Container maxWidth={1040}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
          <Eyebrow color="#1E4BA0">O fluxo</Eyebrow>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(32px, 4.4vw, 54px)', letterSpacing: '-0.024em',
            lineHeight: 1.04, margin: '16px 0 18px', color: '#0A0A0A', textWrap: 'balance'
          }}>
            Veja para onde o seu dinheiro vai.
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.3vw, 18px)',
            lineHeight: 1.6, color: '#52525B', margin: 0
          }}>
            Escrow é simples quando você vê acontecer: o pagamento fica num lugar neutro
            e só é liberado depois que a entrega é cumprida.
          </p>
        </div>

        {/* ── Track ───────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          background: '#fff', border: '1px solid #E4E4E7', borderRadius: 24,
          padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 72px) clamp(28px, 4vw, 40px)',
          boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 24px 60px -32px rgba(10,10,10,0.18)',
          overflow: 'hidden'
        }}>
          {/* rail behind nodes */}
          <div style={{ position: 'relative', height: 'clamp(96px, 12vw, 116px)' }}>
            <div aria-hidden style={{
              position: 'absolute', left: '12%', right: '12%', top: 'clamp(36px, 4.5vw, 46px)',
              height: 2,
              backgroundImage: 'repeating-linear-gradient(90deg, #D4D4D8 0, #D4D4D8 5px, transparent 5px, transparent 11px)'
            }} />
            {/* progress fill on the rail */}
            <div aria-hidden style={{
              position: 'absolute', left: '12%', top: 'clamp(36px, 4.5vw, 46px)',
              height: 2, background: released ? '#16794C' : '#1E4BA0',
              width: phase === 0 ? '0%' : phase >= 4 ? '76%' : '38%',
              transition: 'width 1500ms cubic-bezier(0.4,0,0.2,1), background 500ms'
            }} />

            {/* nodes */}
            <div style={{ position: 'absolute', left: '12%', top: 0, transform: 'translateX(-50%)' }}>
              <FlowNode icon="user" label="Comprador" sublabel="paga" active={phase === 0} />
            </div>
            <div style={{ position: 'absolute', left: '50%', top: '-4px', transform: 'translateX(-50%)' }}>
              <FlowNode icon="shield-check" label="Dalivim" sublabel="custódia neutra" emphasis active={phase >= 1 && phase <= 3} state={custState} />
            </div>
            <div style={{ position: 'absolute', left: '88%', top: 0, transform: 'translateX(-50%)' }}>
              <FlowNode icon="store" label="Vendedor" sublabel="entrega" active={released} />
            </div>

            {/* travelling money token */}
            <div style={{
              position: 'absolute', left: ph.left, top: 'clamp(20px, 2.6vw, 28px)',
              transform: 'translateX(-50%)',
              transition: `left ${moving ? 1500 : 600}ms cubic-bezier(0.45,0,0.2,1)`,
              zIndex: 3
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 13px', borderRadius: 9999,
                background: released ? '#16794C' : '#0A0A0A', color: '#fff',
                fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.02em', whiteSpace: 'nowrap',
                boxShadow: released ?
                '0 10px 24px -10px rgba(22,121,76,0.6)' :
                '0 10px 24px -10px rgba(10,10,10,0.5)',
                transition: 'background 400ms, box-shadow 400ms'
              }}>
                <Icon name={released ? 'check' : 'pix'} size={14} strokeWidth={2.2} />
                {released ? 'liberado' : 'R$ 3.000'}
              </span>
            </div>
          </div>

          {/* ── Caption ── */}
          <div style={{
            marginTop: 'clamp(28px, 4vw, 44px)', paddingTop: 28,
            borderTop: '1px solid #F0F0F2', textAlign: 'center', minHeight: 78
          }}>
            <div key={phase} style={{ animation: reduce ? 'none' : 'dv-fade-in 420ms cubic-bezier(0.2,0.6,0.2,1)' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                fontSize: 'clamp(19px, 2vw, 24px)', letterSpacing: '-0.014em',
                color: '#0A0A0A', lineHeight: 1.25
              }}>{ph.caption}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 'clamp(13.5px, 1.1vw, 15px)',
                color: '#71717A', marginTop: 8, lineHeight: 1.5
              }}>{ph.note}</div>
            </div>
          </div>

          {/* ── Step rail ── */}
          <div style={{
            marginTop: 26, display: 'flex', justifyContent: 'center',
            gap: 'clamp(6px, 2vw, 18px)', flexWrap: 'wrap'
          }}>
            {FLOW_STEPS.map((label, i) => {
              const on = i <= ph.step;
              const current = i === ph.step;
              return (
                <span key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                  color: on ? '#0A0A0A' : '#A1A1AA',
                  transition: 'color 400ms'
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 9999, flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 600,
                    background: current ? released && i === 3 ? '#16794C' : '#1E4BA0' : on ? '#0A0A0A' : '#F4F4F5',
                    color: on || current ? '#fff' : '#A1A1AA',
                    transition: 'background 400ms, color 400ms'
                  }}>{i + 1}</span>
                  {label}
                </span>);

            })}
          </div>
        </div>
      </Container>
    </section>);

}

Object.assign(window, { EscrowFlow });