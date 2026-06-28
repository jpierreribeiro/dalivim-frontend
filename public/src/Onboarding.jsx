// Onboarding — login + guided setup. Mirrors the reference's two-panel pattern
// (progress + left form + right LIVE preview), but adapted to Dalivim: the flow
// teaches the product by building the user's first protected negotiation. The
// right panel is a custody card that fills in as the user advances.

const OB_LS = 'dalivim-onboarding-v1';
const OB_TOTAL = 5;

function obLoad() {
  try { return JSON.parse(localStorage.getItem(OB_LS)) || null; } catch (e) { return null; }
}

// A valid v4 UUID (used as a placeholder Pix key at signup; see register call).
function randomUUID() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ---------- small primitives ----------
function OBField({ label, hint, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 18 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 7,
        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
        color: '#0A0A0A', marginBottom: 8,
      }}>
        {label}{hint && <span style={{ color: '#A1A1AA', fontWeight: 400, fontSize: 12 }}>{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function OBInput({ value, onChange, placeholder, prefix, maxLength, disabled }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '13px 15px',
      background: disabled ? '#F4F4F5' : '#fff',
      border: '1.5px solid ' + (focus ? '#1E4BA0' : '#E4E4E7'),
      borderRadius: 12, transition: 'border-color 180ms',
    }}>
      {prefix && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: '#A1A1AA' }}>{prefix}</span>}
      <input
        value={value} placeholder={placeholder} maxLength={maxLength} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: '#0A0A0A',
        }}
      />
    </div>
  );
}

function BrandGlyph({ name, size = 16 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, style: { flexShrink: 0, display: 'block' } };
  switch (name) {
    case 'instagram':
      return (
        <svg {...p} fill="none" stroke="#E1306C" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5"/>
          <circle cx="12" cy="12" r="4.2"/>
          <circle cx="17.2" cy="6.8" r="1.1" fill="#E1306C" stroke="none"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg {...p}>
          <rect x="2" y="5" width="20" height="14" rx="4.5" fill="#FF0000"/>
          <path d="M10 8.7 L16 12 L10 15.3 Z" fill="#fff"/>
        </svg>
      );
    case 'google':
      return (
        <svg {...p} viewBox="0 0 48 48">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 1.8-1.5 4.6-4.3 6.5l6.6 5.1c3.9-3.6 6.7-8.9 6.7-14.9z"/>
          <path fill="#34A853" d="M24 46c5.9 0 10.8-1.9 14.4-5.3l-6.6-5.1c-1.8 1.2-4.2 2.1-7.8 2.1-5.9 0-11-4-12.8-9.5l-6.8 5.3C7.9 40.6 15.4 46 24 46z"/>
          <path fill="#FBBC05" d="M11.2 28.2c-.5-1.4-.8-2.8-.8-4.2s.3-2.9.7-4.2l-6.8-5.3C2.9 17.3 2 20.5 2 24s.9 6.7 2.4 9.5l6.8-5.3z"/>
          <path fill="#EA4335" d="M24 10.3c3.2 0 5.4 1.4 6.7 2.6l4.9-4.8C32.8 5.4 28 3.5 24 3.5 15.4 3.5 7.9 8.9 4.4 16.5l6.8 5.3C13 14.3 18.1 10.3 24 10.3z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...p} fill="#0A0A0A">
          <path d="M16.5 3c.3 2.3 1.7 4.1 4 4.4v2.7c-1.5 0-2.8-.4-4-1.1v5.9c0 3.4-2.6 5.6-5.7 5.6-3 0-5.3-2.3-5.3-5.2 0-3.1 2.5-5.3 5.6-5.1v2.8c-.4-.1-.8-.2-1.1-.2-1.4 0-2.6 1.1-2.6 2.6 0 1.5 1.1 2.5 2.5 2.5 1.5 0 2.6-1.1 2.6-2.9V3h3z"/>
        </svg>
      );
    default:
      return null;
  }
}

function OBChip({ selected, onClick, children, icon, flag, brand }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 16px', cursor: 'pointer',
        fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
        background: selected ? '#EFF4FB' : '#fff',
        color: selected ? '#15356E' : '#27272A',
        border: (selected ? '2px' : '1.5px') + ' solid ' + (selected ? '#1E4BA0' : hover ? '#C7C7CE' : '#E4E4E7'),
        borderRadius: 9999, transition: 'all 160ms cubic-bezier(0.2,0.6,0.2,1)',
      }}>
      {flag && <span aria-hidden>{flag}</span>}
      {brand && <BrandGlyph name={brand} size={16}/>}
      {icon && <Icon name={icon} size={15}/>}
      {children}
    </button>
  );
}

