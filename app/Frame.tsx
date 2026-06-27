'use client';

// Frame — renders one of the prebuilt Dalivim experiences (static bundles in
// /public) full-bleed. Each bundle is a self-contained React app; Next routes
// to them so the whole product runs under one `npm run dev`.
export default function Frame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        border: 'none',
        display: 'block',
      }}
    />
  );
}
