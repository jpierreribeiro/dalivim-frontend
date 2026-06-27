// FAQ + FinalCta + Footer + Header — all in one

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
  { label: 'Como funciona', href: '#fluxo' },
  { label: 'Casos de uso', href: '#uses' },
  { label: 'FAQ', href: '#faq' }];


  // Frosted glass shared by every capsule / the connected bar.
  const glass = {
    background: scrolled ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.66)',
    backdropFilter: 'saturate(180%) blur(16px)',
    WebkitBackdropFilter: 'saturate(180%) blur(16px)',
    border: '1px solid rgba(228,228,231,0.9)'
  };
  const floatShadow = '0 12px 32px -16px rgba(10,10,10,0.28)';
  const morph = 'background 320ms cubic-bezier(0.2,0.6,0.2,1), padding 320ms cubic-bezier(0.2,0.6,0.2,1), box-shadow 320ms, border-color 320ms';

  return (
    <>
    <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center',
        padding: '16px 20px',
        pointerEvents: 'none'
      }}>
      {/* Top of page → one connected bar. On scroll → bar goes transparent and
             each group becomes its own floating glass capsule. */}
      <div style={{
          pointerEvents: 'auto',
          width: '100%', maxWidth: 1180,
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', gap: 20,
          borderRadius: 9999,
          transition: morph,
          ...(scrolled ?
          { background: 'transparent', border: '1px solid transparent', padding: 0, boxShadow: 'none' } :
          { ...glass, padding: '8px 12px 8px 20px', boxShadow: '0 1px 2px rgba(10,10,10,0.03)' })
        }}>
        {/* Logo capsule */}
        <a href="#" style={{
            justifySelf: 'start',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', color: '#0A0A0A',
            borderRadius: 9999, transition: morph,
            ...(scrolled ?
            { ...glass, padding: '10px 18px 10px 14px', boxShadow: floatShadow } :
            { padding: 0, background: 'transparent', border: '1px solid transparent', boxShadow: 'none' })
          }}>
          <img src="assets/dalivim-mark.svg" alt="" style={{ width: 24, height: 24 }} />
          <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 17,
              letterSpacing: '-0.01em'
            }}>Dalivim</span>
        </a>

        {/* Nav — fades out on scroll */}
        <nav className="dv-lp-nav" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? 'translateY(-6px)' : 'translateY(0)',
            pointerEvents: scrolled ? 'none' : 'auto',
            transition: 'opacity 260ms cubic-bezier(0.2,0.6,0.2,1), transform 320ms cubic-bezier(0.2,0.6,0.2,1)'
          }}>
          {links.map((l) =>
            <a key={l.label} href={l.href} style={{
              padding: '8px 14px',
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 13.5,
              color: '#52525B', textDecoration: 'none', borderRadius: 9999,
              transition: 'background 180ms, color 180ms'
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(10,10,10,0.05)';e.currentTarget.style.color = '#0A0A0A';}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.color = '#52525B';}}>
              {l.label}</a>
            )}
        </nav>

        {/* Actions */}
        <div className="dv-lp-topcta" style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="Onboarding.html?login=1" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 13.5,
              color: '#0A0A0A', textDecoration: 'none', borderRadius: 9999,
              transition: morph,
              ...(scrolled ?
              { ...glass, padding: '10px 18px', boxShadow: floatShadow } :
              { padding: '8px 12px', background: 'transparent', border: '1px solid transparent', boxShadow: 'none' })
            }}>
            Entrar
          </a>
          <a href="Onboarding.html?signup=1" style={{ borderRadius: 9999, boxShadow: scrolled ? floatShadow : 'none', transition: 'box-shadow 320ms' }}>
            <Button variant="primary" style={{ padding: '11px 18px', fontSize: 13.5 }}>
              Criar transação
            </Button>
          </a>
        </div>
      </div>
    </header>
    {/* Thumb-zone: primary action anchored at the bottom on phones */}
    <div className="dv-lp-mobilebar" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100,
        display: 'none',
        padding: '12px 16px calc(14px + env(safe-area-inset-bottom))',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderTop: '1px solid #E4E4E7'
      }}>
      <a href="Onboarding.html?signup=1" style={{ display: 'block', textDecoration: 'none' }}>
        <Button variant="primary" style={{ width: '100%', padding: '16px', fontSize: 15.5 }}>
          Criar transação protegida
        </Button>
      </a>
    </div>
    </>);

}