function OBConnectRow({ icon, name, sub, connected, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 13,
      padding: '15px 16px',
      border: '1.5px solid ' + (connected ? 'rgba(30,138,90,0.4)' : '#E4E4E7'),
      borderRadius: 14, background: connected ? '#F4FBF7' : '#fff',
      transition: 'all 200ms',
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: '#F4F4F5', border: '1px solid #ECECEF',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={icon} size={20}/></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500, color: '#0A0A0A' }}>{name}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#71717A', marginTop: 1 }}>{sub}</div>
      </div>
      {connected ? (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#1E8A5A',
        }}>
          <Icon name="check" size={15} strokeWidth={2.5}/>Conectado
        </span>
      ) : (
        <button type="button" onClick={onToggle} style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
          color: '#0A0A0A', background: '#fff', border: '1.5px solid #E4E4E7',
          padding: '9px 16px', borderRadius: 9999, cursor: 'pointer', transition: 'border-color 160ms',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#1E4BA0'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#E4E4E7'}
        >Conectar</button>
      )}
    </div>
  );
}

// ---------- step 3: real KYC + Pix wiring ----------
// CPF → POST /me/kyc/basic (parks the seller at "pending_basic"; a Dalivim
// admin approves before charges unlock). Pix key → PATCH /seller/pix-key.
function obDigits(s) { return (s || '').replace(/\D/g, ''); }
function obMaskCPF(s) {
  const d = obDigits(s).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
}

function OBStatusPill({ tone, children }) {
  const c = tone === 'ok'
    ? { fg: '#1E8A5A', bg: '#F4FBF7', bd: 'rgba(30,138,90,0.3)' }
    : tone === 'pending'
    ? { fg: '#9A6700', bg: '#FFF8E6', bd: 'rgba(154,103,0,0.25)' }
    : { fg: '#B42318', bg: '#FEF3F2', bd: '#FDA29B' };
  return (
    <div role="status" style={{
      fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, color: c.fg,
      background: c.bg, border: '1px solid ' + c.bd, borderRadius: 10,
      padding: '9px 12px', margin: '2px 0 10px', lineHeight: 1.4,
    }}>{children}</div>
  );
}

function OBSmallButton({ disabled, onClick, children }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} style={{
      width: '100%', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
      color: '#fff', background: disabled ? '#9DAFCB' : '#0A0A0A', border: 'none',
      borderRadius: 10, padding: '12px 16px', cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 160ms',
    }}>{children}</button>
  );
}

function OBPixStep({ data, set }) {
  const [cpf, setCpf] = useState('');
  const [dob, setDob] = useState('');
  const [kyc, setKyc] = useState({
    state: data.kycSubmitted ? 'done' : 'idle',
    tone: 'pending',
    msg: data.kycSubmitted ? 'Identidade enviada — em análise pela Dalivim.' : null,
  });
  const [pixKey, setPixKey] = useState(data.pixKey || data.email || '');
  const [pix, setPix] = useState({
    state: data.pixConnected ? 'done' : 'idle',
    msg: data.pixConnected ? 'Chave Pix salva.' : null,
  });

  const cpfValid = obDigits(cpf).length === 11;
  const dobValid = /^\d{4}-\d{2}-\d{2}$/.test(dob);

  async function submitKyc() {
    if (kyc.state === 'loading') return;
    setKyc({ state: 'loading', tone: 'pending', msg: null });
    try {
      await DalivimAPI.post('/me/kyc/basic', {
        full_name: (data.name || '').trim(),
        cpf: obDigits(cpf),
        date_of_birth: dob,
      });
      set('kycSubmitted', true);
      setKyc({ state: 'done', tone: 'pending', msg: 'Identidade enviada — em análise pela Dalivim.' });
    } catch (e) {
      if (e.status === 409 && e.code === 'KYC_ALREADY_VERIFIED') {
        set('kycSubmitted', true); setKyc({ state: 'done', tone: 'ok', msg: 'Identidade já verificada.' });
      } else if (e.status === 409) {
        set('kycSubmitted', true); setKyc({ state: 'done', tone: 'pending', msg: 'Verificação já enviada — em análise.' });
      } else if (e.status === 401) {
        setKyc({ state: 'error', tone: 'error', msg: 'Sua sessão expirou. Volte e entre novamente.' });
      } else {
        setKyc({ state: 'error', tone: 'error', msg: e.message || 'CPF ou data inválidos. Confira e tente de novo.' });
      }
    }
  }

  async function submitPix() {
    if (pix.state === 'loading') return;
    setPix({ state: 'loading', msg: null });
    try {
      await DalivimAPI.patch('/seller/pix-key', { pix_key: pixKey.trim() });
      set('pixConnected', true); set('pixKey', pixKey.trim());
      setPix({ state: 'done', msg: 'Chave Pix salva.' });
    } catch (e) {
      if (e.status === 401) setPix({ state: 'error', msg: 'Sua sessão expirou. Volte e entre novamente.' });
      else setPix({ state: 'error', msg: e.message || 'Chave Pix inválida. Confira e tente de novo.' });
    }
  }

  const dateStyle = {
    width: '100%', padding: '12px 15px', border: '1.5px solid #E4E4E7', borderRadius: 12,
    outline: 'none', background: '#fff', fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: '#0A0A0A',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Identidade (KYC básico) */}
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#0A0A0A', marginBottom: 12 }}>Identidade (CPF)</div>
        {kyc.state === 'done' ? (
          <OBStatusPill tone={kyc.tone}>{kyc.msg}</OBStatusPill>
        ) : (
          <>
            <OBField label="CPF">
              <OBInput value={obMaskCPF(cpf)} onChange={v => setCpf(obDigits(v))} placeholder="000.000.000-00" maxLength={14}/>
            </OBField>
            <OBField label="Data de nascimento">
              <input type="date" value={dob} max="2010-12-31" onChange={e => setDob(e.target.value)} style={dateStyle}/>
            </OBField>
            {kyc.msg && <OBStatusPill tone={kyc.tone}>{kyc.msg}</OBStatusPill>}
            <OBSmallButton disabled={!cpfValid || !dobValid || kyc.state === 'loading'} onClick={submitKyc}>
              {kyc.state === 'loading' ? 'Enviando…' : 'Enviar para verificação'}
            </OBSmallButton>
          </>
        )}
      </div>

      {/* Chave Pix */}
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#0A0A0A', marginBottom: 12 }}>Chave Pix · para receber</div>
        {pix.state === 'done' ? (
          <OBStatusPill tone="ok">{pix.msg}</OBStatusPill>
        ) : (
          <>
            <OBField label="Chave Pix" hint="· CPF, e-mail, telefone ou aleatória">
              <OBInput value={pixKey} onChange={setPixKey} placeholder="sua chave Pix" maxLength={100}/>
            </OBField>
            {pix.msg && <OBStatusPill tone="error">{pix.msg}</OBStatusPill>}
            <OBSmallButton disabled={pixKey.trim().length < 1 || pix.state === 'loading'} onClick={submitPix}>
              {pix.state === 'loading' ? 'Salvando…' : 'Salvar chave Pix'}
            </OBSmallButton>
          </>
        )}
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#A1A1AA', margin: 0, lineHeight: 1.5 }}>
        A identidade é analisada pela Dalivim antes de liberar cobranças. Os valores ficam em conta segregada, separada da operação da Dalivim.
      </p>
    </div>
  );
}

