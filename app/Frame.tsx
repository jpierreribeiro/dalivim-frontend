'use client';

import { useEffect } from 'react';

// Frame — each Dalivim experience is a self-contained static bundle in /public
// (Landing.html, App.html, …). Instead of nesting them in an <iframe> (which
// desynced the browser URL — F5 fell back to the landing — and squashed the
// layout on mobile), we redirect the top-level window straight to the bundle.
// The bundles are responsive on their own and link to each other with relative
// .html paths, so navigation, refresh and deep-link query params all work.
export default function Frame({ src, title }: { src: string; title: string }) {
  useEffect(() => {
    // Preserve deep-link query/hash (e.g. /onboarding?signup=1 → /Onboarding.html?signup=1).
    const target = src + window.location.search + window.location.hash;
    window.location.replace(target);
  }, [src]);

  // Seamless placeholder during the brief redirect (matches the bundles' bg).
  return <div aria-busy="true" aria-label={title} style={{ position: 'fixed', inset: 0, background: '#FAFAFA' }} />;
}
