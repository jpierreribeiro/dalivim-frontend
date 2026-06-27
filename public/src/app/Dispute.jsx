// Dispute — the mediation surface. Two parts:
//   DisputeFlow   — open a dispute (reason → details + provas → desfecho → revisão)
//   DisputeDetail — follow an open dispute (proteção, etapas, alegação, resposta)
// Same calm, non-technical voice as the rest of the app. The money is safe;
// the screen's job is to lower anxiety and make the next step obvious.

// ── Open-a-dispute flow ──────────────────────────────────────────────
function DisputeFlow({ n, persona, onCancel, onSubmit }) {
  const STEPS = [
    { key: 'reason',  q: 'O que aconteceu?' },
    { key: 'details', q: 'Conte o que houve.' },
    { key: 'outcome', q: 'Como quer resolver?' },
  ];
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ reason: '', claim: '', evidence: [], outcome: '' });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  const valid = [
    () => !!d.reason,
    () => d.claim.trim().length >= 10,
    () => !!d.outcome,
  ];
  const isReview = step === STEPS.length;
  const canNext = isReview || valid[step]();
  const next = () => { if (canNext) setStep(s => s + 1); };
  const back = () => (step === 0 ? onCancel() : setStep(s => s - 1));
  const pct = isReview ? 100 : Math.round(((step + 1) / (STEPS.length + 1)) * 100);

  const addEvidence = () => {
    const label = ['Foto do problema', 'Comprovante', 'Conversa', 'Anúncio original', 'Vídeo'][d.evidence.length % 5];
    set('evidence', [...d.evidence, label + ' ' + (d.evidence.length + 1)]);
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <button type="button" onClick={onCancel}
        onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
        onMouseLeave={e => e.currentTarget.style.color = '#71717A'}
        style={{
          all: 'unset', cursor: 'pointer', color: '#71717A',
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22,
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, transition: 'color 140ms',
        }}>
        <Icon name="arrow-left" size={16}/> {n.title}
      </button>

      {/* Reassurance — the money is safe while this happens */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
        background: '#EEF3FB', border: '1px solid #DCE7F6', borderRadius: 14, marginBottom: 26,
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9999, flexShrink: 0, background: '#fff', color: '#1E4BA0',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
        }}><Icon name="lock" size={15}/></span>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.45, color: '#27406B' }}>
          <strong style={{ fontWeight: 600, color: '#15356E' }}>Seu dinheiro continua protegido.</strong> Os {brl(n.value)} seguem reservados com a Dalivim — ninguém recebe nada enquanto a disputa estiver aberta.
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A1A1AA', whiteSpace: 'nowrap',
        }}>{isReview ? 'Revisão' : `Passo ${step + 1} de ${STEPS.length}`}</span>
        <div style={{ flex: 1, height: 4, background: '#EDEDEF', borderRadius: 9999 }}>
          <div style={{ width: pct + '%', height: '100%', background: '#C0450F', borderRadius: 9999, transition: 'width 460ms cubic-bezier(0.2,0.8,0.2,1)' }}/>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DISPUTE_REASONS.map(r => (
              <BigOption key={r.k} icon={r.icon} title={r.label} sub={r.sub}
                selected={d.reason === r.k} onClick={() => set('reason', r.k)}/>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <textarea autoFocus value={d.claim} onChange={e => set('claim', e.target.value)}
              placeholder={'Descreva o que aconteceu, com datas e detalhes. Quanto mais claro, mais rápido a Dalivim resolve.'}
              rows={5}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '16px 18px',
                border: '1.5px solid #E4E4E7', borderRadius: 16, resize: 'vertical',
                fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.5, color: '#0A0A0A', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#C0450F'}
              onBlur={e => e.target.style.borderColor = '#E4E4E7'}/>

            {/* Evidence */}
            <div style={{ marginTop: 18 }}>
              <Eyebrow style={{ marginBottom: 10 }}>Provas (opcional, mas ajudam)</Eyebrow>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {d.evidence.map((ev, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                    background: '#F4F4F5', border: '1px solid #ECECEF', borderRadius: 10,
                    fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#3F3F46',
                  }}>
                    <Icon name="check" flat size={13} color="#16794C" strokeWidth={3}/>{ev}
                    <button type="button" onClick={() => set('evidence', d.evidence.filter((_, j) => j !== i))}
                      style={{ all: 'unset', cursor: 'pointer', color: '#A1A1AA', display: 'inline-flex' }}>
                      <Icon name="x" flat size={13}/>
                    </button>
                  </span>
                ))}
                <button type="button" onClick={addEvidence} style={{
                  all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 14px', border: '1.5px dashed #C7C7CE', borderRadius: 10,
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#52525B',
                }}>
                  <Icon name="plus" flat size={14}/> Anexar prova
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DISPUTE_OUTCOMES.map(o => (
              <BigOption key={o.k} icon={o.icon} title={o.label} sub={o.sub}
                selected={d.outcome === o.k} onClick={() => set('outcome', o.k)}/>
            ))}
          </div>
        )}

        {isReview && <DisputeReview n={n} d={d}/>}
      </div>

      <div className="dv-desktop-action" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30 }}>
        {isReview
          ? <PrimaryButton key="d-submit" full tone="danger" onClick={() => onSubmit(n.id, d)}>Abrir disputa</PrimaryButton>
          : <PrimaryButton key="d-next" full disabled={!canNext} onClick={next}>Continuar</PrimaryButton>}
        <GhostButton full onClick={back}>
          <Icon name="arrow-left" size={15}/> {step === 0 ? 'Cancelar' : 'Voltar'}
        </GhostButton>
      </div>

      <MobileBar>
        {isReview
          ? <PrimaryButton key="d-submit-m" full tone="danger" onClick={() => onSubmit(n.id, d)}>Abrir disputa</PrimaryButton>
          : <PrimaryButton key="d-next-m" full disabled={!canNext} onClick={next}>Continuar</PrimaryButton>}
        <GhostButton full onClick={back}>
          <Icon name="arrow-left" size={15}/> {step === 0 ? 'Cancelar' : 'Voltar'}
        </GhostButton>
      </MobileBar>
    </div>
  );
}