// ---------- live preview panel ----------
const USE_LABELS = { comprar: 'Comprar', vender: 'Vender', servicos: 'Serviços', ambos: 'Comprar e vender' };
const TX_LABELS = { produto: 'Produto', servico: 'Serviço', outro: 'Outro acordo' };

function OBPreview({ data, step, stage }) {
  const initial = (data.name.trim()[0] || 'D').toUpperCase();
  const verified = data.idVerified || data.pixConnected;
  const showTx = (typeof step === 'number' && step >= 4 && data.txType) || stage === 'done';
  const fee = Math.max(3, Math.round(data.value * 0.029));
  return (
    <div style={{
      background: '#fff', border: '1px solid #ECECEF', borderRadius: 18,
      padding: '22px 22px 24px', width: '100%', maxWidth: 380,
      boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 24px 50px -30px rgba(10,10,10,0.2)',
    }}>
      {/* profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          width: 52, height: 52, borderRadius: 13, flexShrink: 0,
          background: '#1E4BA0', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 22,
        }}>{initial}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 16,
            letterSpacing: '-0.01em', color: data.name ? '#0A0A0A' : '#A1A1AA',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{data.name || 'Seu nome'}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A' }}>
            @{data.username || 'usuario'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 500,
          padding: '5px 10px', borderRadius: 9999,
          background: verified ? '#F4FBF7' : '#F4F4F5',
          color: verified ? '#1E8A5A' : '#71717A',
          border: '1px solid ' + (verified ? 'rgba(30,138,90,0.3)' : '#E4E4E7'),
        }}>
          <Icon name={verified ? 'shield-check' : 'lock'} size={12}/>
          {verified ? 'Verificado' : 'Não verificado'}
        </span>
        {data.use && (
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 500,
            padding: '5px 10px', borderRadius: 9999, background: '#F4F4F5', color: '#52525B',
            border: '1px solid #E4E4E7',
          }}>{USE_LABELS[data.use]}</span>
        )}
      </div>

      {/* the negotiation taking shape */}
      <div style={{
        marginTop: 20, paddingTop: 20, borderTop: '1px solid #ECECEF',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 14,
        }}>Sua negociação protegida</div>

        {showTx ? (
          <>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 30, letterSpacing: '-0.02em', lineHeight: 1, color: '#0A0A0A',
              fontVariantNumeric: 'tabular-nums',
            }}>{formatBRL(data.value)}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#71717A', margin: '6px 0 16px' }}>
              {TX_LABELS[data.txType] || 'Negociação'} · {data.order === 'entrega' ? 'entrega primeiro' : 'pagamento primeiro'}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 12,
              background: '#0A0A0A', color: '#fff',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: "'Inter', sans-serif", fontSize: 13,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: 9999, background: '#7FD1A8',
                  boxShadow: '0 0 0 3px rgba(127,209,168,0.2)',
                  animation: 'dv-pulse-dot 2s ease-in-out infinite',
                }}/>
                {stage === 'done' ? 'Em custódia' : 'Pronto para proteger'}
              </span>
              <Icon name="lock" size={14} color="#9DBDF0"/>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#A1A1AA', marginTop: 12,
            }}>
              <span>Taxa Dalivim (2,9%)</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>− {formatBRL(fee)}</span>
            </div>
          </>
        ) : (
          <div style={{
            border: '1.5px dashed #E4E4E7', borderRadius: 12,
            padding: '24px 18px', textAlign: 'center',
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#A1A1AA', lineHeight: 1.5,
          }}>
            Conclua os passos e veja sua<br/>primeira negociação tomar forma.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- step shell (progress + form + preview + nav) ----------
function OBStepShell({ step, title, sub, children, onBack, onNext, nextLabel, canNext, data, stage }) {
  return (
    <div className="dv-ob-card" style={{
      width: '100%', maxWidth: 1040,
      background: '#fff', border: '1px solid #E4E4E7', borderRadius: 28,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 40px 90px -50px rgba(10,10,10,0.3)',
      display: 'grid', gridTemplateColumns: '1.05fr 0.95fr',
    }}>
      {/* left: form */}
      <div className="dv-ob-form" style={{
        padding: 'clamp(28px, 4vw, 48px)',
        display: 'flex', flexDirection: 'column', minHeight: 560,
      }}>
        {/* progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {Array.from({ length: OB_TOTAL }).map((_, i) => (
            <span key={i} style={{
              flex: 1, height: 5, borderRadius: 9999,
              background: i < step ? '#1E4BA0' : '#ECECEF',
              transition: 'background 420ms cubic-bezier(0.2,0.8,0.2,1)',
            }}/>
          ))}
        </div>

        <div key={step} style={{ animation: 'dv-step-in 380ms cubic-bezier(0.2,0.8,0.2,1)', flex: 1 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 'clamp(24px, 2.6vw, 30px)', letterSpacing: '-0.02em',
            lineHeight: 1.12, margin: 0, color: '#0A0A0A',
          }}>{title}</h2>
          {sub && <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.55,
            color: '#71717A', margin: '10px 0 26px',
          }}>{sub}</p>}
          <div style={{ marginTop: sub ? 0 : 26 }}>{children}</div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button type="button" onClick={onBack} style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500, color: '#52525B',
            background: '#fff', border: '1.5px solid #E4E4E7', borderRadius: 9999,
            padding: '14px 22px', cursor: 'pointer', transition: 'border-color 160ms',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#C7C7CE'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E4E4E7'}
          >Voltar</button>
          <button type="button" onClick={() => canNext && onNext()} disabled={!canNext} style={{
            flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 600,
            color: canNext ? '#15356E' : '#C4C4C9',
            background: canNext ? 'rgba(30,75,160,0.10)' : '#F4F4F5',
            border: '2px solid ' + (canNext ? '#1E4BA0' : '#EDEDEF'), borderRadius: 9999, padding: '13px 22px',
            cursor: canNext ? 'pointer' : 'not-allowed',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 200ms',
          }}
          onMouseEnter={e => { if (canNext) e.currentTarget.style.background = 'rgba(30,75,160,0.16)'; }}
          onMouseLeave={e => { if (canNext) e.currentTarget.style.background = 'rgba(30,75,160,0.10)'; }}
          >{nextLabel || 'Continuar'}<Icon name="arrow-right" size={15} flat color={canNext ? '#15356E' : '#C4C4C9'}/></button>
        </div>
      </div>

      {/* right: live preview */}
      <div className="dv-ob-preview" style={{
        background: '#FAFAFA', borderLeft: '1px solid #ECECEF',
        padding: 'clamp(28px, 4vw, 48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: 9999,
          background: 'radial-gradient(closest-side, rgba(30,75,160,0.08), transparent)',
        }}/>
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <OBPreview data={data} step={step} stage={stage}/>
        </div>
      </div>
    </div>
  );
}

// ---------- welcome / login ----------
// Real auth against the backend (window.DalivimAPI → /auth/login,/auth/register).
// On success the JWT is persisted (DalivimAPI.setToken) and shared across the
// same-origin bundles, then we hand off to the guided setup / app.
function OBAuthInput({ type, value, onChange, placeholder, autoComplete, onEnter }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      onKeyDown={e => { if (e.key === 'Enter' && onEnter) onEnter(); }}
      style={{
        width: '100%', padding: '13px 15px', textAlign: 'left',
        border: '1.5px solid ' + (focus ? '#1E4BA0' : '#E4E4E7'), borderRadius: 12,
        outline: 'none', background: '#fff', marginBottom: 12,
        fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: '#0A0A0A',
        transition: 'border-color 180ms',
      }}
    />
  );
}

