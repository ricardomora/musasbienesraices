# Scripts beta — happy path producción (pass/fail)

Agente: **musas-user** / **musas-qa** · Dry-run: **2026-11-11** · Live local corrida 3b: **2026-11-12 ~01:14Z**  
Ámbito: venta VE (apartamentos / casas). **Alquiler no existe** en schema ni UI.

> **Corrida 3b final:** Admin **PASS** tras `ADMIN_EMAILS=ricardo10mora@gmail.com,ricardo10moraco@gmail.com`. Seed → 6 publicadas/12 fichas; pause `Casa Ávila` → `paused` (5 pub). Imagen UT **PASS**. Q&A **N/A** (1 cuenta).

> **Post-security smoke (musas-qa live):** **2026-11-27 ~17:47Z** · `http://127.0.0.1:4321` · sin sesión. Home hero día **PASS** (`musas.` + «Sin complicaciones.»). Explore **PASS** (5 Convex listings, `ConvexHomeApp`). `/admin` → Clerk sign-in `redirect_url=/admin` **PASS** (AuthGate). Ficha `/inmuebles/apt-de-lujo` contacto sin email **PASS**. Consola: sin crashes; badge Next.js Security Insight only (**minor**).

---

## Matriz rápida

| # | Flujo | Code-walk | Prod hoy | Local post-seed | Pass real |
|---|--------|-----------|----------|-----------------|-----------|
| 1 | Visitante explorar | PASS cableado | **NO** (deploy viejo / seed vacío Convex) | **PASS** live (1 listing + filtros) | **PASS** |
| 2 | Publicar | PASS cableado | **NO** (deploy + UploadThing env) | **PASS** live foto→slug | **PASS** |
| 3 | Preferencial solicitud | PASS cableado | **NO** | **PASS** live Solicitada | **PASS** |
| 4 | Admin ops | PASS cableado | **NO** | **PASS** live seed+pause | **PASS** |
| 5 | Q&A | PASS cableado | **NO** | **N/A** (1 cuenta; owner≠asker) | **N/A** |
| 6 | Favoritos | PASS cableado* | **NO** (merge solo con backend) | **PASS** heart→Guardado | **PASS** |

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

**Orden sugerido:** **S0** → 4 (seed) → 1 → 6 → 2 → 5 → 3 → 4 (status Preferencial / pausar).

---

## S0 — Vendedor recurrente (post-login, sin URLs) — **GATE**

**Ámbito:** Usuario ya publicó al menos una vez (o cuenta con draft). **Prohibido** tipiar `/dashboard/*` o `/publicar`.  
**Contrato de paridad:** [`docs/REFERENTE_PROPIEDASH_MAP.md`](./REFERENTE_PROPIEDASH_MAP.md).

| Paso | Acción | Expected | Fail si… |
|------|--------|----------|----------|
| S0.1 | Cerrar sesión → login Gmail desde `/` | Home carga autenticado | Auth loop |
| S0.2 | Sin URL manual: llegar a **Mis inmuebles** | ≤2 clics vía **Mi panel** / Mis inmuebles | Solo `UserButton`; link solo en footer |
| S0.3 | Ver indicio de **mensajes** | ≤1 clic extra desde panel o header | Inbox solo dentro de `/dashboard` sin puente |
| S0.4 | Abrir `/mapa`, ficha, `/preferencial` logueado | **Mi panel** + Publicar visibles (`AppChrome`) | Nav solo en home |
| S0.5 | Volver a `/` explorando | Panel sigue visible (no «modo visitante») | Nav desaparece fuera de dashboard |

**musas-qa:** ningún PASS de scripts 2–5 sin **S0 PASS** el mismo día. **Owner:** puede vetar invitación a publicadores si S0 FAIL.

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

### Live E2E local — 2026-11-11 (musas-qa)

#### Corrida 1 (~20:58Z) — pre-fix

| Paso | Expected | Actual | Severity |
|------|----------|--------|----------|
| Server / sesión / wizard 1–3 | OK | **PASS** título `QA Musas foto 1794430429` | — |
| Upload foto | UT OK | **FAIL** POST upload **500** `Failed to run middleware` | **blocker** |
| Publish / slug | Visible | **N/A** | — |

