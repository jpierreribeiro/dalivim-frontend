# Dalivim — Frontend

The Dalivim product surface (landing + app) as a Next.js 14 project. The
frontend is deployed as a **static site on Cloudflare Pages**; it talks to the
**Go escrow backend running on Railway**
(`https://dalivim-escrow-production.up.railway.app`).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

`predev`/`prebuild` first run `scripts/gen-config.mjs`, which writes
`public/assets/config.js` from `NEXT_PUBLIC_API_BASE_URL` (defaults to the
Railway backend). That's how the bundles learn where the backend is.

## Routes

| Path           | Experience                                            |
|----------------|-------------------------------------------------------|
| `/`            | Landing page — Pix protegido por escrow               |
| `/app`         | App — negociações, cobranças, dashboard               |
| `/onboarding`  | Onboarding / login flow                               |
| `/disputa`     | Dispute (mediation) flow                              |
| `/fases`       | Milestone (phased payment) flow                       |

## Deploy on Cloudflare Pages

This project builds to a fully static site (`output: 'export'` →`out/`), so
Cloudflare Pages serves it with no server runtime.

**Option A — connect the repo (recommended).** In the Cloudflare dashboard,
create a Pages project from this GitHub repo with:

| Setting            | Value                          |
|--------------------|--------------------------------|
| Framework preset   | Next.js (Static HTML Export)   |
| Build command      | `npm run build`                |
| Build output dir   | `out`                          |

Then add an environment variable:

| Variable                   | Value                                               |
|----------------------------|-----------------------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://dalivim-escrow-production.up.railway.app`  |

**Option B — direct upload.** `npm run pages:deploy` builds and pushes `out/`
via Wrangler (uses `wrangler.toml`).

> After the first deploy you get a `https://<project>.pages.dev` URL (or your
> custom domain). Add that exact origin to the backend's `CORS_ALLOWED_ORIGINS`
> in Railway so browser calls from the frontend are allowed.

## How it connects to the backend

```
Browser ──> Cloudflare Pages (this app, static)
                 │  window.DALIVIM_API_BASE_URL  (assets/config.js)
                 ▼
            Railway (Go escrow API) ──> Postgres / Pix (pague.dev)
```

- **`public/assets/config.js`** — generated at build time; sets
  `window.DALIVIM_API_BASE_URL` from `NEXT_PUBLIC_API_BASE_URL`.
- **`public/src/api.js`** — `window.DalivimAPI`, a tiny fetch client
  (`get/post/patch/put/del`, Bearer-token handling) pointed at that base URL.
  It's the seam for replacing the mock data with live API calls, screen by
  screen. The endpoints are documented in the backend's Postman collection.

The bundles currently render with **mock data** (`public/src/app/data.jsx`) —
this is a high-fidelity prototype. The deployment, configuration, and API
client are wired up; turning individual screens into live API calls is the
remaining product work and can be done incrementally via `DalivimAPI`.

## How it's wired (Next layer)

Each experience is a self-contained React bundle (HTML + JSX components and
assets in `public/`). Next's App Router serves each one full-bleed via a thin
route (`app/*/page.tsx` → `app/Frame.tsx`), so the whole product runs under a
single `npm run dev` / single static build while the bundles stay editable.

```
dalivim-frontend/
├── app/
│   ├── layout.tsx           # root layout + metadata/favicon
│   ├── Frame.tsx            # full-viewport host for a bundle
│   ├── page.tsx             # /            → Landing.html
│   ├── app/page.tsx         # /app         → App.html
│   ├── onboarding/page.tsx  # /onboarding  → Onboarding.html
│   ├── disputa/page.tsx     # /disputa     → Disputa.html
│   └── fases/page.tsx       # /fases       → Fases.html
├── public/
│   ├── Landing.html App.html Onboarding.html Disputa.html Fases.html
│   ├── assets/config.js     # generated: window.DALIVIM_API_BASE_URL
│   ├── src/api.js           # window.DalivimAPI (fetch client)
│   ├── src/                 # JSX components (React + Babel, browser-loaded)
│   └── assets/              # tokens, fonts CSS, SVG mark, 3D icon PNGs
├── scripts/gen-config.mjs   # writes assets/config.js from env
└── wrangler.toml            # Cloudflare Pages config (output dir = out)
```

## Editing

- **Content / components** live in `public/src/*.jsx` — edit and refresh.
- **Design tokens** (colors, type, spacing) are in `public/assets/colors_and_type.css`.
- To point a route at a different bundle, change its `Frame src` in `app/*/page.tsx`.

## Note on the bundles

The bundles use React 18 + in-browser Babel (loaded from a CDN in each HTML
file) so they run without a build step. That's fine for the prototype; a fully
compiled, tree-shaken port can come later without changing the deployment.
