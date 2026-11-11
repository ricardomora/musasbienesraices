# Scripts beta — happy path producción (pass/fail)

Agente: **musas-user** · Dry-run / code-walk: **2026-11-11**  
Ámbito: venta VE (apartamentos / casas). **Alquiler no existe** en schema ni UI.

> **Corrida real:** ⬜ bloqueada en prod. Redeploy Vercel pendiente (build viejo → `/api/clerk` 404). Local con `.env.local` Musas sí puede smoke si hay seed + `ADMIN_EMAILS`.

---

## Matriz rápida

| # | Flujo | Code-walk | Prod hoy | Local post-seed | Pass real |
|---|--------|-----------|----------|-----------------|-----------|
| 1 | Visitante explorar | PASS cableado | **NO** (deploy viejo / seed vacío Convex) | PASS si seed | ⬜ |
| 2 | Publicar | PASS cableado | **NO** (deploy + UploadThing env) | PASS con auth | ⬜ |
| 3 | Preferencial solicitud | PASS cableado | **NO** | PASS con auth | ⬜ |
| 4 | Admin ops | PASS cableado | **NO** | PASS si `ADMIN_EMAILS` | ⬜ |
| 5 | Q&A | PASS cableado | **NO** | PASS (≥2 cuentas) | ⬜ |
| 6 | Favoritos | PASS cableado* | **NO** (merge solo con backend) | PASS | ⬜ |

\*Merge anon→auth filtraba mal Convex IDs; fix en `use-auth-favorites.ts` (IDs opacos ≥16 sin `-`).

---

## Qué NO se puede probar aún

| Bloqueo | Severity | Dónde | Impacto en scripts |
|---------|----------|-------|--------------------|
| **Prod deploy viejo** | **blocker** | `www.musasbienesraices.com` | Happy path prod entero. `/api/clerk` 404 → sync usuarios roto en prod. |
| **Vercel env incompleto** | **blocker** | Vercel project | Sin mismas keys que `.env.local` no hay Clerk/Convex/UploadThing en prod. |
| **Seed vacío (Convex)** | **major** (ops) | DB Musas sin “Cargar demo” | Script 1 vacío; 5/6 sin ficha real. Local demo (`HomeApp`) **no** cuenta como prod. |
| **Alquiler inexistente** | **out of scope** | Schema solo `apartamentos`\|`casas`; hero `comprar`\|`favoritos` | **No** hay filtro/modo alquiler. Marcar N/A, no fail. |
| **Webhook Clerk en prod** | **blocker** (prod) | Endpoint custom domain | Fallback `ensureCurrentUser` ayuda en local; prod webhook sigue pendiente post-deploy. |
| **Una sola cuenta** | major (QA) | Scripts 5 | Owner no puede preguntar en su listing → hace falta 2º user. |

**No confundir:** sin keys, home usa seed **local** (`LISTINGS` en `src/data`). Eso **no** valida `listPublished` / publicar / Preferencial / admin.

---

## Setup antes de correr

**Local (smoke cerrado):**

1. `.env.local` Musas (nunca Biosite) — ver `SETUP_MUSAS.md`.
2. Convex env: `CLERK_JWT_ISSUER_DOMAIN`, `ADMIN_EMAILS`, `USER_SYNC_SECRET`.
3. Clerk JWT template name `convex`; opcional webhook → `/api/clerk`.
4. `npx convex dev` + `npm run dev` → http://127.0.0.1:4321
5. Login admin → `/admin` → **Cargar demo**.

**Prod (cuando exista redeploy):**

1. Deploy código MVP + env Vercel = local.
2. Webhook Clerk → `https://www.musasbienesraices.com/api/clerk`.
3. Admin seed en prod.
4. Correr esta misma matriz contra el dominio custom.

**Orden sugerido:** 4 (seed) → 1 → 6 → 2 → 5 → 3 → 4 (status Preferencial / pausar).

---

## 1 — Visitante: explorar

