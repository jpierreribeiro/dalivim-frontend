// Main Dashboard App — routes, state, data mocks

function DashboardApp() {
  const [activated, setActivated] = useState(() => localStorage.getItem('dv_activated') === '1');
  const [route, setRoute] = useState('overview');
  const [txs, setTxs] = useState(() => seedTxs());
  const [drawer, setDrawer] = useState(null);

  const complete = (data) => {
    localStorage.setItem('dv_activated', '1');
    if (data?.name) localStorage.setItem('dv_name', data.name);
    setActivated(true);
  };

  const onTxStateChange = (id, newState) => {
    setTxs(prev => prev.map(t => t.id === id ? { ...t, state: newState } : t));
    if (drawer && drawer.id === id) setDrawer(prev => ({ ...prev, state: newState }));
  };

  const addTx = (tx) => setTxs(prev => [tx, ...prev]);

  const headerMap = {
    overview: { t: 'Visão geral', s: 'Suas transações protegidas em custódia.' },
    tx:       { t: 'Transações', s: 'Todas as transações desta conta.' },
    nova:     { t: 'Nova transação', s: 'Crie um acordo protegido em 3 passos.' },
    disputas: { t: 'Disputas', s: 'Casos que precisam de atenção.' },
    extrato:  { t: 'Extrato', s: 'Histórico financeiro.' },
    partes:   { t: 'Contrapartes', s: 'Pessoas com quem você já negociou.' },
    settings: { t: 'Configurações', s: 'Conta, KYC e notificações.' },
    help:     { t: 'Ajuda', s: 'Suporte e documentação.' },
  };
  const h = headerMap[route] || { t: '', s: '' };

  const liveDrawer = drawer ? txs.find(t => t.id === drawer.id) : null;

  return (
    <>
      {!activated && <Onboarding onComplete={complete}/>}
      <DSidebar route={route} setRoute={setRoute}/>
      <DMain>
        <DTopbar
          title={h.t} subtitle={h.s}
          actions={
            route === 'overview' ? (
              <button onClick={() => setRoute('nova')} style={{
                all: 'unset', cursor: 'pointer',
                padding: '10px 18px', borderRadius: 9999,
                background: '#0A0A0A', color: '#fff',
                fontSize: 13.5, fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Icon name="plus" size={14}/>Nova transação
              </button>
            ) : null
          }
        />
        {route === 'overview' && <Overview txs={txs} setRoute={setRoute} onOpenTx={setDrawer}/>}
        {route === 'tx'       && <Transacoes txs={txs} onOpenTx={setDrawer}/>}
        {route === 'nova'     && <NovaTransacao onCreated={addTx}/>}
        {(route === 'disputas' || route === 'extrato' || route === 'partes' || route === 'settings' || route === 'help') &&
          <EmptyRoute route={route}/>}
      </DMain>
      <TxDrawer tx={liveDrawer} onClose={() => setDrawer(null)} setState={onTxStateChange}/>

      {/* Reset onboarding (demo affordance) */}
      <button onClick={() => { localStorage.removeItem('dv_activated'); setActivated(false); }}
        style={{
          position: 'fixed', bottom: 18, right: 18, zIndex: 20,
          all: 'unset', cursor: 'pointer',
          padding: '8px 14px', borderRadius: 9999,
          background: '#0A0A0A', color: '#fff',
          fontSize: 11.5, fontWeight: 500, letterSpacing: '0.04em',
          boxShadow: '0 6px 20px -6px rgba(10,10,10,0.3)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
        <Icon name="refresh" size={12}/>Rever ativação
      </button>
    </>
  );
}

function EmptyRoute({ route }) {
  const info = {
    disputas: { icon: 'shield-check', title: 'Nenhuma disputa aberta', sub: 'Quando surgir algum conflito, ele aparece aqui.' },
    extrato:  { icon: 'banknote',     title: 'Extrato em breve', sub: 'Seu histórico de saldos e saques vai ficar aqui.' },
    partes:   { icon: 'users',        title: 'Contrapartes em breve', sub: 'Pessoas com quem você já fechou acordos.' },
    settings: { icon: 'settings',     title: 'Configurações em breve', sub: 'Conta, KYC, chave Pix e notificações.' },
    help:     { icon: 'help',         title: 'Ajuda e suporte', sub: 'Documentação e contato com a equipe.' },
  }[route];
  return (
    <div style={{ padding: '80px 40px', animation: 'dv-fade-in 280ms' }}>
      <div style={{
        maxWidth: 440, margin: '0 auto', textAlign: 'center',
        background: '#fff', border: '1px solid #E4E4E7', borderRadius: 20, padding: 40,
      }}>
        <span style={{
          width: 48, height: 48, borderRadius: 14, background: '#F4F4F5',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#52525B', marginBottom: 18,
        }}>
          <Icon name={info.icon} size={22}/>
        </span>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 500,
          margin: '0 0 8px', letterSpacing: '-0.014em' }}>{info.title}</h3>
        <p style={{ fontSize: 14, color: '#71717A', margin: 0, lineHeight: 1.55 }}>{info.sub}</p>
      </div>
    </div>
  );
}

function seedTxs() {
  return [
    { id: 'TX-4193-KM7P', title: 'Landing page em Next.js', counter: 'Helena Ribeiro', value: 2500, tipo: 'servico', state: 'custodia',            when: 'hoje · 14:22', ts: Date.now() - 1e4 },
    { id: 'TX-2774-BN2L', title: 'Consultoria 10h',          counter: 'Caio Almeida',   value: 4000, tipo: 'servico', state: 'aguardando-entrega', when: 'ontem',         ts: Date.now() - 1e5 },
    { id: 'TX-9821-VRB3', title: 'iPhone 13 usado',           counter: 'Marina Silva',   value: 3200, tipo: 'produto', state: 'liberada',           when: '3 dias atrás', ts: Date.now() - 3e5 },
    { id: 'TX-0442-XT9E', title: 'Ensaio fotográfico',        counter: 'Rafael Neves',   value: 800,  tipo: 'servico', state: 'aguardando',         when: '3 dias atrás', ts: Date.now() - 4e5 },
    { id: 'TX-7730-JQ1A', title: 'Casa temporada praia',      counter: 'Tiago Oliveira', value: 1800, tipo: 'outro',   state: 'liberada',           when: '1 semana',     ts: Date.now() - 7e5 },
    { id: 'TX-5511-WZ8B', title: 'Câmera Fuji X100V',         counter: 'Beatriz Costa',  value: 6400, tipo: 'produto', state: 'disputa',            when: '2 semanas',    ts: Date.now() - 14e5 },
    { id: 'TX-3399-RC4D', title: 'Design de identidade',      counter: 'João Pereira',   value: 5500, tipo: 'servico', state: 'liberada',           when: '1 mês',        ts: Date.now() - 30e5 },
    { id: 'TX-6182-FH2M', title: 'Bike gravel 2023',          counter: 'Lucas Moura',    value: 7800, tipo: 'produto', state: 'confirmada',         when: 'ontem',        ts: Date.now() - 2e5 },
  ];
}

Object.assign(window, { DashboardApp });