#### Corrida 2 (~21:02Z) — post `clerkMiddleware` solo en `/api/uploadthing`

| Paso | Expected | Actual | Severity |
|------|----------|--------|----------|
| Server up (+ restart) | 200 | **PASS** home 200; Next Ready | — |
| Sesión + wizard 1–3 | Draft + fotos | **PASS** (antes del restart: título `QA Musas foto 1794430827`, Caracas, 175000/120, paso 3) | — |
| UploadThing widget | Choose File listo | **FAIL** botón queda en **`Loading…`** indefinido | **blocker** |
| `GET /api/uploadthing` | 200 JSON router | **FAIL** curl `--max-time 20` → **timeout** (000); logs: `Failed to proxy … socket hang up` | **blocker** |
| Upload `/tmp/musas-qa-listing.jpg` + Publicar | published | **N/A** — sin foto | — |
| Explore / slug | URL | **ninguno** | — |
| Consola | Sin crash | Instant Navigation Insight `/publicar` (minor); no red overlay | minor |

**Root cause (retest):** acotar `clerkMiddleware` a `/api/uploadthing` **reintroduce el hang** en esa ruta → el cliente UT nunca termina de inicializar. Antes: auth() fallaba rápido (500). Ahora: request no responde.

**Joaquín / Tech:** auth para UT **sin** hang (p.ej. `auth()` vía cookie/JWT en route handler, o clerk middleware no-bloqueante). Re-test live obligatorio. No PASS sin slug.

#### Corrida 3 (~21:20Z) — post proxy passthrough + `authenticateRequest` UT

| Paso | Expected | Actual | Severity |
|------|----------|--------|----------|
| Smoke GET `/api/uploadthing` | 200 &lt;5s | **PASS** 200 ~0.06s | — |
| Explore `/` | Grid o empty sin crash | **PASS** empty→luego 1 listing `QA Musas foto 1794431619`; filtros `?ciudad=caracas&tipo=apartamentos` | — |
| Auth UserButton | Sesión visible | **PASS** “Abrir menú de usuario”; sign-out no ejercido | — |
| Wizard 1–3 | Draft + paso fotos | **PASS** título único, Caracas, apto, 175000/120 | — |
| Upload foto UT | Toast + preview | **PASS** “Fotos subidas”; preview `ufs.sh/...` | — |
| Publicar en venta | `published` + slug | **PASS** `/dashboard/inmuebles` + `/inmuebles/qa-musas-foto-1794431619-1` | — |
| Preferencial | Solicitud `requested` | **PASS** Sesión fotográfica → Solicitada en `/dashboard/preferencial` | — |
| Admin seed/pause | Panel admin | **BLOCKER** “Necesitas rol admin… ADMIN_EMAILS” | **blocker** (ops) |
| Q&A | ask+answer | **N/A** una sola cuenta (owner no pregunta en propio listing) | major QA |
| Favoritos | Heart en ficha | **PASS** “Guardado”; hero Favoritos (1) | — |
| Consola / overlay | Sin crash runtime | Math.random prerender warning `layout.tsx:55` (dev overlay); 1× home “couldn't load” intermitente luego recuperó | minor |

**Evidencia publish:** slug `qa-musas-foto-1794431619-1` · URL `http://127.0.0.1:4321/inmuebles/qa-musas-foto-1794431619-1`

**Joaquín:** (1) Confirmar email Clerk en Convex `ADMIN_EMAILS` y re-login para Admin. (2) 2ª cuenta Clerk para Q&A. (3) Redeploy prod + env Vercel.

#### Corrida 3b (~01:12–01:14Z) — imagen + admin post `ADMIN_EMAILS` dual