**URL:** `/` · **UI:** `HeroSearch`, `ListingsGrid`, `ConvexListingDetail`  
**API:** `listings.listPublished`, `listings.getBySlug`

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| 1.1 | Abrir `/` con backend | Hero + grid desde Convex (`status: published`) | Empty “No encontramos…” sin seed; o grid local demo con keys ausentes |
| 1.2 | Ciudad / tipo / presupuesto → Buscar | URL `?ciudad=&tipo=&presupuesto=`; grid filtrado | Filtro no cambia resultados / URL |
| 1.3 | Click Ver inmueble | `/inmuebles/[slug]` | 404 o ficha local stale |
| 1.4 | Leer ficha | Precio USD, admin, features, heart, Preguntas | Campos vacíos / crash |

**N/A explícito:** modo o filtro **alquiler** — no implementar en este script.

**Confusión VE:** “¿Por qué no hay nada?” → seed vacío, no “no hay casas en Caracas”.

**Dry-run:** PASS cableado · **Prod:** NO · **Severity residual:** major ops (seed)

---

## 2 — Publicar (vendedor)

**URL:** `/publicar` (Clerk) · **UI:** `PublishWizard` + UploadThing `listingImageUploader`  
**API:** `createDraft` → `updateListing` → `publishListing` (`listingIsComplete`)

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| 2.1 | Login → `/publicar` | Wizard 1/3 | Gate setup / redirect loop |
| 2.2 | Título + tipo + ciudad → Continuar | Paso 2 | — |
| 2.3 | Sector, precio, admin, camas, baños, m², desc ≥40, features → Guardar | Draft + paso 3 | Toast error Convex |
| 2.4 | ≥1 foto UploadThing → Publicar | `published`; redirect `/dashboard/inmuebles` | “incompleto” sin foto/desc corta |
| 2.5 | `/` | Listing visible en explore | Solo draft / paused |

**Completitud mínima (backend):** título≥3, barrio≥2, desc≥40, priceUsd>0, areaM2>0, ≥1 imagen, cityId.

**Confusión VE:** “Guardé y no publica” → falta foto o descripción corta.

**Dry-run:** PASS cableado · **Prod:** NO · **Severity residual:** blocker prod deploy/UploadThing

---

## 3 — Preferencial: solicitud

**URL:** `/preferencial` + `/dashboard/preferencial`  
**API:** `preferential.create` (inserta `status: "requested"`), `myRequests`

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| 3.1 | Abrir `/preferencial` | 3 paquetes: fotos / legal / acompañamiento | Cards rotas |
| 3.2 | Sin login | CTA sign-in | Form submit anónimo |
| 3.3 | Login → ≥1 paquete + notas ≥10 + teléfono opcional → Solicitar | Toast; fila **Solicitada** (`requested`) | Status distinto / error Unauthorized |
| 3.4 | `/dashboard/preferencial` | Misma fila + label ES | Lista vacía |

**Nota producto:** pago/coordinación **fuera de app** (copy en página). No fallar por ausencia de checkout.

**Dry-run:** PASS cableado · **Prod:** NO · **Severity residual:** blocker prod auth

---

## 4 — Admin ops

**URL:** `/admin` · **Precondición:** email en `ADMIN_EMAILS` → `users.role === "admin"`  
**API:** `seed.seedDemoListings`, `preferential.listAdmin` / `updateStatus`, `listings.listAllAdmin` / `setListingStatus`

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| 4.1 | Login admin → `/admin` | Panel Preferencial + Inmuebles | Mensaje “configura ADMIN_EMAILS” |
| 4.2 | **Cargar demo** | Toast con count; explore poblado | 0 created / error |
| 4.3 | Cambiar status solicitud | Label ES actualizado | Select no persiste |
| 4.4 | Pausar listing `published` | Status `paused`; sale de explore | Sigue en grid público |

**Dry-run:** PASS cableado · **Prod:** NO · **Severity residual:** major si typo en `ADMIN_EMAILS` (ver INSUMOS)

---

## 5 — Q&A (comprador ↔ vendedor)

