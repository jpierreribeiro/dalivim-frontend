/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Static export — `next build` emits a fully static site into `out/`,
  // which is exactly what Cloudflare Pages serves. Every route here is a thin
  // iframe host over a self-contained bundle in `public/`, so there is no
  // server runtime to ship: plain HTML/CSS/JS on Cloudflare's edge.
  output: 'export',

  // Emit `/app/index.html` instead of `/app.html` so Pages serves clean,
  // trailing-slash URLs consistently with the bundled .html files.
  trailingSlash: true,

  // No Next image optimizer on a static export.
  images: { unoptimized: true },
};

export default nextConfig;