| Paso | Expected | Actual | Severity |
|------|----------|--------|----------|
| Reload `/` + sync | Providers `/api/me/sync` | **PASS** `200` `{ok:true,email:"ricardo10mora@gmail.com"}` | — |
| `/admin` panel (pre-fix emails) | Panel ops | **BLOCKER** intermedio “Necesitas rol admin” (sesión vs 2ª fila `ricardo10moraco@…`) | **fixed** |
| `/admin` post `ADMIN_EMAILS` dual | Ops Musas | **PASS** panel; Preferencial + moderación visibles | — |
| Seed catálogo | Demo listings | **PASS** 1→**6** publicadas · **12** fichas (Casa Ávila, Altamira, Chacao, Naguara, Playa Norte…) | — |
| Pausar listing | `paused` | **PASS** `Casa Ávila · paused`; stats **5** publicadas | — |
| Imagen ficha slug | sin crash hostname | **PASS** `/inmuebles/qa-musas-foto-1794431619-1` `ufs.sh` `naturalWidth=1600` | — |
| Imagen grid `/` | next/image UT | **PASS** `_next/image?…ufs.sh…` `complete=true` | — |
| Q&A | ask+answer | **N/A** 1 cuenta (owner≠asker) | major QA |

**Evidencia admin:** `http://127.0.0.1:4321/admin` · seed+pause live · Convex `ADMIN_EMAILS` incluye ambos emails.  
**Evidencia imagen:** slug `qa-musas-foto-1794431619-1` · host `y3jddja7qb.ufs.sh`.

**Joaquín:** (1) 2ª cuenta Clerk **distinta** para Q&A. (2) Redeploy prod + env Vercel. (3) Opcional limpiar drafts QA huérfanos.

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

## Fricciones reales FSBO Caracas (musas-user · post corridas PASS)

> Base: live local PASS (publish+foto, Preferencial, admin, favoritos). **Q&A = N/A** (1 cuenta; owner≠asker). No features fancy — dolores de uso.

| # | Dolor / mejora | Quién | Severity | Evidencia de uso | Fix mínimo |
|---|----------------|------|----------|------------------|------------|
| F1 | **Prod / catálogo vacío** → “¿no hay casas en Caracas?” | ambos | **blocker** (ops) | Prod build viejo; explore vacío sin seed | Redeploy + env + seed admin |
| F2 | **Sin WhatsApp en ficha** — solo “Preguntar” (login + espera) | comprador | **major** | Ficha: heart + Q&A; cero CTA WA/tel | CTA “Escribir por WhatsApp” (opt-in vendedor) o teléfono verificado |
| F3 | **No filtro por urbanización** (Altamira, LPG, Chacao…) | comprador | **major** | Hero: ciudad/tipo/presupuesto; barrio solo texto en ficha | Filtro texto “sector” o chips Caracas top |
| F4 | **Presupuesto empieza en “hasta 150k”** — muchos aptos FSBO 40–90k | comprador | **major** | `BUDGET_OPTIONS` min band 150k | Bandas ≤80k / ≤120k o rango desde–hasta |
| F5 | **“Guardé y no publica”** — validación fuerte solo al Publicar | vendedor | **major** | Desc ≥40 + ≥1 foto; toast incompleto tarde | Checklist en paso 2 + contador desc/foto |
| F6 | **1 foto de celular = ficha poco creíble** | ambos | **major** | Mín. 1; Preferencial fotos es link al final | Hint “mín. 4–6” + CTA Preferencial más visible post-publish |
| F7 | **Q&A aún N/A** — no hay camino comprador→vendedor probado | ambos | **major** (QA) | 1 cuenta; owner no pregunta en propio listing | 2ª cuenta Clerk → script 5 mañana |
| F8 | **Preferencial queda en “Solicitada” sin siguiente paso claro** | vendedor | **minor** | Toast WA + dashboard label; ops fuera de app | Copy ETA (“te escribimos en 24h”) + estado en dashboard |

**Confusiones VE escuchadas / esperables**

- “¿Por qué no hay nada?” ≠ mercado vacío → seed/deploy.
- “¿Cómo le escribo al dueño?” → espera Q&A o WA inexistente.
- “¿El precio es en dólares o bolívares?” → copy USD OK, reforzar en hero/wizard.
- “¿Publico con una foto y ya?” → sí técnicamente; mercado no confía.

---

## Brainstorm profundo: Propiedash (10) vs Musas (3) — caraqueño (2026-11-12)

> Persona: busco apto/casa en Caracas (USD), a veces alquiler; también he pensado publicar FSBO. Propiedash = 44k pubs, mapa, zona, chat, hábitos WA-ish, directorio agentes, dashcode share, fotos, BCV, alquiler+venta. Musas = poca densidad, hero bonito, publish básico, Preferencial, Q&A, sin WA ficha, sin sector útil.  
> Propuesta Joaquín a evaluar: **listings validados reales** + **especialistas Musas**.

