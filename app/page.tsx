import type { Metadata } from 'next';

// Homepage — fully server-rendered (static export) so the indexable HTML at `/`
// carries the real marketing copy, heading hierarchy, FAQ and internal links.
// The interactive/animated landing still lives at /Landing.html (noindex), but
// `/` is now the canonical, crawlable page. No client JS is required to read it.

const SITE_URL = 'https://dalivim.com.br';
// Trailing slash matches next.config `trailingSlash: true`, so the link resolves
// directly to /onboarding/ without a Cloudflare auto-slash redirect. The query
// is preserved by app/Frame.tsx into /Onboarding.html.
const SIGNUP = '/onboarding/?signup=1';
const LOGIN = '/onboarding/?login=1';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// ── Content (single source of truth, also feeds JSON-LD) ───────────────────
const FLOW = [
  { step: '1', title: 'O comprador paga via Pix', body: 'O dinheiro sai da conta do comprador — mas ainda não chega ao vendedor.' },
  { step: '2', title: 'O valor entra na custódia da Dalivim', body: 'Fica retido em conta segregada, num lugar neutro. Ninguém pode mexer: nem o comprador, nem o vendedor, nem a Dalivim.' },
  { step: '3', title: 'O vendedor entrega e os dois confirmam', body: 'A entrega acontece com o pagamento já garantido em custódia.' },
  { step: '4', title: 'Só então o dinheiro é liberado', body: 'O vendedor recebe. Se algo der errado, o valor volta integralmente para quem pagou.' },
];

const GUARANTEES = [
  { title: 'Conta segregada', body: 'Os fundos ficam separados do patrimônio da Dalivim. Nenhum dinheiro transita pela nossa operação.' },
  { title: 'Liberação condicionada', body: 'O pagamento só é liberado com a confirmação da entrega pelas duas partes.' },
  { title: 'Disputa garantida', body: 'Divergências são analisadas com base nas evidências e decididas em até 48 horas.' },
  { title: 'Reembolso garantido', body: 'Se a entrega não acontecer ou for diferente do combinado, o dinheiro volta para quem pagou.' },
  { title: 'Pix instantâneo', body: 'O pagamento entra na hora e fica protegido até o combinado ser cumprido.' },
  { title: 'Confirmação dupla', body: 'Comprador e vendedor aprovam a entrega antes de qualquer liberação.' },
];

const CATEGORIES = [
  { title: 'Programação & sites', body: 'Sites, apps e sistemas entregues por etapas — o pagamento é liberado a cada entrega aprovada.' },
  { title: 'Design & identidade', body: 'Logo, identidade visual e UI. O cliente reserva o valor antes de você começar.' },
  { title: 'Marketing & social', body: 'Gestão de redes, tráfego e conteúdo — cobrança recorrente protegida, sem cobrar no WhatsApp.' },
  { title: 'Consultoria & mentoria', body: 'O valor fica reservado e é liberado quando a sessão ou o pacote é cumprido.' },
  { title: 'Produtos & usados', body: 'Celulares, notebooks e marketplace entre desconhecidos, dentro ou fora das redes.' },
  { title: 'Veículos & itens de valor', body: 'Carros, motos e colecionáveis — o valor fica retido até a transferência e a vistoria.' },
];

const FAQS = [
  { q: 'Como sei que meu dinheiro está seguro?', a: 'Os fundos ficam em conta segregada, separada do patrimônio da Dalivim. Nenhum dinheiro transita pela nossa operação — ele só se move quando a entrega é confirmada ou o reembolso é acionado.' },
  { q: 'O que acontece se uma das partes não cumprir?', a: 'O dinheiro não sai da custódia. Volta integralmente para quem pagou. Se houver divergência, nossa equipe analisa as evidências e decide em até 48 horas.' },
  { q: 'Posso usar para serviços contínuos ou parcelados?', a: 'Sim. Você pode criar transações em etapas — cada entrega libera uma parte do pagamento. O restante continua retido até a próxima confirmação.' },
  { q: 'Quanto custa usar a Dalivim?', a: 'Nada por transação criada ou cancelada. Uma taxa pequena é cobrada apenas na liberação bem-sucedida. Sem mensalidade, sem cartão, sem setup.' },
  { q: 'E se eu for vítima de golpe?', a: 'Se a entrega não aconteceu ou foi diferente do combinado, você abre disputa e o dinheiro volta. A Dalivim é feita exatamente para esse cenário.' },
];

// ── Shared style fragments ─────────────────────────────────────────────────
const head = "'Space Grotesk', system-ui, sans-serif";
const body = "'Inter', system-ui, sans-serif";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1E4BA0', marginBottom: 14 }}>
      {children}
    </div>
  );
}

