// Nova Transação — 3-step wizard (like the hero micro-experience)

function NovaTransacao({ onCreated }) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState('servico');
  const [value, setValue] = useState(1500);
  const [title, setTitle] = useState('');
  const [counter, setCounter] = useState('');
  const [order, setOrder] = useState('pagamento');
  const [done, setDone] = useState(false);

  const nextFrom1 = () => title.trim() && counter.trim() && setStep(2);
  const nextFrom2 = () => value >= 50 && setStep(3);
  const create = () => {
    const id = 'TX-' + Math.random().toString(16).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
    const tx = {
      id, title, counter, value, tipo,
      state: order === 'pagamento' ? 'aguardando' : 'custodia',
      when: 'agora', ts: Date.now(),
    };
    setDone(true);
    onCreated(tx);
  };

  if (done) {
    return (
      <div style={{ padding: '60px 40px', animation: 'dv-fade-in 300ms' }}>
        <div style={{
          maxWidth: 520, margin: '0 auto', textAlign: 'center',
          background: '#fff', border: '1px solid #E4E4E7', borderRadius: 20, padding: 40,
        }}>
          <span style={{
            width: 56, height: 56, borderRadius: 9999, background: '#E8F2EC',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#16794C', marginBottom: 20,
          }}>
            <Icon name="check" size={26} strokeWidth={2.5}/>
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 26,
            letterSpacing: '-0.018em', margin: '0 0 10px',
          }}>Transação criada.</h2>
          <p style={{ color: '#52525B', fontSize: 15, lineHeight: 1.55, margin: '0 0 24px' }}>
            Enviamos o link para <strong style={{ color: '#0A0A0A' }}>{counter}</strong>. O valor fica protegido até a confirmação da entrega.
          </p>
          <button onClick={() => { setDone(false); setStep(1); setTitle(''); setCounter(''); setValue(1500); }}
            style={{
              all: 'unset', cursor: 'pointer',
              padding: '12px 20px', background: '#0A0A0A', color: '#fff', borderRadius: 9999,
              fontSize: 14, fontWeight: 500,
            }}>Criar outra transação</button>
        </div>
      </div>
    );
  }

  const pctMap = { 1: 30, 2: 65, 3: 100 };
  const pct = pctMap[step];

  return (
    <div style={{ padding: '40px 40px 80px', animation: 'dv-fade-in 320ms' }}>
      <div style={{
        maxWidth: 640, margin: '0 auto',
        background: '#fff', border: '1px solid #E4E4E7', borderRadius: 20, padding: 36,
      }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#52525B', whiteSpace: 'nowrap' }}>
            Configuração · {step}/3
          </span>
          <div style={{ flex: 1, height: 4, background: '#F4F4F5', borderRadius: 9999 }}>
            <div style={{ width: `${pct}%`, height: '100%',
              background: 'linear-gradient(90deg, #1E4BA0, #3D6BC4)',
              borderRadius: 9999, transition: 'width 500ms cubic-bezier(0.2,0.9,0.2,1)' }}/>
          </div>
        </div>

        <div key={step} style={{ animation: 'dv-step-in 340ms' }}>
          {step === 1 && <>
            <StepTitle t="O que você está negociando?" s="Isso ajuda a configurar sua transação com segurança."/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {[
                { k: 'servico', label: 'Serviço', icon: 'briefcase', sub: 'Freelance, design, consultoria.' },
                { k: 'produto', label: 'Produto', icon: 'package', sub: 'Compra e venda de itens físicos.' },
                { k: 'outro',   label: 'Outro',   icon: 'handshake',sub: 'Qualquer acordo com garantia.' },
              ].map(o => (
                <button key={o.k} onClick={() => setTipo(o.k)} style={{
                  all: 'unset', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  background: tipo === o.k ? '#0A0A0A' : '#fff',
                  color: tipo === o.k ? '#fff' : '#0A0A0A',
                  border: '1.5px solid ' + (tipo === o.k ? '#0A0A0A' : '#E4E4E7'),
                  borderRadius: 12,
                  transition: 'all 180ms',
                }}>
                  <Icon name={o.icon} size={18}/>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{o.label}</span>
                    <span style={{ fontSize: 12.5, opacity: 0.65 }}>{o.sub}</span>
                  </span>
                  {tipo === o.k && <Icon name="check" size={15}/>}
                </button>
              ))}
            </div>
            <Field label="Título da transação">
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Landing page em Next.js"
                style={inputStyle}/>
            </Field>
            <Field label="Email de quem vai pagar">
              <input value={counter} onChange={e => setCounter(e.target.value)}
                placeholder="pagador@email.com" type="email"
                style={inputStyle}/>
            </Field>
            <Actions>
              <Button primary disabled={!title.trim() || !counter.trim()} onClick={nextFrom1}>
                Continuar <Icon name="arrow-right" size={14}/>
              </Button>
            </Actions>
          </>}

          {step === 2 && <>
            <StepTitle t="Qual o valor da transação?" s="O valor ficará protegido até a confirmação da entrega."/>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '22px 24px', border: '1.5px solid #E4E4E7', borderRadius: 14, marginBottom: 16,
            }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, color: '#A1A1AA' }}>R$</span>
              <input inputMode="numeric" value={value === 0 ? '' : value}
                placeholder="1500"
                onChange={e => setValue(Number(e.target.value.replace(/\D/g,'').slice(0,7)) || 0)}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 34,
                  letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: '#0A0A0A', minWidth: 0, width: '100%',
                }}/>
            </div>
            <div style={{
              padding: '4px 16px', background: '#FAFAFA',
              border: '1px solid #E4E4E7', borderRadius: 12, marginBottom: 20,
            }}>
              <FeeRow k="Você recebe" v={formatBRL(value)}/>
              <div style={{ borderTop: '1px dashed #E4E4E7' }}/>
              <FeeRow k="Taxa Dalivim (2,9%)" v={'− ' + formatBRL(Math.round(value * 0.029))}/>
              <div style={{ borderTop: '1px dashed #E4E4E7' }}/>
              <FeeRow k="Valor protegido" v={formatBRL(value - Math.round(value * 0.029))} strong/>
            </div>
            <Actions>
              <Button onClick={() => setStep(1)}><Icon name="arrow-left" size={14}/> Voltar</Button>
              <Button primary onClick={nextFrom2}>Continuar <Icon name="arrow-right" size={14}/></Button>
            </Actions>
          </>}

          {step === 3 && <>
            <StepTitle t="Quem vai primeiro?" s="Defina a ordem do acordo. O valor fica travado até o outro lado confirmar."/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { k: 'pagamento', t: 'Pagamento primeiro', s: 'Pagador envia Pix. Você entrega sabendo que o dinheiro está garantido.' },
                { k: 'entrega',   t: 'Entrega primeiro',   s: 'Você entrega. Pagador confirma e libera o valor já em custódia.' },
              ].map(o => (
                <button key={o.k} onClick={() => setOrder(o.k)} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '14px 18px',
                  border: '1.5px solid ' + (order === o.k ? '#0A0A0A' : '#E4E4E7'),
                  borderRadius: 12,
                  background: order === o.k ? '#0A0A0A' : '#fff',
                  color: order === o.k ? '#fff' : '#0A0A0A',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{o.t}</span>
                    <span style={{ fontSize: 12.5, opacity: 0.65 }}>{o.s}</span>
                  </span>
                  {order === o.k && <Icon name="check" size={15}/>}
                </button>
              ))}
            </div>
            <Actions>
              <Button onClick={() => setStep(2)}><Icon name="arrow-left" size={14}/> Voltar</Button>
              <Button primary onClick={create}>Criar transação segura <Icon name="arrow-right" size={14}/></Button>
            </Actions>
          </>}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #E4E4E7', borderRadius: 10,
  fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  background: '#fff', color: '#0A0A0A',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: '#52525B', fontWeight: 500, marginBottom: 6, display: 'block' }}>{label}</label>
      {children}
    </div>
  );
}

function StepTitle({ t, s }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 500,
        letterSpacing: '-0.016em', margin: '0 0 6px' }}>{t}</h3>
      <p style={{ fontSize: 13.5, color: '#71717A', margin: 0 }}>{s}</p>
    </div>
  );
}

function Actions({ children }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>{children}</div>;
}

function Button({ children, primary, disabled, onClick }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      all: 'unset',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: primary ? '12px 22px' : '12px 18px',
      borderRadius: 9999,
      background: primary ? (disabled ? '#A1A1AA' : '#0A0A0A') : 'transparent',
      color: primary ? '#fff' : '#52525B',
      fontSize: 14, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.7 : 1,
    }}>{children}</button>
  );
}

function FeeRow({ k, v, strong }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '10px 0', fontSize: 13.5,
      color: strong ? '#0A0A0A' : '#52525B',
    }}>
      <span>{k}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontVariantNumeric: 'tabular-nums',
        fontSize: strong ? 16 : 13.5, fontWeight: strong ? 500 : 400,
        color: strong ? '#1E4BA0' : '#52525B',
      }}>{v}</span>
    </div>
  );
}

Object.assign(window, { NovaTransacao });
