// Disputa — standalone page for the dispute (mediation) flow. Seeds the
// in-dispute negotiation and renders the mediation detail directly, with a
// persona switch so you can see both sides. "Voltar ao app" returns to App.html.

function DisputaPage() {
  const seed = useMemo(() => seedNegotiations().find(n => n.dispute) || seedNegotiations()[0], []);
  const [n, setN] = useState(seed);
  const [persona, setPersona] = useState('vendedor'); // the side being asked to respond

  const updateDispute = (id, { reply, persona: from }) => {
    setN(prev => {
      if (!prev.dispute) return prev;
      const thread = [
        ...(prev.dispute.thread || []),
        { from, when: 'agora', text: reply },
        { from: 'dalivim', when: 'agora', text: 'Recebemos as duas versões e as provas. Nossa equipe vai analisar e responder em até 2 dias úteis.' },
      ];
      return { ...prev, dispute: { ...prev.dispute, stage: 'analise', thread } };
    });
  };
  const resolveDispute = (id, kind) => {
    setN(prev => prev.dispute ? {
      ...prev,
      status: kind === 'reembolso' ? 'reembolsado' : 'liberado',
      dispute: { ...prev.dispute, stage: 'resolucao', resolution: kind },
    } : prev);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <TopBar persona={persona} setPersona={setPersona} homeHref="App.html"/>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '38px 22px 120px' }}>
        <OpenInApp href="App.html"/>
        <DisputeDetail n={n} persona={persona}
          onBack={() => { window.location.href = 'App.html'; }}
          onUpdate={updateDispute} onResolve={resolveDispute}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DisputaPage/>);
