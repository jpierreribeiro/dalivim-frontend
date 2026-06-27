// Wizard — create a protected negotiation. One decision per screen.
// Flow: tipo → quem cria → valor → descrição → convidar → liberação → resumo.

const STEPS = [
  { key: 'tipo',      q: 'O que será negociado?' },
  { key: 'lado',      q: 'Quem está criando?' },
  { key: 'valor',     q: 'Qual o valor?' },
  { key: 'descricao', q: 'O que foi combinado?' },
  { key: 'convite',   q: 'Quem é a outra parte?' },
  { key: 'liberacao', q: 'Quando liberar o pagamento?' },
];

const LIBERACAO_LABEL = {
  confirmacao: 'Após a confirmação do cliente',
  prazo:       'Automaticamente em 7 dias',
  data:        'Em uma data específica',
};

function Wizard({ persona, onCancel, onCreate }) {
  const [step, setStep] = useState(0);     // 0..5 config, 6 = resumo
  const [d, setD] = useState({
    tipo: '', lado: persona, value: 0, desc: '',
    name: '', contact: '', liberacao: 'confirmacao',
  });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  const valid = [
    () => !!d.tipo,
    () => !!d.lado,
    () => d.value >= 50,
    () => d.desc.trim().length >= 8,
    () => d.name.trim() && d.contact.trim(),
    () => !!d.liberacao,
  ];
  const isReview = step === STEPS.length;
  const canNext = isReview || valid[step]();
  const next = () => { if (canNext) setStep(s => s + 1); };
  const back = () => (step === 0 ? onCancel() : setStep(s => s - 1));

  const fee = feeOf(d.value), total = d.value + fee;
  const pct = isReview ? 100 : Math.round(((step + 1) / (STEPS.length + 1)) * 100);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A1A1AA', whiteSpace: 'nowrap',
        }}>{isReview ? 'Resumo' : `Passo ${step + 1} de ${STEPS.length}`}</span>
        <div style={{ flex: 1, height: 4, background: '#EDEDEF', borderRadius: 9999 }}>
          <div style={{
            width: pct + '%', height: '100%', background: '#1E4BA0', borderRadius: 9999,
            transition: 'width 460ms cubic-bezier(0.2,0.8,0.2,1)',
          }}/>
        </div>
      </div>

      {!isReview && (
        <h1 key={step} style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 'clamp(28px, 4.4vw, 38px)', letterSpacing: '-0.026em', lineHeight: 1.05,
          margin: '0 0 26px', color: '#0A0A0A', animation: 'dv-step 360ms ease',
        }}>{STEPS[step].q}</h1>
      )}

      <div key={'b' + step} style={{ animation: 'dv-step 360ms ease' }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(TIPO_META).map(([k, m]) => (
              <BigOption key={k} icon={m.icon} title={m.label}
                sub={k === 'produto' ? 'Algo físico que será entregue'
                  : k === 'servico' ? 'Um trabalho a ser realizado'
                  : 'Qualquer combinado com garantia'}
                selected={d.tipo === k} onClick={() => { set('tipo', k); }}/>
            ))}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BigOption icon="user" title="Sou o cliente" sub="Vou pagar e receber"
              selected={d.lado === 'comprador'} onClick={() => set('lado', 'comprador')}/>
            <BigOption icon="store" title="Sou o prestador" sub="Vou entregar e receber o pagamento"
              selected={d.lado === 'vendedor'} onClick={() => set('lado', 'vendedor')}/>
          </div>
        )}

        {step === 2 && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '22px 24px', border: '1.5px solid #E4E4E7', borderRadius: 16, marginBottom: 16,
            }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, color: '#C4C4C9' }}>R$</span>
              <input autoFocus inputMode="numeric" value={d.value === 0 ? '' : d.value} placeholder="0"
                onChange={e => set('value', Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 0)}
                style={{
                  flex: 1, minWidth: 0, width: '100%', border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 44,
                  letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', color: '#0A0A0A',
                }}/>
            </div>
            <FeeBox value={d.value} fee={fee} total={total}/>
          </>
        )}

        {step === 3 && (
          <>
            <textarea autoFocus value={d.desc} onChange={e => set('desc', e.target.value)}
              placeholder={'Ex: "Notebook Dell Latitude 5420, i5, 16 GB RAM. Envio pelos Correios."'}
              rows={5}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '16px 18px',
                border: '1.5px solid #E4E4E7', borderRadius: 16, resize: 'vertical',
                fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.5, color: '#0A0A0A',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#1E4BA0'}
              onBlur={e => e.target.style.borderColor = '#E4E4E7'}/>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#A1A1AA', margin: '12px 2px 0', lineHeight: 1.5 }}>
              Esta descrição serve como referência caso algo dê errado.
            </p>
          </>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FieldInput label="Nome" value={d.name} onChange={v => set('name', v)} placeholder="Ex: Maria Santos" autoFocus/>
            <FieldInput label="E-mail ou telefone" value={d.contact} onChange={v => set('contact', v)} placeholder="maria@email.com"/>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#A1A1AA', margin: '2px', lineHeight: 1.5 }}>
              Enviaremos um convite para ela participar. Nada além disso por agora.
            </p>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BigOption title="Quando o cliente confirmar" sub="Recomendado — mais seguro para os dois"
              selected={d.liberacao === 'confirmacao'} onClick={() => set('liberacao', 'confirmacao')}/>
            <BigOption title="Automaticamente em 7 dias" sub="Se ninguém abrir uma disputa antes"
              selected={d.liberacao === 'prazo'} onClick={() => set('liberacao', 'prazo')}/>
            <BigOption title="Em uma data específica" sub="Você escolhe o dia da liberação"
              selected={d.liberacao === 'data'} onClick={() => set('liberacao', 'data')}/>
          </div>
        )}

        {isReview && (
          <Review d={d} fee={fee} total={total}/>
        )}
      </div>

      {/* Footer actions — one primary action per screen. On phones it anchors
          to the bottom thumb zone; on desktop it sits inline under the form. */}
      <div className="dv-desktop-action" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30 }}>
        {isReview
          ? <PrimaryButton full onClick={() => onCreate(d)}>Criar negociação protegida</PrimaryButton>
          : <PrimaryButton full disabled={!canNext} onClick={next}>Continuar</PrimaryButton>}
        <GhostButton full onClick={back}>
          <Icon name="arrow-left" size={15}/> {step === 0 ? 'Cancelar' : 'Voltar'}
        </GhostButton>
      </div>

      <MobileBar>
        {isReview
          ? <PrimaryButton full onClick={() => onCreate(d)}>Criar negociação protegida</PrimaryButton>
          : <PrimaryButton full disabled={!canNext} onClick={next}>Continuar</PrimaryButton>}
        <GhostButton full onClick={back}>
          <Icon name="arrow-left" size={15}/> {step === 0 ? 'Cancelar' : 'Voltar'}
        </GhostButton>
      </MobileBar>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────
