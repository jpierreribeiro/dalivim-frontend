// Settings (Configurações) — seller's public profile + checkout preferences.
// Reads GET /seller/profile and /seller/settings, saves via PATCH. The GET
// responses come back PascalCase (the Go models have no json tags) while the
// PATCH bodies are snake_case, so we read both shapes defensively and always
// write snake_case.

function SettingsField({ label, hint, value, onChange, placeholder, type = 'text', maxLength }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#52525B', marginBottom: 7 }}>
        {label}{hint && <span style={{ color: '#A1A1AA', fontWeight: 400 }}> · {hint}</span>}
      </span>
      <input
        type={type} value={value} placeholder={placeholder} maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        onFocus={e => e.target.style.borderColor = '#1E4BA0'}
        onBlur={e => e.target.style.borderColor = '#E4E4E7'}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '13px 15px',
          border: '1.5px solid #E4E4E7', borderRadius: 12, outline: 'none',
          fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#0A0A0A',
        }}/>
    </label>
  );
}

function SettingsArea({ label, value, onChange, placeholder, maxLength }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#52525B', marginBottom: 7 }}>{label}</span>
      <textarea value={value} placeholder={placeholder} rows={3} maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        onFocus={e => e.target.style.borderColor = '#1E4BA0'}
        onBlur={e => e.target.style.borderColor = '#E4E4E7'}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '13px 15px',
          border: '1.5px solid #E4E4E7', borderRadius: 12, outline: 'none', resize: 'vertical',
          fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.5, color: '#0A0A0A',
        }}/>
    </label>
  );
}

function SaveNote({ state }) {
  if (!state.msg) return null;
  const ok = state.tone === 'ok';
  return (
    <div role="status" style={{
      fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
      color: ok ? '#16794C' : '#B42318',
      background: ok ? '#E8F2EC' : '#FEF3F2',
      border: '1px solid ' + (ok ? '#CDE6D8' : '#FDA29B'),
      borderRadius: 10, padding: '10px 12px', marginBottom: 12,
    }}>{state.msg}</div>
  );
}

function Toggle({ checked, onChange, label, sub, first }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', cursor: 'pointer',
      borderTop: first ? 'none' : '1px solid #F4F4F5',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: '#0A0A0A' }}>{label}</div>
        {sub && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#A1A1AA', marginTop: 1 }}>{sub}</div>}
      </div>
      <span aria-hidden style={{
        width: 40, height: 24, borderRadius: 9999, flexShrink: 0, position: 'relative',
        background: checked ? '#1E4BA0' : '#D4D4D8', transition: 'background 160ms',
      }}>
        <span style={{
          position: 'absolute', top: 3, left: checked ? 19 : 3, width: 18, height: 18, borderRadius: 9999,
          background: '#fff', transition: 'left 160ms', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}/>
      </span>
    </div>
  );
}

// Event toggles shown in the Notificações card (key matches the API field).
const NOTIF_EVENTS = [
  ['notify_payment_confirmed', 'Pagamento confirmado'],
  ['notify_dispute_opened', 'Disputa aberta'],
  ['notify_dispute_updated', 'Disputa atualizada'],
  ['notify_milestone_delivered', 'Fase entregue'],
  ['notify_milestone_approved', 'Fase aprovada'],
  ['notify_payout_failed', 'Falha no repasse'],
  ['notify_link_expiring', 'Link de pagamento expirando'],
  ['notify_webhook_delivery_failed', 'Falha de webhook'],
];

