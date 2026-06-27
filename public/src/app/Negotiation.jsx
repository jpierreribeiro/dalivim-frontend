// Negotiation detail — answers, in 5 seconds: what happened, where the money
// is, what to do now. Three layout variations of the status + timeline block,
// toggled by the `variant` tweak.

const ACTION_META = {
  pay: {
    to: 'protegido', tone: 'action',
    confirmTitle: 'Pagar e proteger',
    confirmBody: 'O valor sai da sua conta e fica reservado com a Dalivim. Só é liberado quando você confirmar o recebimento.',
    okTitle: 'Pagamento protegido.',
    okBody: 'O dinheiro está reservado. Avisaremos quando a entrega for feita.',
  },
  deliver: {
    to: 'aguardando-confirmacao', tone: 'action',
    confirmTitle: 'Marcar como entregue',
    confirmBody: 'Avisaremos o cliente para confirmar o recebimento. O dinheiro é liberado assim que ele confirmar.',
    okTitle: 'Entrega registrada.',
    okBody: 'Agora é só aguardar a confirmação do cliente.',
  },
  release: {
    to: 'liberado', tone: 'action',
    confirmTitle: 'Confirmar recebimento',
    confirmBody: 'Confirme que recebeu tudo como combinado. O pagamento é liberado para o prestador — esta ação não pode ser desfeita.',
    okTitle: 'Pagamento liberado.',
    okBody: 'Tudo certo. Esta negociação foi finalizada.',
  },
};

function Negotiation({ n, persona, variant, onBack, onAction, onMilestone, onViewMilestone, onOpenDispute, onViewDispute }) {
  const [confirming, setConfirming] = useState(null); // verb
  const [done, setDone] = useState(null);             // {okTitle, okBody}
  const a = nextAction(persona, n.status, n);
  const hasMs = n.milestones && n.milestones.length;

  const runAction = (verb) => {
    if (verb === 'deliver-ms' || verb === 'approve-ms') {
      const i = a.msIndex;
      onMilestone(n.id, i, verb === 'deliver-ms' ? 'entregue' : 'aprovado');
      setConfirming(null);
      setDone(verb === 'deliver-ms'
        ? { title: 'Fase entregue.', body: 'Avisamos o cliente para aprovar. O valor da fase é liberado assim que ele confirmar.' }
        : { title: 'Fase aprovada.', body: 'O pagamento desta fase foi liberado para o prestador.' });
      return;
    }
    const m = ACTION_META[verb];
    onAction(n.id, m.to);
    setConfirming(null);
    setDone({ title: m.okTitle, body: m.okBody });
  };

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
        <Icon name="arrow-left" size={16}/> Negociações
      </button>

      {/* 1 — Sua próxima ação (assistant) */}
      <div style={{ marginBottom: 22 }}><NextActionBanner action={a}/></div>

      {/* 2 — Title + value */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 24 }}>
        <div style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 9 }}>{(TIPO_META[n.tipo] || {}).label} · {n.counterpart}</Eyebrow>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(26px, 4vw, 34px)', letterSpacing: '-0.026em', lineHeight: 1.08,
            margin: 0, color: '#0A0A0A',
          }}>{n.title}</h1>
        </div>
        <Money value={n.value} size={30}/>
      </div>

      {/* 3 — Status + timeline (variant-specific), OR milestone summary */}
      {hasMs
        ? <MilestoneSummary n={n} onView={() => onViewMilestone(n.id)}/>
        : variant === 'recibo'
        ? <ReciboBlock n={n}/>
        : variant === 'foco'
        ? <FocoBlock n={n}/>
        : <TimelineBlock n={n}/>}

      {/* 4 — Descrição do acordo */}
      <div style={{ marginTop: 22 }}>
        <Eyebrow style={{ marginBottom: 10 }}>Descrição do acordo</Eyebrow>
        <Card pad={20}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.55, color: '#3F3F46', margin: 0 }}>{n.desc}</p>
        </Card>
      </div>

      {/* 5 — One primary action; dispute is a quiet secondary, kept OUT of the
          bottom thumb zone so it can't be tapped by accident. */}
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {a.kind === 'do' && hasMs && (
          <span className="dv-desktop-action" style={{ width: '100%' }}>
            <PrimaryButton full tone="soft" onClick={() => onViewMilestone(n.id)}>
              {a.cta} <Icon name="arrow-right" size={15}/>
            </PrimaryButton>
          </span>
        )}
        {a.kind === 'do' && !hasMs && (
          <span className="dv-desktop-action" style={{ width: '100%' }}>
            <PrimaryButton full tone={a.verb === 'release' || a.verb === 'pay' ? 'action' : 'ink'}
              onClick={() => setConfirming(a.verb)}>
              {a.cta}
            </PrimaryButton>
          </span>
        )}
        {n.status === 'disputa' && (
          <span className="dv-desktop-action" style={{ width: '100%' }}>
            <PrimaryButton full tone="danger" onClick={() => onViewDispute(n.id)}>
              <Icon name="alert-triangle" size={16}/> Ver disputa
            </PrimaryButton>
          </span>
        )}
        {n.status !== 'liberado' && n.status !== 'reembolsado' && n.status !== 'disputa' && (
          <QuietLink onClick={() => onOpenDispute(n.id)}>
            Algum problema? Abrir disputa
          </QuietLink>
        )}
      </div>

      {a.kind === 'do' && (
        <MobileBar>
          {hasMs
            ? <PrimaryButton full tone="soft" onClick={() => onViewMilestone(n.id)}>{a.cta} <Icon name="arrow-right" size={15}/></PrimaryButton>
            : <PrimaryButton full tone={a.verb === 'release' || a.verb === 'pay' ? 'action' : 'ink'}
                onClick={() => setConfirming(a.verb)}>{a.cta}</PrimaryButton>}
        </MobileBar>
      )}
      {n.status === 'disputa' && (
        <MobileBar>
          <PrimaryButton full tone="danger" onClick={() => onViewDispute(n.id)}>
            <Icon name="alert-triangle" size={16}/> Ver disputa
          </PrimaryButton>
        </MobileBar>
      )}

      {confirming && (
        <ConfirmSheet verb={confirming} n={n} milestone={a.msIndex != null ? n.milestones[a.msIndex] : null}
          onCancel={() => setConfirming(null)} onConfirm={() => runAction(confirming)}/>
      )}
      {done && (
        <SuccessSheet title={done.title} body={done.body}
          onClose={() => setDone(null)} onBack={onBack}/>
      )}
    </div>
  );
}

