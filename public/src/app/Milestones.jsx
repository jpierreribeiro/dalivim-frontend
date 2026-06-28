// Milestones (Fases) — dedicated page for a phased transaction, mirroring the
// dispute page pattern. The negotiation detail links here via "Ver fases".
// Each phase is delivered → approved → released independently; the money
// summary makes "what's liberado vs. still em custódia" obvious at a glance.

function MilestoneDetail({ n, persona, onBack, onMilestone }) {
  const [confirming, setConfirming] = useState(null); // { verb, i }
  const [done, setDone] = useState(null);
  const ms = n.milestones || [];
  const money = milestoneMoney(n);
  const active = activeMilestone(ms);
  const pct = Math.round((money.liberado / money.total) * 100);
  const buyer = persona === 'comprador';
  const a = nextAction(persona, n.status, n);

  // Returns a promise; throws on API failure so the sheet can show the error.
  const runPhase = async (verb, i, notes) => {
    const milestone = ms[i];
    if (verb === 'deliver-ms' && isUUID(n.id) && milestone && isUUID(milestone.id)) {
      await DalivimAPI.post('/transactions/' + n.id + '/milestones/' + milestone.id + '/deliver', { delivery_notes: notes });
    }
    onMilestone(n.id, i, verb === 'deliver-ms' ? 'entregue' : 'aprovado');
    setConfirming(null);
    setDone(verb === 'deliver-ms'
      ? { title: 'Fase entregue.', body: 'Avisamos o comprador para aprovar. O valor da fase é liberado assim que ele confirmar.' }
      : { title: 'Fase aprovada.', body: 'O pagamento desta fase foi liberado para o vendedor.' });
  };

  const allDone = active === -1;

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

      {/* Next-action line */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 22,
        padding: '18px 20px', borderRadius: 14,
        background: a.kind === 'do' ? '#EEF3FB' : allDone ? '#E8F2EC' : '#FAFAFA',
        border: '1px solid ' + (a.kind === 'do' ? '#DCE7F6' : allDone ? '#CDE6D8' : '#ECECEE'),
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9999, flexShrink: 0, marginTop: 1,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: a.kind === 'do' ? '#1E4BA0' : allDone ? '#16794C' : '#F0F0F1',
          color: a.kind === 'wait' && !allDone ? '#A1A1AA' : '#fff',
        }}>
          <Icon name={allDone ? 'check' : a.kind === 'do' ? 'arrow-right' : 'clock'} size={15} strokeWidth={2}/>
        </span>
        <div style={{ minWidth: 0 }}>
          <Eyebrow color={a.kind === 'do' ? '#5277B8' : allDone ? '#3F8463' : '#A1A1AA'} style={{ marginBottom: 3 }}>
            {allDone ? 'Concluído' : 'Sua próxima ação'}
          </Eyebrow>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: 500, lineHeight: 1.4, color: '#0A0A0A' }}>{a.line}</div>
        </div>
      </div>

      {/* Title + total */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
        <div style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 9 }}>Fases · {n.id} · {n.counterpart}</Eyebrow>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-0.026em', lineHeight: 1.08, margin: 0, color: '#0A0A0A',
          }}>{n.title}</h1>
        </div>
        <Money value={n.value} size={28}/>
      </div>

      {/* Money summary */}
      <Card pad={22} style={{ marginBottom: 22 }}>
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
        <div style={{ height: 6, background: '#ECECEE', borderRadius: 9999 }}>
          <div style={{ width: pct + '%', height: '100%', background: '#1E8A5A', borderRadius: 9999, transition: 'width 460ms cubic-bezier(0.2,0.8,0.2,1)' }}/>
        </div>
      </Card>

      {/* Phase list — each active phase shows its own action inline */}
      <Eyebrow style={{ marginBottom: 12 }}>As fases do acordo</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ms.map((m, i) => {
          const meta = MILESTONE_STATUS[m.status];
          const t = TONES[meta.tone];
          const isActive = i === active;
          const canDeliver = isActive && m.status === 'aguardando' && !buyer;
          const canApprove = isActive && m.status === 'entregue' && buyer;
          return (
            <Card key={m.id} pad={18} style={isActive ? { borderColor: '#C9DAF3', boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 16px 40px -28px rgba(30,75,160,0.25)' } : undefined}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{
                  width: 34, height: 34, borderRadius: 9999, flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 600,
                  background: m.status === 'aprovado' ? '#E8F2EC' : isActive ? t.bg : '#F4F4F5',
                  color: m.status === 'aprovado' ? '#1E8A5A' : isActive ? t.fg : '#A1A1AA',
                }}>{m.status === 'aprovado' ? <Icon name="check" flat color="#1E8A5A" size={17} strokeWidth={3}/> : i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: isActive ? 600 : 500, color: m.status === 'aprovado' ? '#52525B' : '#0A0A0A' }}>{m.title}</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4,
                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: t.fg,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.dot }}/>{meta.label}
                  </span>
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 500, color: m.status === 'aprovado' ? '#A1A1AA' : '#0A0A0A', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{brl(m.value, { cents: false })}</span>
              </div>
              {(canDeliver || canApprove) && (
                <div style={{ marginTop: 16 }}>
                  <PrimaryButton full tone={canApprove ? 'action' : 'ink'}
                    onClick={() => setConfirming({ verb: canApprove ? 'approve-ms' : 'deliver-ms', i })}>
                    {canApprove ? `Aprovar e liberar ${brl(m.value, { cents: false })}` : `Marcar “${m.title}” como entregue`}
                  </PrimaryButton>
                </div>
              )}
              {isActive && !canDeliver && !canApprove && m.status !== 'aprovado' && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#FAFAFA', borderRadius: 12, fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A' }}>
                  <Icon name="clock" size={16} color="#A1A1AA"/>
                  {m.status === 'aguardando' ? 'Aguardando o vendedor entregar esta fase.' : 'Aguardando o comprador aprovar esta fase.'}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Protection note */}
      <div style={{
        marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        background: '#EEF3FB', border: '1px solid #DCE7F6', borderRadius: 14,
        fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.45, color: '#27406B',
      }}>
        <span style={{ width: 30, height: 30, borderRadius: 9999, flexShrink: 0, background: '#fff', color: '#1E4BA0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={15}/>
        </span>
        Cada fase só é liberada quando o comprador aprova. O restante segue reservado com a Dalivim.
      </div>

      {confirming && (
        <ConfirmSheet verb={confirming.verb} n={n} milestone={ms[confirming.i]}
          onCancel={() => setConfirming(null)} onConfirm={(notes) => runPhase(confirming.verb, confirming.i, notes)}/>
      )}
      {done && (
        <SuccessSheet title={done.title} body={done.body}
          onClose={() => setDone(null)} onBack={() => setDone(null)}/>
      )}
    </div>
  );
}

