// Fases — standalone page for the milestone (phased payment) flow. Seeds the
// phased negotiation and renders the Fases detail directly, with a persona
// switch (buyer approves, seller delivers). "Voltar ao app" returns to App.html.

function FasesPage() {
  const seed = useMemo(() => seedNegotiations().find(n => n.milestones && n.milestones.length) || seedNegotiations()[0], []);
  const [n, setN] = useState(seed);
  const [persona, setPersona] = useState('comprador'); // buyer can approve the delivered phase

  const onMilestone = (id, i, status) =>
    setN(prev => {
      if (!prev.milestones) return prev;
      const milestones = prev.milestones.map((m, j) => j === i ? { ...m, status } : m);
      const allApproved = milestones.every(m => m.status === 'aprovado');
      return { ...prev, milestones, status: allApproved ? 'liberado' : prev.status };
    });

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <TopBar persona={persona} setPersona={setPersona} homeHref="App.html"/>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '38px 22px 120px' }}>
        <OpenInApp href="App.html"/>
        <MilestoneDetail n={n} persona={persona}
          onBack={() => { window.location.href = 'App.html'; }}
          onMilestone={onMilestone}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FasesPage/>);
