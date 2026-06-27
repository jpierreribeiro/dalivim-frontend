// Overview — KPIs, activity feed, onboarding checklist
// Backed conceptually by GET /api/dashboard/summary + /activity + /onboarding

function Overview({ txs, setRoute, onOpenTx }) {
  // Aggregate KPIs from txs
  const kpis = useMemo(() => {
    const inCustody = txs.filter(t => ['custodia','aguardando-entrega'].includes(t.state));
    const awaiting = txs.filter(t => t.state === 'aguardando');
    const released = txs.filter(t => t.state === 'liberada');
    const sum = arr => arr.reduce((a, t) => a + t.value, 0);
    return {
      custodia: sum(inCustody),
      custodiaCount: inCustody.length,
      aguardando: sum(awaiting),
      aguardandoCount: awaiting.length,
      liberado: sum(released),
      liberadoCount: released.length,
    };
  }, [txs]);

  const recent = txs.slice(0, 5);
  const checklist = [
    { k: 'kyc',   label: 'KYC verificado', done: true },
    { k: 'pix',   label: 'Chave Pix cadastrada', done: true },
    { k: 'first', label: 'Primeira transação criada', done: txs.length > 0 },
    { k: 'link',  label: 'Link de cobrança publicado', done: txs.length > 2 },
    { k: 'wh',    label: 'Webhook configurado', done: false },
  ];
  const doneCount = checklist.filter(c => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  return (
    <div style={{ padding: '32px 40px 80px', animation: 'dv-fade-in 320ms' }}>
      {/* KPI tiles */}
      <div className="dv-metrics" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28,
      }}>
        <KpiTile label="Em custódia" value={formatBRL(kpis.custodia)}
          sub={`${kpis.custodiaCount} ${kpis.custodiaCount === 1 ? 'transação ativa' : 'transações ativas'}`}
          dotColor="#1E4BA0" accent="#EEF3FB"/>
        <KpiTile label="Aguardando pagamento" value={formatBRL(kpis.aguardando)}
          sub={`${kpis.aguardandoCount} ${kpis.aguardandoCount === 1 ? 'pendente' : 'pendentes'}`}
          dotColor="#D97706" accent="#FEF6E7"/>
        <KpiTile label="Liberado (30 dias)" value={formatBRL(kpis.liberado)}
          sub={`${kpis.liberadoCount} ${kpis.liberadoCount === 1 ? 'concluída' : 'concluídas'}`}
          dotColor="#16794C" accent="#E8F2EC"/>
      </div>

      {/* Split */}
      <div className="dv-split" style={{
        display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16,
      }}>
        {/* Activity feed */}
        <DCard pad={0}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid #EDEDEF',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 500,
              letterSpacing: '-0.01em', margin: 0,
            }}>Atividade recente</h3>
            <button onClick={() => setRoute('tx')} style={{
              all: 'unset', cursor: 'pointer', fontSize: 13, color: '#1E4BA0', fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>Ver todas<Icon name="arrow-right" size={12}/></button>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recent.map((t, i) => (
              <li key={t.id} style={{
                padding: '16px 24px',
                borderBottom: i < recent.length - 1 ? '1px solid #F4F4F5' : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer',
              }}
              onClick={() => onOpenTx(t)}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: '#F4F4F5', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', color: '#52525B',
                }}>
                  <Icon name={t.tipo === 'servico' ? 'briefcase' : t.tipo === 'produto' ? 'package' : 'handshake'} size={16}/>
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#0A0A0A' }}>{t.title}</span>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#A1A1AA' }}>{t.id}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#71717A', marginTop: 2 }}>{t.counter} · {t.when}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 14,
                    fontVariantNumeric: 'tabular-nums',
                  }}>{formatBRL(t.value)}</div>
                  <div style={{ marginTop: 4 }}><DBadge state={t.state}/></div>
                </div>
              </li>
            ))}
          </ul>
        </DCard>

        {/* Onboarding checklist */}
        <DCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 500,
              letterSpacing: '-0.01em', margin: 0,
            }}>Configuração da conta</h3>
            <span style={{ fontSize: 12, color: '#71717A' }}>{doneCount}/{checklist.length}</span>
          </div>
          <div style={{ height: 4, background: '#F4F4F5', borderRadius: 9999, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #1E4BA0, #3D6BC4)', transition: 'width 500ms' }}/>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {checklist.map(c => (
              <li key={c.k} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13.5, color: c.done ? '#A1A1AA' : '#0A0A0A',
                textDecoration: c.done ? 'line-through' : 'none',
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 9999,
                  background: c.done ? '#16794C' : '#fff',
                  border: c.done ? 'none' : '1.5px solid #E4E4E7',
                  color: '#fff', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {c.done && <Icon name="check" size={12} strokeWidth={3}/>}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
          <button onClick={() => setRoute('nova')} style={{
            all: 'unset', marginTop: 18, cursor: 'pointer',
            padding: '10px 14px', width: '100%', textAlign: 'center', boxSizing: 'border-box',
            background: '#0A0A0A', color: '#fff', borderRadius: 10,
            fontSize: 13, fontWeight: 500,
          }}>Criar transação</button>
        </DCard>
      </div>
    </div>
  );
}

function KpiTile({ label, value, sub, dotColor, accent }) {
  return (
    <DCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: 9999, background: dotColor }}/>
        <span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1.05,
        fontVariantNumeric: 'tabular-nums', color: '#0A0A0A',
      }}>{value}</div>
      <div style={{ fontSize: 12.5, color: '#A1A1AA', marginTop: 8 }}>{sub}</div>
    </DCard>
  );
}

Object.assign(window, { Overview });