### 1) Por qué abro Propiedash mañana y no Musas (8 razones brutales)

| # | Razón | Severity si Musas no cierra |
|---|--------|------------------------------|
| 1 | **Densidad.** En Propiedash hay oferta; en Musas siento “beta vacía”. Si no hay 3–5 opciones en *mi* zona, no vuelvo. | **blocker** |
| 2 | **Zona, no ciudad.** Busco Altamira / LPG / Los Palos / La Tahona. “Caracas” sola es inútil. | **blocker** |
| 3 | **Contacto YA.** Chat o WA-ish en ficha. Musas me pide login + pregunta y rezar. En Caracas eso es morir. | **blocker** |
| 4 | **Mapa mental.** Aunque no use el mapa todos los días, me orienta “dónde queda de verdad”. Sin zona ni mapa, desconfío del pin. | **major** |
| 5 | **Alquiler + venta.** Mucha gente empieza alquilando o compara. Musas solo venta = me saca del embudo. | **major** (D7=A consciente) |
| 6 | **Share cultural.** Dashcode / link corto para status WA. Musas = URL larga que nadie manda. | **major** |
| 7 | **Fotos serias.** Galería + volumen. Una foto hero “bonita” no me convence a visitar. | **major** |
| 8 | **Directorio / agentes.** Si el dueño no responde, tengo plan B humano. En Musas Preferencial se siente “pedido a un vacío”. | **major** |

**Quote usuario:** “Propiedash no es lindo; es donde *hay*. Musas parece revista, no mercado.”

### 2) Qué de Propiedash echaría de menos si Musas lo copia mal

| Si Musas copia… | Cómo lo rompe | Qué sí quiero |
|-----------------|---------------|---------------|
| **Mapa** | Mapa vacío / pins fake / lag | Primero **sector + densidad**; mapa después con listings reales |
| **Chat** | Chat lento + login + nadie online | **WA opt-in** (hábito real) + Q&A como historial |
| **Directorio agentes** | Lista fría de 200 “asesores” sin filtro | Pocos **especialistas con cara, zona y SLA** |
| **BCV** | Calculadora que distrae del precio USD | USD-first; BCV solo si confunde en beta |
| **44k pubs** | Abrir flood de basura / duplicados | Menos volumen, **más verdad** — pero mínimo viable de densidad Caracas |
| **Dashcode** | Código raro sin cultura de uso | Botón **Compartir / copiar link** que abra en WA |

**Anti-copia:** no pelear el “catálogo infinito”. Pelear **confianza + velocidad de contacto** en el subset Caracas USD.

### 3) ¿Validación listing me convence? ¿Qué prueba concreta en ficha?

**Veredicto:** sí me interesa *si* es prueba visible, no badge marketing.

| Me convence | No me convence |
|-------------|----------------|
| “Musas revisó docs / visita / fotos propias” con **fecha** y **qué se validó** | Sello “Verificado ✓” genérico |
| Foto de fachada/ambiente claramente de sesión (no stock) | “Publicación revisada por admin” sin detalle |
| Checklist visible: título / documentos / precio / ubicación | Solo Preferencial pagado = “validado” |

**Prueba mínima en ficha (P0 trust):**
1. Badge **“Validado Musas”** + tooltip/modal: *qué* (docs / visita / fotos) + *cuándo* (fecha).
2. Si no está validado: estado honesto **“Publicado por dueño — sin validar”** (no esconder).
3. Ideal: 1 línea “Última revisión: 12 nov 2026 · fotos + ubicación”.

Sin eso, “validado” = humo y peor que Propiedash (allí al menos asumo ruido conocido).

### 4) Especialistas Musas vs directorio Propiedash — ¿cuándo pago / confío?

| | Directorio Propiedash | Especialistas Musas (propuesta) |
|--|----------------------|----------------------------------|
| Confianza | Baja–media: muchos nombres, poco filtro | Alta *si* son pocos, con zona, cara, y casos |
| Pago | Comisión típica / fee agente | Preferencial / fee claro + SLA |
| Cuándo uso | Cuando dueño no responde o quiero intermediario | Cuando quiero **cierre serio** (visita, docs, negociación) |