function BigOption({ icon, title, sub, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        all: 'unset', boxSizing: 'border-box', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
        borderRadius: 16, background: '#fff',
        border: '1.5px solid ' + (selected ? '#0A0A0A' : '#E7E7EA'),
        transition: 'border-color 150ms',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = '#C4C4C9'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = '#E7E7EA'; }}>
      {icon && (
        <span style={{
          width: 46, height: 46, borderRadius: 13, flexShrink: 0,
          background: selected ? '#0A0A0A' : '#F4F4F5', color: selected ? '#fff' : '#52525B',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms',
        }}><Icon name={icon} size={20} strokeWidth={1.8}/></span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 16.5, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.01em' }}>{title}</span>
        {sub && <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#71717A', marginTop: 2 }}>{sub}</span>}
      </span>
      <span style={{
        width: 22, height: 22, borderRadius: 9999, flexShrink: 0,
        border: '1.5px solid ' + (selected ? '#0A0A0A' : '#D4D4D8'),
        background: selected ? '#0A0A0A' : '#fff', color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms',
      }}>{selected && <Icon name="check" size={13} strokeWidth={3}/>}</span>
    </button>
  );
}

function FieldInput({ label, value, onChange, placeholder, autoFocus }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#52525B', marginBottom: 7 }}>{label}</span>
      <input autoFocus={autoFocus} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={e => e.target.style.borderColor = '#1E4BA0'}
        onBlur={e => e.target.style.borderColor = '#E4E4E7'}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '14px 16px',
          border: '1.5px solid #E4E4E7', borderRadius: 14,
          fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#0A0A0A', outline: 'none',
        }}/>
    </label>
  );
}

function FeeBox({ value, fee, total }) {
  return (
    <div style={{ background: '#FAFAFA', border: '1px solid #ECECEE', borderRadius: 14, padding: '6px 18px' }}>
      <FeeRow k="Valor combinado" v={brl(value)}/>
      <div style={{ borderTop: '1px dashed #E4E4E7' }}/>
      <FeeRow k="Taxa da plataforma" v={brl(fee)}/>
      <div style={{ borderTop: '1px dashed #E4E4E7' }}/>
      <FeeRow k="Total" v={brl(total)} strong/>
    </div>
  );
}
function FeeRow({ k, v, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0' }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: strong ? '#0A0A0A' : '#71717A', fontWeight: strong ? 600 : 400 }}>{k}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontVariantNumeric: 'tabular-nums',
        fontSize: strong ? 18 : 14.5, fontWeight: 500, color: strong ? '#0A0A0A' : '#52525B',
      }}>{v}</span>
    </div>
  );
}

function Review({ d, fee, total }) {
  const rows = [
    ['Tipo', (TIPO_META[d.tipo] || {}).label],
    ['Você é', d.lado === 'comprador' ? 'Cliente' : 'Prestador'],
    ['Outra parte', d.name],
    ['Liberação', LIBERACAO_LABEL[d.liberacao]],
  ];
  return (
    <div>
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 'clamp(28px, 4.4vw, 38px)', letterSpacing: '-0.026em', lineHeight: 1.05,
        margin: '0 0 6px', color: '#0A0A0A',
      }}>Tudo certo?</h1>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#71717A', margin: '0 0 22px' }}>
        Confira antes de criar. Você pode voltar e ajustar.
      </p>
      <Card pad={0}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #F0F0F1' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>{d.desc.split('\n')[0].slice(0, 70) || 'Negociação'}</div>
          <Money value={d.value} size={30}/>
        </div>
        <div style={{ padding: '8px 24px' }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: i < rows.length - 1 ? '1px solid #F4F4F5' : 'none' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#A1A1AA' }}>{k}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500, color: '#0A0A0A', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '15px 0 16px' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#A1A1AA' }}>Total com taxa</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 500, color: '#1E4BA0', fontVariantNumeric: 'tabular-nums' }}>{brl(total)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Wizard });