function DisputeReview({ n, d }) {
  const rows = [
    ['Motivo', DISPUTE_REASON_LABEL[d.reason]],
    ['Você quer', DISPUTE_OUTCOME_LABEL[d.outcome]],
    ['Provas anexadas', d.evidence.length ? `${d.evidence.length} ${d.evidence.length === 1 ? 'arquivo' : 'arquivos'}` : 'Nenhuma'],
  ];
  return (
    <div>
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 'clamp(26px, 4.2vw, 36px)', letterSpacing: '-0.026em', lineHeight: 1.05,
        margin: '0 0 6px', color: '#0A0A0A',
      }}>Confira antes de enviar</h1>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#71717A', margin: '0 0 22px' }}>
        A outra parte será avisada e terá até 5 dias para responder.
      </p>
      <Card pad={0}>
        <div style={{ padding: '20px 22px', borderBottom: '1px solid #F0F0F1' }}>
          <Eyebrow style={{ marginBottom: 8 }}>O que você descreveu</Eyebrow>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.55, color: '#3F3F46', margin: 0 }}>{d.claim}</p>
        </div>
        <div style={{ padding: '8px 22px' }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: i < rows.length - 1 ? '1px solid #F4F4F5' : 'none' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#A1A1AA' }}>{k}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500, color: '#0A0A0A', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Dispute detail (mediation) ───────────────────────────────────────
function DisputeDetail({ n, persona, onBack, onUpdate, onResolve }) {
  const [replying, setReplying] = useState(false);
  const [resolving, setResolving] = useState(null); // 'reembolso' | 'liberar'
  const d = n.dispute || {};
  const stages = disputeProgress(d.stage);
  const youOpened = d.openedBy === persona;
  const other = n.counterpart;
  const reasonLabel = DISPUTE_REASON_LABEL[d.reason] || 'Problema relatado';
  const outcomeLabel = DISPUTE_OUTCOME_LABEL[d.outcome] || '';

  // The 5-second line: what's happening + what you should do
  const head = n.status === 'reembolsado'
    ? { kind: 'done', line: 'Disputa encerrada. O valor foi devolvido ao cliente.' }
    : n.status === 'liberado'
    ? { kind: 'done', line: 'Disputa encerrada. O pagamento foi liberado ao prestador.' }
    : d.stage === 'analise'
    ? { kind: 'wait', line: 'A Dalivim está analisando as duas versões. Avisaremos a decisão.' }
    : youOpened
    ? { kind: 'wait', line: `Aguardando a resposta de ${other} — ${d.deadline || 'em alguns dias'}.` }
    : { kind: 'do', line: `${other} abriu uma disputa. Responda para que a Dalivim possa avaliar.` };

  const resolved = n.status === 'reembolsado' || n.status === 'liberado';

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
        <Icon name="arrow-left" size={16}/> {n.title}
      </button>

      {/* Next-action / status line */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 22,
        padding: '18px 20px', borderRadius: 14,
        background: head.kind === 'do' ? '#FBEAE5' : head.kind === 'done' ? '#E8F2EC' : '#FAFAFA',
        border: '1px solid ' + (head.kind === 'do' ? '#F3D2C7' : head.kind === 'done' ? '#CDE6D8' : '#ECECEE'),
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9999, flexShrink: 0, marginTop: 1,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: head.kind === 'do' ? '#C0450F' : head.kind === 'done' ? '#16794C' : '#F0F0F1',
          color: head.kind === 'wait' ? '#A1A1AA' : '#fff',
        }}>
          <Icon name={head.kind === 'done' ? 'check' : head.kind === 'do' ? 'alert-triangle' : 'clock'} size={15} strokeWidth={2}/>
        </span>
        <div style={{ minWidth: 0 }}>
          <Eyebrow color={head.kind === 'do' ? '#B4633F' : head.kind === 'done' ? '#3F8463' : '#A1A1AA'} style={{ marginBottom: 3 }}>
            {head.kind === 'done' ? 'Disputa encerrada' : 'Em mediação'}
          </Eyebrow>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: 500, lineHeight: 1.4, color: '#0A0A0A' }}>{head.line}</div>
        </div>
      </div>

      {/* Title + amount */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
        <div style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 9 }}>Disputa · {n.id} · {reasonLabel}</Eyebrow>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-0.026em', lineHeight: 1.08, margin: 0, color: '#0A0A0A',
          }}>{n.title}</h1>
        </div>
        <Money value={n.value} size={28}/>
      </div>

      {/* Money protection banner */}
      {!resolved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 13, padding: '16px 18px',
          background: '#0A0A0A', borderRadius: 16, marginBottom: 22,
        }}>
          <span style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: 'rgba(127,168,238,0.18)', color: '#9DBDF0',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="lock" size={18}/></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 600, color: '#fff' }}>O dinheiro está retido e protegido</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#A1A1AA', marginTop: 2 }}>Nada é liberado para nenhum dos lados até a disputa terminar.</div>
          </div>
        </div>
      )}

      {/* Mediation stages */}
      <Eyebrow style={{ marginBottom: 12 }}>Como a disputa anda</Eyebrow>
      <Card pad={22} style={{ marginBottom: 22 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {stages.map((s, i) => (
            <li key={s.key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: i < stages.length - 1 ? 18 : 0 }}>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                <DisputeDot state={s.state}/>
                {i < stages.length - 1 && <span style={{ flex: 1, width: 2, minHeight: 20, marginTop: 4, background: s.state === 'done' ? '#C0450F' : '#ECECEE' }}/>}
              </span>
              <span style={{ paddingBottom: 2 }}>
                <span style={{
                  display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 14.5,
                  fontWeight: s.state === 'current' ? 600 : 500,
                  color: s.state === 'pending' ? '#C4C4C9' : '#0A0A0A',
                }}>{s.label}</span>
                <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 12.5, lineHeight: 1.45, color: s.state === 'pending' ? '#C4C4C9' : '#71717A', marginTop: 2 }}>
                  {s.state === 'current' && d.deadline && s.key === 'resposta' ? `${s.hint} Prazo: ${d.deadline}.` : s.hint}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* The claim */}
      <Eyebrow style={{ marginBottom: 12 }}>O que foi alegado</Eyebrow>
      <Card pad={22} style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{
            width: 34, height: 34, borderRadius: 9999, flexShrink: 0, background: '#FBEAE5', color: '#C0450F',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="alert-triangle" size={17}/></span>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 600, color: '#0A0A0A' }}>{reasonLabel}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#71717A' }}>
              Aberta por {d.openedBy === 'comprador' ? 'cliente' : 'prestador'} · {d.openedWhen} · pede {outcomeLabel.toLowerCase()}
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.55, color: '#3F3F46', margin: '0 0 16px' }}>{d.claim}</p>
        {d.evidence && d.evidence.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {d.evidence.map((ev, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px',
                background: '#FAFAFA', border: '1px solid #ECECEF', borderRadius: 10,
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#52525B',
              }}>
                <Icon name="check" flat size={12} color="#16794C" strokeWidth={3}/>{ev}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Conversation thread */}
      {d.thread && d.thread.length > 0 && (
        <>
          <Eyebrow style={{ marginBottom: 12 }}>Conversa da mediação</Eyebrow>
          <Card pad={20} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {d.thread.map((m, i) => {
                const mine = m.from === persona;
                const who = m.from === 'dalivim' ? 'Dalivim' : m.from === persona ? 'Você' : other;
                return (
                  <div key={i} style={{ display: 'flex', gap: 11, flexDirection: mine ? 'row-reverse' : 'row' }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 9999, flexShrink: 0,
                      background: m.from === 'dalivim' ? '#0A0A0A' : mine ? '#1E4BA0' : '#F0F0F1',
                      color: m.from === 'dalivim' || mine ? '#fff' : '#52525B',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                    }}>{m.from === 'dalivim' ? <Icon name="shield-check" size={14}/> : mine ? 'J' : (other[0] || '?')}</span>
                    <div style={{ maxWidth: '78%' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3, flexDirection: mine ? 'row-reverse' : 'row' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: '#0A0A0A' }}>{who}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: '#A1A1AA' }}>{m.when}</span>
                      </div>
                      <div style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.5, color: '#27272A',
                        background: mine ? '#EEF3FB' : '#F7F7F8', borderRadius: 14,
                        padding: '10px 14px', textAlign: 'left',
                      }}>{m.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* Actions */}
      {!resolved && (
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {head.kind === 'do' && (
            <PrimaryButton full tone="ink" onClick={() => setReplying(true)}>
              <Icon name="message" size={16}/> Responder à disputa
            </PrimaryButton>
          )}
          {d.stage === 'analise' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 11, padding: '15px 18px',
              background: '#FAFAFA', border: '1px solid #ECECEE', borderRadius: 14,
              fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#52525B',
            }}>
              <Icon name="scale" size={18} color="#71717A"/> A Dalivim responde em até 2 dias úteis.
            </div>
          )}

          {/* Resolve by agreement — available to either side before análise */}
          {d.stage !== 'analise' && (
            <Card pad={18}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>Resolver por acordo</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A', marginBottom: 14, lineHeight: 1.45 }}>
                Sem esperar a análise. O dinheiro vai direto para o lado combinado.
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setResolving('reembolso')} style={resolveBtn('#16794C')}>
                  Reembolsar o cliente
                </button>
                <button type="button" onClick={() => setResolving('liberar')} style={resolveBtn('#1E4BA0')}>
                  Liberar ao prestador
                </button>
              </div>
            </Card>
          )}

          <QuietLink onClick={() => onBack()}>Voltar à negociação</QuietLink>
        </div>
      )}

      {resolved && (
        <PrimaryButton full tone="ink" onClick={onBack}>Voltar à negociação</PrimaryButton>
      )}

      {replying && (
        <ReplySheet other={other}
          onCancel={() => setReplying(false)}
          onSend={(text) => { setReplying(false); onUpdate(n.id, { reply: text, persona }); }}/>
      )}
      {resolving && (
        <ResolveSheet kind={resolving} n={n}
          onCancel={() => setResolving(null)}
          onConfirm={() => { setResolving(null); onResolve(n.id, resolving); }}/>
      )}
    </div>
  );
}