**Confiaría / pagaría cuando:**
- Veo **nombre + foto + zona** (ej. “Ana · Chacao / Altamira”).
- Hay **respuesta &lt;24h** prometida y cumplida (D8).
- El especialista está **atado a mi listing** (no directorio genérico).
- Precio Preferencial visible “desde X USD” + pago fuera OK.

**No pagaría:** lista tipo “encuentra un agente” sin accountability. Eso es Propiedash peor.

### 5) 8 ideas de producto desde fricción real (no vanity)

| # | Idea | Fricción que mata | Severity |
|---|------|-------------------|----------|
| P1 | **WA opt-in en ficha** (anon) + Q&A con login | No puedo contactar como en Caracas | **blocker** |
| P2 | **Filtro sector Caracas** (chips Altamira/LPG/…) | “Caracas” no es búsqueda | **blocker** |
| P3 | **Sello Validado** con checklist + fecha en ficha | Desconfianza vs 44k pubs | **major** (diferencial) |
| P4 | **Especialista asignado** en Preferencial (cara + WA ops + ETA) | Preferencial = ticket al vacío | **major** |
| P5 | **Galería ≥4–6** + hint; Preferencial = upgrade fotos | 1 foto = no visito | **major** |
| P6 | **Compartir / copiar link** (WA status) | No viralizo ficha | **major** |
| P7 | **Bandas precio ≤80k / ≤120k** | Primera banda 150k me echa | **major** |
| P8 | **“Dueño no responde” → CTA especialista** | Chat muerto en rivales; aquí Musas gana | **major** (si ops existe) |

**Prioridad caraqueña mañana:** P1 + P2 + densidad seed. Validación (P3) y especialistas (P4/P8) son el diferencial *después* de poder buscar y escribir.

### Veredicto usuario → PM / Owner

- Propiedash gana por **oferta + hábito**. Musas solo gana si **verdad + humano** son visibles en ficha, no en pitch.
- Copiar mapa/BCV/directorio sin densidad = suicide vanity.
- Validación + especialistas: **sí**, con prueba concreta y SLA; **no** como badge vacío.

---

## Gaps mercado: ellos tienen / Musas no (musas-user · 2026-11-12)

> Contraste vs hábito caraqueño: **ML Inmuebles**, **Housy**, **Propiedash**, **WhatsApp directo** (status / grupos / “te paso el link”).  
> Evidencia código Musas: ficha = 1ª foto + Q&A con login; hero = ciudad/tipo/presupuesto (≥150k); wizard 3 pasos sin WA de listing; cero share UI.

| # | Ellos tienen | Musas hoy | Severity | ¿Emular o diferenciar? | Fix mínimo |
|---|--------------|-----------|----------|-------------------------|------------|
| G1 | **WhatsApp inmediato en ficha** (botón verde / “Contactar”) | Solo “Preguntar” + login; sin `wa.me` | **blocker** (confianza contacto) | **Emular** CTA WA opt-in del vendedor. **Diferenciar** Q&A público como capa de historial (no reemplazar WA). | Al publicar: WA opcional → botón sticky “Escribir por WhatsApp” en ficha (anon OK). Q&A sigue para dudas que queden en ficha. |
| G2 | **Contacto sin cuenta** (tocar WA y listo) | Pregunta exige Clerk | **blocker** (fricción vs hábito) | **Emular** el atajo WA. **No** quitar login del Q&A (spam). | WA sin login; Q&A con login = diferenciación consciente. |
| G3 | **Filtro urbanización / zona** (Altamira, LPG, Chacao, La Tahona…) | Solo ciudad + tipo + presupuesto; `neighborhood` es texto en ficha | **major** | **Emular** | Input “sector” o chips Caracas top en hero + query Convex. |
| G4 | **Galería 8–20 fotos**; 1 foto = desconfianza | Mín. 1; ficha renderiza **solo `images[0]`** | **major** | **Emular** galería. Soft-nudge ≥4–6 (no bloquear MVP). Preferencial = upgrade fotos. | Carrusel/grid de todas las URLs; hint “mín. 4–6” + CTA Preferencial post-publish. |
| G5 | **WA / teléfono al publicar** (ficha contactable al instante) | Wizard no pide contacto del listing; `users.contactPhone` existe pero no alimenta ficha | **major** | **Emular** opt-in al paso 2 | Campo WA en wizard → persiste en listing o user → G1. |
| G6 | **Share fácil** (WA status, código, “te mando el link”) | URL larga `/inmuebles/[slug]`; sin botón compartir / copiar | **major** | **Emular** | Botón Compartir (`navigator.share` + copiar link). Código corto = v1.1 si duele. |
| G7 | Bandas de precio **desde ~50–80k** (FSBO Caracas) | Primera banda “Hasta USD 150.000” | **major** | **Emular** | Añadir ≤80k / ≤120k (o desde–hasta). |
| G8 | A veces **USD + ref. BCV** al lado | USD claro (bien); cero BCV | **minor** | **Diferenciar** USD-first (ventaja Musas). BCV opcional después. | No priorizar. Si confunde en beta, nota “precios en USD” más visible — no calculadora BCV en MVP. |