function Faq() {
  const items = [
  { q: 'Como sei que meu dinheiro está seguro?',
    a: 'Os fundos ficam em conta segregada, separada do patrimônio da Dalivim. Nenhum dinheiro transita pela nossa operação — ele só se move quando a entrega é confirmada ou o reembolso é acionado.' },
  { q: 'O que acontece se uma das partes não cumprir?',
    a: 'O dinheiro não sai da custódia. Volta integralmente para quem pagou. Se houver divergência, nossa equipe analisa as evidências e decide em até 48 horas.' },
  { q: 'Posso usar para serviços contínuos ou parcelados?',
    a: 'Sim. Você pode criar transações em etapas — cada entrega libera uma parte do pagamento. O restante continua retido até a próxima confirmação.' },
  { q: 'Quanto custa usar a Dalivim?',
    a: 'Nada por transação criada ou cancelada. Uma taxa pequena é cobrada apenas na liberação bem-sucedida. Sem mensalidade, sem cartão, sem setup.' },
  { q: 'E se eu for vítima de golpe?',
    a: 'Se a entrega não aconteceu ou foi diferente do combinado, você abre disputa e o dinheiro volta. A Dalivim é feita exatamente para esse cenário.' }];

  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ padding: '140px 0', background: '#fff', borderTop: '1px solid #E4E4E7' }}>
      <Container maxWidth={1180}>
        <div style={{
          display: 'grid', gridTemplateColumns: '0.82fr 1.18fr',
          gap: 'clamp(48px, 6vw, 96px)', alignItems: 'start'
        }} className="dv-faq-grid">

          {/* ── Left rail ── */}
          <div className="dv-faq-rail" style={{ position: 'sticky', top: 110 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18,
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1E4BA0'
            }}>
              FAQ <span style={{ color: '#1E4BA0', fontWeight: 600 }}>+</span>
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 'clamp(36px, 4.2vw, 56px)',
              letterSpacing: '-0.024em', lineHeight: 1.02,
              margin: 0, color: '#0A0A0A', textWrap: 'balance'
            }}>Ainda tem<br />dúvidas?</h2>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15.5, lineHeight: 1.6,
              color: '#71717A', margin: '20px 0 28px', maxWidth: 340
            }}>
              Regras simples, sem letra miúda. Se algo parecer escondido, é porque não existe.
            </p>

            <a href="Onboarding.html?signup=1" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 15,
              background: '#1E4BA0', color: '#fff',
              padding: '14px 22px', borderRadius: 9999, textDecoration: 'none',
              transition: 'background 200ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#153A82'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1E4BA0'}>
              Criar transação grátis</a>

            {/* contact card */}
            <a href="mailto:contato@dalivim.com.br" className="dv-faq-contact" style={{
              display: 'inline-flex', alignItems: 'center',
              marginTop: 'clamp(40px, 9vw, 96px)', textDecoration: 'none',
              position: 'relative'
            }}>
              <image-slot
                id="faq-support"
                shape="rounded" radius="18"
                style={{ width: '108px', height: '108px', flexShrink: 0, display: 'block' }}
                placeholder="Foto do time">
              </image-slot>
              <span className="dv-faq-chip" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                marginLeft: -22,
                padding: '11px 16px 11px 11px',
                background: '#fff', border: '1px solid #E4E4E7', borderRadius: 9999,
                boxShadow: '0 10px 30px -14px rgba(10,10,10,0.22)',
                transition: 'transform 200ms cubic-bezier(0.2,0.6,0.2,1), box-shadow 200ms'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateX(3px)';e.currentTarget.style.boxShadow = '0 14px 34px -14px rgba(10,10,10,0.3)';}}
              onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateX(0)';e.currentTarget.style.boxShadow = '0 10px 30px -14px rgba(10,10,10,0.22)';}}>
                <span style={{
                  flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon name="message" size={52} />
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: '#0A0A0A'
                }}>Clique aqui e fale conosco</span>
              </span>
            </a>
          </div>

          {/* ── Right: numbered accordion ── */}
          <div>
            {items.map((f, i) => {
              const isOpen = open === i;
              const num = String(i + 1).padStart(2, '0');
              return (
                <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #ECECEF' }}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    style={{
                      width: '100%', display: 'grid',
                      gridTemplateColumns: '46px 1fr 28px',
                      alignItems: 'start', gap: 16,
                      padding: isOpen ? '30px 0 18px' : '28px 0',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'padding 320ms cubic-bezier(0.2,0.6,0.2,1)'
                    }}>
                    
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                      fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.35,
                      color: '#1E4BA0', fontVariantNumeric: 'tabular-nums'
                    }}>{num}.</span>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                      fontSize: 'clamp(17px, 1.7vw, 21px)',
                      letterSpacing: '-0.012em', lineHeight: 1.35, color: '#0A0A0A',
                      paddingTop: 1
                    }}>{f.q}</span>
                    <span style={{
                      justifySelf: 'end', marginTop: 4,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 20, height: 20, color: '#1E4BA0'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{
                          transformOrigin: 'center',
                          transform: isOpen ? 'scaleY(0)' : 'scaleY(1)',
                          transition: 'transform 320ms cubic-bezier(0.2,0.6,0.2,1)'
                        }} />
                      </svg>
                    </span>
                  </button>
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0,
                    transition: 'grid-template-rows 380ms cubic-bezier(0.2,0.6,0.2,1), opacity 260ms'
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        paddingBottom: 30, paddingRight: 40, paddingLeft: 62,
                        fontFamily: "'Inter', sans-serif", fontSize: 15.5, lineHeight: 1.65,
                        color: '#52525B', maxWidth: 620
                      }}>{f.a}</div>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </Container>
    </section>);

}

