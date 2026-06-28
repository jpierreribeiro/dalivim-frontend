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

// ── Invoice mapping: backend InvoiceResponse → the local list/detail shape ──
const INVOICE_STATUS_MAP = { draft: 'pendente', sent: 'pendente', paid: 'pago', cancelled: 'cancelada' };

function timeAgoPt(iso) {
  const then = iso ? new Date(iso).getTime() : 0;
  if (!then) return 'agora';
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return 'agora';
  const m = Math.floor(s / 60); if (m < 60) return 'há ' + m + ' min';
  const h = Math.floor(m / 60); if (h < 24) return 'há ' + h + ' h';
  const d = Math.floor(h / 24); if (d < 30) return 'há ' + d + (d === 1 ? ' dia' : ' dias');
  const mo = Math.floor(d / 30); return 'há ' + mo + (mo === 1 ? ' mês' : ' meses');
}

function mapInvoice(resp) {
  const value = Math.round((resp.amount_cents || 0) / 100);
  return {
    id: resp.id,
    buyer: resp.buyer_name || '', buyerEmail: resp.buyer_email || '',
    title: resp.title, desc: resp.description || '',
    value, fee: feeOf(value), total: value + feeOf(value),
    type: resp.type === 'direct' ? 'direct' : 'escrow',
    status: INVOICE_STATUS_MAP[resp.status] || 'pendente',
    when: timeAgoPt(resp.created_at),
    paymentUrl: resp.payment_url || '',
  };
}

// ── Transaction mapping: backend TransactionListItem → local negotiation ──
const TX_STATUS_MAP = {
  pending_payment: 'aguardando-pagamento',
  paid: 'protegido',
  in_escrow: 'protegido',
  cancel_requested: 'protegido', // funds still held while cancellation is negotiated
  released: 'liberado',
  disputed: 'disputa',
  refund_pending_external: 'reembolsado',
  refund_failed_external: 'reembolsado',
  refunded: 'reembolsado',
  cancelled: 'cancelado',
  expired: 'expirado',
};

function tipoFromProduct(pt) {
  const s = (pt || '').toLowerCase();
  if (s.indexOf('serv') >= 0) return 'servico';
  if (s.indexOf('produt') >= 0 || s.indexOf('product') >= 0) return 'produto';
  return 'outro';
}

function mapTransaction(item) {
  const value = Math.round((item.amount_cents || 0) / 100);
  const status = item.has_dispute ? 'disputa' : (TX_STATUS_MAP[item.status] || 'protegido');
  return {
    id: item.id,
    title: item.product_type_label || 'Negociação',
    tipo: tipoFromProduct(item.product_type),
    value, fee: feeOf(value), total: value + feeOf(value),
    counterpart: item.buyer_email || '',
    status,
    when: timeAgoPt(item.created_at),
    desc: '',
  };
}