// Compact summary shown on the negotiation detail — links to the Fases page.
function MilestoneSummary({ n, onView }) {
  const money = milestoneMoney(n);
  const pct = Math.round((money.liberado / money.total) * 100);
  return (
    <Card pad={20}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 600, color: '#0A0A0A' }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: '#EEF3FB', color: '#1E4BA0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="scale" size={16} strokeWidth={1.8}/>
          </span>
          Pagamento em {money.fases} fases
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, color: '#71717A' }}>{money.aprovadas}/{money.fases} liberadas</span>
      </div>
      <div style={{ height: 6, background: '#ECECEE', borderRadius: 9999, marginBottom: 14 }}>
        <div style={{ width: pct + '%', height: '100%', background: '#1E8A5A', borderRadius: 9999 }}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A' }}>
          Liberado <strong style={{ color: '#0A0A0A', fontWeight: 600 }}>{brl(money.liberado, { cents: false })}</strong> · em custódia <strong style={{ color: '#1E4BA0', fontWeight: 600 }}>{brl(money.emCustodia, { cents: false })}</strong>
        </span>
      </div>
      <PrimaryButton full tone="soft" onClick={onView}>
        Ver fases <Icon name="arrow-right" size={15}/>
      </PrimaryButton>
    </Card>
  );
}

Object.assign(window, { MilestoneDetail, MilestoneSummary });
