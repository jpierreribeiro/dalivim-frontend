// Invoices (Cobranças) — seller bills a specific buyer. Two types:
//   escrow — held until the buyer approves (protected)
//   direct — settles straight to the seller
// Same calm vocabulary and visual system as the rest of the app.

// ── List ─────────────────────────────────────────────────────────────
function InvoiceList({ invoices, onOpen, onNew }) {
  const pending = invoices.filter(i => i.status === 'pendente');
  const totalEscrow = invoices.filter(i => i.status === 'pago').reduce((s, i) => s + i.value, 0);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
        <div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(26px, 4vw, 34px)', letterSpacing: '-0.026em', lineHeight: 1.08, margin: 0, color: '#0A0A0A',
          }}>Cobranças</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: '#71717A', margin: '6px 0 0' }}>
            Envie uma cobrança para um cliente. O dinheiro fica protegido até a entrega.
          </p>
        </div>
        <span className="dv-desktop-action">
          <PrimaryButton tone="soft" onClick={onNew}>
            <Icon name="plus" size={17}/> Nova cobrança
          </PrimaryButton>
        </span>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <SummaryChip label="Em custódia" value={brl(totalEscrow)} tone="blue"/>
        <SummaryChip label="Aguardando pagamento" value={String(pending.length)} tone="amber"/>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {invoices.map(inv => {
          const meta = INVOICE_STATUS[inv.status];
          const t = TONES[meta.tone];
          return (
            <li key={inv.id}>
              <Card pad={18} hover onClick={() => onOpen(inv.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: '#F4F4F5', color: '#52525B',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name={inv.type === 'escrow' ? 'shield-check' : 'banknote'} size={20} strokeWidth={1.8}/></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inv.title}</span>
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A', marginTop: 2 }}>
                      {inv.buyer} · {inv.when}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Money value={inv.value} size={18}/>
                    <div style={{ marginTop: 5 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: t.fg,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.dot }}/>{meta.label}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      <MobileBar>
        <PrimaryButton full tone="soft" onClick={onNew}>
          <Icon name="plus" size={17}/> Nova cobrança
        </PrimaryButton>
      </MobileBar>
    </div>
  );
}

function SummaryChip({ label, value, tone }) {
  const t = TONES[tone];
  return (
    <div style={{ flex: '1 1 0', minWidth: 140, padding: '14px 16px', background: '#fff', border: '1px solid #ECECEF', borderRadius: 16 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#71717A', marginBottom: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: 9999, background: t.dot }}/>{label}
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 500, color: '#0A0A0A', letterSpacing: '-0.018em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

// ── Detail ───────────────────────────────────────────────────────────
function InvoiceDetail({ inv, onBack, onAction }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(null); // 'release' | 'cancel'
  const meta = INVOICE_STATUS[inv.status];
  const t = TONES[meta.tone];
  const isEscrow = inv.type === 'escrow';
  const link = `dalivim.com/c/${inv.id.toLowerCase().replace('-', '')}`;

  // Seller's next action for this invoice
  const head = inv.status === 'pendente'
    ? { kind: 'wait', line: 'Cobrança enviada. Aguardando o pagamento do cliente.' }
    : inv.status === 'pago' && isEscrow
    ? { kind: 'do', line: 'O cliente pagou. Confirme a entrega para liberar o valor.' }
    : inv.status === 'liberado'
    ? { kind: 'done', line: 'Pagamento liberado para você. Cobrança concluída.' }
    : inv.status === 'cancelada'
    ? { kind: 'wait', line: 'Esta cobrança foi cancelada.' }
    : { kind: 'wait', line: meta.money };

  const copy = () => { navigator.clipboard && navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <button type="button" onClick={onBack}
        onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
        onMouseLeave={e => e.currentTarget.style.color = '#71717A'}
        style={{
          all: 'unset', cursor: 'pointer', color: '#71717A',
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22,
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, transition: 'color 140ms',
        }}>
        <Icon name="arrow-left" size={16}/> Cobranças
      </button>

      {/* status line */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 22,
        padding: '18px 20px', borderRadius: 14,
        background: head.kind === 'do' ? '#EEF3FB' : head.kind === 'done' ? '#E8F2EC' : '#FAFAFA',
        border: '1px solid ' + (head.kind === 'do' ? '#DCE7F6' : head.kind === 'done' ? '#CDE6D8' : '#ECECEE'),
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9999, flexShrink: 0, marginTop: 1,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: head.kind === 'do' ? '#1E4BA0' : head.kind === 'done' ? '#16794C' : '#F0F0F1',
          color: head.kind === 'wait' ? '#A1A1AA' : '#fff',
        }}>
          <Icon name={head.kind === 'done' ? 'check' : head.kind === 'do' ? 'arrow-right' : 'clock'} size={15} strokeWidth={2}/>
        </span>
        <div style={{ minWidth: 0 }}>
          <Eyebrow color={head.kind === 'do' ? '#5277B8' : head.kind === 'done' ? '#3F8463' : '#A1A1AA'} style={{ marginBottom: 3 }}>Sua próxima ação</Eyebrow>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: 500, lineHeight: 1.4, color: '#0A0A0A' }}>{head.line}</div>
        </div>
      </div>

      {/* title + amount */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
        <div style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 9 }}>{inv.id} · {isEscrow ? 'Escrow' : 'Direto'}</Eyebrow>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-0.026em', lineHeight: 1.08, margin: 0, color: '#0A0A0A',
          }}>{inv.title}</h1>
        </div>
        <Money value={inv.value} size={28}/>
      </div>

      {/* recipient + type cards */}
      <Card pad={0} style={{ marginBottom: 18 }}>
        <Row k="Cliente" v={inv.buyer}/>
        <Row k="E-mail" v={inv.buyerEmail}/>
        <Row k="Tipo" v={isEscrow ? 'Escrow — protegido até a entrega' : 'Direto — sem custódia'}/>
        <Row k="Taxa da plataforma" v={brl(inv.fee)}/>
        <Row k="Total ao cliente" v={brl(inv.total)} last strong/>
      </Card>

      {/* description */}
      {inv.desc && (
        <div style={{ marginBottom: 18 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Descrição</Eyebrow>
          <Card pad={18}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.55, color: '#3F3F46', margin: 0 }}>{inv.desc}</p>
          </Card>
        </div>
      )}

      {/* share link — only while awaiting payment */}
      {inv.status === 'pendente' && (
        <div style={{ marginBottom: 18 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Link de pagamento</Eyebrow>
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            <div style={{
              flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '0 16px',
              background: '#fff', border: '1.5px solid #E4E4E7', borderRadius: 12,
              fontFamily: 'ui-monospace, monospace', fontSize: 13.5, color: '#52525B',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{link}</div>
            <button type="button" onClick={copy} style={{
              all: 'unset', cursor: 'pointer', flexShrink: 0, padding: '12px 18px', borderRadius: 12,
              background: copied ? '#E8F2EC' : '#0A0A0A', color: copied ? '#16794C' : '#fff',
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'background 160ms',
            }}>
              <Icon name={copied ? 'check' : 'message'} size={15} strokeWidth={2.2}/>{copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
      )}

      {/* actions */}
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {head.kind === 'do' && (
          <PrimaryButton full tone="action" onClick={() => setConfirming('release')}>
            Confirmar entrega e liberar
          </PrimaryButton>
        )}
        {inv.status === 'pendente' && (
          <QuietLink color="#B42318" onClick={() => setConfirming('cancel')}>Cancelar cobrança</QuietLink>
        )}
      </div>

      {confirming === 'release' && (
        <Overlay onClose={() => setConfirming(null)}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 500, letterSpacing: '-0.018em', margin: '0 0 8px', color: '#0A0A0A' }}>Liberar o pagamento?</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.5, color: '#52525B', margin: '0 0 18px' }}>
            Os {brl(inv.value)} reservados são liberados para você. Confirme que o combinado foi entregue — esta ação não pode ser desfeita.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <PrimaryButton full onClick={() => { onAction(inv.id, 'liberado'); setConfirming(null); }}>Liberar pagamento</PrimaryButton>
            <GhostButton full onClick={() => setConfirming(null)}>Voltar</GhostButton>
          </div>
        </Overlay>
      )}
      {confirming === 'cancel' && (
        <Overlay onClose={() => setConfirming(null)}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 500, letterSpacing: '-0.018em', margin: '0 0 8px', color: '#0A0A0A' }}>Cancelar esta cobrança?</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.5, color: '#52525B', margin: '0 0 18px' }}>
            O link de pagamento para de funcionar e o cliente não poderá mais pagar.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <PrimaryButton full tone="danger" onClick={() => { onAction(inv.id, 'cancelada'); setConfirming(null); }}>Cancelar cobrança</PrimaryButton>
            <GhostButton full onClick={() => setConfirming(null)}>Voltar</GhostButton>
          </div>
        </Overlay>
      )}
    </div>
  );

  function Row({ k, v, strong, last }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '15px 20px', borderBottom: last ? 'none' : '1px solid #F4F4F5' }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#A1A1AA' }}>{k}</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: strong ? 600 : 500, color: '#0A0A0A', textAlign: 'right', maxWidth: '62%' }}>{v}</span>
      </div>
    );
  }
}

