'use client';

// Google OAuth callback. Google redirects here (GOOGLE_OAUTH_REDIRECT_URI must
// point at this URL) with ?code&state. We exchange them at the backend:
//   200 → logged in (save session, go to the app)
//   202 → an email/password account already exists for this Google email;
//         the user confirms ownership with their password (confirm-link)
// The session is written to the same localStorage keys the bundles read
// (dalivim.jwt / dalivim.user), so /App.html picks it up.
import { useEffect, useState } from 'react';

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dalivim-escrow-production.up.railway.app').replace(/\/+$/, '');

type AnyObj = Record<string, any>;

function saveSession(data: AnyObj) {
  try {
    if (data && data.token) window.localStorage.setItem('dalivim.jwt', data.token);
    if (data && data.user) window.localStorage.setItem('dalivim.user', JSON.stringify(data.user));
  } catch { /* storage unavailable — ignore */ }
}

async function postJSON(path: string, body: AnyObj) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: AnyObj = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = {}; }
  return { res, json };
}

export default function GoogleCallback() {
  const [phase, setPhase] = useState<'loading' | 'link' | 'error'>('loading');
  const [error, setError] = useState('');
  const [linkToken, setLinkToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const err = p.get('error');
    const code = p.get('code');
    const state = p.get('state');
    if (err) { setError('Login com Google cancelado.'); setPhase('error'); return; }
    if (!code || !state) { setError('Retorno do Google inválido.'); setPhase('error'); return; }

    (async () => {
      try {
        const { res, json } = await postJSON('/auth/google/callback', { code, state });
        if (res.status === 202 && json.link_required) {
          setLinkToken(json.link_required.link_token || '');
          setEmail(json.link_required.email || '');
          setPhase('link');
          return;
        }
        if (!res.ok) {
          setError((json.error && json.error.message) || 'Não foi possível entrar com o Google.');
          setPhase('error');
          return;
        }
        saveSession(json);
        window.location.replace('/App.html');
      } catch {
        setError('Não foi possível conectar ao servidor. Tente de novo.');
        setPhase('error');
      }
    })();
  }, []);

  async function confirmLink() {
    if (password.length < 1 || submitting) return;
    setSubmitting(true); setError('');
    try {
      const { res, json } = await postJSON('/auth/google/confirm-link', { link_token: linkToken, password });
      if (!res.ok) {
        setSubmitting(false);
        setError(res.status === 401 ? 'Senha incorreta.' : ((json.error && json.error.message) || 'Não foi possível vincular a conta.'));
        return;
      }
      saveSession(json);
      window.location.replace('/App.html');
    } catch {
      setSubmitting(false);
      setError('Não foi possível conectar ao servidor. Tente de novo.');
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F4F4F5', padding: 20, fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #E4E4E7',
        borderRadius: 22, padding: 'clamp(26px, 5vw, 36px)', textAlign: 'center',
        boxShadow: '0 1px 2px rgba(10,10,10,0.03), 0 30px 70px -40px rgba(10,10,10,0.3)',
      }}>
        {phase === 'loading' && (
          <>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 22, margin: '0 0 8px', color: '#0A0A0A' }}>Entrando com o Google…</h1>
            <p style={{ fontSize: 14.5, color: '#71717A', margin: 0 }}>Só um instante.</p>
          </>
        )}

        {phase === 'link' && (
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 22, margin: '0 0 8px', color: '#0A0A0A' }}>Vincular sua conta</h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: '#52525B', margin: '0 0 16px' }}>
              Já existe uma conta com <strong>{email || 'esse e-mail'}</strong>. Digite sua senha para vincular o Google.
            </p>
            <input
              type="password" value={password} placeholder="Sua senha" autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmLink(); }}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '13px 15px', border: '1.5px solid #E4E4E7',
                borderRadius: 12, outline: 'none', fontSize: 14.5, color: '#0A0A0A', marginBottom: 12,
              }}
            />
            {error && (
              <div role="alert" style={{ fontSize: 13, color: '#B42318', background: '#FEF3F2', border: '1px solid #FDA29B', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>{error}</div>
            )}
            <button type="button" onClick={confirmLink} disabled={password.length < 1 || submitting} style={{
              width: '100%', fontSize: 15, fontWeight: 600, color: '#fff',
              background: (password.length < 1 || submitting) ? '#9DAFCB' : '#0A0A0A',
              border: 'none', borderRadius: 9999, padding: '14px 20px',
              cursor: (password.length < 1 || submitting) ? 'not-allowed' : 'pointer',
            }}>{submitting ? 'Vinculando…' : 'Vincular e entrar'}</button>
          </div>
        )}

        {phase === 'error' && (
          <>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 22, margin: '0 0 8px', color: '#0A0A0A' }}>Não deu certo</h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: '#52525B', margin: '0 0 18px' }}>{error}</p>
            <a href="/Onboarding.html?login=1" style={{
              display: 'inline-block', textDecoration: 'none', fontSize: 15, fontWeight: 600, color: '#fff',
              background: '#0A0A0A', borderRadius: 9999, padding: '13px 24px',
            }}>Voltar ao login</a>
          </>
        )}
      </div>
    </div>
  );
}
