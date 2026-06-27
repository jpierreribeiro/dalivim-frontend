// 3D rendered icon set (user-provided). When a name has a matching PNG in
// assets/icons3d/, render that image; otherwise fall back to the inline SVG.
const ICON3D = new Set([
'arrow-left', 'arrow-right', 'banknote', 'briefcase', 'car', 'check', 'check-circle',
'clock', 'gem', 'globe', 'handshake', 'lock', 'lock-open', 'message', 'monitor',
'package', 'pix', 'plus', 'refresh', 'scale', 'shield', 'shield-check', 'store', 'user', 'users']
);

// Inline SVG icons — outline 2px, lucide style (fallback)
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, style = {}, flat = false }) {
  if (ICON3D.has(name) && !flat) {
    return (
      <img
        src={`assets/icons3d/${name}.png`}
        alt=""
        width={size}
        height={size}
        aria-hidden="true"
        style={{ ...{ width: size, height: size, objectFit: 'contain', flexShrink: 0, display: 'inline-block', ...style }, width: "32px", height: "32px" }} />);


  }
  const c = {
    width: size, height: size,
    viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { flexShrink: 0, ...style },
    'aria-hidden': true
  };
  switch (name) {
    case 'check':return <svg {...c}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'check-circle':return <svg {...c}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
    case 'arrow-right':return <svg {...c}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case 'arrow-left':return <svg {...c}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
    case 'chevron-down':return <svg {...c}><polyline points="6 9 12 15 18 9" /></svg>;
    case 'chevron-up':return <svg {...c}><polyline points="18 15 12 9 6 15" /></svg>;
    case 'chevron-right':return <svg {...c}><polyline points="9 18 15 12 9 6" /></svg>;
    case 'x':return <svg {...c}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case 'plus':return <svg {...c}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case 'shield':return <svg {...c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case 'shield-check':return <svg {...c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
    case 'lock':return <svg {...c}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case 'lock-open':return <svg {...c}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>;
    case 'package':return <svg {...c}><path d="M21 8L12 3 3 8v8l9 5 9-5V8z" /><path d="M3.3 7L12 12l8.7-5" /><line x1="12" y1="22" x2="12" y2="12" /></svg>;
    case 'briefcase':return <svg {...c}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
    case 'handshake':return <svg {...c}><path d="M11 17l2 2a1 1 0 1 0 3-3" /><path d="M14 14l2.5 2.5a1 1 0 1 0 3-3L15 9" /><path d="M10 14l-3 3a1 1 0 1 1-3-3l4-4 2 2" /><path d="M13 13l-4-4 5-5 6 6-2 2-2-2" /></svg>;
    case 'banknote':return <svg {...c}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
    case 'scale':return <svg {...c}><path d="M12 3v18M5 8l-3 8h6l-3-8zM19 8l-3 8h6l-3-8zM4 21h16" /></svg>;
    case 'clock':return <svg {...c}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case 'message':return <svg {...c}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    case 'star':return <svg {...c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case 'alert-triangle':return <svg {...c}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    case 'pix':return <svg {...c}><path d="M12 3L4 12l8 9 8-9-8-9z" /><path d="M9 9l3 3 3-3M9 15l3-3 3 3" /></svg>;
    case 'user':return <svg {...c}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case 'users':return <svg {...c}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'store':return <svg {...c}><path d="M3 9l2-5h14l2 5" /><path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" /><path d="M8 9v3a2 2 0 0 0 4 0V9" /><path d="M12 9v3a2 2 0 0 0 4 0V9" /></svg>;
    case 'refresh':return <svg {...c}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
    case 'layout':return <svg {...c}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
    case 'list':return <svg {...c}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
    case 'search':return <svg {...c}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case 'settings':return <svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    case 'help':return <svg {...c}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    case 'car':return <svg {...c}><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M5 13h14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" /><circle cx="7.5" cy="15.5" r=".6" /><circle cx="16.5" cy="15.5" r=".6" /></svg>;
    case 'monitor':return <svg {...c}><rect x="2" y="4" width="20" height="13" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
    case 'gem':return <svg {...c}><path d="M6 3h12l3 6-9 12L3 9z" /><path d="M3 9h18M9 3l-3 6 6 12 6-12-3-6" /></svg>;
    case 'globe':return <svg {...c}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" /></svg>;
    default:return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}
Object.assign(window, { Icon });