function OBWelcome({ data, set, onStart, onAuthed, initialView, initialMode }) {
  // view: 'choices' (Google / e-mail) → 'email' (real login/register form).
  // Landing deep-links set these: ?signup=1 → create-account, ?login=1 → login.
  const [view, setView] = useState(initialView || 'choices');
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(data.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleNote, setGoogleNote] = useState(false);

  const canSubmit = email.trim().length > 3 && email.includes('@') &&
    password.length >= (mode === 'register' ? 8 : 1) &&
    (mode === 'login' || name.trim().length >= 2);

  async function submit() {
    if (!canSubmit || loading) return;
    setLoading(true); setError(null);
    try {
      let resp;
      if (mode === 'register') {
        // Register clean (no pix_key) — the seller sets the real key later in
        // the "Identidade e Pix" step. If the deployed backend still requires
        // a Pix key for sellers, retry once with a valid placeholder UUID
        // (overwritten by the real key in onboarding). This keeps signup
        // working across backend versions and self-cleans once the backend
        // that makes pix_key optional is live.
        const regBody = { email: email.trim(), password, full_name: name.trim(), type: 'seller' };
        try {
          resp = await DalivimAPI.post('/auth/register', regBody, { auth: false });
        } catch (e) {
          if (e.status === 422 && /pix.?key/i.test(e.message || '')) {
            resp = await DalivimAPI.post('/auth/register', { ...regBody, pix_key: randomUUID() }, { auth: false });
          } else {
            throw e;
          }
        }
      } else {
        resp = await DalivimAPI.post('/auth/login', {
          email: email.trim(), password,
        }, { auth: false });
      }
      if (resp && resp.token) DalivimAPI.setToken(resp.token);
      if (resp && resp.user) DalivimAPI.setUser(resp.user);
      // Seed the guided-setup data from the account we just got.
      if (resp && resp.user && resp.user.full_name) set('name', resp.user.full_name);
      onAuthed(resp, mode);
    } catch (e) {
      // 409 on register = e-mail já cadastrado → nudge to login.
      if (mode === 'register' && e.status === 409) {
        setError('Esse e-mail já tem conta. Faça login.');
        setMode('login');
      } else if (mode === 'login' && e.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(e.message || 'Não foi possível continuar. Tente de novo.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Google OAuth: ask the backend to start the flow and redirect to Google.
  // Until GOOGLE_OAUTH_* is configured server-side, /auth/google/start 404s and
  // we show a friendly "em breve" note instead of breaking.
  async function googleStart() {
    setError(null);
    try {
      const res = await DalivimAPI.post('/auth/google/start', {}, { auth: false });
      if (res && res.auth_url) { window.location.href = res.auth_url; return; }
      setGoogleNote(true);
    } catch (e) {
      setGoogleNote(true);
    }
  }

  const googleBtn = (
    <>
      <button type="button" onClick={googleStart} style={{
        width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 11,
        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: '#0A0A0A',
        background: '#fff', border: '1.5px solid #E4E4E7', borderRadius: 9999,
        padding: '14px 20px', cursor: 'pointer', marginBottom: 10, transition: 'border-color 160ms',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#C7C7CE'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#E4E4E7'}
      >
        <span style={{
          width: 20, height: 20, borderRadius: 5, background: '#fff', border: '1px solid #E4E4E7',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#1E4BA0',
        }}>G</span>
        Continuar com Google
      </button>
      {googleNote && (
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#A1A1AA', margin: '0 0 10px' }}>
          Login com Google em breve — use seu e-mail por enquanto.
        </div>
      )}
    </>
  );

  const orDivider = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0 14px' }}>
      <span style={{ flex: 1, height: 1, background: '#ECECEF' }}/>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#A1A1AA' }}>ou</span>
      <span style={{ flex: 1, height: 1, background: '#ECECEF' }}/>
    </div>
  );

  return (
    <div style={{
      width: '100%', maxWidth: 420,
      background: '#fff', border: '1px solid #E4E4E7', borderRadius: 24,
      padding: 'clamp(28px, 4vw, 40px)',
      boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 40px 90px -50px rgba(10,10,10,0.3)',
      textAlign: 'center',
    }}>
      <img src="assets/dalivim-mark.svg" alt="" style={{ width: 34, height: 34, margin: '0 auto 18px', display: 'block' }}/>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#1E4BA0',
        letterSpacing: '0.02em', marginBottom: 8,
      }}>Bem-vindo à Dalivim</div>
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 'clamp(26px, 3vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.1,
        margin: '0 0 28px', color: '#0A0A0A',
      }}>{view === 'email' && mode === 'login' ? 'Entrar na sua conta' : 'Crie sua conta protegida'}</h1>

      {view === 'email' && mode === 'register' && (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.5, color: '#71717A', margin: '-16px 0 22px' }}>
          Cadastro rápido. Em seguida você configura identidade, Pix e sua primeira negociação.
        </p>
      )}

      {view === 'choices' ? (
        <>
          {googleBtn}
          <button type="button" onClick={() => { setView('email'); setError(null); }} style={{
            width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: '#fff',
            background: '#0A0A0A', border: 'none', borderRadius: 9999,
            padding: '15px 20px', cursor: 'pointer', transition: 'background 180ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1f1f24'}
          onMouseLeave={e => e.currentTarget.style.background = '#0A0A0A'}
          ><Icon name="message" size={15}/>Continuar com e-mail</button>
        </>
      ) : (
        <div style={{ textAlign: 'left' }}>
          {googleBtn}
          {orDivider}
          {mode === 'register' && (
            <OBAuthInput type="text" value={name} onChange={setName}
              placeholder="Nome completo" autoComplete="name" onEnter={submit}/>
          )}
          <OBAuthInput type="email" value={email} onChange={setEmail}
            placeholder="seu@email.com" autoComplete="email" onEnter={submit}/>
          <OBAuthInput type="password" value={password} onChange={setPassword}
            placeholder={mode === 'register' ? 'Crie uma senha (mín. 8)' : 'Sua senha'}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'} onEnter={submit}/>

          {error && (
            <div role="alert" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#B42318',
              background: '#FEF3F2', border: '1px solid #FDA29B', borderRadius: 10,
              padding: '10px 12px', margin: '2px 0 12px',
            }}>{error}</div>
          )}

          <button type="button" onClick={submit} disabled={!canSubmit || loading} style={{
            width: '100%', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
            color: '#fff', background: (!canSubmit || loading) ? '#9DAFCB' : '#0A0A0A',
            border: 'none', borderRadius: 9999, padding: '15px 20px',
            cursor: (!canSubmit || loading) ? 'not-allowed' : 'pointer', transition: 'background 180ms',
          }}>
            {loading ? 'Aguarde…' : (mode === 'register' ? 'Criar conta' : 'Entrar')}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#52525B',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}>
              {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
            </button>
          </div>
        </div>
      )}

      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12, lineHeight: 1.6, color: '#A1A1AA',
        margin: '22px 0 0',
      }}>
        Ao continuar, você concorda com os <a href="/termos" target="_top" style={{ color: '#52525B' }}>Termos</a> e a <a href="/privacidade" target="_top" style={{ color: '#52525B' }}>Privacidade</a> da Dalivim.
      </p>
    </div>
  );
}

