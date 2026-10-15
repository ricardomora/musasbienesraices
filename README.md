# Musas Bienes Raíces

Landing de marketing para **Musas**, una app que simplifica y revoluciona la venta de propiedades en Latinoamérica: claridad, control y trato justo frente a las inmobiliarias tradicionales.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Español (LatAm)

Auth (Clerk) y deploy (Vercel) están planeados; esta primera entrega es solo la landing.

## Desarrollo local

```bash
npm install
npm run dev -- --port 4317 --hostname 0.0.0.0
```

Abre [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Scripts

| Comando        | Descripción              |
| -------------- | ------------------------ |
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Build de producción      |
| `npm run start`| Sirve el build           |
| `npm run lint` | ESLint                   |

## Estructura

- `src/app/` — layout, estilos globales y página de inicio
- `src/components/landing/` — secciones de la landing
- `src/components/lead-form.tsx` — captura de leads (mock local, sin backend)
- `public/` — imágenes de atmósfera inmobiliaria
