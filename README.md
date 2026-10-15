# Musas Bienes Raíces

Landing de marketing para **Musas**, una app que simplifica y revoluciona la venta de propiedades en Latinoamérica: claridad, control y trato justo frente a las inmobiliarias tradicionales.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (scroll, reveal, parallax)
- Español (LatAm)

Clerk auth is planned later. Deploy target: Vercel (GitHub `main`).

## Diseño (landing v2)

- Deep dark cinematic UI, teal neon accents, backdrop blur
- Soft parallax on property imagery; masked text reveals; chained section motion
- Brand-first full-bleed hero; respects `prefers-reduced-motion`

## Desarrollo local

```bash
npm install
npm run dev -- --port 4321 --hostname 127.0.0.1
```

Abre [http://127.0.0.1:4321](http://127.0.0.1:4321/).

## Vercel

App lives at the **repo root** (`src/app/page.tsx`). Expected project settings:

| Setting | Value |
| --- | --- |
| Framework Preset | **Next.js** |
| Root Directory | `.` (empty / repo root) — not `src`, not `public` |
| Build Command | `npm run build` (default) |
| Output Directory | **leave empty** (Next.js manages this; do not set `public` or `.next`) |
| Install Command | `npm install` |
| Node.js Version | **20.x** or newer |

### If you see Vercel’s generic `404 NOT_FOUND`

1. Open the project: [vercel.com/ricardo-mora-s-projects/musasbienesraices](https://vercel.com/ricardo-mora-s-projects/musasbienesraices)
2. **Settings → Domains** — ensure a production domain is listed (team URL `musasbienesraices-ricardo-mora-s-projects.vercel.app` and/or `musasbienesraices.vercel.app`). Assign it to **Production**.
3. **Settings → Deployment Protection** — set **Production** to **None** (disable Vercel Authentication for production) so the public can open the landing without a Vercel login.
4. **Deployments** → open the latest `main` deployment → **Redeploy** (or push a new commit to `main`).

Do **not** set Output Directory to `public` — that serves only static assets and yields a platform 404 for `/`.

## Scripts

| Comando         | Descripción            |
| --------------- | ---------------------- |
| `npm run dev`   | Servidor de desarrollo |
| `npm run build` | Build de producción    |
| `npm run start` | Sirve el build         |
| `npm run lint`  | ESLint                 |

## Estructura

- `src/app/` — layout, estilos globales y página de inicio
- `src/components/landing/` — secciones de la landing
- `src/components/lead-form.tsx` — captura de leads (mock local, sin backend)
- `public/` — imágenes de atmósfera inmobiliaria
- `vercel.json` — Framework Preset Next.js for Vercel