// ---------- done ----------
function OBDone({ data }) {
  const initial = (data.name.trim()[0] || 'D').toUpperCase();
  const checks = [
    { label: 'Perfil criado', done: true },
    { label: 'Pix conectado', done: data.pixConnected },
    { label: 'Identidade verificada', done: data.idVerified || data.pixConnected },
    { label: 'Primeira negociação configurada', done: !!data.txType },
  ];
  return (
    <div style={{
      width: '100%', maxWidth: 460,
      background: '#fff', border: '1px solid #E4E4E7', borderRadius: 24,
      padding: 'clamp(28px, 4vw, 40px)',
      boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 40px 90px -50px rgba(10,10,10,0.3)',
      animation: 'dv-fade-in 460ms cubic-bezier(0.2,0.6,0.2,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <span style={{
          width: 52, height: 52, borderRadius: 13, flexShrink: 0,
          background: '#1E4BA0', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 22,
        }}>{initial}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 17, color: '#0A0A0A' }}>
            {data.name || 'Sua conta'}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#71717A' }}>@{data.username || 'usuario'}</div>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: '#1E8A5A',
          padding: '6px 11px', borderRadius: 9999, background: '#F4FBF7', border: '1px solid rgba(30,138,90,0.3)',
        }}><Icon name="shield-check" size={13}/>Pronto</span>
      </div>

      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 14,
      }}>Tudo configurado</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
        {checks.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
            borderTop: i === 0 ? 'none' : '1px solid #ECECEF',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 9999, flexShrink: 0,
              background: c.done ? '#F4FBF7' : '#F4F4F5',
              color: c.done ? '#1E8A5A' : '#C7C7CE',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="check" size={14} strokeWidth={2.5}/></span>
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14.5, flex: 1,
              color: c.done ? '#0A0A0A' : '#A1A1AA',
            }}>{c.label}</span>
          </div>
        ))}
      </div>

      <a href="App.html" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: 600, color: '#15356E',
        background: 'rgba(30,75,160,0.10)', border: '2px solid #1E4BA0',
        borderRadius: 9999, padding: '15px', textDecoration: 'none',
        marginBottom: 10, transition: 'background 180ms',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,75,160,0.16)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,75,160,0.10)'}
      >Ir para o painel<Icon name="arrow-right" size={16} flat color="#15356E"/></a>
      <a href="Landing.html" style={{
        display: 'block', textAlign: 'center',
        fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#71717A', textDecoration: 'none', padding: 6,
      }}>Voltar ao site</a>
    </div>
  );
}