const MILESTONE_STATUS_MAP = {
  pending: 'aguardando', funded: 'aguardando',
  delivered: 'entregue',
  approved: 'aprovado', payout_pending: 'aprovado', released: 'aprovado',
  disputed: 'disputa', refunded: 'disputa',
};
function mapMilestone(m) {
  return {
    id: m.id,
    title: m.title,
    value: Math.round((m.amount_cents || 0) / 100),
    status: MILESTONE_STATUS_MAP[m.status] || 'aguardando',
  };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const persona = t.persona === 'vendedor' ? 'vendedor' : 'comprador';
  const variant = VARIANT_MAP[t.variant] || 'timeline';

  // Signed-in users start EMPTY (their real data loads from the API below) so
  // the demo seed never flashes; anonymous visitors get the seed for the demo.
  const signedIn = !!(window.DalivimAPI && DalivimAPI.getToken && DalivimAPI.getToken());
  const [negotiations, setNegotiations] = useState(() => signedIn ? [] : seedNegotiations());
  const [invoices, setInvoices] = useState(() => signedIn ? [] : seedInvoices());
  const [route, setRoute] = useState({ view: 'dashboard', id: null });
  const [userName, setUserName] = useState(() =>
    (window.DalivimAPI && DalivimAPI.getUser && (DalivimAPI.getUser() || {}).full_name) || '');

  // Signed in → replace the demo seed with the seller's real data:
  // GET /transactions (negotiations) + GET /invoices (charges). Anonymous
  // visitors keep the seed so the prototype still renders without a login.
  useEffect(() => {
    if (!window.DalivimAPI || !DalivimAPI.getToken()) return;
    let cancelled = false;
    // Logged-in user is a seller — show the seller's lens, not the demo buyer one.
    setTweak('persona', 'vendedor');

    DalivimAPI.get('/me/status')
      .then(res => {
        if (cancelled) return;
        const u = res && res.user;
        if (u && u.full_name) { setUserName(u.full_name); DalivimAPI.setUser(u); }
      })
      .catch(() => { /* keep cached/empty name */ });

    DalivimAPI.get('/transactions?page=1&page_size=50&sort_by=created_at&sort_order=desc')
      .then(res => {
        if (cancelled) return;
        const arr = (res && (res.data || res.items || res.transactions)) || [];
        setNegotiations(arr.map(mapTransaction));
      })
      .catch(() => { /* keep the demo seed on 401 / network error */ });

    DalivimAPI.get('/invoices?page=1&page_size=50')
      .then(res => {
        if (cancelled) return;
        const arr = (res && (res.data || res.items)) || [];
        setInvoices(arr.map(mapInvoice));
      })
      .catch(() => { /* keep the demo seed on 401 / network error */ });

    return () => { cancelled = true; };
  }, []);

  // Enrich a real negotiation with its full detail (GET /transactions/:id):
  // fresh status, scope as description, buyer, amounts and milestones. Demo
  // (non-UUID) ids and anonymous visitors are left untouched.
  const enrichNegotiation = (id) => {
    if (!window.DalivimAPI || !DalivimAPI.getToken()) return;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(String(id))) return;
    DalivimAPI.get('/transactions/' + id)
      .then(d => {
        if (!d) return;
        const value = Math.round((d.amount_cents || 0) / 100);
        setNegotiations(prev => prev.map(n => {
          if (n.id !== id) return n;
          const next = { ...n, value, fee: feeOf(value), total: value + feeOf(value) };
          if (d.buyer_email) next.counterpart = d.buyer_email;
          next.status = d.has_dispute ? 'disputa' : (TX_STATUS_MAP[d.status] || n.status);
          if (d.scope_of_work) next.desc = d.scope_of_work;
          if (d.has_milestones && Array.isArray(d.milestones) && d.milestones.length) {
            next.milestones = d.milestones.map(mapMilestone);
          }
          return next;
        }));
      })
      .catch(() => { /* keep the list-level data on 404 / network error */ });
  };

  const open = (id) => { setRoute({ view: 'negotiation', id }); window.scrollTo(0, 0); enrichNegotiation(id); };
  const goNew = () => { setRoute({ view: 'wizard', id: null }); window.scrollTo(0, 0); };
  const goHome = () => { setRoute({ view: 'dashboard', id: null }); window.scrollTo(0, 0); };

  // ── Invoice (cobrança) handlers ───────────────────────────────────
  const goSettings = () => { setRoute({ view: 'settings', id: null }); window.scrollTo(0, 0); };
  const goInvoices = () => { setRoute({ view: 'invoices', id: null }); window.scrollTo(0, 0); };
  const openInvoice = (id) => { setRoute({ view: 'invoice', id }); window.scrollTo(0, 0); };
  const goNewInvoice = () => { setRoute({ view: 'invoice-new', id: null }); window.scrollTo(0, 0); };
  const invoiceAction = (id, status) =>
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  // Prepend the freshly created charge (mapped from the /invoices response).
  const createInvoice = (resp) => {
    const inv = mapInvoice(resp);
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
      <TopBar persona={persona} setPersona={p => setTweak('persona', p)} onHome={onHome} onSettings={goSettings}
        initial={(userName.trim()[0] || 'D').toUpperCase()}/>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '38px 22px 120px' }}>
        {(route.view === 'dashboard' || route.view === 'invoices') && (
          <HomeTabs active={route.view} onNegs={goHome} onInvoices={goInvoices}/>
        )}
        {route.view === 'dashboard' && (
          <Dashboard negotiations={negotiations} persona={persona} onOpen={open} onNew={goNew} userName={userName}/>
        )}
        {route.view === 'settings' && (
          <SettingsPage onBack={onHome}/>
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
