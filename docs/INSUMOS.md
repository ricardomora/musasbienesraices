# Insumos de Joaquín (bloqueadores)

Marca cada ítem cuando esté listo. **Estado 2026-11-12 (INFORME-5):** Propiedash=10 Musas=3 aceptado. Moat propuesto = verify listings + especialistas (D11–D13 pendientes). Bloqueo prod = **env/sync/Clerk live**. D7=**A**. D1–D6 + D8 + D10 pendientes. Roadmap 30/60/90: UX robada + moat L1→L3; no mapa/NL/BCV/directorio.

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
| `ADMIN_EMAILS` (Convex env) | **listo dual** | — local; **BLOQUEA PROD** si falta en Vercel | `ricardo10mora@gmail.com,ricardo10moraco@gmail.com` (confirmado) |
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
| Confirmación D1–D6 (o silencio 48h) | **pendiente — sin OK explícito** | **PARALELO** | INFORME-1/3; deadline 2026-11-13 19:20 UTC |
| **D7 — MVP solo venta vs venta+alquiler** | **A — solo venta (aprobada)** | — | Alquiler = backlog |
| **D8 — Ops Preferencial &lt;24h** | **pendiente** | **PARALELO** major | Nombre + WA/email (INFORME-3 / OWNER-2) |
| **D10 — WA en ficha** | **pendiente** | W1 UX | A opt-in / B solo Q&A / C WA ops — rec PM: **A** (INFORME-4) |
| **D11 — Posicionamiento vs Propiedash** | **pendiente** | estratégico 90d | INFORME-5: rec **D** = N2 (listings verificados) + N3 (especialistas) |
| **D12 — Política verify listings** | **pendiente** | moat | INFORME-5: rec **A** L0 post-publish → L1 cola &lt;24h + badge |
| **D13 — Quién paga verify** | **pendiente** | ops/costo | INFORME-5: rec L1 absorbido Musas; L2/L3 vía Preferencial |
| Disclaimer legal VE | pendiente | **PRE-APERTURA PÚBLICA** | Semana 2 |
| Paquetes Preferencial | default en código | confirmar | D3/D6 floors 120/150/200 |
| Ciudad piloto | default 7 ciudades | confirmar | D4 |
| 5–10 usuarios beta + ≥3 publicadores | pendiente | criterio éxito | Semana 1 |
| Términos + privacidad v0 | pendiente | **PRE-APERTURA PÚBLICA** | Semana 2 |
| Seed admin post-deploy | pendiente | **BLOQUEA** métricas | Tras G2–G4 |
| QA local scripts 1–4+6 | **PASS** corrida 3/3b | — | Q&A N/A (1 cuenta) |
| INFORME-OWNER formal | **OWNER-1 + OWNER-2 + OWNER-3** | — | OWNER-3: apuesta competitiva VE (Caracas USD + Preferencial); D10 WA ficha |
| **D10 — WA opt-in en ficha** | **pendiente** (recom owner: sí) | competitivo major | vs hábito VE / ML / Propiedash |

## Orden recomendado ahora (INFORME-4)

1. **Semana 0:** Vercel env → redeploy → webhook → seed → smoke prod + 2ª cuenta Q&A + D8 ops.
2. Confirmar D1–D6 + **D10 WA** + lista beta (paralelo).
3. **W1 UX:** F4 bandas → D10 (si A) → F5/F6 checklist/fotos → F3 sector. **No** mapa/NL/BCV.
4. **W2:** T&C/disclaimer + share light + métricas M1–M7 (anti-copia).