### Veredicto contacto: Q&A in-app vs WhatsApp

| Canal | Rol en Musas | No hacer |
|-------|--------------|----------|
| **WhatsApp** | Happy path de “quiero hablar ya / visitar” — lo que el caraqueño ya hace | Obligar a abandonar Q&A para todo |
| **Q&A in-app** | Diferenciador: preguntas públicas, historial, menos spam anónimo, inbox vendedor | Pretender que reemplaza WA en beta Caracas |

**Pitch beta honesto:** “Explora y deja pregunta en la ficha; el contacto serio sigue por WhatsApp cuando el vendedor lo active.” Sin CTA WA, Musas se siente *más lenta* que mandar un status.

### Lo que Musas ya hace bien (no gap)

- Precio **USD** explícito + admin en ficha.
- Wizard **paso a paso** 1→3 (mejor que form monolito; falta WA + checklist fotos).
- Preferencial (fotos/legal) — rivales no empaquetan así; ops humano pendiente.

---

## Script beta amigos — 40 min (30 Musas + 10 rival)

**Prep Joaquín:** seed en el entorno que usen (prod post-redeploy **o** local `127.0.0.1:4321`) · 2ª cuenta Clerk · 1 amigo comprador + 1 vendedor Caracas · rival elegido: **ML Inmuebles** *o* **Housy** *o* **Propiedash** (uno solo).

### Parte A — Musas · 30 min

| Min | Rol | Acción | Pass si… | Anotar gap si falla |
|-----|-----|--------|----------|---------------------|
| 0–5 | visitante | Abrir home; ¿hay fichas Caracas? | Grid con ≥3 listings legibles | G vacío / F1 |
| 5–10 | comprador | Buscar “como en la vida”: **sector** mental (Altamira/LPG) + presupuesto ~80–120k | Encuentra algo útil o verbaliza “no puedo filtrar sector / bandas” | G3, G7 |
| 10–15 | comprador | Abrir ficha: contar fotos visibles; buscar **cómo contactar dueño** | Entiende precio USD; sabe qué hacer para hablar | G1, G2, G4 |
| 15–18 | comprador | Heart + (si 2ª cuenta) **1 pregunta Q&A** | Favorito OK; pregunta aparece o CTA login claro | F7 / Q&A |
| 18–25 | vendedor | `/publicar` apto real o casi-real (≥4 fotos celular, sector real, precio USD) | Sale en explore; anota si “faltó WA” / “1 foto bastó” | G5, G4, F5 |
| 25–28 | vendedor | Preferencial 1 paquete + WA real | `Solicitada` + entiende “te escriben fuera” | F8 |
| 28–30 | ambos | Intento **compartir** ficha a un chat WA (copiar URL a mano) | Link abre; fricción “no hay botón” = dato | G6 |

### Parte B — 1 rival · 10 min (mismo amigo, misma intención)

| Min | Acción | Comparar en voz alta |
|-----|--------|----------------------|
| 0–4 | Misma búsqueda (ciudad + zona + presupuesto) | ¿Cuántos taps hasta resultados de *su* urbanización? |
| 4–7 | Abrir 1 ficha | ¿Hay WA? ¿Cuántas fotos? ¿USD claro? |
| 7–10 | “¿Publicarías aquí o en Musas?” + 1 frase | Forzar tradeoff: contacto rápido vs ficha limpia Musas |