// ── Shared: status line ──────────────────────────────────────────────
function StatusLine({ n }) {
  const meta = STATUS[n.status];
  const t = TONES[meta.tone];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <span style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: t.bg, color: t.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={n.status === 'liberado' ? 'lock-open' : n.status === 'disputa' ? 'alert-triangle' : 'lock'} size={19}/>
      </span>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600, color: '#0A0A0A' }}>{meta.label}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#71717A', marginTop: 1 }}>{meta.money}</div>
      </div>
    </div>
  );
}

// ── Variant A: vertical timeline (default) ───────────────────────────
function TimelineBlock({ n }) {
  const steps = timeline(n.status);
  return (
    <Card pad={24}>
      <StatusLine n={n}/>
      <div style={{ height: 1, background: '#F0F0F1', margin: '20px 0 4px' }}/>
      <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0 0' }}>
        {steps.map((s, i) => (
          <li key={s.key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Dot state={s.state}/>
            </div>
            <span style={{
              paddingBottom: i < steps.length - 1 ? 18 : 0, paddingTop: 0,
              fontFamily: "'Inter', sans-serif", fontSize: 14.5,
              fontWeight: s.state === 'current' ? 600 : 500,
              color: s.state === 'pending' ? '#C4C4C9' : s.state === 'current' ? '#0A0A0A' : '#52525B',
            }}>{s.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ── Milestone tracker (faseamento) ───────────────────────────────────
function MilestoneTracker({ n, persona, onMilestone }) {
  const ms = n.milestones;
  const money = milestoneMoney(n);
  const active = activeMilestone(ms);
  const pct = Math.round((money.liberado / money.total) * 100);
  return (
    <Card pad={24}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A', marginBottom: 4 }}>Liberado · {money.aprovadas} de {money.fases} fases</div>
          <Money value={money.liberado} size={26}/>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A', marginBottom: 4 }}>Em custódia</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 500, color: '#1E4BA0', fontVariantNumeric: 'tabular-nums' }}>{brl(money.emCustodia)}</div>
        </div>
      </div>
      <div style={{ height: 6, background: '#ECECEE', borderRadius: 9999, marginBottom: 22 }}>
        <div style={{ width: pct + '%', height: '100%', background: '#1E8A5A', borderRadius: 9999, transition: 'width 460ms cubic-bezier(0.2,0.8,0.2,1)' }}/>
      </div>
      <div style={{ height: 1, background: '#F0F0F1', margin: '0 0 6px' }}/>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {ms.map((m, i) => {
          const meta = MILESTONE_STATUS[m.status];
          const t = TONES[meta.tone];
          const isActive = i === active;
          return (
            <li key={m.id} style={{
              display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0',
              borderBottom: i < ms.length - 1 ? '1px solid #F4F4F5' : 'none',
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 9999, flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 600,
                background: m.status === 'aprovado' ? '#E8F2EC' : isActive ? t.bg : '#F4F4F5',
                color: m.status === 'aprovado' ? '#1E8A5A' : isActive ? t.fg : '#A1A1AA',
              }}>{m.status === 'aprovado' ? <Icon name="check" flat color="#1E8A5A" size={16} strokeWidth={3}/> : i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: isActive ? 600 : 500, color: m.status === 'aprovado' ? '#52525B' : '#0A0A0A' }}>{m.title}</div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4,
                  fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: t.fg,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.dot }}/>{meta.label}
                </span>
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 500, color: m.status === 'aprovado' ? '#A1A1AA' : '#0A0A0A', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{brl(m.value, { cents: false })}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Dot({ state }) {
  if (state === 'done') return (
    <span style={{ width: 22, height: 22, color: '#1E8A5A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name="check" flat color="#1E8A5A" size={20} strokeWidth={3}/>
    </span>
  );
  if (state === 'current') return (
    <span style={{ width: 22, height: 22, borderRadius: 9999, background: '#1E4BA0', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', animation: 'dv-pulse 2s infinite' }}>
      <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#fff' }}/>
    </span>
  );
  return <span style={{ width: 22, height: 22, borderRadius: 9999, border: '2px solid #E4E4E7', background: '#fff', flexShrink: 0, boxSizing: 'border-box' }}/>;
}

// ── Variant B: status focus + compact horizontal stepper ─────────────
function FocoBlock({ n }) {
  const meta = STATUS[n.status];
  const t = TONES[meta.tone];
  const steps = timeline(n.status);
  return (
    <div>
      <Card pad={32} style={{ textAlign: 'center', background: t.bg, border: 'none' }}>
        <span style={{
          width: 60, height: 60, borderRadius: 9999, background: '#fff', color: t.fg,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Icon name={n.status === 'liberado' ? 'lock-open' : n.status === 'disputa' ? 'alert-triangle' : 'shield-check'} size={28}/>
        </span>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 500, letterSpacing: '-0.018em', color: t.fg, marginBottom: 8 }}>{meta.label}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: t.fg, opacity: 0.85, maxWidth: 360, margin: '0 auto', lineHeight: 1.45 }}>{meta.money}</div>
      </Card>
      <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
        {steps.map(s => (
          <div key={s.key} style={{ flex: 1 }} title={s.label}>
            <div style={{ height: 5, borderRadius: 9999, background: s.state === 'done' ? '#1E8A5A' : s.state === 'current' ? '#1E4BA0' : '#ECECEE' }}/>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#71717A' }}>{steps.find(s => s.state === 'current')?.label || 'Concluída'}</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#A1A1AA' }}>{steps.filter(s => s.state === 'done').length}/{steps.length}</span>
      </div>
    </div>
  );
}

// ── Variant C: ledger / receipt (ink surface) ────────────────────────
function ReciboBlock({ n }) {
  const meta = STATUS[n.status];
  const t = TONES[meta.tone];
  const steps = timeline(n.status);
  return (
    <div style={{ background: '#0A0A0A', borderRadius: 18, padding: 26, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5, letterSpacing: '0.04em', color: '#8A8A92' }}>{n.id}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px', borderRadius: 9999, background: 'rgba(255,255,255,0.07)', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500 }}>
          <span style={{ width: 7, height: 7, borderRadius: 9999, background: t.dot }}/>{meta.label}
        </span>
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8A8A92', marginBottom: 6 }}>Onde está o dinheiro</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>{brl(n.value)}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#C4C4C9', marginBottom: 22 }}>{meta.money}</div>
      <div style={{ borderTop: '1px solid #1F1F23', paddingTop: 18 }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0' }}>
            <span style={{ width: 16, display: 'inline-flex', justifyContent: 'center', flexShrink: 0 }}>
              {s.state === 'done'
                ? <Icon name="check" size={14} color="#7FD1A8" strokeWidth={2.5}/>
                : s.state === 'current'
                ? <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#1E4BA0', boxShadow: '0 0 0 4px rgba(30,75,160,0.25)' }}/>
                : <span style={{ width: 7, height: 7, borderRadius: 9999, border: '1.5px solid #3F3F46' }}/>}
            </span>
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, letterSpacing: '0.02em',
              color: s.state === 'pending' ? '#5A5A62' : s.state === 'current' ? '#fff' : '#A1A1AA' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Confirmation sheet ───────────────────────────────────────────────
const MS_ACTION = {
  'deliver-ms': {
    title: 'Marcar fase como entregue',
    body: 'Avisaremos o cliente para aprovar esta fase. O valor reservado dela é liberado assim que ele confirmar.',
  },
  'approve-ms': {
    title: 'Aprovar e liberar fase',
    body: 'Confirme que esta fase foi entregue como combinado. O valor dela é liberado para o prestador — esta ação não pode ser desfeita.',
  },
};
function ConfirmSheet({ verb, n, milestone, onCancel, onConfirm }) {
  const ms = verb === 'deliver-ms' || verb === 'approve-ms';
  const m = ms ? MS_ACTION[verb] : ACTION_META[verb];
  const title = ms ? m.title : m.confirmTitle;
  const body = ms ? m.body : m.confirmBody;
  const value = ms && milestone ? milestone.value : n.value;
  return (
    <Overlay onClose={onCancel}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 500, letterSpacing: '-0.018em', margin: '0 0 10px', color: '#0A0A0A' }}>{title}</h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.5, color: '#52525B', margin: '0 0 18px' }}>{body}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 16px', background: '#FAFAFA', borderRadius: 12, marginBottom: 22 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#71717A' }}>{ms && milestone ? milestone.title : 'Valor'}</span>
        <Money value={value} size={20}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <PrimaryButton full onClick={onConfirm}>{title}</PrimaryButton>
        <GhostButton full onClick={onCancel}>Voltar</GhostButton>
      </div>
    </Overlay>
  );
}

function SuccessSheet({ title, body, onClose, onBack }) {
  return (
    <Overlay onClose={onClose}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ width: 60, height: 60, borderRadius: 9999, background: '#E8F2EC', color: '#16794C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, animation: 'dv-pop 360ms cubic-bezier(0.2,0.8,0.2,1)' }}>
          <Icon name="check" size={28} strokeWidth={2.5}/>
        </span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 25, fontWeight: 500, letterSpacing: '-0.018em', margin: '0 0 10px', color: '#0A0A0A' }}>{title}</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.5, color: '#52525B', margin: '0 0 22px' }}>{body}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <PrimaryButton full tone="ink" onClick={onClose}>Ver negociação</PrimaryButton>
          <GhostButton full onClick={onBack}>Voltar para negociações</GhostButton>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} className="dv-overlay" style={{
      position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,10,10,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'dv-fade 200ms ease', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} className="dv-sheet" style={{
        width: '100%', maxWidth: 420, background: '#fff', borderRadius: 22, padding: 28,
        animation: 'dv-rise 280ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, { Negotiation, ConfirmSheet, SuccessSheet });
