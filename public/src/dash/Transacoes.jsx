// Transações — list with filters + detail drawer
// Backed by GET /transactions, GET /transactions/:id

function Transacoes({ txs, onOpenTx }) {
  const [filter, setFilter] = useState('todos');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');

  const filtered = useMemo(() => {
    let list = txs;
    if (filter !== 'todos') list = list.filter(t => t.state === filter);
    if (query) list = list.filter(t =>
      (t.title + ' ' + t.id + ' ' + t.counter).toLowerCase().includes(query.toLowerCase()));
    if (sort === 'recent') list = [...list].sort((a, b) => b.ts - a.ts);
    if (sort === 'value-desc') list = [...list].sort((a, b) => b.value - a.value);
    if (sort === 'value-asc')  list = [...list].sort((a, b) => a.value - b.value);
    return list;
  }, [txs, filter, query, sort]);

  const filters = [
    { k: 'todos',               label: 'Todas' },
    { k: 'aguardando',          label: 'Aguardando' },
    { k: 'custodia',            label: 'Em custódia' },
    { k: 'aguardando-entrega',  label: 'Aguardando entrega' },
    { k: 'liberada',            label: 'Liberadas' },
    { k: 'disputa',             label: 'Disputa' },
  ];

  return (
    <div style={{ padding: '28px 40px 80px', animation: 'dv-fade-in 320ms' }}>
      {/* Filters */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)} style={{
              all: 'unset', cursor: 'pointer',
              padding: '7px 13px', borderRadius: 9999,
              background: filter === f.k ? '#0A0A0A' : '#fff',
              color: filter === f.k ? '#fff' : '#52525B',
              border: '1px solid ' + (filter === f.k ? '#0A0A0A' : '#E4E4E7'),
              fontSize: 13, fontWeight: 500, transition: 'all 160ms',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', background: '#fff', border: '1px solid #E4E4E7', borderRadius: 10,
        }}>
          <Icon name="search" size={14} color="#A1A1AA"/>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por ID, título ou contraparte"
            style={{ border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 13, width: 240, color: '#0A0A0A' }}/>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          padding: '8px 12px', border: '1px solid #E4E4E7', borderRadius: 10,
          background: '#fff', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <option value="recent">Mais recentes</option>
          <option value="value-desc">Maior valor</option>
          <option value="value-asc">Menor valor</option>
        </select>
      </div>

      {/* Table */}
      <DCard pad={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr 1fr 140px',
          padding: '12px 24px', borderBottom: '1px solid #EDEDEF',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#A1A1AA',
        }}>
          <span>ID</span><span>Transação</span><span>Contraparte</span><span style={{ textAlign: 'right' }}>Valor</span><span>Estado</span>
        </div>
        {filtered.map((t, i) => (
          <div key={t.id} onClick={() => onOpenTx(t)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr 1fr 140px',
              padding: '16px 24px',
              borderBottom: i < filtered.length - 1 ? '1px solid #F4F4F5' : 'none',
              fontSize: 13.5, alignItems: 'center', cursor: 'pointer',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: '#52525B' }}>{t.id}</span>
            <span style={{ color: '#0A0A0A' }}>{t.title}</span>
            <span style={{ color: '#52525B' }}>{t.counter}</span>
            <span style={{
              textAlign: 'right', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
            }}>{formatBRL(t.value)}</span>
            <span><DBadge state={t.state}/></span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#A1A1AA', fontSize: 13 }}>
            Nenhuma transação encontrada com esses filtros.
          </div>
        )}
      </DCard>
    </div>
  );
}