### Tarjeta feedback (1 por persona)

1. En Musas, ¿pudiste **contactar** como esperabas? (sí / parcial / no)
2. ¿Qué te faltó vs ML/Housy/Propiedash/WA? (1 frase)
3. Si Musas tuviera **solo una** mejora mañana: ¿WA en ficha, filtro sector, o más fotos?
4. ¿Publicarías un inmueble real en Musas esta semana? (sí / no + por qué)
5. NPS 0–10

### Criterio éxito de esta corrida

- ≥2 amigos completan Parte A+B
- ≥1 quote literal sobre G1 (WA) o G3 (zona)
- Lista G1–G8 marcada vista/no-vista (no inventar PASS)
- Q&A solo PASS si hubo 2 cuentas; si no → N/A

---

## Qué probar mañana en beta con amigos

| Orden | Prueba | Cuenta | Pass si… | Fail / anotar |
|-------|--------|--------|----------|---------------|
| A | Abrir **prod** (si hubo redeploy) o local seed | visitante | Grid Caracas real / demo | Empty sin explicación → F1 |
| B | Filtrar Caracas + presupuesto bajo + abrir ficha | comprador | Resultados útiles / ficha legible | “Nada bajo 150k” → F4; sin sector → F3 |
| C | Favorito anon → login → Mis favoritos | comprador | Heart persiste | Se pierden → merge |
| D | Amigo **publica apto real** (fotos celular, sector real) | vendedor | Sale en explore | Rechazo tarde / 1 foto fea → F5/F6 |
| E | Solicitar Preferencial con **WA real** | vendedor | `Solicitada` + ops ve fila | Confusión ETA → F8 |
| F | **Q&A** pregunta+respuesta | 2 cuentas | Hilo en ficha + inbox | **N/A hoy** hasta 2ª cuenta → F7 |
| G | Feedback form (abajo) post-sesión | ambos | ≥1 frase fricción | — |
| H | **Script 40 min** (30 Musas + 10 rival) | ambos | Tarjetas G1–G8 + quote WA/zona | Ver sección “Script beta amigos” |

**Prep Joaquín antes:** 2ª cuenta Clerk distinta · redeploy prod si posible · 1–2 amigos Caracas (1 vende, 1 busca).

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
- Lista F1–F8 re-validada con amigos (pass/fail + quote)

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
| ut-auth-middleware | **fixed** (local) | 2 | Live1: UT 500; Live2: hang; Live3: passthrough + `authenticateRequest` → foto→slug PASS | Mantener sin clerkMiddleware; re-test en prod post-deploy |
| admin-role-session | **fixed** (local) | 4 | Live3b: 2 users Convex; `ADMIN_EMAILS` dual → `/admin` seed+pause PASS | Mantener ambos emails en env; re-test prod |
| preferential-notes-10 | **minor** | 3 | Notas mín. 10 chars | Placeholder/hint si confunde |

### Micro-fixes ya en código (dry-runs previos)

- `src/hooks/use-auth-favorites.ts` — merge anon→auth
- `src/components/home/listings-grid.tsx` — sin “de ejemplo”
- Preferencial labels ES + Q&A hint/disabled + mensajes empty state

### Qué probar primero cuando desbloquee

1. Redeploy prod **o** smoke local con seed  
2. Script **4** seed → **1** explorar → **6** favoritos  
3. **2** publicar → **5** Q&A (2 cuentas) → **3** Preferencial → **4** status/pausar

---

## Diferencial vs Propiedash — brainstorm QA (2026-11-12)

> **No es PASS live.** Schema hoy: `draft | published | paused`. Preferencial: `requested→…→done`. **No** hay `pending` / `rejected` / `validated`. Decir “validados + especialistas” sin ops D8 = marketing; QA solo marca PASS si el sello/estado es **auditable en UI + DB**.

### 1) Scripts pass/fail (diferencial REAL)