// ---------- app ----------
function OnboardingApp() {
  const saved = obLoad();
  const params = (() => { try { return new URLSearchParams(window.location.search); } catch (e) { return new URLSearchParams(''); } })();
  const hasAuthIntent = params.has('login') || params.has('signup');
  const loggedIn = !!(window.DalivimAPI && DalivimAPI.getToken());
  const savedStage = saved?.stage;
  // "Entry" = not mid guided-setup (a numeric step 1..5). A signed-in user who
  // lands on the entry — via login/signup links or a stale saved 'done' — goes
  // straight to the app instead of replaying onboarding or seeing the old
  // "Tudo configurado" screen.
  const atEntry = savedStage == null || savedStage === 'welcome' || savedStage === 'done';
  const redirectToApp = loggedIn && atEntry;

  // With an explicit auth intent, ignore a stale saved stage (e.g. 'done').
  const [stage, setStage] = useState(
    redirectToApp ? 'redirect' : (hasAuthIntent ? 'welcome' : (savedStage ?? 'welcome'))
  );
  const [data, setData] = useState(saved?.data ?? {
    account: 'pessoa',
    name: '', email: '', username: '', phone: '',
    use: '', source: '',
    pixConnected: false, bankConnected: false, idVerified: false,
    kycSubmitted: false, pixKey: '',
    txType: '', value: 1500, order: 'pagamento',
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  // Already signed in and at the onboarding entry → go to the app.
  useEffect(() => {
    if (redirectToApp) window.location.replace('App.html');
  }, []);

  // Carry the landing "teste agora, 30 seg" choices into the guided setup, so
  // the first-negotiation step (4) arrives pre-filled. URL e.g.:
  //   Onboarding.html?signup=1&tipo=servico&valor=1500&acordo=eu_pago
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const tipo = p.get('tipo'), valor = p.get('valor'), acordo = p.get('acordo');
      if (tipo) set('txType', tipo);
      if (valor && /^\d+$/.test(valor)) set('value', Math.max(0, parseInt(valor, 10)));
      if (acordo) set('order', acordo === 'outro_entrega' ? 'entrega' : 'pagamento');
    } catch (e) { /* no params — nothing to prefill */ }
  }, []);

  useEffect(() => {
    if (stage === 'redirect') return; // transient — don't persist the redirect state
    try { localStorage.setItem(OB_LS, JSON.stringify({ stage, data })); } catch (e) {}
  }, [stage, data]);

  const go = (s) => { setStage(s); window.scrollTo({ top: 0 }); };

  const SOURCES = [
    { k: 'instagram', label: 'Instagram', brand: 'instagram' }, { k: 'youtube', label: 'YouTube', brand: 'youtube' },
    { k: 'google', label: 'Google', brand: 'google' },
    { k: 'tiktok', label: 'TikTok', brand: 'tiktok' }, { k: 'outro', label: 'Outro' },
  ];

  let body;
  // Landing CTAs deep-link the auth screen: "Criar transação" → ?signup=1
  // (create-account form), "Entrar" → ?login=1 (login form). Default: the
  // choices screen, with the e-mail path defaulting to create-account.
  const authIntent = (() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.has('login')) return { view: 'email', mode: 'login' };
      if (p.has('signup')) return { view: 'email', mode: 'register' };
    } catch (e) {}
    return { view: 'choices', mode: 'register' };
  })();

  if (stage === 'redirect') {
    body = <div aria-busy="true" style={{ minHeight: '50vh' }}/>;
  } else if (stage === 'welcome') {
    body = <OBWelcome data={data} set={set} onStart={() => go(1)}
      initialView={authIntent.view} initialMode={authIntent.mode}
      onAuthed={(resp, mode) => {
        if (resp && resp.user && resp.user.email) set('email', resp.user.email);
        // Returning user → straight to the panel. New account → finish the
        // guided setup (profile / Pix / first negotiation), then the panel.
        if (mode === 'login') window.location.href = 'App.html';
        else go(1);
      }}/>;
  } else if (stage === 'done') {
    body = <OBDone data={data}/>;
  } else {
    const step = stage;
    const shell = (props) => (
      <OBStepShell step={step} data={data} stage={stage}
        onBack={() => go(step === 1 ? 'welcome' : step - 1)}
        onNext={() => go(step === OB_TOTAL ? 'done' : step + 1)}
        {...props}/>
    );

    if (step === 1) body = shell({
      title: 'Vamos criar seu perfil',
      sub: 'É assim que você aparece para a outra parte em cada negociação.',
      canNext: data.name.trim().length > 1,
      children: (
        <>
          <OBField label="Nome completo">
            <OBInput value={data.name} onChange={v => set('name', v)} placeholder="Como você se chama" maxLength={40}/>
          </OBField>
          <OBField label="Nome de usuário">
            <OBInput value={data.username} onChange={v => set('username', v.replace(/\s/g, '').toLowerCase())} placeholder="seu_usuario" prefix="@" maxLength={24}/>
          </OBField>
          <OBField label="Telefone" hint="· para avisos da negociação">
            <OBInput value={data.phone} onChange={v => set('phone', v)} placeholder="(11) 99999-9999" maxLength={16}/>
          </OBField>
        </>
      ),
    });
    else if (step === 2) body = shell({
      title: 'Como você vai usar a Dalivim?',
      sub: 'Ajustamos a experiência ao seu tipo de negociação.',
      canNext: !!data.use,
      children: (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {[['comprar', 'Comprar', 'package'], ['vender', 'Vender', 'store'], ['servicos', 'Serviços', 'briefcase'], ['ambos', 'Os dois', 'refresh']].map(([k, l, ic]) => (
              <OBChip key={k} icon={ic} selected={data.use === k} onClick={() => set('use', k)}>{l}</OBChip>
            ))}
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#0A0A0A', marginBottom: 12,
          }}>Como conheceu a Dalivim?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {SOURCES.map(s => (
              <OBChip key={s.k} brand={s.brand} selected={data.source === s.k} onClick={() => set('source', s.k)}>{s.label}</OBChip>
            ))}
          </div>
        </>
      ),
    });
    else if (step === 3) body = shell({
      title: 'Identidade e Pix',
      sub: 'Verifique sua identidade e cadastre sua chave Pix. É o que libera o recebimento das suas cobranças.',
      canNext: data.kycSubmitted && data.pixConnected,
      children: <OBPixStep data={data} set={set}/>,
    });
    else if (step === 4) body = shell({
      title: 'Crie sua primeira negociação',
      sub: 'Veja na prática como funciona. Você pode ajustar depois.',
      canNext: !!data.txType && data.value >= 50,
      children: (
        <>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#0A0A0A', marginBottom: 12 }}>O que você está negociando?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {[['produto', 'Produto', 'package'], ['servico', 'Serviço', 'briefcase'], ['outro', 'Outro', 'handshake']].map(([k, l, ic]) => (
              <OBChip key={k} icon={ic} selected={data.txType === k} onClick={() => set('txType', k)}>{l}</OBChip>
            ))}
          </div>
          <OBField label="Valor da negociação">
            <OBInput value={data.value ? String(data.value) : ''} prefix="R$"
              onChange={v => set('value', Number(v.replace(/\D/g, '').slice(0, 7)) || 0)}
              placeholder="1500"/>
          </OBField>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#0A0A0A', margin: '6px 0 12px' }}>Quem vai primeiro?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <OBChip icon="arrow-right" selected={data.order === 'pagamento'} onClick={() => set('order', 'pagamento')}>Pagamento primeiro</OBChip>
            <OBChip icon="package" selected={data.order === 'entrega'} onClick={() => set('order', 'entrega')}>Entrega primeiro</OBChip>
          </div>
        </>
      ),
    });
    else if (step === 5) body = shell({
      title: 'Revise e proteja',
      sub: 'Confirme os detalhes. O valor fica retido até a entrega ser confirmada.',
      nextLabel: 'Proteger valor',
      canNext: true,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            ['Tipo', TX_LABELS[data.txType] || '—'],
            ['Valor', formatBRL(data.value)],
            ['Ordem', data.order === 'entrega' ? 'Entrega primeiro' : 'Pagamento primeiro'],
            ['Pix', data.pixConnected ? 'Conectado' : 'Pendente'],
            ['Identidade', (data.idVerified || data.pixConnected) ? 'Verificada' : 'Pendente'],
          ].map(([k, v], i) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '15px 0', borderTop: i === 0 ? 'none' : '1px solid #ECECEF',
              fontFamily: "'Inter', sans-serif", fontSize: 14.5,
            }}>
              <span style={{ color: '#71717A' }}>{k}</span>
              <span style={{ color: '#0A0A0A', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{
            marginTop: 16, padding: '14px 16px', borderRadius: 12,
            background: '#F4F8FF', border: '1px solid rgba(30,75,160,0.2)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#1E4BA0', lineHeight: 1.5,
          }}>
            <Icon name="lock" size={15}/>
            O dinheiro só é liberado quando as duas partes confirmam a entrega.
          </div>
        </div>
      ),
    });
  }

  const centered = stage === 'welcome' || stage === 'done';

  return (
    <div style={{ minHeight: '100vh', background: '#F4F4F5', display: 'flex', flexDirection: 'column' }}>
      {/* top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px clamp(20px, 5vw, 48px)',
      }}>
        <a href="Landing.html" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0A0A0A',
        }}>
          <img src="assets/dalivim-mark.svg" alt="" style={{ width: 24, height: 24 }}/>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em' }}>Dalivim</span>
        </a>
        <button type="button" onClick={() => { try { localStorage.removeItem(OB_LS); } catch (e) {} window.location.href = 'Landing.html'; }} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: '#71717A',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}><Icon name="arrow-right" size={14}/>Sair</button>
      </div>

      {/* body */}
      <div style={{
        flex: 1, display: 'flex', alignItems: centered ? 'center' : 'flex-start',
        justifyContent: 'center', padding: 'clamp(16px, 4vw, 48px)',
        paddingTop: centered ? 'clamp(16px, 4vw, 48px)' : 'clamp(8px, 2vw, 24px)',
      }}>
        {body}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<OnboardingApp/>);
