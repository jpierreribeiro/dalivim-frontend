// Onboarding — first-login: KYC + Pix key (required before first tx)

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [pix, setPix] = useState('');
  const [full, setFull] = useState('');

  const step1Valid = full.trim().length > 2 && cpf.replace(/\D/g,'').length >= 11;
  const step2Valid = pix.trim().length > 3;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'dv-fade-in 280ms',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 22, maxWidth: 560, width: '100%',
        padding: 'clamp(28px, 4vw, 44px)',
        border: '1px solid #E4E4E7',
        boxShadow: '0 40px 80px -20px rgba(10,10,10,0.4)',
      }}>
        {/* Progress header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 9999,
            background: '#F4F4F5', color: '#52525B',
            fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 9999, background: '#7FD1A8' }}/>
            Ativação · {step}/2
          </span>
          <div style={{ flex: 1, height: 4, background: '#F4F4F5', borderRadius: 9999 }}>
            <div style={{ width: step === 1 ? '50%' : '100%', height: '100%',
              background: 'linear-gradient(90deg, #1E4BA0, #3D6BC4)',
              borderRadius: 9999, transition: 'width 500ms cubic-bezier(0.2,0.9,0.2,1)' }}/>
          </div>
        </div>

        {step === 1 && (
          <div style={{ animation: 'dv-step-in 320ms' }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 'clamp(24px, 3vw, 30px)',
              letterSpacing: '-0.02em', lineHeight: 1.15,
              margin: '0 0 10px', color: '#0A0A0A', textWrap: 'balance',
            }}>Vamos validar sua identidade.</h2>
            <p style={{ fontSize: 14.5, color: '#52525B', margin: '0 0 24px', lineHeight: 1.55 }}>
              Para receber pagamentos com proteção, precisamos confirmar quem você é. Exigência da regulação do Banco Central.
            </p>
            <div style={{ marginBottom: 14 }}>
              <label style={onbLabel}>Nome completo</label>
              <input value={full} onChange={e => setFull(e.target.value)} placeholder="Como aparece no seu documento"
                style={onbInput}/>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={onbLabel}>CPF</label>
              <input value={cpf} onChange={e => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00"
                inputMode="numeric" style={onbInput}/>
            </div>
            <button disabled={!step1Valid} onClick={() => setStep(2)} style={onbPrimary(step1Valid)}>
              Continuar <Icon name="arrow-right" size={14}/>
            </button>
            <div style={onbTrust}>
              <Icon name="lock" size={12}/>
              Dados criptografados · conformidade LGPD
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'dv-step-in 320ms' }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              fontSize: 'clamp(24px, 3vw, 30px)',
              letterSpacing: '-0.02em', lineHeight: 1.15,
              margin: '0 0 10px', color: '#0A0A0A', textWrap: 'balance',
            }}>Onde você quer receber?</h2>
            <p style={{ fontSize: 14.5, color: '#52525B', margin: '0 0 24px', lineHeight: 1.55 }}>
              Cadastre sua chave Pix. É pra lá que o dinheiro vai quando uma transação for liberada.
            </p>
            <div style={{ marginBottom: 22 }}>
              <label style={onbLabel}>Chave Pix</label>
              <input value={pix} onChange={e => setPix(e.target.value)} placeholder="CPF, e-mail, celular ou chave aleatória"
                style={onbInput}/>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={onbSecondary}>
                <Icon name="arrow-left" size={14}/> Voltar
              </button>
              <button disabled={!step2Valid} onClick={() => onComplete({ name: full, cpf, pix })} style={{ ...onbPrimary(step2Valid), flex: 1 }}>
                Entrar na conta <Icon name="arrow-right" size={14}/>
              </button>
            </div>
            <div style={onbTrust}>
              <Icon name="shield-check" size={12}/>
              Conta segregada · BCB 4.658
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatCpf(v) {
  const d = v.replace(/\D/g,'').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}

const onbLabel = { fontSize: 12, color: '#52525B', fontWeight: 500, marginBottom: 6, display: 'block' };
const onbInput = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #E4E4E7', borderRadius: 10,
  fontFamily: 'inherit', fontSize: 14.5, outline: 'none', boxSizing: 'border-box',
  background: '#fff', color: '#0A0A0A',
};
const onbPrimary = (enabled) => ({
  all: 'unset', cursor: enabled ? 'pointer' : 'not-allowed',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '13px 22px', borderRadius: 9999,
  background: enabled ? '#0A0A0A' : '#A1A1AA',
  color: '#fff', fontSize: 14, fontWeight: 500,
  width: '100%', boxSizing: 'border-box',
  opacity: enabled ? 1 : 0.7,
  transition: 'background 160ms',
});
const onbSecondary = {
  all: 'unset', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '13px 18px', borderRadius: 9999,
  color: '#52525B', fontSize: 14, fontWeight: 500,
};
const onbTrust = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  marginTop: 18, fontSize: 11.5, color: '#A1A1AA',
};

Object.assign(window, { Onboarding });