function resolveBtn(color) {
  return {
    all: 'unset', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center',
    padding: '11px 14px', borderRadius: 10, border: '1.5px solid ' + color, color,
    fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
    background: '#fff', transition: 'background 140ms', whiteSpace: 'nowrap',
  };
}

function DisputeDot({ state }) {
  if (state === 'done') return (
    <span style={{ width: 22, height: 22, color: '#C0450F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name="check" flat color="#C0450F" size={19} strokeWidth={3}/>
    </span>
  );
  if (state === 'current') return (
    <span style={{ width: 22, height: 22, borderRadius: 9999, background: '#C0450F', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#fff' }}/>
    </span>
  );
  return <span style={{ width: 22, height: 22, borderRadius: 9999, border: '2px solid #E4E4E7', background: '#fff', flexShrink: 0, boxSizing: 'border-box' }}/>;
}

function ReplySheet({ other, onCancel, onSend }) {
  const [text, setText] = useState('');
  return (
    <Overlay onClose={onCancel}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 500, letterSpacing: '-0.018em', margin: '0 0 8px', color: '#0A0A0A' }}>Sua resposta</h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.5, color: '#52525B', margin: '0 0 16px' }}>
        Conte a sua versão. Ela vai para {other} e para a equipe de mediação.
      </p>
      <textarea autoFocus value={text} onChange={e => setText(e.target.value)} rows={4}
        placeholder="Explique o que aconteceu do seu lado…"
        style={{
          width: '100%', boxSizing: 'border-box', padding: '14px 16px', border: '1.5px solid #E4E4E7',
          borderRadius: 14, resize: 'vertical', fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.5, color: '#0A0A0A', outline: 'none', marginBottom: 18,
        }}
        onFocus={e => e.target.style.borderColor = '#1E4BA0'} onBlur={e => e.target.style.borderColor = '#E4E4E7'}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <PrimaryButton full disabled={text.trim().length < 4} onClick={() => onSend(text.trim())}>Enviar resposta</PrimaryButton>
        <GhostButton full onClick={onCancel}>Voltar</GhostButton>
      </div>
    </Overlay>
  );
}

function ResolveSheet({ kind, n, onCancel, onConfirm }) {
  const refund = kind === 'reembolso';
  return (
    <Overlay onClose={onCancel}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 500, letterSpacing: '-0.018em', margin: '0 0 8px', color: '#0A0A0A' }}>
        {refund ? 'Reembolsar o cliente?' : 'Liberar ao prestador?'}
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.5, color: '#52525B', margin: '0 0 18px' }}>
        {refund
          ? `Os ${brl(n.value)} reservados voltam para a conta do cliente. A disputa é encerrada e esta ação não pode ser desfeita.`
          : `Os ${brl(n.value)} reservados são liberados para o prestador. A disputa é encerrada e esta ação não pode ser desfeita.`}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 16px', background: '#FAFAFA', borderRadius: 12, marginBottom: 22 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#71717A' }}>Valor reservado</span>
        <Money value={n.value} size={20}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <PrimaryButton full tone={refund ? 'action' : 'action'} onClick={onConfirm}>
          {refund ? 'Confirmar reembolso' : 'Confirmar liberação'}
        </PrimaryButton>
        <GhostButton full onClick={onCancel}>Voltar</GhostButton>
      </div>
    </Overlay>
  );
}

Object.assign(window, { DisputeFlow, DisputeDetail });
