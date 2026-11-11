# Setup Musas (separado de Biosite)

**Crítico:** cuentas **nuevas** de Clerk, Convex y UploadThing para Musas. No copies `.env` ni webhooks de Biosite.

## Estado local (2026-11-11)

| Pieza | Estado |
|-------|--------|
| Clerk app Musas + JWT template `convex` | listo |
| Convex `colorful-llama-725` | listo |
| UploadThing token | listo (local) |
| `ADMIN_EMAILS` (Convex) | listo — **verificar typo email** |
| `CLERK_WEBHOOK_SECRET` + `USER_SYNC_SECRET` | listo en `.env.local` |
| Prod `www.musasbienesraices.com` | **build viejo** → `/api/clerk` = **404** |

Auth en app: **AuthGate** en layouts (`/dashboard`, `/publicar`, `/admin`) + `src/proxy.ts` passthrough (sin `clerkMiddleware`; colgaba en Next 16).

---

## 1) Checklist local (ya hecho / verificar)

1. Clerk → API keys → `.env.local`
2. Clerk → JWT Templates → New → Convex → name exactamente `convex`
3. Generar `USER_SYNC_SECRET` (mismo valor en `.env.local` **y** Convex Dashboard → Environment)
4. `npx convex dev` → proyecto Musas (`colorful-llama-725`)
5. Convex env:
   - `CLERK_JWT_ISSUER_DOMAIN` = issuer Clerk Musas
   - `ADMIN_EMAILS` = email(s) admin separados por coma
   - `USER_SYNC_SECRET` = mismo que local
6. UploadThing → `UPLOADTHING_TOKEN` en `.env.local`
7. Clerk webhook **prod** (tras deploy): `https://www.musasbienesraices.com/api/clerk`  
   Events: `user.created`, `user.updated` → secret = `CLERK_WEBHOOK_SECRET`

Placeholders: `.env.example` · insumos vivos: `docs/INSUMOS.md`.

---

## 2) Deploy Vercel — **NO ejecutar sin OK de Joaquín**

Orden obligatorio: **env en Vercel → deploy → webhook Clerk → seed admin → smoke**.

### 2.1 Env vars exactas en Vercel (Production + Preview)

Copiar desde `.env.local` Musas (nunca Biosite). Marcar **todas** como disponibles en Production (y Preview si se prueba preview URLs).

#### Obligatorias (bloquean prod)

| Variable | Dónde se usa | Notas |
|----------|--------------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client + SSR | Clerk Musas |
| `CLERK_SECRET_KEY` | Server (`auth()`, UploadThing middleware) | Clerk Musas |
| `CLERK_WEBHOOK_SECRET` | `POST /api/clerk` | Svix secret del webhook |
| `NEXT_PUBLIC_CONVEX_URL` | Client + webhook HTTP | `https://colorful-llama-725.convex.cloud` |
| `CONVEX_DEPLOYMENT` | Convex tooling / build hints | ej. `dev:colorful-llama-725` o prod deployment |
| `USER_SYNC_SECRET` | Next webhook → `users.syncUser` | **Idéntico** al de Convex Dashboard |
| `UPLOADTHING_TOKEN` | `/api/uploadthing` | App UploadThing Musas |

#### Recomendadas (UX / ops)

| Variable | Default si falta | Notas |
|----------|------------------|-------|
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/` | |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/` | |
| `NEXT_PUBLIC_SITE_URL` | — | `https://www.musasbienesraices.com` |
| `NEXT_PUBLIC_OPS_EMAIL` | “sin email ops” en admin | Contacto Preferencial |
| `NEXT_PUBLIC_OPS_WHATSAPP` | opcional | Canal ops |

#### Solo Convex Dashboard (NO van en Vercel)

| Variable | Notas |
|----------|-------|
| `CLERK_JWT_ISSUER_DOMAIN` | Issuer del JWT template `convex` |
| `ADMIN_EMAILS` | Comma-separated; typo = `/admin` muerto |
| `USER_SYNC_SECRET` | Mismo valor que Vercel / `.env.local` |

### 2.2 Pasos deploy (cuando Joaquín autorice)

1. Vercel → Project Musas → Settings → Environment Variables → pegar tabla **Obligatorias** (+ recomendadas).
2. Redeploy **Production** del commit actual (código con `/api/clerk`, AuthGate, wizard, etc.).
3. Verificar:
   - `https://www.musasbienesraices.com/` → home Musas actual
   - `https://www.musasbienesraices.com/api/clerk` con POST inválido ≠ 404 (espera 400/500 sin svix; **no** 404)
4. Clerk → Webhooks → endpoint estable:
   `https://www.musasbienesraices.com/api/clerk`  
   (evitar `*.vercel.app` efímeros)
5. Sign-up de prueba → usuario en Convex `users` (webhook **o** `ensureCurrentUser` al entrar).
6. Login con email en `ADMIN_EMAILS` → `/admin` → **Cargar demo**.
7. Smoke: `docs/BETA_SCRIPTS.md` flujos 1–7.

### 2.3 Auth / Next 16 notas

- **No** reintroducir `clerkMiddleware` hasta validar que no cuelga el proxy Next 16.
- Protección: `AuthGate` + `x-pathname` desde `src/proxy.ts` → redirect a `/sign-in?redirect_url=…`.
- UploadThing middleware sigue usando `auth()` de Clerk (requiere `CLERK_SECRET_KEY` en Vercel).
- Build (Cache Components): `ConvexReactClient` se crea **solo en cliente** tras hydration (evita `Math.random` en prerender). Hasta entonces el shell muestra “Cargando Musas…” para no montar hooks Convex sin provider. Root layout: `instant = false` + `<Suspense>` alrededor de `Providers`.

---

## 3) Smoke local (post-keys)

- [ ] Sign-up / sign-in Clerk
- [ ] Usuario en Convex (`users`) vía webhook o `ensureCurrentUser`
- [ ] Seed demo + home con listings Convex
- [ ] Publicar draft → fotos UploadThing → publish
- [ ] Pregunta + respuesta en ficha / inbox
- [ ] Favorito (anon local → merge al login con IDs Convex)
- [ ] Solicitud Preferencial + cambio de estado en admin

---

## 4) Scope / D7 (no implementar sin decisión)

Schema actual = **venta USD implícita** (`priceUsd`, tipo `apartamentos|casas`). **Sin** `operationType` sale/rent.

| Opción | Esfuerzo estimado | Notas |
|--------|-------------------|-------|
| **A** Solo venta (recomendado MVP) | 0 | Copy deja claro compra/venta USD |
| **B** Venta + alquiler | **~1–2 sprints** | Schema + indexes + filtros explore/publish + seed dual + Preferencial edge + scripts User + copy Design |
| **C** UI “coming soon” alquiler | ~0.5 día | Riesgo expectativa falsa |

**Regla tech:** no tocar schema grande de operación hasta **D7 aprobada** por Joaquín (ver `docs/INFORME_DECISIONES.md` INFORME-2).