function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(30px, 4vw, 50px)', letterSpacing: '-0.024em', lineHeight: 1.05, margin: 0, color: '#0A0A0A', ...style }}>
      {children}
    </h2>
  );
}

// ── Structured data ────────────────────────────────────────────────────────
function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Dalivim',
        url: SITE_URL,
        logo: `${SITE_URL}/assets/dalivim-mark.svg`,
        description: 'Plataforma de pagamento protegido por escrow via Pix para compra e venda segura no Brasil.',
        email: 'contato@dalivim.com.br',
        areaServed: { '@type': 'Country', name: 'Brasil' },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contato@dalivim.com.br',
          contactType: 'customer support',
          availableLanguage: ['Portuguese'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Dalivim',
        inLanguage: 'pt-BR',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/#service`,
        name: 'Pix protegido por escrow',
        serviceType: 'Pagamento protegido por escrow via Pix',
        description: 'Intermediação segura de pagamento: o dinheiro fica retido em conta segregada e só é liberado quando a entrega é confirmada pelas duas partes.',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'Brasil' },
        audience: { '@type': 'Audience', audienceType: 'Compradores e vendedores' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <StructuredData />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(12px)', borderBottom: '1px solid #ECECEF' }}>
        <div className="dv-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '14px clamp(18px, 4vw, 28px)' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0A0A0A' }}>
            <img src="/assets/dalivim-mark.svg" alt="Logo da Dalivim" width={26} height={26} style={{ color: '#1E4BA0' }} />
            <span style={{ fontFamily: head, fontWeight: 500, fontSize: 18, letterSpacing: '-0.01em' }}>Dalivim</span>
          </a>
          <nav className="dv-nav" aria-label="Navegação principal">
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#casos">Casos de uso</a>
            <a href="#faq">Perguntas frequentes</a>
          </nav>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <a className="dv-header-login" href={LOGIN}>Entrar</a>
            <a className="dv-btn dv-btn-primary" href={SIGNUP} style={{ padding: '11px 18px', fontSize: 14 }}>Criar transação</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 60%, #F4F7FB 100%)', borderBottom: '1px solid #E4E4E7', padding: 'clamp(56px, 9vw, 96px) 0' }}>
          <div className="dv-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: '#fff', border: '1px solid #E4E4E7', borderRadius: 9999, fontFamily: body, fontSize: 13, fontWeight: 500, color: '#27272A', boxShadow: '0 1px 2px rgba(10,10,10,0.04)' }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: 9999, background: '#16794C' }} />
              Pix protegido por escrow
            </span>

            <h1 style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(38px, 6.4vw, 84px)', lineHeight: 1.02, letterSpacing: '-0.03em', margin: '24px 0 0', color: '#0A0A0A', maxWidth: 940, textWrap: 'balance' }}>
              Pix protegido: negocie sem precisar{' '}
              <span style={{ background: 'linear-gradient(90deg, #1E4BA0 0%, #16794C 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#1E4BA0' }}>confiar.</span>
            </h1>

            <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', lineHeight: 1.55, color: '#52525B', margin: '22px 0 0', maxWidth: 580 }}>
              A Dalivim é o pagamento seguro para compra e venda no Brasil: o dinheiro fica
              protegido em custódia e só é liberado quando o combinado é cumprido.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 32 }}>
              <a className="dv-btn dv-btn-dark" href={SIGNUP}>Criar negociação protegida</a>
              <a className="dv-btn dv-btn-ghost" href="#como-funciona">Como funciona</a>
            </div>

            {/* Static custody preview card */}
            <div style={{ width: '100%', maxWidth: 440, margin: '52px auto 0', background: '#fff', border: '1px solid #ECECEF', borderRadius: 22, padding: '24px 26px', textAlign: 'left', boxShadow: '0 1px 2px rgba(10,10,10,0.04), 0 40px 80px -44px rgba(30,75,160,0.28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717A' }}>
                <span>Custódia</span>
                <span style={{ color: '#16794C' }}>ativa</span>
              </div>
              <div style={{ fontFamily: head, fontWeight: 500, fontSize: 36, letterSpacing: '-0.022em', color: '#0A0A0A' }}>R$ 3.000,00</div>
              <div style={{ fontFamily: body, fontSize: 13, color: '#71717A', margin: '6px 0 16px' }}>Pagamento reservado · fora da operação da Dalivim</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #F0F0F2', fontFamily: body, fontSize: 13.5, color: '#27272A' }}>
                <span>Comprador</span><span style={{ color: '#16794C' }}>confirmou ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #F0F0F2', fontFamily: body, fontSize: 13.5, color: '#27272A' }}>
                <span>Vendedor</span><span style={{ color: '#A1A1AA' }}>aguardando entrega</span>
              </div>
              <div style={{ marginTop: 14, padding: '12px 14px', background: '#F3F7FC', border: '1px solid #DCE7F6', borderRadius: 12, fontFamily: body, fontSize: 13, color: '#1E4BA0' }}>
                Valor liberado só com a aprovação dos dois lados.
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" style={{ background: '#FAFAFA', borderBottom: '1px solid #E4E4E7', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container">
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <Eyebrow>Como funciona</Eyebrow>
              <H2>Como funciona o Pix protegido por escrow</H2>
              <p style={{ fontFamily: body, fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.6, color: '#52525B', margin: '18px 0 0' }}>
                Escrow é simples quando você vê acontecer: o pagamento fica num lugar neutro e
                só é liberado depois que a entrega é cumprida. Veja para onde o seu dinheiro vai.
              </p>
            </div>
            <ol className="dv-grid-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {FLOW.map((s) => (
                <li key={s.step} className="dv-card" style={{ display: 'flex', gap: 18 }}>
                  <span aria-hidden style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 9999, background: '#EEF3FB', color: '#1E4BA0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: head, fontWeight: 600 }}>{s.step}</span>
                  <div>
                    <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 18, letterSpacing: '-0.012em', margin: '6px 0 6px', color: '#0A0A0A' }}>{s.title}</h3>
                    <p style={{ fontFamily: body, fontSize: 14.5, lineHeight: 1.55, color: '#52525B', margin: 0 }}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contrast */}
        <section style={{ background: '#fff', borderBottom: '1px solid #E4E4E7', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container">
            <div style={{ maxWidth: 680, marginBottom: 48 }}>
              <Eyebrow>A diferença</Eyebrow>
              <H2>O mesmo Pix. Dois desfechos diferentes.</H2>
            </div>
            <div className="dv-grid-2">
              <div className="dv-card" style={{ padding: 32 }}>
                <div style={{ fontFamily: body, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 10 }}>Sem escrow</div>
                <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.016em', margin: '0 0 20px', color: '#0A0A0A' }}>Você envia o Pix — e torce.</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {['O dinheiro vai direto e não tem volta.', 'O vendedor pode receber e sumir.', 'Deu problema? Resta tentar resolver depois.'].map((p) => (
                    <li key={p} style={{ display: 'flex', gap: 12, fontFamily: body, fontSize: 15.5, color: '#52525B' }}>
                      <span aria-hidden style={{ color: '#A1A1AA' }}>✕</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dv-card" style={{ padding: 32 }}>
                <div style={{ fontFamily: body, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#16794C', marginBottom: 10 }}>Com a Dalivim</div>
                <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.016em', margin: '0 0 20px', color: '#0A0A0A' }}>O Pix fica protegido até a entrega.</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {['O valor fica retido num lugar neutro.', 'O vendedor sabe que o dinheiro já está reservado.', 'Aprovar, contestar ou reembolsar — com regras claras.'].map((p) => (
                    <li key={p} style={{ display: 'flex', gap: 12, fontFamily: body, fontSize: 15.5, color: '#0A0A0A', fontWeight: 500 }}>
                      <span aria-hidden style={{ color: '#16794C' }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section style={{ background: '#FAFAFA', borderBottom: '1px solid #E4E4E7', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container">
            <div style={{ maxWidth: 680, marginBottom: 48 }}>
              <Eyebrow>Como protegemos seu dinheiro</Eyebrow>
              <H2>Uma rede de garantias com o dinheiro no centro.</H2>
            </div>
            <div className="dv-grid-3">
              {GUARANTEES.map((g) => (
                <article key={g.title} className="dv-card">
                  <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 18, letterSpacing: '-0.012em', margin: '0 0 8px', color: '#0A0A0A' }}>{g.title}</h3>
                  <p style={{ fontFamily: body, fontSize: 14.5, lineHeight: 1.55, color: '#52525B', margin: 0 }}>{g.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits — buyer & seller */}
        <section id="beneficios" style={{ background: '#fff', borderBottom: '1px solid #E4E4E7', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container">
            <div style={{ maxWidth: 680, marginBottom: 48 }}>
              <Eyebrow>Para os dois lados</Eyebrow>
              <H2>Proteção para comprador e vendedor.</H2>
            </div>
            <div className="dv-grid-2">
              <div className="dv-card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 22, letterSpacing: '-0.016em', margin: '0 0 18px', color: '#0A0A0A' }}>Para quem compra</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {['Paga via Pix sabendo que o dinheiro fica protegido até receber.', 'Se a entrega não acontecer ou for diferente do combinado, o valor volta.', 'Abre disputa com regras claras e decisão em até 48 horas.'].map((p) => (
                    <li key={p} style={{ display: 'flex', gap: 12, fontFamily: body, fontSize: 15.5, lineHeight: 1.5, color: '#27272A' }}>
                      <span aria-hidden style={{ color: '#16794C' }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dv-card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 22, letterSpacing: '-0.016em', margin: '0 0 18px', color: '#0A0A0A' }}>Para quem vende</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {['Começa o trabalho ou envia o produto com o pagamento já garantido em custódia.', 'Dinheiro na custódia é dinheiro confirmado — sem correr atrás de calote.', 'Recebe na hora assim que a entrega é aprovada pelas duas partes.'].map((p) => (
                    <li key={p} style={{ display: 'flex', gap: 12, fontFamily: body, fontSize: 15.5, lineHeight: 1.5, color: '#27272A' }}>
                      <span aria-hidden style={{ color: '#16794C' }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section id="casos" style={{ background: '#FAFAFA', borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container">
            <div style={{ maxWidth: 700, marginBottom: 48 }}>
              <Eyebrow>Casos de uso</Eyebrow>
              <H2>Para quem vive de entregar e quer receber.</H2>
              <p style={{ fontFamily: body, fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.6, color: '#52525B', margin: '18px 0 0' }}>
                De um projeto de design a uma consultoria mensal, a custódia garante que você
                receba pelo que entregar. E vale também para a venda de produtos e usados entre
                desconhecidos.
              </p>
            </div>
            <div className="dv-grid-3">
              {CATEGORIES.map((c) => (
                <article key={c.title} className="dv-card">
                  <h3 style={{ fontFamily: head, fontWeight: 500, fontSize: 18, letterSpacing: '-0.012em', margin: '0 0 8px', color: '#0A0A0A' }}>{c.title}</h3>
                  <p style={{ fontFamily: body, fontSize: 14.5, lineHeight: 1.55, color: '#52525B', margin: 0 }}>{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ background: '#fff', borderBottom: '1px solid #E4E4E7', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container" style={{ maxWidth: 820 }}>
            <div style={{ marginBottom: 32 }}>
              <Eyebrow>FAQ</Eyebrow>
              <H2>Perguntas frequentes</H2>
              <p style={{ fontFamily: body, fontSize: 15.5, lineHeight: 1.6, color: '#71717A', margin: '16px 0 0' }}>
                Regras simples, sem letra miúda. Se algo parecer escondido, é porque não existe.
              </p>
            </div>
            <div>
              {FAQS.map((f, i) => (
                <details key={f.q} className="dv-faq-item" open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ background: '#0A0A0A', color: '#fff', textAlign: 'center', padding: 'clamp(72px, 10vw, 128px) 0' }}>
          <div className="dv-container" style={{ maxWidth: 760 }}>
            <H2 style={{ color: '#fff', fontSize: 'clamp(34px, 5vw, 60px)' }}>Crie sua primeira transação em 60 segundos.</H2>
            <p style={{ fontFamily: body, fontSize: 18, lineHeight: 1.55, color: '#A1A1AA', margin: '20px auto 36px', maxWidth: 540 }}>
              Sem cadastro complicado, sem mensalidade. Você só paga quando o dinheiro é liberado.
            </p>
            <a className="dv-btn dv-btn-primary" href={SIGNUP} style={{ fontSize: 16, padding: '16px 30px' }}>Criar transação grátis</a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#0A0A0A', color: '#8A8A92', borderTop: '1px solid #1C1C20', padding: '44px 0 52px' }}>
        <div className="dv-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontFamily: body, fontSize: 13 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <img src="/assets/dalivim-mark.svg" alt="" width={22} height={22} style={{ filter: 'invert(1)' }} />
            <span style={{ fontFamily: head, fontWeight: 500, fontSize: 15 }}>Dalivim</span>
          </span>
          <span>© 2026 Dalivim — Pix com garantia de entrega.</span>
          <nav style={{ display: 'flex', gap: 20 }} aria-label="Rodapé">
            <a href="/termos" style={{ color: '#8A8A92', textDecoration: 'none' }}>Termos</a>
            <a href="/privacidade" style={{ color: '#8A8A92', textDecoration: 'none' }}>Privacidade</a>
            <a href="mailto:contato@dalivim.com.br" style={{ color: '#8A8A92', textDecoration: 'none' }}>Contato</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
