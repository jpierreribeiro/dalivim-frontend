// Root — top bar shell, persona lens, router between dashboard / wizard /
// negotiation. Persona and detail variant are driven by the Tweaks panel.

const VARIANT_MAP = {
  'Linha do tempo': 'timeline',
  'Foco no status': 'foco',
  'Recibo': 'recibo',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "persona": "comprador",
  "variant": "Linha do tempo"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const persona = t.persona === 'vendedor' ? 'vendedor' : 'comprador';
  const variant = VARIANT_MAP[t.variant] || 'timeline';

  const [negotiations, setNegotiations] = useState(seedNegotiations);
  const [invoices, setInvoices] = useState(seedInvoices);
  const [route, setRoute] = useState({ view: 'dashboard', id: null });

  const open = (id) => { setRoute({ view: 'negotiation', id }); window.scrollTo(0, 0); };
  const goNew = () => { setRoute({ view: 'wizard', id: null }); window.scrollTo(0, 0); };
  const goHome = () => { setRoute({ view: 'dashboard', id: null }); window.scrollTo(0, 0); };

  // ── Invoice (cobrança) handlers ───────────────────────────────────
  const goInvoices = () => { setRoute({ view: 'invoices', id: null }); window.scrollTo(0, 0); };
  const openInvoice = (id) => { setRoute({ view: 'invoice', id }); window.scrollTo(0, 0); };
  const goNewInvoice = () => { setRoute({ view: 'invoice-new', id: null }); window.scrollTo(0, 0); };
  const invoiceAction = (id, status) =>
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  const createInvoice = (d) => {
    const inv = {
      id: 'COB-' + Math.floor(1000 + Math.random() * 8999),
      buyer: d.buyer, buyerEmail: d.buyerEmail, title: d.title, desc: d.desc,
      value: d.value, fee: feeOf(d.value), total: d.value + feeOf(d.value),
      type: d.type, status: 'pendente', when: 'agora',
    };
    setInvoices(prev => [inv, ...prev]);
    setRoute({ view: 'invoice', id: inv.id });
    window.scrollTo(0, 0);
  };

  const setStatus = (id, status) =>
    setNegotiations(prev => prev.map(n => n.id === id ? { ...n, status } : n));

  // Milestone deliver/approve: set the phase status; if all approved, finalize.
  const onMilestone = (id, i, status) =>
    setNegotiations(prev => prev.map(n => {
      if (n.id !== id || !n.milestones) return n;
      const milestones = n.milestones.map((m, j) => j === i ? { ...m, status } : m);
      const allApproved = milestones.every(m => m.status === 'aprovado');
      return { ...n, milestones, status: allApproved ? 'liberado' : n.status };
    }));

  // ── Dispute handlers ──────────────────────────────────────────────
  const goDisputeOpen = (id) => { setRoute({ view: 'dispute-open', id }); window.scrollTo(0, 0); };
  const goDispute = (id) => { setRoute({ view: 'dispute', id }); window.scrollTo(0, 0); };
  const goMilestone = (id) => { setRoute({ view: 'milestone', id }); window.scrollTo(0, 0); };

  const submitDispute = (id, d) => {
    setNegotiations(prev => prev.map(n => n.id === id ? {
      ...n, status: 'disputa',
      dispute: {
        reason: d.reason, outcome: d.outcome, claim: d.claim, evidence: d.evidence,
        openedBy: persona, openedWhen: 'agora', stage: 'resposta', deadline: 'em 5 dias',
        thread: [{ from: persona, when: 'agora', text: d.claim }],
      },
    } : n));
    setRoute({ view: 'dispute', id });
    window.scrollTo(0, 0);
  };

  const updateDispute = (id, { reply, persona: from }) => {
    setNegotiations(prev => prev.map(n => {
      if (n.id !== id || !n.dispute) return n;
      const thread = [
        ...(n.dispute.thread || []),
        { from, when: 'agora', text: reply },
        { from: 'dalivim', when: 'agora', text: 'Recebemos as duas versões e as provas. Nossa equipe vai analisar e responder em até 2 dias úteis.' },
      ];
      return { ...n, dispute: { ...n.dispute, stage: 'analise', thread } };
    }));
  };

  const resolveDispute = (id, kind) => {
    setNegotiations(prev => prev.map(n => n.id === id && n.dispute ? {
      ...n,
      status: kind === 'reembolso' ? 'reembolsado' : 'liberado',
      dispute: { ...n.dispute, stage: 'resolucao', resolution: kind },
    } : n));
    window.scrollTo(0, 0);
  };

  const createNegotiation = (d) => {
    const n = {
      id: 'NG-' + Math.floor(1000 + Math.random() * 8999),
      title: d.desc.split('\n')[0].slice(0, 60) || 'Nova negociação',
      tipo: d.tipo, value: d.value, fee: feeOf(d.value), total: d.value + feeOf(d.value),
      counterpart: d.name, status: 'aguardando-pagamento', when: 'agora', desc: d.desc,
    };
    setNegotiations(prev => [n, ...prev]);
    if (d.lado !== persona) setTweak('persona', d.lado);
    setRoute({ view: 'negotiation', id: n.id });
    window.scrollTo(0, 0);
  };

  const current = negotiations.find(n => n.id === route.id);
  const currentInvoice = invoices.find(i => i.id === route.id);
  const onHome = () => { setRoute({ view: 'dashboard', id: null }); window.scrollTo(0, 0); };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <TopBar persona={persona} setPersona={p => setTweak('persona', p)} onHome={onHome}/>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '38px 22px 120px' }}>
        {(route.view === 'dashboard' || route.view === 'invoices') && (
          <HomeTabs active={route.view} onNegs={goHome} onInvoices={goInvoices}/>
        )}
        {route.view === 'dashboard' && (
          <Dashboard negotiations={negotiations} persona={persona} onOpen={open} onNew={goNew}/>
        )}
        {route.view === 'invoices' && (
          <InvoiceList invoices={invoices} onOpen={openInvoice} onNew={goNewInvoice}/>
        )}
        {route.view === 'invoice' && currentInvoice && (
          <InvoiceDetail inv={currentInvoice} onBack={goInvoices} onAction={invoiceAction}/>
        )}
        {route.view === 'invoice-new' && (
          <NewInvoice onCancel={goInvoices} onCreate={createInvoice}/>
        )}
        {route.view === 'wizard' && (
          <Wizard persona={persona} onCancel={goHome} onCreate={createNegotiation}/>
        )}
        {route.view === 'negotiation' && current && (
          <Negotiation n={current} persona={persona} variant={variant}
            onBack={goHome} onAction={setStatus} onMilestone={onMilestone}
            onViewMilestone={goMilestone}
            onOpenDispute={goDisputeOpen} onViewDispute={goDispute}/>
        )}
        {route.view === 'milestone' && current && (
          <MilestoneDetail n={current} persona={persona}
            onBack={() => { setRoute({ view: 'negotiation', id: current.id }); window.scrollTo(0, 0); }}
            onMilestone={onMilestone}/>
        )}
        {route.view === 'dispute-open' && current && (
          <DisputeFlow n={current} persona={persona}
            onCancel={() => { setRoute({ view: 'negotiation', id: current.id }); window.scrollTo(0, 0); }}
            onSubmit={submitDispute}/>
        )}
        {route.view === 'dispute' && current && (
          <DisputeDetail n={current} persona={persona}
            onBack={() => { setRoute({ view: 'negotiation', id: current.id }); window.scrollTo(0, 0); }}
            onUpdate={updateDispute} onResolve={resolveDispute}/>
        )}
      </main>

      <TweaksPanel>
        <TweakSection label="Ponto de vista"/>
        <TweakRadio label="Você está vendo como" value={persona}
          options={['comprador', 'vendedor']}
          onChange={v => setTweak('persona', v)}/>
        <TweakSection label="Tela da negociação"/>
        <TweakRadio label="Status + linha do tempo" value={t.variant}
          options={['Linha do tempo', 'Foco no status', 'Recibo']}
          onChange={v => setTweak('variant', v)}/>
      </TweaksPanel>
    </div>
  );
}

function HomeTabs({ active, onNegs, onInvoices }) {
  const tabs = [
    { k: 'dashboard', l: 'Negociações', fn: onNegs },
    { k: 'invoices', l: 'Cobranças', fn: onInvoices },
  ];
  return (
    <div style={{ display: 'inline-flex', gap: 4, background: '#F0F0F1', borderRadius: 9999, padding: 4, marginBottom: 30 }}>
      {tabs.map(tb => {
        const on = active === tb.k;
        return (
          <button key={tb.k} type="button" onClick={tb.fn} style={{
            all: 'unset', cursor: 'pointer', padding: '8px 18px', borderRadius: 9999,
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
            color: on ? '#0A0A0A' : '#71717A', background: on ? '#fff' : 'transparent',
            boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none', transition: 'all 160ms',
          }}>{tb.l}</button>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