**URLs:** ficha `/inmuebles/[slug]` · inbox `/dashboard/mensajes`  
**API:** `questions.ask` (≥10), `answer` (≥5), `listForListing`, `inboxForSeller`

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| 5.1 | Anon en ficha | CTA “Inicia sesión para hacer una pregunta” | Form libre |
| 5.2 | Cuenta **no-owner** → pregunta ≥10 chars | Aparece con askerName; “Esperando respuesta…” | Owner puede preguntar en propio listing (debe error) |
| 5.3 | Owner → `/dashboard/mensajes` | Hilo + link ficha | Inbox vacío con pregunta existente |
| 5.4 | Responder ≥5 (inbox o ficha) | Respuesta en inbox **y** ficha | Solo un lado |

**Precondición:** listing published + 2 usuarios. Tras seed, owner = admin seed → usar otra cuenta comprador.

**Dry-run:** PASS cableado · **Prod:** NO · **Severity residual:** major QA (2 cuentas)

---

## 6 — Favoritos (anon → auth)

**UI:** heart grid/ficha · hero “Mis favoritos” · `useAuthFavorites`  
**Storage/API:** `localStorage` `musas-favorites` → `favorites.mergeLocal` → `toggle` / `listMine`

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| 6.1 | Sin login, heart en card/ficha | Persiste en `musas-favorites` | No revive al refresh |
| 6.2 | Modo Mis favoritos | `?favoritos=1`; solo guardados | Lista completa sin filtrar |
| 6.3 | Sign-in tras favorito Convex | Merge; heart filled; local limpio si IDs migraron | Favoritos “se pierden” al login |
| 6.4 | Toggle logged-in | Convex `toggle`; sync en otras pestañas vía query | Solo local |

**Nota:** IDs demo locales (`casa-avila`) **no** migran a Convex (by design). Solo IDs Convex opacos.

**Dry-run:** PASS* (post-fix merge) · **Prod:** NO · **Severity residual:** minor (demo IDs vs Convex)

---

## Feedback form (copiar a Notion/Typeform)

- ¿Qué intentabas hacer?
- ¿Lo lograste? (sí / parcial / no)
- Fricción principal (1 frase)
- ¿Publicarías un inmueble real aquí? ¿Por qué?
- NPS 0–10

## Criterio éxito beta

- ≥1 listing de usuario externo (no solo seed)
- ≥1 hilo Q&A completo (pregunta + respuesta)
- ≥1 solicitud Preferencial (`requested` o avanzado)
- Scripts 1–6 con pass/fail guardado + feedback

---

## Dry-run findings (severity)

| ID | Severity | Flujo | Hallazgo | Fix mínimo |
|----|----------|-------|----------|------------|
| prod-deploy-old | **blocker** | todos | Prod build viejo; `/api/clerk` 404 | Redeploy MVP + env Vercel |
| vercel-env | **blocker** | todos | Env prod ≠ local | Pegar keys Musas en Vercel |
| seed-empty | **major** | 1,5,6 | Convex sin demo → explore vacío | Admin → Cargar demo |
| alquiler-na | **out of scope** | 1 | No hay alquiler en producto | No testear; copy solo venta |
| admin-email-typo | **major** (ops) | 4 | INSUMOS: confirmar `ricardo1omora` vs `ricardo10mora` | Corregir `ADMIN_EMAILS` |
| qa-two-accounts | **major** (QA) | 5 | Owner no pregunta en su ficha | 2ª cuenta Clerk |
| fav-merge-ids | **fixed** | 6 | Merge usaba `includes("\|")` | Ya filtrado por ID opaco |
| publish-complete-late | **minor** | 2 | Validación fuerte solo en `publishListing` | Toast claro ya; opcional validar en UI paso 2 |
| preferential-notes-10 | **minor** | 3 | Notas mín. 10 chars | Placeholder/hint si confunde |

### Micro-fixes ya en código (dry-runs previos)

- `src/hooks/use-auth-favorites.ts` — merge anon→auth
- `src/components/home/listings-grid.tsx` — sin “de ejemplo”
- Preferencial labels ES + Q&A hint/disabled + mensajes empty state

### Qué probar primero cuando desbloquee

1. Redeploy prod **o** smoke local con seed  
2. Script **4** seed → **1** explorar → **6** favoritos  
3. **2** publicar → **5** Q&A (2 cuentas) → **3** Preferencial → **4** status/pausar