function SettingsPage({ onBack }) {
  const authed = !!(window.DalivimAPI && DalivimAPI.getToken());
  const [loading, setLoading] = useState(authed);
  const [profile, setProfile] = useState({
    display_name: '', support_contact_email: '', support_contact_phone: '',
    public_description: '', trust_blurb: '',
  });
  const [settings, setSettings] = useState({ default_expiration_hours: 24, default_checkout_behavior: 'standard' });
  const [notifs, setNotifs] = useState({
    email_enabled: true,
    notify_payment_confirmed: true, notify_dispute_opened: true, notify_dispute_updated: true,
    notify_milestone_delivered: true, notify_milestone_approved: true, notify_payout_failed: true,
    notify_link_expiring: true, notify_webhook_delivery_failed: true,
  });
  const [pState, setPState] = useState({ saving: false, msg: null, tone: 'ok' });
  const [sState, setSState] = useState({ saving: false, msg: null, tone: 'ok' });
  const [nState, setNState] = useState({ saving: false, msg: null, tone: 'ok' });

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    Promise.all([
      DalivimAPI.get('/seller/profile').catch(() => null),
      DalivimAPI.get('/seller/settings').catch(() => null),
      DalivimAPI.get('/seller/notification-preferences').catch(() => null),
    ]).then(([p, s, n]) => {
      if (cancelled) return;
      if (p) setProfile({
        display_name: p.DisplayName ?? p.display_name ?? '',
        support_contact_email: p.SupportEmail ?? p.support_contact_email ?? '',
        support_contact_phone: p.SupportPhone ?? p.support_contact_phone ?? '',
        public_description: p.PublicDescription ?? p.public_description ?? '',
        trust_blurb: p.TrustBlurb ?? p.trust_blurb ?? '',
      });
      if (s) setSettings({
        default_expiration_hours: s.DefaultExpirationHours ?? s.default_expiration_hours ?? 24,
        default_checkout_behavior: s.DefaultCheckoutBehavior ?? s.default_checkout_behavior ?? 'standard',
      });
      if (n) setNotifs(prev => {
        const next = { ...prev };
        for (const k of Object.keys(prev)) if (typeof n[k] === 'boolean') next[k] = n[k];
        return next;
      });
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const setP = (k, v) => setProfile(d => ({ ...d, [k]: v }));
  const setS = (k, v) => setSettings(d => ({ ...d, [k]: v }));

  async function saveProfile() {
    if (pState.saving) return;
    setPState({ saving: true, msg: null, tone: 'ok' });
    try {
      await DalivimAPI.patch('/seller/profile', {
        display_name: profile.display_name,
        support_contact_email: profile.support_contact_email,
        support_contact_phone: profile.support_contact_phone,
        public_description: profile.public_description,
        trust_blurb: profile.trust_blurb,
      });
      setPState({ saving: false, msg: 'Perfil salvo.', tone: 'ok' });
    } catch (e) {
      setPState({ saving: false, tone: 'err', msg: e.status === 401 ? 'Sua sessão expirou. Entre novamente.' : (e.message || 'Não foi possível salvar o perfil.') });
    }
  }

  async function saveSettings() {
    if (sState.saving) return;
    setSState({ saving: true, msg: null, tone: 'ok' });
    try {
      await DalivimAPI.patch('/seller/settings', {
        default_expiration_hours: Number(settings.default_expiration_hours) || 24,
        default_checkout_behavior: settings.default_checkout_behavior,
      });
      setSState({ saving: false, msg: 'Preferências salvas.', tone: 'ok' });
    } catch (e) {
      setSState({ saving: false, tone: 'err', msg: e.status === 401 ? 'Sua sessão expirou. Entre novamente.' : (e.message || 'Não foi possível salvar as preferências.') });
    }
  }

  const setN = (k, v) => setNotifs(d => ({ ...d, [k]: v }));

  async function saveNotifs() {
    if (nState.saving) return;
    setNState({ saving: true, msg: null, tone: 'ok' });
    try {
      await DalivimAPI.patch('/seller/notification-preferences', notifs);
      setNState({ saving: false, msg: 'Notificações salvas.', tone: 'ok' });
    } catch (e) {
      setNState({ saving: false, tone: 'err', msg: e.status === 401 ? 'Sua sessão expirou. Entre novamente.' : (e.message || 'Não foi possível salvar as notificações.') });
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <button type="button" onClick={onBack}
        onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
        onMouseLeave={e => e.currentTarget.style.color = '#71717A'}
        style={{
          all: 'unset', cursor: 'pointer', color: '#71717A',
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18,
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, transition: 'color 140ms',
        }}>
        <Icon name="arrow-left" size={16}/> Início
      </button>

      <Eyebrow style={{ marginBottom: 9 }}>Sua conta</Eyebrow>
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: 'clamp(26px, 4vw, 34px)', letterSpacing: '-0.026em', lineHeight: 1.08, margin: '0 0 24px', color: '#0A0A0A',
      }}>Configurações</h1>

      {!authed ? (
        <Card pad={24}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#52525B', margin: '0 0 16px', lineHeight: 1.5 }}>
            Entre na sua conta para ver e editar seu perfil e preferências.
          </p>
          <a href="Onboarding.html?login=1" style={{ textDecoration: 'none' }}>
            <PrimaryButton>Entrar</PrimaryButton>
          </a>
        </Card>
      ) : loading ? (
        <Card pad={24}><span style={{ color: '#A1A1AA', fontSize: 14.5, fontFamily: "'Inter', sans-serif" }}>Carregando…</span></Card>
      ) : (
        <>
          {/* Public profile */}
          <Card pad={22} style={{ marginBottom: 18 }}>
            <Eyebrow style={{ marginBottom: 16 }}>Perfil público</Eyebrow>
            <SettingsField label="Nome de exibição" value={profile.display_name} onChange={v => setP('display_name', v)} placeholder="Loja do Jean" maxLength={255}/>
            <SettingsField label="E-mail de suporte" type="email" value={profile.support_contact_email} onChange={v => setP('support_contact_email', v)} placeholder="suporte@email.com" maxLength={255}/>
            <SettingsField label="Telefone de suporte" value={profile.support_contact_phone} onChange={v => setP('support_contact_phone', v)} placeholder="+55 11 99999-9999" maxLength={40}/>
            <SettingsArea label="Descrição pública" value={profile.public_description} onChange={v => setP('public_description', v)} placeholder="O que você vende, como funciona…"/>
            <SettingsArea label="Mensagem de confiança" value={profile.trust_blurb} onChange={v => setP('trust_blurb', v)} placeholder="Pagamento protegido por escrow."/>
            <SaveNote state={pState}/>
            <PrimaryButton onClick={saveProfile} disabled={pState.saving}>{pState.saving ? 'Salvando…' : 'Salvar perfil'}</PrimaryButton>
          </Card>

          {/* Checkout preferences */}
          <Card pad={22}>
            <Eyebrow style={{ marginBottom: 16 }}>Preferências de checkout</Eyebrow>
            <SettingsField label="Validade do link de pagamento" hint="em horas (1 a 720)" type="number"
              value={settings.default_expiration_hours} onChange={v => setS('default_expiration_hours', v)} placeholder="24"/>
            <label style={{ display: 'block', marginBottom: 16 }}>
              <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#52525B', marginBottom: 7 }}>Comportamento do checkout</span>
              <select value={settings.default_checkout_behavior} onChange={e => setS('default_checkout_behavior', e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '13px 15px', border: '1.5px solid #E4E4E7',
                  borderRadius: 12, outline: 'none', background: '#fff',
                  fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#0A0A0A',
                }}>
                <option value="standard">Padrão</option>
                <option value="strict">Rigoroso</option>
              </select>
            </label>
            <SaveNote state={sState}/>
            <PrimaryButton onClick={saveSettings} disabled={sState.saving}>{sState.saving ? 'Salvando…' : 'Salvar preferências'}</PrimaryButton>
          </Card>

          {/* Notifications */}
          <Card pad={22} style={{ marginTop: 18 }}>
            <Eyebrow style={{ marginBottom: 6 }}>Notificações por e-mail</Eyebrow>
            <Toggle first label="Receber e-mails" sub="Desligar pausa todos os avisos abaixo."
              checked={notifs.email_enabled} onChange={v => setN('email_enabled', v)}/>
            <div style={{ opacity: notifs.email_enabled ? 1 : 0.45, pointerEvents: notifs.email_enabled ? 'auto' : 'none', marginTop: 4 }}>
              {NOTIF_EVENTS.map(([k, label]) => (
                <Toggle key={k} label={label} checked={!!notifs[k]} onChange={v => setN(k, v)}/>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <SaveNote state={nState}/>
              <PrimaryButton onClick={saveNotifs} disabled={nState.saving}>{nState.saving ? 'Salvando…' : 'Salvar notificações'}</PrimaryButton>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

Object.assign(window, { SettingsPage });