// ── New invoice (Nova cobrança) ──────────────────────────────────────
function NewInvoice({ onCancel, onCreate }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ buyer: '', buyerEmail: '', title: '', desc: '', value: 0, type: 'escrow' });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  const STEPS = [
    { q: 'Para quem é a cobrança?' },
    { q: 'O que está sendo cobrado?' },
    { q: 'Como o pagamento funciona?' },
  ];
  const valid = [
    () => d.buyer.trim() && d.buyerEmail.trim(),
    () => d.title.trim().length >= 3 && d.value >= 50,
    () => !!d.type,
  ];
  const isReview = step === STEPS.length;
  const canNext = isReview || valid[step]();
  const next = () => { if (canNext) setStep(s => s + 1); };
  const back = () => (step === 0 ? onCancel() : setStep(s => s - 1));
  const fee = feeOf(d.value), total = d.value + fee;
  const pct = isReview ? 100 : Math.round(((step + 1) / (STEPS.length + 1)) * 100);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A1A1AA', whiteSpace: 'nowrap',
        }}>{isReview ? 'Resumo' : `Passo ${step + 1} de ${STEPS.length}`}</span>
        <div style={{ flex: 1, height: 4, background: '#EDEDEF', borderRadius: 9999 }}>
          <div style={{ width: pct + '%', height: '100%', background: '#1E4BA0', borderRadius: 9999, transition: 'width 460ms cubic-bezier(0.2,0.8,0.2,1)' }}/>
        </div>
      </div>

      {!isReview && (
        <h1 key={step} style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 'clamp(26px, 4.2vw, 36px)', letterSpacing: '-0.026em', lineHeight: 1.05,
          margin: '0 0 24px', color: '#0A0A0A', animation: 'dv-step 360ms ease',
        }}>{STEPS[step].q}</h1>
      )}

      <div key={'b' + step} style={{ animation: 'dv-step 360ms ease' }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <InvField label="Nome do cliente" value={d.buyer} onChange={v => set('buyer', v)} placeholder="Ex: Carolina Dias" autoFocus/>
            <InvField label="E-mail do cliente" value={d.buyerEmail} onChange={v => set('buyerEmail', v)} placeholder="carolina@email.com"/>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#A1A1AA', margin: '2px', lineHeight: 1.5 }}>
              Enviaremos o link de pagamento para este e-mail.
            </p>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InvField label="Título" value={d.title} onChange={v => set('title', v)} placeholder="Ex: Consultoria de marketing — junho" autoFocus/>
            <div>
              <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#52525B', marginBottom: 7 }}>Valor</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', border: '1.5px solid #E4E4E7', borderRadius: 14 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, color: '#C4C4C9' }}>R$</span>
                <input inputMode="numeric" value={d.value === 0 ? '' : d.value} placeholder="0"
                  onChange={e => set('value', Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 0)}
                  style={{
                    flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 30,
                    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: '#0A0A0A',
                  }}/>
              </div>
            </div>
            <textarea value={d.desc} onChange={e => set('desc', e.target.value)} rows={3}
              placeholder="Descrição (opcional) — o que está incluído."
              style={{
                width: '100%', boxSizing: 'border-box', padding: '14px 16px', border: '1.5px solid #E4E4E7',
                borderRadius: 14, resize: 'vertical', fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.5, color: '#0A0A0A', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#1E4BA0'} onBlur={e => e.target.style.borderColor = '#E4E4E7'}/>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BigOption icon="shield-check" title="Escrow — protegido" sub="O dinheiro fica reservado até você confirmar a entrega. Recomendado."
              selected={d.type === 'escrow'} onClick={() => set('type', 'escrow')}/>
            <BigOption icon="banknote" title="Direto" sub="O pagamento cai direto para você, sem custódia."
              selected={d.type === 'direct'} onClick={() => set('type', 'direct')}/>
          </div>
        )}

        {isReview && (
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 'clamp(26px, 4.2vw, 36px)', letterSpacing: '-0.026em', lineHeight: 1.05,
              margin: '0 0 6px', color: '#0A0A0A',
            }}>Tudo certo?</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#71717A', margin: '0 0 22px' }}>
              Enviaremos o link de pagamento para {d.buyer}.
            </p>
            <Card pad={0}>
              <div style={{ padding: '20px 22px', borderBottom: '1px solid #F0F0F1' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>{d.title}</div>
                <Money value={d.value} size={28}/>
              </div>
              <div style={{ padding: '8px 22px' }}>
                {[['Cliente', d.buyer], ['E-mail', d.buyerEmail], ['Tipo', d.type === 'escrow' ? 'Escrow — protegido' : 'Direto']].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: i < 2 ? '1px solid #F4F4F5' : 'none' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#A1A1AA' }}>{k}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500, color: '#0A0A0A', textAlign: 'right', maxWidth: '62%' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '15px 0 16px' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#A1A1AA' }}>Total ao cliente</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 500, color: '#1E4BA0', fontVariantNumeric: 'tabular-nums' }}>{brl(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="dv-desktop-action" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30 }}>
        {isReview
          ? <PrimaryButton key="inv-create" full onClick={() => onCreate(d)}>Enviar cobrança</PrimaryButton>
          : <PrimaryButton key="inv-next" full disabled={!canNext} onClick={next}>Continuar</PrimaryButton>}
        <GhostButton full onClick={back}>
          <Icon name="arrow-left" size={15}/> {step === 0 ? 'Cancelar' : 'Voltar'}
        </GhostButton>
      </div>
      <MobileBar>
        {isReview
          ? <PrimaryButton key="inv-create-m" full onClick={() => onCreate(d)}>Enviar cobrança</PrimaryButton>
          : <PrimaryButton key="inv-next-m" full disabled={!canNext} onClick={next}>Continuar</PrimaryButton>}
        <GhostButton full onClick={back}>
          <Icon name="arrow-left" size={15}/> {step === 0 ? 'Cancelar' : 'Voltar'}
        </GhostButton>
      </MobileBar>
    </div>
  );
}

function InvField({ label, value, onChange, placeholder, autoFocus }) {
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

Object.assign(window, { InvoiceList, InvoiceDetail, NewInvoice });