| ID | Acción | PASS si… | FAIL si… | Severity |
|----|--------|----------|----------|----------|
| D-01 | Publicar basura (1 foto blur, desc mínima, precio absurdo) | Queda **sin** sello Validado / no en filtro “solo validados” | Aparece como Validado o indistinguible de Preferencial | **blocker** trust |
| D-02 | Admin marca Validado (cuando exista estado) | Badge + filtro explore + ficha muestran mismo sello; timestamp/ops id | Solo copy marketing en landing; grid sin filtro | **blocker** |
| D-03 | Quitar Validado / pause | Desaparece de “validados”; ficha sin sello | Sello stale en cache/seed | **major** |
| D-04 | Preferencial `fotos` → `requested` → ops avanza a `assigned`/`in_progress` | Dashboard vendedor refleja estado; admin ve fila | Queda eterno `Solicitada` sin ETA (F8) | **major** ops |
| D-05 | Preferencial `done` | Evidencia (nota ops / fecha); listing puede ganar badge distinto a “Validado” genérico | Badge “verificado” sin paquete cumplido | **blocker** |
| D-06 | Comprador: filtro “Validados” vs “Todos” | Conteos coherentes; 0 validados = empty honesto | Mezcla demo/`isDemo` con validados reales | **major** |
| D-07 | Especialista ≠ directorio | Solo 3 paquetes Musas; sin perfiles broker aleatorios | UI tipo “encuentra tu agente” (Propiedash-like) | **major** posicionamiento |
| D-08 | Seed/`isDemo` | Demo **no** lleva sello Validado (o badge “Demo”) | Demo vende confianza falsa | **blocker** |

### 2) Casos frontera (cuando exista moderación)

| Caso | Expected | Actual hoy (baseline) | Fail |
|------|----------|----------------------|------|
| Pendiente revisión | No en `listPublished`; owner ve “en revisión” | Publish → **published** inmediato | Público sin gate = no diferencial |
| Rechazado | Motivo ES; CTA corregir; no en explore | N/A (no status) | Silencio / 404 sin copy |
| Validado falso positivo | Audit trail (quién/cuándo/checklist); revocable en &lt;5 min | Solo `pause` admin | Sello irrevocable o sin dueño |
| Preferencial cancelado | Sin sello especialista; listing puede seguir published | `cancelled` en schema | Badge huérfano |
| Doble sello | Reglas claras: Validado ≠ Preferencial done | `badge` string libre | Copy “verificado” genérico |

### 3) Smoke 15 min vs Propiedash (side-by-side)

Cronómetro; 1 listing Caracas; anotar PASS/FAIL por fila (no vibes).

| Min | Check Musas | Check Propiedash | Criterio “nosotros ganamos” |
|-----|-------------|------------------|-----------------------------|
| 0–2 | Home: ¿sello/filtro validado visible? | Home: ¿directorio/chat/wizard? | Trust signal **antes** de scroll infinito |
| 2–5 | Abrir 1 ficha: fotos, USD, WA/Q&A | Misma ciudad/tipo | Contacto real + claridad USD |
| 5–8 | Publicar draft→publish (o intento) | Wizard rival | Checklist + foto mínima sin paywall |
| 8–11 | Preferencial 1 paquete → `Solicitada` | “Te acompañamos” / chat | Paquete **nombrado** + estado en dashboard |
| 11–13 | Admin: pause o quitar trust | Moderación rival (si hay) | Revocación &lt;2 clics |
| 13–15 | ¿Demo vs real distinguible? | Inventario ruido | 0 sellos falsos en seed |

**Regla:** si en 15 min un amigo no distingue Musas de “otro directorio con neon”, diferencial = **FAIL** (aunque publish PASS).

### 4) Riesgos “verificado” sin ops

- **Legal VE:** “verificado/validado” implica due diligence; sin T&C + disclaimer = riesgo reclamación / publicidad engañosa.
- **Confianza:** 1 FP (sello en listing estafa) quema la marca más que 10 listings sin sello.
- **Ops D8:** Preferencial &lt;24h sin dueño nombrado → badge = mentira operativa (F8).
- **Copy seguro mientras tanto:** “Revisado por Musas” / “Preferencial: fotos hechas por…” con fecha; **evitar** “garantizado / certificado / título OK”.
- **QA gate:** copy “verificado” en UI = **FAIL automático** hasta exista estado auditable + dueño ops + revocación.

**Pedir refresh Oficina.**
