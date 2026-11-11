# Insumos de Joaquín (bloqueadores)

Marca cada ítem cuando esté listo. **Estado 2026-11-11 (tarde / INFORME-2):** keys locales casi listas. Bloqueo crítico = **deploy MVP a Vercel** + env prod + confirmación D1–D6 + **D7 venta vs alquiler**. Posible typo `ADMIN_EMAILS`.

## Leyenda de bloqueo beta

| Etiqueta | Significado |
|----------|-------------|
| **BLOQUEA BETA** | Sin esto no hay auth/DB/uploads reales ni scripts User |
| **BLOQUEA PROD** | Sin esto el dominio no sirve el MVP / webhook falla |
| **PARALELO** | Puede avanzar mientras se preparan keys; no desbloquea smoke E2E |
| **PRE-APERTURA PÚBLICA** | No bloquea beta cerrada; sí antes de registro público |

---

## Cuentas / keys (Fase 1)

| Ítem | Estado | Bloqueo | Notas |
|------|--------|---------|-------|
| Clerk app (dev) — publishable + secret | **listo** | — | App `musas` |
| Clerk sign-in/up URLs | **listo** | — | `/sign-in`, `/sign-up` |
| Clerk JWT template name `convex` | **listo** | — | Confirmado por Joaquín 2026-11-11 |
| `CLERK_JWT_ISSUER_DOMAIN` (Convex env) | **listo** | — | Set en deployment `colorful-llama-725` |
| Clerk webhook → `/api/clerk` + `CLERK_WEBHOOK_SECRET` | **parcial** | **BLOQUEA PROD** | Secret en `.env.local`; falta mismo en Vercel + redeploy (hoy `/api/clerk` 404) |
| `USER_SYNC_SECRET` (Next + Convex) | **listo** | — | Mismo valor en `.env.local` y Convex env |
| Convex — `NEXT_PUBLIC_CONVEX_URL` / deployment | **listo** | — | `https://colorful-llama-725.convex.cloud` · functions pushed |
| UploadThing — `UPLOADTHING_TOKEN` | **listo** | — | En `.env.local` (no commit) |
| `ADMIN_EMAILS` (Convex env) | **listo / verificar** | **BLOQUEA** admin | `ricardo10mora@gmail.com` — **confirmar typo vs `ricardo10mora`** |
| Archivo `.env.local` | **existe** | — | gitignored |
| Dominio prod | **listo** | — | `https://www.musasbienesraices.com` |
| Vercel project / deploy URL | **parcial** | — | Preview existe; dominio custom aún build viejo |
| Deploy código MVP a Vercel | **pendiente** | **BLOQUEA PROD** | Hoy `/api/clerk` = 404 (build viejo) |
| Vercel env (mismas keys que `.env.local`) | **pendiente** | **BLOQUEA PROD** | Incluye `CLERK_WEBHOOK_SECRET` |

## Ops / notificaciones (Fase 5)

| Ítem | Estado | Bloqueo | Notas |
|------|--------|---------|-------|
| Email ops Preferencial o Resend | pendiente | **PARALELO** | MVP = dashboard admin |
| WhatsApp/Instagram/email soporte beta | pendiente | **PARALELO** | |

## Negocio / contenido

| Ítem | Estado | Bloqueo | Notas |
|------|--------|---------|-------|
| Confirmación D1–D6 (o silencio 48h) | **pendiente — sin OK explícito** | **PARALELO** | INFORME-1; deadline 2026-11-13 19:20 UTC |
| **D7 — MVP solo venta vs venta+alquiler** | **pendiente** | Scope beta | INFORME-2; recomendación PM = **A solo venta** |
| Disclaimer legal VE | pendiente | **PRE-APERTURA PÚBLICA** | |
| Paquetes Preferencial | default en código | confirmar | D6 |
| Ciudad piloto | default 7 ciudades | confirmar | D4 |
| 5–10 usuarios beta + ≥3 publicadores | pendiente | criterio éxito | |
| Términos + privacidad v0 | pendiente | **PRE-APERTURA PÚBLICA** | |
| Seed admin post-deploy | pendiente | **BLOQUEA** métricas | Tras G2–G4 |
| INFORME-OWNER formal | **ausente** | — | Owner aún no escribió; INFORME-2 anticipa |

## Orden recomendado ahora (INFORME-2)

1. **Joaquín decide D7** (A recomendado) + confirma D1–D6 o silencio.
2. **Vercel env** = mirror de `.env.local` → **deploy MVP** a `www.musasbienesraices.com`.
3. Clerk webhook prod → `/api/clerk` (dejar de 404).
4. Confirmar `ADMIN_EMAILS` sin typo → smoke `/admin` → **seed**.
5. Correr `BETA_SCRIPTS` + reclutar beta cerrada.
