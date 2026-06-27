// Dashboard — greeting, one primary action, negotiations that need you first.
// No metrics, no tables. "Bom dia, Jean." then: what needs you, then the rest.

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function Dashboard({ negotiations, persona, onOpen, onNew }) {
  // Split by whether the current persona must act
  const { needsYou, watching } = useMemo(() => {
    const needsYou = [], watching = [];
    for (const n of negotiations) {
      const a = nextAction(persona, n.status, n);
      (a.kind === 'do' || n.status === 'disputa' ? needsYou : watching).push(n);
    }
    return { needsYou, watching };
  }, [negotiations, persona]);

  return (
    <div>
      {/* Greeting + primary action */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap', marginBottom: 32,
      }}>
        <div>
          <Eyebrow style={{ marginBottom: 10 }}>Suas negociações</Eyebrow>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(34px, 5vw, 46px)', letterSpacing: '-0.028em',
            lineHeight: 1.02, margin: 0, color: '#0A0A0A',
          }}>{greeting()}, Jean.</h1>
        </div>
        <span className="dv-desktop-action">
          <PrimaryButton tone="soft" onClick={onNew}>
            <Icon name="plus" size={17}/> Nova negociação
          </PrimaryButton>
        </span>
      </div>

      {needsYou.length > 0 && (
        <Group title="Precisa de você" count={needsYou.length} accent>
          {needsYou.map(n => (
            <NegotiationRow key={n.id} n={n} persona={persona} onOpen={onOpen} emphasize/>
          ))}
        </Group>
      )}

      <MobileBar>
        <PrimaryButton full tone="soft" onClick={onNew}>
          <Icon name="plus" size={17}/> Nova negociação
        </PrimaryButton>
      </MobileBar>

      <Group title="Acompanhando" count={watching.length}>
        {watching.length === 0
          ? <Card pad={28}><span style={{ color: '#A1A1AA', fontSize: 14.5 }}>Nada por aqui ainda.</span></Card>
          : watching.map(n => (
            <NegotiationRow key={n.id} n={n} persona={persona} onOpen={onOpen}/>
          ))}
      </Group>
    </div>
  );
}

function Group({ title, count, accent, children }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13, paddingLeft: 2 }}>
        {accent && <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#C77A12' }}/>}
        <h2 style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
          letterSpacing: '0.04em', color: accent ? '#A1620B' : '#71717A', margin: 0,
        }}>{title}</h2>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: '#A1A1AA',
          background: '#F4F4F5', borderRadius: 9999, padding: '1px 8px',
        }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </section>
  );
}

function NegotiationRow({ n, persona, onOpen, emphasize }) {
  const a = nextAction(persona, n.status, n);
  return (
    <Card pad={0} hover onClick={() => onOpen(n.id)}
      style={emphasize ? { borderColor: '#E6D2B0' } : undefined}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
        <TipoGlyph tipo={n.tipo} size={46}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600, color: '#0A0A0A',
            letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{n.title}</div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusPill status={n.status} size="sm"/>
            {n.milestones && n.milestones.length > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
                color: '#1E4BA0', background: '#EEF3FB', borderRadius: 9999, padding: '2px 9px',
              }}>
                <Icon name="scale" flat size={11} color="#1E4BA0" strokeWidth={2}/>
                {n.milestones.filter(m => m.status === 'aprovado').length}/{n.milestones.length} fases
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
          <Money value={n.value} size={19} cents={false}/>
          {a.kind === 'do'
            ? <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: '#1E4BA0',
              }}>{a.cta}<Icon name="chevron-right" size={13}/></span>
            : <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#A1A1AA' }}>{n.counterpart}</span>}
        </div>
      </div>
    </Card>
  );
}

Object.assign(window, { Dashboard });