function FinalCta() {
  return (
    <section id="cadastro" style={{
      padding: '140px 0', background: '#0A0A0A', color: '#fff',
      textAlign: 'center'
    }}>
      <Container maxWidth={760}>
        <Eyebrow color="#8A8A92">Comece agora</Eyebrow>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
          fontSize: 'clamp(40px, 5.5vw, 72px)',
          letterSpacing: '-0.028em', lineHeight: 1.02,
          margin: '18px 0 24px',
          textWrap: 'balance'
        }}>
          Crie sua primeira transação em 60 segundos.
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.55,
          color: '#A1A1AA', margin: '0 auto 40px', maxWidth: 540
        }}>
          Sem cadastro complicado, sem mensalidade. Você só paga quando o dinheiro é liberado.
        </p>
        <a href="Onboarding.html?signup=1" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <Button variant="primary" style={{ padding: '18px 32px', fontSize: 16 }}>
            Criar transação grátis
          </Button>
        </a>
      </Container>
    </section>);

}

function Footer() {
  return (
    <footer style={{
      background: '#0A0A0A', color: '#8A8A92',
      padding: '48px 0 56px',
      borderTop: '1px solid #1C1C20'
    }}>
      <Container>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 24, flexWrap: 'wrap',
          fontFamily: "'Inter', sans-serif", fontSize: 13
        }} className="dv-footer-row">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <img src="assets/dalivim-mark.svg" alt="" style={{ width: 22, height: 22, filter: 'invert(1)' }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 15
            }}>Dalivim</span>
          </div>
          <span>© 2026 Dalivim — Pix com garantia de entrega.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#8A8A92', textDecoration: 'none' }}>Termos</a>
            <a href="#" style={{ color: '#8A8A92', textDecoration: 'none' }}>Privacidade</a>
            <a href="mailto:contato@dalivim.com.br" style={{ color: '#8A8A92', textDecoration: 'none' }}>Contato</a>
          </div>
        </div>
      </Container>
    </footer>);

}

Object.assign(window, { Header, Faq, FinalCta, Footer });