// ---- Drawer with transaction detail ----
function TxDrawer({ tx, onClose, setState }) {
  if (!tx) return null;
  const stateFlow = ['aguardando', 'custodia', 'aguardando-entrega', 'confirmada', 'liberada'];
  const actions = [
    { k: 'aguardando', label: 'Marcar como aguardando Pix' },
    { k: 'custodia', label: 'Pagamento recebido' },
    { k: 'aguardando-entrega', label: 'Aguardar entrega' },
    { k: 'confirmada', label: 'Confirmar entrega' },
    { k: 'liberada', label: 'Liberar para vendedor' },
    { k: 'disputa', label: 'Abrir disputa' },
  ];

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 50,
        animation: 'dv-fade-in 200ms',
      }}/>
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(520px, 100vw)',
        background: '#fff', zIndex: 51, overflowY: 'auto',
        boxShadow: '-20px 0 40px -20px rgba(10,10,10,0.2)',
        animation: 'dv-step-in 320ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px', borderBottom: '1px solid #EDEDEF',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11,
              letterSpacing: '0.14em', color: '#71717A', marginBottom: 6 }}>{tx.id}</div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 500,
              letterSpacing: '-0.016em', margin: 0,
            }}>{tx.title}</h2>
          </div>
          <button onClick={onClose} style={{
            all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 9999,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#71717A',
          }}><Icon name="x" size={18}/></button>
        </div>

        {/* Amount + state */}
        <div style={{ padding: '24px 28px', background: '#FAFAFA', borderBottom: '1px solid #EDEDEF' }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 500,
            letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginBottom: 10,
          }}>{formatBRL(tx.value)}</div>
          <DBadge state={tx.state}/>
        </div>

        {/* Details */}
        <div style={{ padding: '22px 28px' }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#71717A', margin: '0 0 14px' }}>Detalhes</h3>
          <Row k="Contraparte" v={tx.counter}/>
          <Row k="Tipo" v={tx.tipo === 'servico' ? 'Serviço' : tx.tipo === 'produto' ? 'Produto' : 'Outro'}/>
          <Row k="Método" v="Pix"/>
          <Row k="Criada" v={tx.when}/>
          <Row k="Taxa" v={formatBRL(Math.round(tx.value * 0.029))}/>
          <Row k="Valor protegido" v={formatBRL(tx.value - Math.round(tx.value * 0.029))} strong/>
        </div>

        {/* Timeline */}
        <div style={{ padding: '22px 28px', borderTop: '1px solid #EDEDEF' }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#71717A', margin: '0 0 14px' }}>Linha do tempo</h3>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 11, top: 12, bottom: 12,
              width: 1.5, background: '#F4F4F5' }}/>
            {stateFlow.map(s => {
              const currentIdx = stateFlow.indexOf(tx.state);
              const sIdx = stateFlow.indexOf(s);
              const done = sIdx <= currentIdx && currentIdx !== -1;
              const active = sIdx === currentIdx;
              return (
                <li key={s} style={{ display: 'flex', gap: 12, padding: '8px 0', position: 'relative' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 9999, flexShrink: 0,
                    background: done ? '#16794C' : '#fff',
                    border: done ? 'none' : '1.5px solid #E4E4E7',
                    color: '#fff', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: active ? '0 0 0 4px rgba(30,75,160,0.15)' : 'none',
                    zIndex: 1,
                  }}>
                    {done && <Icon name="check" size={12} strokeWidth={3}/>}
                  </span>
                  <span style={{ fontSize: 13.5, color: done ? '#0A0A0A' : '#A1A1AA', paddingTop: 4,
                    fontWeight: active ? 500 : 400 }}>
                    {({aguardando:'Aguardando pagamento','custodia':'Pagamento recebido','aguardando-entrega':'Aguardando entrega',confirmada:'Entrega confirmada',liberada:'Dinheiro liberado'})[s]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Actions — change state (the tweakable demo control) */}
        <div style={{ padding: '22px 28px', borderTop: '1px solid #EDEDEF' }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#71717A', margin: '0 0 14px' }}>Ações (demo)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {actions.map(a => (
              <button key={a.k} onClick={() => setState(tx.id, a.k)} style={{
                all: 'unset', cursor: 'pointer',
                padding: '7px 11px', borderRadius: 9999,
                background: tx.state === a.k ? '#0A0A0A' : '#fff',
                color: tx.state === a.k ? '#fff' : '#52525B',
                border: '1px solid ' + (tx.state === a.k ? '#0A0A0A' : '#E4E4E7'),
                fontSize: 12, fontWeight: 500,
              }}>{a.label}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ k, v, strong }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '9px 0', borderBottom: '1px dashed #EDEDEF',
      fontSize: 13.5,
    }}>
      <span style={{ color: '#71717A' }}>{k}</span>
      <span style={{ color: '#0A0A0A', fontWeight: strong ? 500 : 400,
        fontFamily: strong ? "'Space Grotesk', sans-serif" : "'Inter', sans-serif" }}>{v}</span>
    </div>
  );
}

Object.assign(window, { Transacoes, TxDrawer });
