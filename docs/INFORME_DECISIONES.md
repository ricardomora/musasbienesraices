# Informe de decisiones — Musas MVP

Plantilla del PM. Cada entrada: problema → opciones → recomendación → impacto/riesgo → **decisión**.

---

## INFORME-0 — Kickoff (borrador; completar con agente musas-pm)

*Fecha:* 2026-11-11  
*Autor:* musas-pm (pendiente ejecución formal)

### Contexto

Marketplace mínimo real VE/USD, Clerk + Convex + UploadThing, sin pagos. Preferencial = solicitud.

### Decisiones abiertas

#### D1 — Notificación de nuevas preguntas (Q&A)

- **Problema:** El vendedor debe enterarse de preguntas sin depender solo de volver a la app.
- **Opciones:** (A) Solo inbox in-app · (B) Email (Resend) · (C) A + email
- **Recomendación:** **A** en MVP; email en v1.1 cuando haya Resend.
- **Impacto/riesgo:** Menos engagement; zero costo ops.
- **Decisión:** **Aprobada por defecto (recomendación)** — implementado inbox in-app

#### D2 — Moderación de publicaciones

- **Problema:** ¿Publicar va directo a `published` o pasa por review?
- **Opciones:** (A) Post-publish (publicado inmediato + admin puede pausar) · (B) Pre-publish `under_review`
- **Recomendación:** **A** para velocidad de feedback beta; admin pause.
- **Impacto/riesgo:** Contenido inadecuado breve; mitigar con checklist + pause.
- **Decisión:** **Aprobada por defecto** — `publishListing` + admin pause

#### D3 — Precio en Atención Preferencial

- **Problema:** Mostrar montos sin cobro online puede generar expectativas.
- **Opciones:** (A) “A cotizar” · (B) Precio referencial USD visible · (C) Ambos (desde X USD)
- **Recomendación:** **C** con copy “coordinación y pago fuera de la app”.
- **Impacto/riesgo:** Claridad comercial vs fricción.
- **Decisión:** **Aprobada por defecto** — UI Preferencial

#### D4 — Ciudad piloto

- **Problema:** Semilla y marketing.
- **Opciones:** (A) Solo Caracas · (B) 7 ciudades actuales del seed
- **Recomendación:** **B** (ya hay datos); priorizar Caracas en copy.
- **Decisión:** **Aprobada por defecto** — seed multi-ciudad

#### D5 — Favoritos anónimos → login

- **Problema:** Hoy hay localStorage; con auth conviene migrar.
- **Opciones:** (A) Descartar anon al login · (B) Merge local → Convex on login
- **Recomendación:** **B** una sola vez al `ensureCurrentUser`/hook favorites.
- **Decisión:** **Aprobada por defecto** — `useAuthFavorites` + `mergeLocal` (IDs Convex)

#### D6 — Paquetes Preferencial (contenido default propuesto)

| Key | Nombre | Incluye | Referencia |
|-----|--------|---------|------------|
| `fotos` | Sesión fotográfica | Sesión en sitio, selección editada, carga a ficha | desde USD 120 · a cotizar |
| `legal` | Asesoría legal | Revisión documental básica + checklist cierre | desde USD 200 · a cotizar |
| `acompanamiento` | Acompañamiento | Coordinación visitas + soporte negociación | desde USD 150 · a cotizar |

- **Decisión de copy/precios:** **Aprobada por defecto** — ajustable por Joaquín en `src/lib/preferential-packages.ts`

### Arquitectura (confirmada)

Clerk + Convex + UploadThing · patrón Biosite · Next.js App Router Musas. Sin pagos/BNC en MVP.

### Siguiente gate

Cerrar D1–D6 (pueden aprobarse por defecto de recomendación si Joaquín no objeta en 48h de beta interna) → Fase 1 keys en `INSUMOS.md`.

---

## INFORME-1 — Gate Fase 6 Beta

*Fecha:* 2026-11-11  
*Autor:* musas-pm  
*Gate:* Comercial — arranque beta feedback (Fase 6)  
*Estado del gate:* **ABIERTO** — código listo; bloqueo operativo en keys Musas

### Contexto

Fases 0–5 están **completed en código** (cimientos → comprar → vender → Q&A → Preferencial). Fase 6 (deploy + reclutas + scripts User + iteración) está **pending**.  
Mercado fijado: Venezuela / Musas / USD. Sin pagos in-app. Preferencial = solicitud + ops.  
**Hecho verificado:** no existe `.env.local` en el repo — no se asume que keys estén listas.

### Estado D1–D6 (defaults vigentes; confirmación pendiente)

| ID | Tema | Default vigente | Implementado en código | Confirmación Joaquín |
|----|------|-----------------|------------------------|----------------------|
| D1 | Notif Q&A | A — solo inbox in-app | Sí | **Pendiente** (explícita o silencio 48h) |
| D2 | Moderación | A — post-publish + pause admin | Sí | **Pendiente** |
| D3 | Precio Preferencial | C — desde X USD + a cotizar | Sí | **Pendiente** |
| D4 | Ciudad piloto | B — 7 ciudades; Caracas en copy | Sí (seed) | **Pendiente** |
| D5 | Favoritos anon→login | B — merge local → Convex | Sí | **Pendiente** |
| D6 | Paquetes Preferencial | 3 paquetes + refs USD | Sí (`preferential-packages.ts`) | **Pendiente** |

**Regla de cierre:** no hay aprobación silenciosa nueva. Joaquín confirma D1–D6 **explícitamente** o deja pasar **48h sin objeción** desde la fecha de este informe (deadline orientativa: **2026-11-13 19:20 UTC**). Cualquier objeción reabre la fila correspondiente.

### Checklist insumos críticos (gate beta)

| Prioridad | Ítem | Bloquea beta real? | Estado |
|-----------|------|--------------------|--------|
| P0 | Clerk + Convex + UploadThing **nuevos** Musas → `.env.local` | **Sí** | pendiente — **sin `.env.local`** |
| P0 | Convex env: `CLERK_JWT_ISSUER_DOMAIN` + `ADMIN_EMAILS` | **Sí** | pendiente |
| P0 | Clerk JWT template `convex` + webhook `/api/clerk` | **Sí** | pendiente |
| P1 | Email admin Clerk (`ADMIN_EMAILS`) | **Sí** para ops/admin | pendiente |
| P1 | 5–10 usuarios beta (≥3 publicadores) | **Sí** para criterio éxito | pendiente |
| P2 | Canal soporte beta (WA/IG/email) | No (paralelo; mejora ops) | pendiente |
| P2 | Email ops Preferencial / Resend | No (MVP = dashboard admin) | pendiente |
| P2 | Disclaimer legal VE | No bloquea smoke; sí antes de listings reales amplios | pendiente |
| P2 | Términos + privacidad v0 | No bloquea beta cerrada; sí registro público | pendiente |
| P3 | Logo/favicon final | No | opcional |
| — | Paquetes Preferencial / ciudad piloto | Defaults D4/D6 | en código; confirmar |

Detalle vivo: `docs/INSUMOS.md`. Setup: `docs/SETUP_MUSAS.md`.

### Métricas de éxito beta (del plan)

| Métrica | Umbral | Cómo medir |
|---------|--------|------------|
| Listing externo | ≥1 publicado por usuario externo | Admin / explore post-seed |
| Q&A completo | ≥1 hilo pregunta + respuesta | `/dashboard/mensajes` + ficha |
| Preferencial | ≥1 solicitud `requested`+ | `/admin` + dashboard |
| Feedback cualitativo | Documentado (scripts User + form) | `docs/BETA_SCRIPTS.md` + form |
| Seguridad | Cero secretos en repo; ownership en mutations | Review tech + git hygiene |

Scripts pass/fail: `docs/BETA_SCRIPTS.md` (7 flujos). Ejecución **bloqueada** hasta auth real.

### Riesgos residuales

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Sin keys → beta no arranca | **Crítico** | Joaquín sigue `SETUP_MUSAS.md` (apps nuevas, no Biosite) |
| Defaults D1–D6 sin confirmación | Mayor | Confirmación explícita o silencio 48h; no reabrir scope |
| Contenido inadecuado (post-publish) | Medio | Checklist calidad + pause admin (D2) |
| Expectativas de cobro Preferencial | Medio | Copy “pago fuera de la app” (D3) |
| Engagement Q&A sin email | Medio | Inbox in-app; Resend en v1.1 |
| Beta sin reclutas / sin publicadores | Mayor | Lista P1 de contactos esta semana |
| Términos ausentes en registro amplio | Medio | Mantener beta **cerrada** hasta T&C v0 |

### Recomendación PM

1. **Esta semana, P0:** crear keys Musas y `.env.local` (único desbloqueo técnico).  
2. **En paralelo:** confirmar D1–D6 (o silencio 48h) + reclutar ≥5 beta / ≥3 publicadores.  
3. **Luego:** seed admin → correr `BETA_SCRIPTS` → deploy Vercel cuando smoke pase.  
4. No abrir registro público sin disclaimer + T&C v0.

### Decisión del gate

| Pregunta | Decisión |
|----------|----------|
| ¿Código listo para beta con keys? | **Sí** (Fases 0–5) — condicionado a setup |
| ¿Gate comercial Fase 6 cerrado? | **No** — abierto hasta keys + confirmación D1–D6 + reclutas mínimos |
| ¿Aprobaciones nuevas asumidas? | **Ninguna** |

**Decisión Joaquín (pendiente):**

- [ ] Confirmo D1–D6 tal cual  
- [ ] Ajusto (indicar IDs)  
- [ ] Silencio 48h = acepto defaults  
- [ ] Entrego keys / avanzo `SETUP_MUSAS.md` esta semana  
- [ ] Entrego lista beta (≥5 / ≥3 publicadores)

### Asks explícitos para Joaquín

1. **P0 — Keys Musas:** crear Clerk + Convex + UploadThing nuevos; completar `.env.local` según `docs/SETUP_MUSAS.md` (nunca Biosite). Avisar al PM cuando esté.  
2. **P0 — Confirmación D1–D6:** responder “OK defaults” / ajustes / o silencio hasta **2026-11-13 19:20 UTC**.  
3. **P1 — `ADMIN_EMAILS`:** email Clerk que será admin.  
4. **P1 — Reclutas beta:** 5–10 contactos, ≥3 dispuestos a publicar.  
5. **P2 (paralelo):** canal soporte + disclaimer VE + T&C v0 antes de abrir más allá de beta cerrada.

### Impacto / riesgo de no decidir

Sin keys: código permanece demo local; Fase 6 no arranca; métricas beta = 0. Sin confirmación D1–D6: riesgo de retrabajo de copy/moderación a mitad de beta.

---

## INFORME-2 — Respuesta a Owner + gate producción

*Fecha:* 2026-11-11  
*Autor:* musas-pm  
*Antecedente:* **INFORME-OWNER aún no escrito** en el repo. Este informe anticipa el cuestionamiento del dueño/experto RE al happy path y fija el gate a producción.  
*Estado del gate:* **ABIERTO** — no se asumen aprobaciones nuevas

### Respuesta al Owner (happy path real, no demo)

| Paso happy path | ¿Viable hoy? | Evidencia / hueco |
|-----------------|--------------|-------------------|
| Visitante ve inmuebles (venta USD) | **Código sí / prod no** | Explore + seed multi-ciudad en código; **www.musasbienesraices.com = build viejo** |
| Publicar listing (fotos + checklist) | **Código sí / prod no** | Wizard + UploadThing local; falta env Vercel + deploy MVP |
| Q&A comprador ↔ vendedor | **Código sí** | Inbox in-app (D1); sin email en MVP |
| Preferencial (planes + solicitud) | **Código sí** | Intake + admin status; cobro fuera de app (D3) |
| Admin útil (seed, pause, Preferencial) | **Casi** | `/admin` cableado; `ADMIN_EMAILS` set local — **verificar typo email** |
| Auth / sync / webhook prod | **Bloqueado en prod** | Local casi listo; webhook prod 404 hasta redeploy + env Vercel |
| Alquiler vs venta | **Fuera de modelo** | Schema solo `priceUsd` + tipo apto/casa; UI “Comprar”; **sin `operationType`** |

**Veredicto PM:** el happy path de **venta USD** está implementado en código (Fases 0–5). No es “teatro” de producto — es **teatro de producción** mientras el dominio sirva el build antiguo. El Owner tiene razón en exigir deploy + seed + beta medible antes de declarar “en producción”.

### Gate producción (deploy → seed → beta)

Orden obligatorio (sin saltos):

| # | Gate | Owner | Criterio PASS | Estado |
|---|------|-------|---------------|--------|
| G1 | Env Vercel = `.env.local` (Clerk, Convex, UT, webhook, USER_SYNC) | Joaquín / tech | Secrets en project Vercel; redeploy | **Pendiente** |
| G2 | Deploy código MVP a `www.musasbienesraices.com` | Joaquín / tech | `/api/clerk` ≠ 404; home Musas actual | **Pendiente** (bloquea prod) |
| G3 | Clerk webhook prod → `/api/clerk` | Joaquín | Sync user.created/updated en Convex | **Pendiente** (tras G2) |
| G4 | Confirmar `ADMIN_EMAILS` sin typo | Joaquín | Admin entra a `/admin` | **Riesgo tipográfico** — hoy `ricardo1omora@gmail.com` vs posible `ricardo10mora` |
| G5 | Seed admin + smoke `BETA_SCRIPTS` | Admin + User | ≥ listings publicados visibles; scripts 1–7 | **Pendiente** |
| G6 | Beta cerrada (5–10 / ≥3 publicadores) | Joaquín + User | Métricas INFORME-1 | **Pendiente** |
| G7 | D1–D6 confirmación | Joaquín | OK explícito o silencio 48h (deadline **2026-11-13 19:20 UTC**) | **Pendiente** — **sin OK explícito** |
| G8 | D7 scope venta/alquiler | Joaquín | Decisión explícita (abajo) | **Pendiente** |

**Regla:** no abrir registro público sin T&C + disclaimer VE. Beta = cerrada.

### D7 — ¿MVP solo venta o venta + alquiler?

- **Problema:** En VE el tráfico busca comprar **y** alquilar. El producto hoy es **solo venta USD implícita** (sin campo operación). Meter alquiler implica schema, filtros, copy, precios (mensual vs total), seed y scripts — retrabajo de alcance.
- **Opciones:**

| Opción | Descripción | Esfuerzo | Riesgo |
|--------|-------------|----------|--------|
| **A — Solo venta (recomendado MVP)** | Mantener modelo actual; copy/hero dejan claro “compra en USD”; alquiler = backlog v1.1 | Cero código nuevo | Owner/mercado pide alquiler pronto |
| **B — Venta + alquiler en beta** | `operationType: sale \| rent`, filtros, publish, explore, seed dual | 1–2 sprints tech + design + User | Retrasa gate producción; diluye feedback venta |
| **C — UI alquiler “coming soon”** | Tab/filtro visible sin backend | Bajo | Expectativa falsa; peor trust |

- **Recomendación PM:** **A — MVP solo venta USD.** Justificación: el happy path a producción ya está atrasado por deploy; ampliar a alquiler **antes** de G1–G6 viola protección de scope y mete dos productos en una beta. Alquiler entra post-métricas beta venta (fase post-6).
- **Impacto/riesgo:** Si Joaquín exige B, PM reabre roadmap y **congela** G6 métricas hasta schema + scripts; fecha beta se mueve.
- **Decisión:** **Pendiente — Joaquín debe elegir A / B / C.** Ninguna aprobación silenciosa.

### Defaults D1–D6 (recordatorio; sin OK nuevo)

Siguen **vigentes por defecto de INFORME-1**, **sin confirmación explícita**. No se reafirman como “aprobadas” aquí. Deadline silencio 48h: **2026-11-13 19:20 UTC**.

### Recomendación PM (esta semana)

1. **No expandir a alquiler** hasta D7 = A (o decisión B consciente).  
2. **P0 producción:** G1 → G2 → G3 → G4 (typo admin) → G5 seed/smoke.  
3. **Paralelo:** OK D1–D6 + lista beta + D7.  
4. Owner puede escribir **INFORME-OWNER** contra este happy path; PM actualizará INFORME-2b si hay objeciones nuevas.

### Decisión del gate (sin asumir)

| Pregunta | Estado |
|----------|--------|
| ¿Código Fases 0–5 listo para beta con keys? | **Sí** (condicionado a prod wiring) |
| ¿Prod dominio = MVP actual? | **No** |
| ¿Gate producción cerrado? | **No** |
| ¿D7 cerrada? | **No** |
| ¿Aprobaciones nuevas asumidas? | **Ninguna** |

### Asks explícitos para Joaquín

1. **D7:** ¿MVP **A solo venta**, **B venta+alquiler**, o **C coming soon**? (recomendación PM: **A**)  
2. **G1–G2:** ¿Autorizas / ejecutas deploy MVP a Vercel + env prod esta semana?  
3. **G4:** Confirma email admin exacto — ¿`ricardo1omora@gmail.com` o `ricardo10mora@gmail.com`?  
4. **D1–D6:** “OK defaults” / ajustes por ID / o silencio hasta deadline.  
5. **G6:** Lista beta ≥5 / ≥3 publicadores + canal soporte.  
6. (Opcional) Pedir a Owner que publique **INFORME-OWNER** formal tras este INFORME-2.

---

## INFORME-OWNER-1 — Happy path producción (dueño + mercado VE/USD)

*Fecha:* 2026-11-11  
*Autor:* musas-owner  
*Audiencia:* musas-pm (preguntas duras) + coordinador  
*Lente:* ¿Sobrevive una sesión real vendedor/comprador en Caracas hoy, o es teatro de demo?

### Veredicto

**Código MVP de venta en USD: cableado y serio.**  
**Producción pública (`www.musasbienesraices.com`): NO lista** — build viejo, webhook Clerk 404.  
**D1–D6: defaults sin OK explícito de Joaquín** — no rubber-stamp.  
**Alquiler: fuera de schema** — si el PM lo promete, está mintiendo al mercado.

Nota: `INFORME-1` quedó **desactualizado** (decía “sin `.env.local`”). Fuente viva: `docs/INSUMOS.md` (2026-11-11 tarde) — keys locales + JWT + `ADMIN_EMAILS` listos; bloqueo = **deploy Vercel con env + webhook prod**.

### Score happy path (pass/fail + evidencia)

| # | Criterio | Local / código | Prod pública | Evidencia |
|---|----------|----------------|--------------|-----------|
| 1 | Visitante ve inmuebles **venta** USD | **PASS** | **FAIL** | Explore `/` (`src/app/page.tsx`) + ficha `/inmuebles/[slug]`; `listings.listPublished` / `getBySlug`; filtros ciudad/tipo/presupuesto. Schema solo `priceUsd` (`convex/schema.ts` L41–67). Copy meta = compra/venta (`src/app/layout.tsx`). |
| 1b | Visitante ve **alquiler** | **FAIL (fuera de scope)** | N/A | Schema: `type` = `apartamentos\|casas` únicamente; **sin** campo venta/alquiler. Wizard igual (`publish-wizard.tsx`). |
| 2 | Usuario publica listing real (fotos + checklist) | **PASS** | **FAIL** (auth/sync prod rota) | `/publicar` + `AuthGate`; wizard 3 pasos; UploadThing; `listingIsComplete` exige foto + desc ≥40 + precio (`convex/lib.ts`); `publishListing` bloquea incompleto (`convex/listings.ts` L191–208). |
| 3 | Preferencial: planes + solicitud (sin pagos) | **PASS** | **FAIL** (build viejo) | `/preferencial` + `PREFERENTIAL_PACKAGES` (`src/lib/preferential-packages.ts`); `preferential.create` → `requested`; dashboard + admin status. Sin cobro in-app (correcto MVP). |
| 4 | Admin útil (listings, Preferencial, seed) — no vanity | **PASS** | **FAIL** | `/admin`: Preferencial status, listar/pausar, seed demo (`src/app/admin/page.tsx`). Sin analytics fancy. |
| 5 | Auth / sync / deploy prod ready | **PASS parcial** (local) | **FAIL** | Local: Clerk+Convex+UT+webhook secret+`ADMIN_EMAILS` (`INSUMOS.md`). Código `/api/clerk` existe (`src/app/api/clerk/route.ts`). **Prod:** `/api/clerk` = **404** → build VIEJO; Vercel env incompleto. |
| 6 | Confianza mercado (T&C, disclaimer VE, reclutas) | **FAIL** | **FAIL** | Sin T&C/privacidad v0; sin disclaimer VE; sin ≥5 beta / ≥3 publicadores. Q&A solo inbox (D1 default) — frágil para vendedor real. |

**Resumen score:** 4/6 PASS en código local (venta+publicar+Preferencial+admin). **0/6 PASS en producción real.** Alquiler y confianza = huecos conscientes.

### Preguntas duras al PM (no rubber-stamp)

1. **Venta vs alquiler.** El producto es **solo venta USD**. ¿Vas a decirle eso en marketing y a los reclutas, o vamos a recibir “¿dónde está el alquiler?” el día 1? Si alquiler entra, es **scope nuevo** (schema + filtros + copy + precios mensuales) — no un toggle cosmético. Decisión: **venta only esta semana** o retrasamos deploy.

2. **¿Qué es “producción” para ti?** Dominio vivo con build viejo **no es prod**. ¿Cerramos gate cuando (a) smoke local E2E pasa, (b) Vercel redeploy + webhook 200, o (c) primer listing externo real? Necesito definición única.

3. **Confianza.** Sin T&C + disclaimer VE, ¿abro registro o mantengo beta cerrada por invite? En VE, precio USD sin contexto de “no somos intermediarios de pago / coordinación Preferencial fuera” genera quejas. ¿Quién redacta disclaimer antes de tráfico real?

4. **Ops Preferencial.** Solicitud llega a `/admin`. ¿Quién responde en &lt;24h? ¿WhatsApp de ops? Sin dueño humano, Preferencial es teatro: el usuario pagará “desde USD 120” **fuera** y esperará llamada. Nombre + canal **hoy**.

5. **D1 Q&A sin email.** Un vendedor FSBO en Caracas no vive en `/dashboard/mensajes`. ¿Aceptas churn de preguntas sin respuesta, o D1 vuelve a “email ASAP” antes de beta pública?

6. **D2 post-publish.** Estamos OK con basura 10 minutos en explore hasta que admin pause? En VE hay scrapers y estafas. ¿Seed demo marcado `isDemo` se ve distinto en UI para no quemar confianza?

7. **Precios Preferencial (D3/D6).** “Desde USD 120 / 150 / 200 + a cotizar” — ¿Joaquín/ops puede cumplir ese floor? Si no, bájalo o quita número; peor es cotizar más caro que el referencial.

8. **Ciudad (D4).** Seed 7 ciudades está bien para demo; marketing ¿Caracas-first o “Venezuela”? Diluir mensaje = cero density de inventario.

9. **Deploy.** ¿Quién aprieta el botón Vercel esta semana y pega env (incl. `CLERK_WEBHOOK_SECRET`)? Sin dueño = seguimos con 404 eterno.

10. **ADMIN_EMAILS typo.** `ricardo1omora@gmail.com` vs `ricardo10mora` — ¿verificado login admin real? Un typo = `/admin` muerto en el momento crítico.

### Asks con severidad

| Ask | Owner | Severity |
|-----|-------|----------|
| Redeploy MVP a Vercel + env = `.env.local` + webhook Clerk → `https://www.musasbienesraices.com/api/clerk` | tech + Joaquín | **blocker** |
| Confirmar D1–D6 **explícito** (no silencio ambiguo) | Joaquín vía PM | **blocker** comercial |
| Definir venta-only en copy/reclutas (o abrir ticket alquiler) | PM + design | **major** |
| Canal ops Preferencial (&lt;24h) + dueño humano | PM / Joaquín | **major** |
| Verificar `ADMIN_EMAILS` login real + seed | tech / user | **major** |
| Correr `BETA_SCRIPTS` 1–7 pass real (no dry-run) | user | **major** |
| T&C + disclaimer VE v0 antes de registro amplio | PM + legal light | **pre-apertura** |
| Reclutar ≥5 beta / ≥3 publicadores | Joaquín / PM | **criterio éxito** |
| Email notif Q&A (Resend) | tech | **backlog** v1.1 |
| Alquiler / toggle operación | — | **backlog** (no esta semana) |

### DoD mínimo producción — esta semana

1. Vercel deploy del código actual; dominio custom sirve `/api/clerk` **200** (no 404).  
2. Env prod = Clerk + Convex + UploadThing + `USER_SYNC_SECRET` + `CLERK_WEBHOOK_SECRET`.  
3. Admin real entra `/admin`, seed, pause listing.  
4. Scripts beta 1–7 **PASS** documentados (al menos 1 ciclo completo publicar → Q&A → Preferencial).  
5. Joaquín: **OK o ajuste** D1–D6 por escrito.  
6. Copy/reclutas: **solo venta USD**; Preferencial = solicitud + pago fuera.  
7. Nombre + canal ops Preferencial.

### Backlog (después de DoD)

- Email Q&A (D1→C) · T&C/privacidad · disclaimer amplio · analytics · pagos Preferencial · alquiler · app nativa · BNC/escrow (nunca MVP).

### Decisión pedida a Joaquín / PM

- [ ] Prod = redeploy + webhook esta semana (**sí/no + dueño**)  
- [ ] Mercado = **venta only** hasta nuevo INFORME  
- [ ] D1–D6: OK / ajustes (IDs)  
- [ ] Ops Preferencial: nombre + WA/email  
- [ ] Beta cerrada hasta T&C (**recomendación owner: sí**)

---

## DECISIÓN Joaquín — 2026-11-11 (tarde)

- **D7:** **A — MVP solo venta** esta semana (aprobada). Alquiler = backlog.
- **ADMIN_EMAILS:** `ricardo10mora@gmail.com` (confirmado; corregido typo `1o`).
- **Deploy:** push a `origin/main` → Vercel auto-deploy `www.musasbienesraices.com`.
- **D1–D6:** siguen con defaults hasta objeción o silencio 48h (deadline INFORME-1).

---

## INFORME-OWNER-2 — Post QA local PASS: brainstorm + plan avance

*Fecha:* 2026-11-12  
*Autor:* musas-owner  
*Antecedente:* QA live local corrida 3b **PASS** (Explore, Publish+foto `qa-musas-foto-1794431619-1`, Preferencial, Favoritos, Admin seed/pause, imágenes `*.ufs.sh`). Q&A **N/A** (1 cuenta). Prod **BLOCKER** (deploy viejo + env Vercel + `/api/clerk` 404).  
*Audiencia:* musas-pm (cuestionamiento) + Joaquín (gates) + tech/user

### Veredicto de dueño

**Local ya no es teatro.** Un vendedor FSBO puede publicar con foto real y un admin puede sembrar/pausar.  
**Producción sigue siendo mentira de marketplace:** el dominio no sirve este MVP. Sin G1–G3, todo lo demás es vanity de roadmap.

**Mensaje al PM:** deja de medir “features cableadas”. Mide **sesión real en www**. Hasta que un beta externo publique en prod y Preferencial llegue a un humano &lt;24h, no hay producto en el mercado VE/USD — hay lab.

### Score happy path (actualizado post-QA)

| # | Criterio | Local LIVE | Prod | Nota owner |
|---|----------|------------|------|------------|
| 1 | Visitante ve venta USD | **PASS** | **FAIL** | Seed demo OK local; prod build viejo |
| 2 | Publicar + foto + checklist | **PASS** | **FAIL** | Slug QA real; UT auth arreglado |
| 3 | Preferencial planes + solicitud | **PASS** | **FAIL** | Form OK; **ops humano aún vacío** |
| 4 | Admin útil (seed/pause/Preferencial) | **PASS** | **FAIL** | Dual `ADMIN_EMAILS` desbloqueó |
| 5 | Auth/sync/deploy | **PASS local** | **FAIL** | Proxy passthrough; webhook prod 404 |
| 6 | Q&A comprador↔vendedor | **N/A** | **FAIL** | Falta 2ª cuenta — no declarar PASS |
| 7 | Confianza (T&C, reclutas, ops) | **FAIL** | **FAIL** | Sin beta humana / sin disclaimer |

**Resumen:** 4/7 PASS local medible · **0/7 prod** · Q&A y confianza abiertos a conciencia.

### Preguntas duras al PM (no rubber-stamp)

1. **¿Por qué “plan de features” si el dominio miente?** Prioridad #1 no es UX polish: es **G1 env + G2 redeploy + G3 webhook**. Si el PM mete alquiler, analytics o pagos antes de eso, estoy vetando el sprint.
2. **Inventario.** Seed demo ≠ marketplace. ¿Quién trae **3 listings reales Caracas** (precio USD serio + ≥3 fotos que vendan)? Sin eso, explore en prod es vacío o basura demo y quemamos trust día 1.
3. **Preferencial sin dueño.** Solicitud en `/admin` sin WA/nombre &lt;24h = **teatro comercial**. ¿Quién cotiza “desde USD 120” y llama? Si no hay nombre, **baja Preferencial a soft-CTA** hasta ops.
4. **Q&A N/A.** No vendas “mensajes” en pitch beta hasta script 5 PASS con 2 cuentas. Inbox sin email (D1=A) ya es frágil; sin prueba E2E es peor.
5. **Caracas-first o 7 ciudades?** Seed multi-ciudad diluye. Marketing beta: **Caracas + quizás una secundaria**. Density &gt; mapa vacío.
6. **¿Beta cerrada o vanity pública?** Sin T&C/disclaimer VE, registro abierto = riesgo reputacional. Owner exige invite-only hasta copy legal mínimo.
7. **Métrica de éxito esta semana.** No es “ship feature X”. Es: **prod smoke = scripts 1–4 + 6 PASS** + ≥1 listing externo o 3 publicadores comprometidos. ¿Aceptas esa métrica o inventas otra?

### 7 apuestas de mejora (impacto mercado, ordenadas)

| Rank | Apuesta | Por qué vende en VE/USD | Pri | Owner |
|------|---------|-------------------------|-----|-------|
| 1 | **Prod viva** (env Vercel + redeploy + webhook Clerk 200) | Sin esto no hay sesión real | **P0** | tech + Joaquín |
| 2 | **Inventario real Caracas** (≥3 pubs externos o reclutas con foto seria) | Comprador juzga stock en 10s; seed solo no convence | **P0** | Joaquín / PM |
| 3 | **Ops Preferencial &lt;24h** (nombre + WA/email + `NEXT_PUBLIC_OPS_EMAIL`) | “Desde USD 120” sin llamada = estafa percibida | **P0** | Joaquín |
| 4 | **Q&A E2E + alerta mínima** (2ª cuenta; email Resend o WA al vendedor) | FSBO no vive en dashboard; pregunta muerta = churn | **P1** | user + tech |
| 5 | **Confianza v0** (disclaimer VE + T&C/privacidad cortos + badge demo vs real) | USD + post-publish = terreno de estafas; trust es el producto | **P1** | PM + design |
| 6 | **Calidad de ficha que venda** (mín. 3 fotos, guía copy precio USD, checklist más dura) | En VE la foto manda; 1 foto mediocre no cierra visita | **P1** | design + tech |
| 7 | **Canal beta cerrado** (invite + soporte WA + form feedback) | Feedback cualitativo &gt; features; controla junk | **P2** | PM + user |

*(Apuesta 8 opcional post-métricas: email notif Q&A formal / merge D1→C — no antes de prod smoke.)*

### Qué NO hacer aún (veto owner)

- **Alquiler / `operationType`** — D7=A ya decidida; reabrir = congelar prod.
- **Pagos in-app / BNC / escrow** — fuera de MVP; Preferencial fuera de app.
- **Analytics vanity / dashboards fancy** — admin útil ya existe; no charts.
- **App nativa / PWA pesada** — cero ROI esta semana.
- **Coming soon alquiler en UI** — expectativa falsa = peor trust.
- **Abrir registro público** sin T&C + disclaimer + ops Preferencial.
- **Más paquetes Preferencial** o bajar precios sin capacidad de cumplir el floor.
- **Pulir motion/landing** mientras `/api/clerk` = 404.

### Priorización P0 / P1 / P2

**P0 — esta semana (gate producción)**
- Env Vercel = mirror `.env.local` (Clerk, Convex, UT, `USER_SYNC_SECRET`, `CLERK_WEBHOOK_SECRET`, `ADMIN_EMAILS`, ops email).
- Redeploy Production → `www.musasbienesraices.com`; `/api/clerk` ≠ 404.
- Webhook Clerk prod apuntando al dominio.
- Smoke prod: Explore + Auth + Publicar+foto + Preferencial + Favoritos + Admin seed/pause (reusar `BETA_SCRIPTS`).
- Nombre + canal ops Preferencial &lt;24h.
- Lista ≥5 beta / ≥3 publicadores **o** compromiso escrito de fechas.

**P1 — inmediatamente post-smoke**
- 2ª cuenta Clerk → Q&A PASS.
- Disclaimer VE + T&C/privacidad v0 (beta cerrada hasta entonces si hay registro amplio).
- Distinción visual seed/`isDemo` vs listing real.
- Checklist publicar: empujar ≥3 fotos (o copy fuerte “con 1 foto no vendes”).
- Confirmar D1–D6 explícito (deadline silencio **2026-11-13 19:20 UTC**).

**P2 — backlog consciente**
- Email Q&A (Resend) / D1→C.
- Analytics liviano (conteo pubs / solicitudes).
- Segunda ciudad marketing solo si Caracas tiene density.
- Alquiler = INFORME nuevo post-métricas venta.

### Riesgos

| Riesgo | Sev | Mitigación |
|--------|-----|------------|
| Push sin env Vercel → auth/UT rotos en “prod” | **Crítico** | Checklist `SETUP_MUSAS.md` §2 **antes** de celebrar deploy |
| Dominio sigue en build viejo | **Crítico** | Verificar `/api/clerk` + home Musas post-deploy |
| Preferencial sin ops humano | **Mayor** | Bloquear pitch “servicios” hasta canal &lt;24h |
| Explore con solo seed demo | **Mayor** | Reclutas + marcar demo; no vender como inventario vivo |
| Q&A declarado listo sin E2E | **Mayor** | Mantener N/A en pitch hasta 2 cuentas |
| Post-publish basura/estafa | **Medio** | Pause admin + checklist + beta cerrada |
| Floor Preferencial incumplible | **Medio** | Joaquín valida USD 120/150/200 o baja números |
| Dual ADMIN_EMAILS confuso | **Menor** | Documentar emails canónicos; no crecer lista ad hoc |

### Decision gates (orden; sin saltos)

| Gate | Criterio PASS | Dueño | Estado |
|------|---------------|-------|--------|
| **G-Prod** | Env Vercel + redeploy + webhook 200 | Joaquín / tech | **ABIERTO — P0** |
| **G-Smoke** | Scripts 1–4 + 6 PASS en dominio | user/qa | Pendiente tras G-Prod |
| **G-Ops** | Nombre + WA/email Preferencial &lt;24h | Joaquín | **ABIERTO** |
| **G-Beta** | ≥5 users / ≥3 pubs + canal soporte | Joaquín / PM | Pendiente |
| **G-Trust** | Disclaimer + T&C v0 antes de registro amplio | PM | Pendiente |
| **G-QA** | Script 5 PASS (2 cuentas) | user | N/A hoy |
| **G-D1D6** | OK explícito o silencio 48h | Joaquín | Deadline 2026-11-13 |

**Regla owner:** no declarar “Musas en producción” hasta **G-Prod + G-Smoke**. No declarar “Preferencial listo comercialmente” hasta **G-Ops**.

### Esta semana vs backlog

| Esta semana (ship) | Backlog (no tocar) |
|--------------------|--------------------|
| G-Prod + G-Smoke | Alquiler |
| G-Ops + reclutas | Pagos / BNC / escrow |
| 2ª cuenta Q&A (si cabe) | Analytics vanity |
| Disclaimer corto si hay tráfico | App nativa |
| | Más paquetes Preferencial |

### Decisión pedida a Joaquín (explícita)

- [ ] **G-Prod hoy/mañana:** ¿pegaste env Vercel y confirmas redeploy Production? (sí/no + captura `/api/clerk`)
- [ ] **G-Ops:** nombre + WhatsApp/email que responde Preferencial &lt;24h
- [ ] **Inventario:** ¿quiénes son los ≥3 publicadores Caracas y cuándo publican?
- [ ] **D1–D6:** OK defaults / ajustes por ID (no asumir silencio si vas a objetar)
- [ ] **Beta:** ¿cerrada por invite hasta T&C? (**recomendación owner: sí**)
- [ ] **Floor Preferencial:** ¿cumples USD 120/150/200 o bajamos copy?

### Asks con severidad

| Ask | Para | Sev |
|-----|------|-----|
| Env Vercel + redeploy + webhook | tech + Joaquín | **blocker** |
| Ops Preferencial nombre+canal | Joaquín | **blocker** comercial |
| Reclutas / 3 pubs Caracas | Joaquín / PM | **blocker** mercado |
| Re-smoke `BETA_SCRIPTS` en prod | user/qa | **major** |
| 2ª cuenta Q&A | user / Joaquín | **major** |
| Disclaimer + T&C v0 | PM + design | **pre-apertura** |
| Email Q&A Resend | tech | **P2** |

### Handoff

- **PM:** responde preguntas 1–7; no abras scope; fija métrica semanal = G-Prod+G-Smoke+G-Ops.
- **Tech:** solo G-Prod; no features nuevas hasta smoke prod verde.
- **User/QA:** preparar corrida prod idéntica a 3b; parallel 2ª cuenta para script 5.
- **Design:** copy Caracas-first + disclaimer corto; no landing nueva.
- **Coordinador:** refresh Oficina tras este informe.

---

## INFORME-3 — Roadmap 2 semanas post-MVP local PASS

*Fecha:* 2026-11-11 (noche)  
*Autor:* musas-pm  
*Antecedente:* QA corridas 3/3b **PASS local** (explore, auth, publish+foto, Preferencial, favoritos, admin seed/pause). Q&A **N/A** (1 cuenta). Prod **bloqueada** (env Vercel + redeploy + webhook).  
*Estado del gate:* **ABIERTO** — sin asumir D1–D6; D7=A ya aprobada

### Veredicto PM

Código + smoke local = **listos para ship a prod**. El cuello de botella es **operativo (G1–G3)**, no de feature. Semana 1 = desbloquear dominio + beta cerrada medible. Semana 2 = feedback loop + confianza (T&C) + ops Preferencial real. **No abrir alquiler ni pagos.**

**Alineación OWNER-2:** acuerdo total en P0 (prod viva + ops Preferencial + inventario Caracas). No declarar “en producción” sin G-Prod+G-Smoke; no pitch Preferencial sin G-Ops. Seed ≠ marketplace — meta ≥3 pubs reales Caracas. Q&A permanece N/A en pitch hasta 2ª cuenta.

### (1) Gate inmediato producción (orden obligatorio)

| # | Gate | Dueño | Criterio PASS | Estado |
|---|------|-------|---------------|--------|
| G1 | Env Vercel = mirror `.env.local` (Clerk, Convex, UT, `CLERK_WEBHOOK_SECRET`, `USER_SYNC_SECRET`, `ADMIN_EMAILS` dual, ops email) | Tech + Joaquín | Secrets en Production | **Pendiente — blocker** |
| G2 | Redeploy Production → `www.musasbienesraices.com` | Tech / Vercel | Home MVP actual; `/api/clerk` ≠ 404 | **Pendiente — blocker** |
| G3 | Clerk webhook prod → `https://www.musasbienesraices.com/api/clerk` | Joaquín / Tech | user.created/updated sync Convex | **Pendiente** (tras G2) |
| G4 | Admin prod: login `ricardo10mora` (+ dual) → `/admin` → seed | User + Tech | Seed visible en explore prod | **Pendiente** |
| G5 | `BETA_SCRIPTS` 1–4 + 6 en **prod** | User / QA | PASS documentado (no dry-run) | **Pendiente** |
| G5b | Script 5 Q&A con **2ª cuenta** Clerk | User | ≥1 pregunta + respuesta | **Pendiente** (local también) |
| G6 | Beta cerrada invite-only | Joaquín + PM | ≥5 usuarios / ≥3 publicadores | **Pendiente** |
| G7 | D1–D6 | Joaquín | OK explícito **o** silencio 48h (deadline **2026-11-13 19:20 UTC**) | **Pendiente — no asumir** |

**Regla Owner/Tech:** push sin env Vercel = deploy muerto. Checklist: `docs/SETUP_MUSAS.md` §2.

### (2) Semana 1 — Ship + beta cerrada (prioridad absoluta)

**Objetivo:** dominio = MVP; primer ciclo real medible.

| Día | Comercial | Técnico / Design / User / QA |
|-----|-----------|------------------------------|
| D0–1 | Joaquín autoriza G1–G2; nombra dueño deploy | Tech pega env Vercel + redeploy; verifica `/api/clerk` |
| D1 | Confirma canal ops Preferencial (nombre + WA/email &lt;24h) | G3 webhook; G4 admin seed prod |
| D1–2 | Recluta lista beta (5–10 / ≥3 pub); copy “solo venta USD” | User/QA: scripts 1–4+6 en prod |
| D2 | D1–D6: “OK defaults” / ajustes / silencio | 2ª cuenta → script 5 Q&A |
| D3–5 | Onboard beta; empujar **≥3 listings reales Caracas**; 1 Preferencial → ops &lt;24h | Design: badge demo vs real; copy “≥3 fotos venden”; polish sin scope creep |
| D5–7 | Review métricas W1; decidir si ampliar invites | Tech: `NEXT_PUBLIC_OPS_EMAIL`; limpiar drafts QA huérfanos |

**Fuera de Semana 1 (veto Owner/PM):** alquiler, Resend/email Q&A, pagos/BNC, analytics vanity, registro público, pulir landing mientras `/api/clerk`=404.


**Integración exigencias agentes:**

| Agente | Exigencia Semana 1 |
|--------|-------------------|
| Owner | Prod = redeploy+webhook; venta-only a reclutas; ops Preferencial humano |
| Tech | Env Vercel completo; DoD `/api/clerk` 200; UT prod |
| Design | Copy solo-venta; no cards/hero clutter; Preferencial “pago fuera” |
| User/QA | PASS prod no dry-run; Q&A 2 cuentas; fallar en crash consola |

### (3) Semana 2 — Feedback loop + confianza + Preferencial comercial

**Objetivo:** aprender de beta; endurecer trust; validar pricing Preferencial con demanda real.

| Foco | Acciones | Gate |
|------|----------|------|
| Feedback | Form corto + notas `BETA_SCRIPTS`; triage PM (P0 bugs vs nice-to-have) | ≥3 feedbacks documentados |
| Preferencial | SLA &lt;24h en admin; 1 caso “reviewing→assigned”; validar floors USD 120/150/200 | ≥1 lead real o 0 leads + insight |
| Confianza | T&C + privacidad v0 + disclaimer VE (light) | **PRE-APERTURA** — antes de registro amplio |
| Q&A | Si churn vendedor: ticket Resend (D1→C) como v1.1, no bloquea | Decisión post-métricas |
| Inventario | ≥1 listing **externo** (no seed/QA) published | Criterio éxito beta |
| Scope | Alquiler / pagos / BNC = backlog explícito | No ship Semana 2 |

**Pricing Preferencial (referencia vigente; D3/D6 sin OK Joaquín):**

| Paquete | Desde USD | Mensaje comercial |
|---------|-----------|-------------------|
| fotos | 120 | Sesión + carga a ficha; pago fuera |
| acompanamiento | 150 | Visitas + negociación; pago fuera |
| legal | 200 | Docs + checklist cierre; pago fuera |

**Ask pricing:** ¿ops puede cumplir esos floors? Si no → bajar número o quitar monto (opción D3-A “a cotizar”).

### (4) Métricas feedback beta (medir Semana 1–2)

| Métrica | Umbral W1 | Umbral W2 | Cómo |
|---------|-----------|-----------|------|
| Deploy prod sano | `/api/clerk` 200; auth+UT | Estabilidad sin rollback | Smoke User |
| Listings publicados (no solo seed) | ≥1 externo **o** ≥3 QA/demo útiles | ≥1 externo real | Admin / explore |
| Publicadores activos | ≥3 invitados con intent | ≥3 con publish o draft serio | Lista + dashboard |
| Q&A completo | ≥1 hilo (2ª cuenta) | ≥2 hilos con respuesta &lt;48h | Mensajes |
| Preferencial | ≥1 `requested` | ≥1 avanza de status + respuesta ops | `/admin` |
| Favoritos engagement | Señal cualitativa | ≥3 users guardan ≥1 | Convex / feedback |
| Feedback cualitativo | ≥3 notas (dolor publish/explore/Pref) | ≥5; top-3 issues priorizados | Form + scripts |
| Confianza | Beta cerrada | T&C/disclaimer draft listo | Docs |
| Seguridad | 0 secretos en repo | Ownership prod verificado | Tech review |
| NPS/proxy | — | “¿Recomendarías publicar en Musas?” 1–5 ≥3.5 avg | Form fin W2 |

**No-métricas vanity:** pageviews sin acción; seed count como “éxito de mercado”.

### (5) Decisiones abiertas (no asumir)

| ID | Tema | Default / estado | ¿Bloquea ship? | Ask Joaquín |
|----|------|------------------|----------------|-------------|
| **D1** | Notif Q&A | A inbox · sin OK explícito | No (código listo) | OK / email ASAP / silencio→deadline |
| **D2** | Moderación | A post-publish+pause · sin OK | No | OK / pre-review |
| **D3** | Precio Preferencial UI | C desde X + cotizar · sin OK | Comercial | OK floors / quitar montos |
| **D4** | Ciudad piloto | B 7 ciudades · sin OK | Copy | Caracas-first OK? |
| **D5** | Favoritos merge | B merge · sin OK | No | OK / descartar anon |
| **D6** | Paquetes + refs USD | 120/150/200 · sin OK | Comercial/ops | ¿Cumplibles? |
| **D7** | Venta vs alquiler | **A solo venta — APROBADA** | — | Cerrada |
| **D8** *(nueva)* | Dueño ops Preferencial &lt;24h | Ausente | Major ops | Nombre + WA/email |
| **D9** *(nueva)* | ¿Registro público post-W2? | Recom: **no** sin T&C | Pre-apertura | Sí solo tras disclaimer |

**Deadline silencio D1–D6:** 2026-11-13 19:20 UTC (INFORME-1). PM **no** las marca aprobadas hasta OK o vencimiento.

### Riesgos residuales (post-PASS local)

| Riesgo | Sev | Mitigación |
|--------|-----|------------|
| Prod sin env | Crítico | G1 antes de celebrar ship |
| Q&A sin 2ª cuenta | Major | Crear comprador test día 1 prod |
| Preferencial sin humano | Major | D8 antes de invites |
| Defaults D1–D6 objetados mid-beta | Major | Forzar OK día 1–2 |
| Expectativa alquiler | Medio | Copy + onboarding reclutas (D7=A) |
| Floors Preferencial irreales | Medio | Validar D3/D6 con ops |

### Recomendación PM (orden de ship)

1. **Hoy/mañana:** G1 → G2 → G3 (único P0).  
2. **Mismo día prod:** G4 seed + G5 smoke + 2ª cuenta Q&A.  
3. **Paralelo:** D1–D6 respuesta + D8 ops + lista beta.  
4. **Fin Semana 1:** métricas mínimas o informe de bloqueo honesto.  
5. **Semana 2:** feedback + T&C draft + validación pricing; **no** alquiler/pagos.

### Decisión del gate (sin asumir)

| Pregunta | Estado |
|----------|--------|
| ¿Local MVP PASS para avanzar a prod? | **Sí** (Q&A pendiente 2ª cuenta) |
| ¿Prod = MVP? | **No** |
| ¿D1–D6 cerradas? | **No** |
| ¿D7 cerrada? | **Sí — A** |
| ¿Aprobaciones nuevas asumidas? | **Ninguna** |

### Asks explícitos para Joaquín

1. **P0:** ¿Autorizas pegar env Vercel + redeploy Production **hoy/mañana**? ¿Quién aprieta el botón?  
2. **D1–D6:** “OK defaults” / ajustes por ID (antes del deadline).  
3. **D8:** Nombre + canal ops Preferencial (&lt;24h).  
4. **D3/D6 pricing:** ¿confirmas floors 120/150/200 o cambiamos?  
5. **G6:** Lista beta ≥5 / ≥3 publicadores + fecha primer invite.  
6. **D9:** ¿Mantener beta cerrada hasta T&C v0? (recom: sí)

---

## INFORME-4 — Roadmap 2 semanas + benchmarks competitivos VE

*Fecha:* 2026-11-12  
*Autor:* musas-pm  
*Antecedente:* INFORME-3 (ship prod + beta) · OWNER-2 · User F1–F8 · referentes ML / Housy / Propiedash / Encuentra24 / Properati / Lamudi  
*Estado del gate:* **ABIERTO** — Semana 0 = prod; UX “robado” solo post-smoke o en paralelo sin tocar G-Prod  
*Aprobaciones nuevas asumidas:* **Ninguna**

### Veredicto PM

Musas **no gana** siendo “ML más chiquito” ni “Housy sin mapa”. Gana si: (1) **prod viva + inventario Caracas**, (2) **contacto comprador→vendedor** (Q&A + decisión WA), (3) **Preferencial con humano &lt;24h**, (4) filtros/presupuesto que un FSBO Caracas entiende. Semana 0 sigue siendo G-Prod. W1 = beta + robos UX P0/P1. W2 = trust + share/ops + métricas de diferenciación.

---

### (1) Competitive gaps — Musas vs top 3 VE (ML / Housy / Propiedash)

Leyenda: **Tenemos** · **Falta (robar/adaptar)** · **No competir** (fuera de apuesta MVP)

| Capacidad | ML Inmuebles | Housy | Propiedash | Musas hoy | Veredicto |
|-----------|--------------|-------|------------|-----------|-----------|
| Inventario / density Caracas | Alto | Medio | Medio-bajo | Seed + 0 pubs externos prod | **Falta** density (F1) — no escala ML |
| Precio USD claro | Mixto / ambiguo a veces | Mixto | **USD + BCV** | **Solo USD** (D7=A) | **Tenemos** (diferenciador) · BCV = **No competir** en MVP |
| Publicar gratis / wizard | Form portal | Gratis + NL | **Wizard fuerte** | Wizard 3 pasos PASS local | **Tenemos** base · **Falta** checklist temprana (F5) |
| Mapa / geo | Sí | **Mapa + NL** | Limitado | No | **No competir** W0–W2 (mapa = v1.1+) |
| Búsqueda NL | No típico | **Sí** | No | No | **No competir** hasta density |
| Filtros must (ciudad/tipo/precio) | Sí | Sí | Sí | Ciudad/tipo/presupuesto | **Tenemos** · **Falta** bandas &lt;150k (F4) |
| Filtro sector / urb. (Altamira, LPG…) | Sí / chips | Geo | Parcial | Solo texto en ficha | **Falta** (F3; Properati must) |
| Contacto rápido (WA en ficha) | Tel/WA típico | App/chat | Chat in-app | Solo Q&A + login | **Falta** (F2; Encuentra24) — **D10** |
| Chat / mensajería | Mensajes portal | In-app | **Chat** | Q&A hilos (inbox) | **Tenemos** Q&A · no clonar chat full |
| Share listing (código/link) | Link | Link | **Share code** | URL slug | **Falta** light (W2) · no code fancy obligatorio |
| Servicios / upsell vendedor | Ads / destacados | — | — | **Preferencial** (fotos/legal/acompaña) | **Tenemos** (única apuesta comercial) · ops humano **Falta** (D8) |
| Trust / anti-estafa | Reputación ML | Brand NL | — | Post-publish + pause; sin T&C | **Falta** disclaimer/T&C (W2) |
| Alquiler | Sí | Sí | Sí | **No** (D7=A) | **No competir** hasta métricas venta |
| Pagos in-app | Ecosistema | — | — | No (correcto) | **No competir** MVP |

**Posición de marca (1 línea):** *Portal venta-only USD + Preferencial humano + Q&A, no marketplace genérico con mapa.*

**Top 3 robos UX priorizados (no vanity):**

| Pri | Robo | Referente | Ligado a | Bloquea ¿? |
|-----|------|-----------|----------|------------|
| P0 UX | Bandas presupuesto ≤80k / ≤120k | Properati / Lamudi | F4 | No ship prod |
| P0 UX | CTA WhatsApp opt-in en ficha | Encuentra24 | F2 → **D10** | Decisión Joaquín |
| P1 UX | Filtro/chips sector Caracas | Properati must | F3 | Post-smoke |
| P1 UX | Checklist publicar paso 2 + hint ≥3–6 fotos | Propiedash wizard | F5/F6 | Post-smoke |
| P2 UX | Share fácil (copy link / “código” corto) | Propiedash | viral FSBO | W2 |
| — | Mapa, NL, BCV dual, inventario ML | Housy/ML/Propiedash | — | **No competir** 2 semanas |

---

### (2) Roadmap ajustado: Semana 0 → W1 → W2

#### Semana 0 — Prod viva (sin features nuevas salvo unblock)

| # | Ítem | Dueño | PASS si… |
|---|------|-------|----------|
| S0.1 | Env Vercel = `.env.local` + redeploy | Tech + Joaquín | Home MVP; `/api/clerk` ≠ 404 |
| S0.2 | Webhook Clerk prod | Tech / Joaquín | Sync user en Convex |
| S0.3 | Admin dual → seed Caracas | Admin | Grid no vacío (mata F1 amigos) |
| S0.4 | Smoke prod scripts 1–4 + 6 | QA/User | PASS documentado |
| S0.5 | D8 ops Preferencial nombre+WA | Joaquín | Canal &lt;24h antes de pitch |
| S0.6 | 2ª cuenta → script 5 Q&A | User | Q&A deja de ser N/A |

**Veto Semana 0:** mapa, NL, BCV, alquiler, analytics vanity, landing polish.

#### Semana 1 — Beta cerrada + UX robado P0/P1

| Orden | Ítem | Tipo | Notas |
|-------|------|------|-------|
| W1.1 | Invites ≥5 / ≥3 pubs Caracas | Ops | Copy: solo venta USD |
| W1.2 | Bandas presupuesto &lt;150k (F4) | UX robo Properati | Ship rápido, alto ROI |
| W1.3 | **D10** WA en ficha opt-in (F2) | UX robo Encuentra24 | Solo si Joaquín aprueba A/B abajo |
| W1.4 | Checklist paso 2 + hint fotos (F5/F6) | UX robo Propiedash | Reduce “guardé y no publica” |
| W1.5 | Chips/filtro sector top Caracas (F3) | UX robo Properati | Altamira, LPG, Chacao, La Castellana… |
| W1.6 | Preferencial ETA copy (F8) | Copy | “Te escribimos en 24h” |
| W1.7 | ≥1 Preferencial real → ops responde | Comercial | Valida diferenciador vs ML ads |
| W1.8 | Feedback amigos (form + F1–F8) | User | Quotes &gt; vanity clicks |

#### Semana 2 — Confianza + no-ser-copia-peor

| Orden | Ítem | Tipo |
|-------|------|------|
| W2.1 | T&C + disclaimer VE v0 | Trust (pre-apertura) |
| W2.2 | Badge demo vs listing real | Trust |
| W2.3 | Share link fácil (± código corto) | UX Propiedash light |
| W2.4 | Triage feedback → top-3 fixes | PM |
| W2.5 | Decidir D1→C (email Q&A) solo si churn medido | Backlog condicional |
| W2.6 | Métricas diferenciación (tabla §3) | PM + User |
| — | Mapa / NL / BCV / alquiler / pagos | **Backlog explícito** |

---

### (3) Métricas — demostrar que no somos “copia peor”

Umbrales orientados a **comportamiento**, no a “parecer portal”.

| # | Métrica | Por qué diferencia | Umbral W1 | Umbral W2 | vs copia peor |
|---|---------|-------------------|-----------|-----------|---------------|
| M1 | Time-to-first-publish (amigo nuevo) | Wizard útil vs fricción Propiedash/ML | ≤15 min con ≥1 foto | ≤12 min + checklist usada | Si &gt;20 min = peor wizard |
| M2 | % fichas con ≥3 fotos | Calidad &gt; volumen ML basura | ≥50% pubs beta | ≥70% | Copia peor = 1 foto celular |
| M3 | Contact rate (Q&A y/o WA) / ficha vista | Encuentra24 gana por WA; nosotros medimos respuesta | ≥1 contacto iniciado | ≥30% hilos con respuesta &lt;48h | Copia peor = “Preguntar” muerto |
| M4 | Preferencial: requested → contacted ops &lt;24h | Único moat vs destacados ML | ≥1 caso | 100% casos W2 &lt;24h | Sin humano = teatro |
| M5 | Filter success: búsqueda Caracas + bandas ≤120k con ≥1 hit | Properati must | Tras F4: ≥1 hit seed/real | Amigos encuentran sector útil | Copia peor = “hasta 150k” vacío |
| M6 | “¿Publicarías de nuevo en Musas?” (1–5) | No vanity NPS genérico | n≥3 avg ≥3.5 | n≥5 avg ≥3.5 | &lt;3 = copia peor percibida |
| M7 | Listing externo real (no seed/QA) | Marketplace ≠ lab | ≥1 o 3 pubs comprometidos | ≥3 published Caracas | Seed-only = fail owner |
| M8 | Share/forward (si W2.3) | Propiedash viral | — | ≥2 shares/forwards reportados | Opcional |

**Anti-métricas (no celebrar):** pageviews sin acción · # seed como “inventario” · features shipped sin uso beta.

---

### (4) Decisiones abiertas nuevas / vigentes

| ID | Tema | Opciones | Rec. PM | Bloquea | Estado |
|----|------|----------|---------|---------|--------|
| **D10** *(nueva)* | WA en ficha | **A** Opt-in vendedor (campo WA + CTA) · **B** Solo Q&A MVP · **C** WA ops Musas (no dueño) | **A** para beta Caracas (F2); Q&A sigue | UX W1 | **Pendiente** |
| D8 | Ops Preferencial | Nombre + canal | Obligatorio | Pitch Pref | Pendiente |
| D1–D6 | Defaults | OK / ajuste | Sin asumir | Comercial | Pendiente (deadline 2026-11-13 19:20 UTC) |
| D3/D6 | Floors Pref | Cumplir / bajar / quitar monto | Validar con ops | Pricing | Pendiente |
| D9 | Registro público | No sin T&C | **No** | Pre-apertura | Pendiente |

---

### Riesgos (competitivos)

| Riesgo | Sev | Mitigación |
|--------|-----|------------|
| Amigos comparan con Housy (“¿dónde está el mapa?”) | Medio | Onboarding: venta USD + Preferencial; mapa = no esta beta |
| Solo Q&A sin WA → churn vs Encuentra24 | Mayor | Cerrar **D10** día 1 W1 |
| Bandas precio altas → “no hay nada barato” | Mayor | F4 en W1.2 antes de invites masivos |
| Preferencial sin respuesta = peor que “destacado” ML | Crítico | D8 antes de invites |
| Copiar BCV/mapa diluye marca USD | Medio | Mantener **No competir** 2 semanas |

---

### Recomendación PM

1. **Semana 0 intacta** (G-Prod + seed + smoke + D8).  
2. **W1 prioriza F4 → D10 → F5/F6 → F3** (orden impacto FSBO Caracas).  
3. **No** mapa/NL/BCV/alquiler.  
4. Medir **M1–M7**; si M3 y M4 fallan, somos copia peor aunque el UI sea lindo.

### Decisión del gate

| Pregunta | Estado |
|----------|--------|
| ¿INFORME-3 sigue vigente en Semana 0? | **Sí** |
| ¿UX competitivo entra antes de prod? | **No** (salvo F4 copy/bandas si no bloquea deploy) |
| ¿D10 asumida? | **No** |
| ¿Aprobaciones nuevas? | **Ninguna** |

### Asks explícitos para Joaquín

1. **Semana 0:** ¿Env Vercel + redeploy **hoy/mañana**? ¿Quién pega secrets?  
2. **D10:** ¿WA opt-in en ficha (**A**), solo Q&A (**B**), o WA ops (**C**)? Rec: **A**.  
3. **D8:** Nombre + WA/email Preferencial &lt;24h.  
4. **D1–D6 + floors 120/150/200:** OK / ajustes antes del deadline.  
5. **Beta amigos:** ¿cuántos y cuándo (post-seed prod)? ¿Caracas-first confirmado?  
6. **W1 scope:** ¿autorizas F4+F5/F6+F3 post-smoke sin reabrir mapa/BCV?  
7. **D9:** ¿Beta cerrada hasta T&C? (recom: sí)

---

## INFORME-OWNER-3 — Priorización competitiva VE (nov 2026)

*Fecha:* 2026-11-12  
*Autor:* musas-owner  
*Lente:* Portales abiertos VE (ML Inmuebles, Housy, Propiedash, Inmueble Oferta, MercadoPiso) + franquicias + agregadores.  
*Pregunta dura:* Si Musas es solo “otro portal dark bonito”, pierde. ¿Qué paga un FSBO Caracas con **atención**?

### Veredicto de dueño

**Musas no gana por volumen ni por gratis.**  
ML tiene inventario + ads. Housy es gratis con mapa/NL en DC–Miranda–Aragua. Propiedash empuja wizard + USD/BCV + chat.  
**La única apuesta creíble:** *publicar venta USD en Caracas sin humillación, con foto que venda, y ayuda Preferencial humana cuando el dueño se atasca* — no un agregador más.

Sin **prod viva + ≥3 listings reales Caracas**, no hay diferenciación que medir. Dark UI sin stock = Instagram vacío.

### Pregunta al PM (no rubber-stamp)

1. ¿Vas a pitchar “marketplace VE” o “venta USD Caracas con Preferencial”? Lo segundo cabe; lo primero es mentira vs ML/Housy.  
2. ¿Preferencial es el producto o un banner? Sin ops &lt;24h es banner.  
3. ¿WA en ficha (F2) entra en beta o defendemos solo Q&A? En Caracas el FSBO espera WA; Q&A-only es fricción vs Propiedash chat / ML contacto.  
4. ¿Caracas-first o seguimos seedando 7 ciudades para “parecer portal”? Density &gt; mapa.  
5. ¿Cuándo miramos UI (bandas presupuesto, sector, checklist fotos) vs cuándo solo G-Prod? Respuesta abajo en gates — no mezclar.

---

### 5 apuestas vs referentes (robar / ignorar / superar)

| # | Apuesta Musas | Robar de… | Ignorar de… | Superar con… | ¿Por qué el FSBO Caracas presta atención? |
|---|---------------|-----------|-------------|--------------|-------------------------------------------|
| **A1** | **Publicar venta USD sin pagar listing** + checklist que evita ficha basura | Housy (gratis publicar) · Propiedash (wizard guiado) | ML paywall / boosts · franquicias “tráelo a la oficina” | Wizard corto + checklist foto/desc/precio USD **antes** de publicar; copy “tu apto en dólares, no en BCV confuso” | Dueño odia pagar ML “por si acaso” y odia fichas feas que nadie abre |
| **A2** | **Preferencial = ayuda profesional on-demand** (fotos / legal / acompañamiento) sin ser inmobiliaria | Propiedash “te acompañamos” vibe · RAH/C21 servicio humano | Franquicia full-service · escrow/pagos in-app · “somos broker” | Paquetes claros + solicitud WA + ops &lt;24h + pago fuera; **no** fingir MLS | FSBO quiere ayuda puntual (fotos que vendan) sin ceder el listing a comisión 5% |
| **A3** | **Contacto real al vendedor** (WA opt-in en ficha + Q&A con login) | ML / casi todo VE (WA manda) · Propiedash chat | Solo formularios corporativos · lead-gen a broker tercero | Opt-in WA + Q&A persistente (historial en ficha) — trust sin cazar al comprador a escondidas | Comprador Caracas no espera 48h a un inbox; vendedor quiere leads directos |
| **A4** | **Caracas density + filtros que buscan gente** (sector / bandas &lt;150k) | Housy foco geo DC–Miranda · Inmueble Oferta/MercadoPiso nicho | Trovit/Nuroa scrapers · mapa NL fancy sin stock · 7 ciudades vacías | Chips sector Caracas + presupuestos 40–120k reales FSBO (F3/F4) **después** de tener stock | Comprador juzga en 10s: “¿hay algo en mi zona a mi plata?” |
| **A5** | **Confianza USD post-estafa** (badge demo vs real, disclaimer, pause admin, ≥3 fotos) | Propiedash USD/BCV claridad · ML reviews/reputación (parcial) | Dashboards vanity · DASHCODE cosplay cripto · NL search sin inventario | Distinguir seed/demo; checklist fotos; admin pause rápido; T&C/disclaimer antes de abrir | En VE el miedo es estafa/dólar fantasma; trust es el producto, no el neon |

**Ranking owner de atención FSBO:** A1 → A2 → A3 → A5 → A4.  
A4 sin A1/stock = maquillaje. A2 sin humano = teatro.

---

### Posicionamiento — 1 frase

| Vs | Frase |
|----|-------|
| **Housy** | Ellos: mapa gratis multi-estado; **nosotros: venta USD Caracas con ficha que vende y Preferencial cuando el dueño necesita fotos/cierre, no otro buscador vacío.** |
| **Mercado Libre Inmuebles** | Ellos: volumen + pago por visibilidad; **nosotros: publicar serio sin subasta de ads, contacto directo y ayuda humana opcional — no un listing más perdido en ML.** |
| **Propiedash** | Ellos: wizard + multi-moneda + chat producto; **nosotros: misma promesa de “fácil de publicar”, pero Preferencial empaquetado (fotos/legal/acompañar) y foco venta USD Caracas sin diluir en cripto/BCV theater.** |

**Tagline interno (no marketing público aún):**  
*Musas = vender tu inmueble en USD en Caracas sin humillación ni comisión forzada.*

---

### Gates — cuándo mirar UI vs cuándo prod + inventario

| Gate | Criterio | ¿UI polish? | ¿Qué sí? |
|------|----------|-------------|----------|
| **G-Prod** | Env Vercel + redeploy + `/api/clerk` 200 | **NO** | Solo wiring prod |
| **G-Stock** | Seed prod + ≥3 pubs reales Caracas (o 3 amigos con fecha) | **NO** (salvo empty-state honesto) | Inventario + reclutas |
| **G-Ops** | Nombre + WA Preferencial &lt;24h | **NO** | Humano + canal |
| **G-Smoke** | Scripts 1–4+6 PASS en dominio | Micro-copy si rompe smoke | Validar happy path |
| **G-UI-FSBO** | Solo **después** G-Prod+G-Stock | **SÍ** | F2 WA ficha · F3 sector · F4 bandas &lt;150k · F5/F6 checklist ≥3–6 fotos · F8 ETA Preferencial |
| **G-Trust** | Antes de registro amplio | Copy legal corto | Disclaimer + T&C + badge demo |
| **G-Scale** | Post métricas beta venta | Tal vez | Mapa/NL tipo Housy, segunda ciudad, email Q&A |

**Regla dura:**  
- **Antes de G-Prod+G-Stock:** vetado rediseñar landing, motion, “más dark”, mapa Housy-like.  
- **UI entra** solo para desbloquear fricción FSBO medible (F2–F6) cuando haya URL real con casas.  
- **Preferencial pitch** solo con G-Ops verde.

---

### NO hacer (vanity de portales grandes)

- Mapa + búsqueda NL tipo Housy **sin** density Caracas.  
- Paywall / boosts / “destacados de pago” tipo ML (no hay tráfico que vender).  
- Multi-moneda BCV + DASHCODE / cripto theater tipo Propiedash.  
- Chat realtime fancy antes de WA opt-in + Q&A E2E con 2 cuentas.  
- Agregador / scrapers Trovit-style.  
- Alquiler (Quarto gana ese juego; D7=A).  
- App nativa, PWA pesada, analytics vanity, dashboards fancy.  
- Franquicia cosplay (C21/REMAX/RAH) sin inventario ni agentes.  
- Abrir “Venezuela completa” con 7 ciudades seed vacías.  
- Pulir hero mientras dominio = build viejo.

---

### Score happy path (sin cambio de hechos)

| Criterio | Local | Prod | Nota competitiva |
|----------|-------|------|------------------|
| Ver venta USD | PASS | FAIL | Sin prod no hay vs Housy/ML |
| Publicar + foto | PASS | FAIL | A1 existe en código; nadie lo ve |
| Preferencial | PASS form | FAIL ops | A2 incompleta sin humano |
| Admin útil | PASS | FAIL | OK vs vanity |
| WA en ficha | **FAIL** | FAIL | Hueco vs mercado VE (F2) |
| Filtros sector/&lt;150k | **FAIL** | FAIL | A4 pendiente post-stock |
| Confianza T&C/demo badge | FAIL | FAIL | A5 abierta |

---

### Esta semana vs backlog

| Esta semana (ship mercado) | Backlog consciente |
|----------------------------|--------------------|
| G-Prod + G-Stock + G-Ops | Mapa/NL Housy |
| Smoke prod + 2ª cuenta Q&A | BCV dual / DASHCODE |
| Decisión **D10:** WA opt-in en ficha (sí/no beta) | Boosts ML-style |
| Post-stock: F4 bandas + F6 hint fotos (UI mínima) | Alquiler / Quarto |
| Caracas-first en copy reclutas | Segunda ciudad marketing |

---

### Decisiones pedidas a Joaquín / PM

- [ ] **D10 (nueva):** ¿CTA WhatsApp opt-in en ficha para beta? (**recom owner: SÍ** — sin esto perdemos vs hábito VE)  
- [ ] Confirmar apuesta #1 de pitch: **venta USD Caracas + Preferencial**, no “portal nacional”  
- [ ] G-Prod esta semana: sí/no + dueño  
- [ ] G-Ops: nombre + WA  
- [ ] ≥3 publicadores Caracas con fecha  
- [ ] G-UI-FSBO solo post G-Stock (¿acepta el PM?)

### Asks con severidad

| Ask | Para | Sev |
|-----|------|-----|
| Redeploy + env + webhook | tech + Joaquín | **blocker** |
| Inventario real Caracas | Joaquín / PM | **blocker** mercado |
| Ops Preferencial &lt;24h | Joaquín | **blocker** A2 |
| Decidir D10 WA ficha | PM + Joaquín | **major** competitivo |
| F4 bandas presupuesto post-stock | design + tech | **major** post G-Stock |
| No abrir mapa/NL/BCV | PM (veto) | **scope** |
| Badge demo + disclaimer | design + PM | **pre-apertura** |

### Handoff

- **PM:** responde D10 + confirma pitch Caracas/Preferencial; no priorices UI antes de G-Prod/G-Stock.  
- **Tech:** solo prod wiring; features UI = cola post-stock salvo blockers smoke.  
- **Design:** copy posicionamiento (frases vs Housy/ML/Propiedash); no landing nueva.  
- **User:** beta amigos midan A1 (publicar) y F2 (¿piden WA?).  
- **Coordinador:** refresh Oficina — INFORME-OWNER-3.

---

## INFORME-OWNER-4 — Propiedash=10 / Musas=3: diferencial realista

*Fecha:* 2026-11-12  
*Autor:* musas-owner  
*Input Joaquín:* Propiedash referente #1. Hipótesis diferencial: (1) validar publicaciones reales (revisión inicial) (2) especialistas CON Musas (no directorio abierto).  
*Hechos Propiedash (nov 2026):* ~44k pubs · 1478 zonas · 23 estados · venta+alquiler+corto · USD+BCV · mapa · DASHCODE · Dashtag · directorio profesionales · “verificación” = identidad AGENTE (docs), **no** que la propiedad sea real/del dueño · chat · planes $0/$19/$49 · destacados · Wasi · watermark · report fake 48h · wizard fuerte · freemium fotos.  
*Musas hoy:* local PASS básico · prod parcial · venta-only USD · Preferencial · Q&A · sin directorio · sin mapa · sin validación listing · inventory seed.

### Veredicto (una línea)

**Un 3 no se arregla con “más features Propiedash”.** Se arregla con densidad Caracas creíble + contacto al hábito VE + un trust claim que Propiedash **no** tiene (propiedad real / ayuda cerrada) — o se queda como lab bonito.

---

### 1) Por qué somos un 3 (5 razones mercado, sin endulzar)

| # | Razón | Evidencia mercado |
|---|-------|-------------------|
| **1** | **Cero density útil** | Propiedash ~44k / 23 estados. Musas = seed + 0 pubs externos en prod. Comprador Caracas juzga stock en 10s; vacío = “no hay casas”. |
| **2** | **No estás en el mercado (prod miente)** | Dominio parcial (`/api/me/sync` 404, Clerk `pk_test`). Sesión real vendedor/comprador en www ≠ lab local. Sin sesión pública no hay score. |
| **3** | **Coverage de intención incompleta** | Ellos: venta+alquiler+corto + USD/BCV. Nosotros: solo venta USD (D7=A — correcta para MVP, pero el tráfico llega buscando alquilar también). |
| **4** | **Hábito de contacto perdido** | Ellos: chat in-app. Mercado VE: WA en ficha. Musas: Q&A+login, **sin WA** (D10 abierta). Fricción vs todo portal que el caraqueño ya usa. |
| **5** | **Trust claim vacío / Preferencial teatro** | Ellos venden “agentes verificados” (aunque sea solo ID). Nosotros no validamos listing, no tenemos directorio, y Preferencial sin ops &lt;24h = banner. Seed sin badge demo quema confianza. |

**Nota dura:** el 3 no es “UI fea”. Es **no eres un marketplace usable hoy**. Propiedash es un 10 *relativo al juego portal VE abierto*; nosotros ni entramos a la cancha.

---

### 2) Qué ROBAR de Propiedash (sin vergüenza) — prioridad

| Pri | Robar | Por qué | No robar / adaptar |
|-----|-------|---------|-------------------|
| **P0** | Wizard asistido + checklist fotos (límites claros, hint ≥3–6) | Baja “guardé y no publica”; calidad &gt; 1 foto celular | No freemium paywall fotos día 1 (cero tráfico que vender) |
| **P0** | Reportar fake + SLA ops (su 48h → nuestro admin pause &lt;24h beta) | Anti-estafa percibida sin inventar “verificado” falso | No fingir “listados verificados” si solo pausamos basura |
| **P1** | Share / link fácil (± código corto tipo DASHCODE light) | FSBO viraliza en WA grupos | No cripto theater / DASHCODE brand |
| **P1** | Galería + orden de fotos + watermark opcional post-stock | Ficha que vende; watermark reduce scrape | Watermark no es moat |
| **P1** | Planes freemium **solo después** de density | Ellos monetizan $19/$49 con volumen | Destacados sin tráfico = teatro de ingresos |
| **P2** | Import Wasi / bulk | Brokers traen stock | Solo si hay red cerrada de especialistas — no día 1 |
| **—** | **NO** mapa nacional, BCV dual, alquiler, directorio abierto 1478 zonas, chat full realtime | Volumen y feature parity = suicidio de foco | Preferencial + WA opt-in + Q&A &gt; clonar chat |

**Orden owner:** robar fricción FSBO (wizard/fotos/report) → contacto (WA) → share. **No** clonar el portal.

---

### 3) Hipótesis Joaquín — evaluación dura

#### H1 — Validar publicaciones (revisión inicial para que sean “reales”)

| Criterio | Score | Comentario |
|----------|-------|------------|
| ¿Vende? | **Sí, si el claim es honesto** | En VE el miedo es estafa/dólar fantasma. “Revisado por Musas” (docs dueño / visita / checklist foto) **sí diferencia** de Propiedash, cuya “verificación” es del **agente**, no del inmueble. |
| ¿Escala? | **No a 44k** | Revisión humana no escala a volumen portal. Escala a **curated Caracas** (decenas→cientos), no a miles/semana. |
| ¿Ops mata MVP? | **Sí si es pre-publish estricto desde día 0 sin equipo** | Cola `under_review` sin revisor &lt;24h = vendedor odia Musas. **Mitigación:** beta = post-publish + pause (D2=A) + badge “Pendiente de revisión Musas” / “Musas-reviewed” solo tras checklist humano; o pre-review **solo Caracas** con 1 ops nombrado. |

**Veredicto H1:** **Apuesta correcta de marca, mala como gate de publish en MVP sin ops.**  
Producto: *claim de listing verificado* ≠ *bloquear publish*. Primero densidad mínima + humano que revise 5–10/semana; luego endurecer.

**Pregunta al PM:** ¿Quién revisa los primeros 20 listings y con qué checklist (cédula/RIF, foto fachada, video walkthrough, visita Preferencial)? Sin nombre = hypotesis vapor.

#### H2 — Gente especializada CON Musas (no directorio abierto)

| Criterio | Score | Comentario |
|----------|-------|------------|
| ¿Vende? | **Sí al FSBO que ya quiere ayuda** | Preferencial (fotos/legal/acompañar) es exactamente esto. Propiedash = directorio abierto (cualquiera se lista). Musas = **red cerrada / roster curado** que ejecuta con la marca. |
| ¿Escala? | **Lenta y correcta** | 3 fotógrafos + 2 abogados Caracas &gt; 500 “profesionales” basura. Escala por ciudad, no por SEO directorio. |
| ¿Ops mata MVP? | **Sí si abrimos “directorio” antes de roster + SLA** | Sin cupos, scoring, ni respuesta &lt;24h, es Propiedash peor. **Mitigación:** no UI directorio; solo Preferencial → asignación ops a especialista conocido. |

**Veredicto H2:** **Este es el diferencial comercial real** — ya está a medio cable (Preferencial). El hueco no es “falta directorio”; es **falta humano + roster**. Abrir directorio tipo Propiedash **diluye** la hipótesis.

**Combinación H1+H2 que sí vende:**  
*Listing Musas-reviewed en Caracas + si necesitas fotos/legal, te asignamos a alguien de la red Musas.*  
Eso Propiedash **no** promete hoy (verifican agente, no propiedad; directorio ≠ ejecución Preferencial).

**Combinación que mata MVP:** pre-review de todo + directorio abierto + 7 ciudades + alquiler + mapa — ops infinite, stock cero.

---

### 4) Cinco diferenciales REALISTAS (rankeados)

| Rank | Opción | ¿Vende? | ¿Escala? | Ops MVP | Owner |
|------|--------|---------|----------|---------|-------|
| **#1** | **Preferencial = red cerrada Caracas** (fotos/legal/acompañar con roster + SLA &lt;24h; sin directorio público) | Alto FSBO stuck | Ciudad a ciudad | **Bajo si roster=3–5 personas** | **GANA** — ya es la apuesta; falta G-Ops |
| **#2** | **Musas-verified listing** (badge post-checklist humano: dueño/docs/fotos mín.; no “agente verificado”) | Alto trust vs estafa | Baja (curated) | Medio — 1 ops | **Diferencia real vs Propiedash** si claim ≠ mentira |
| **#3** | **Caracas curated venta-only USD** (density Altamira/LPG/Chacao/…; sectores + bandas &lt;150k; sin fingir 23 estados) | Alto comprador local | Media en 1 ciudad | Bajo-medio | Base de #1+#2; sin esto badges no importan |
| **#4** | **FSBO-only trust** (dueño publica; brokers invitados solo con reglas; WA opt-in + Q&A; anti-lead-gen) | Medio-alto dueños | Media | Bajo | Nicho claro; pierde stock de agencias |
| **#5** | **Validación pre-publish estricta** (todo `under_review` antes de explore) | Alto *si* SLA | Mala | **Alto — mata beta** | Solo tras roster ops; **no rank 1 esta semana** |

**Variante descartada como “diferencial”:** directorio abierto de profesionales (copia Propiedash peor).  
**Variante condicional:** “red de abogados/fotógrafos Preferencial” = **#1**, no un producto aparte.

**Ranking resumen:** Preferencial cerrada → verified listing → Caracas curated → FSBO trust → pre-publish estricto (después).

---

### 5) Qué NO intentar (competir en volumen 44k)

- Inventario nacional / 23 estados / 1478 zonas.  
- Paridad feature: mapa + BCV + alquiler + corto plazo + chat full + Wasi + planes $19/$49 **antes** de 50 listings Caracas serios.  
- “Listados verificados” copy si solo verificamos email Clerk.  
- Directorio abierto de agentes (guerra de SEO con Propiedash).  
- Destacados de pago sin tráfico.  
- Scrapers / agregador.  
- App nativa, DASHCODE cosplay, multi-moneda theater.  
- Pre-review 100% sin humano nombrado.

**Frase de dueño:** Propiedash gana el juego *cantidad*. Musas solo puede ganar *calidad + ayuda + trust de propiedad* en un radio chico.

---

### Preguntas duras al PM

1. ¿Vas a pitchar contra Propiedash en **volumen** o en **verified Caracas + Preferencial**? Si es volumen, pierdes.  
2. ¿H1 es badge post-hoc o cola pre-publish? Elige una; “las dos” = ops muerta.  
3. ¿H2 es Preferencial (sí) o directorio (no)? No mezcles.  
4. ¿Quién es el revisor de listings semana 1–2 (nombre)?  
5. ¿D10 WA sigue abierta mientras dices que el referente es Propiedash/chat? Sin WA ni chat usable, el 3 empeora.

---

### Esta semana vs backlog (post-brainstorm)

| Esta semana | Backlog |
|-------------|---------|
| Cerrar prod sana (`me/sync`, Clerk live) + seed Caracas | Directorio profesionales |
| D8 ops Preferencial + roster mínimo 1 fotógrafo / 1 legal | Pre-publish estricto masivo |
| D10 WA opt-in | Mapa / BCV / alquiler / Wasi |
| Definir checklist **Musas-reviewed** (aunque badge ship W2) | Planes $19/$49 / destacados |
| ≥3 pubs reales Caracas | 44k cosplay |

---

### Decisiones pedidas a Joaquín *(IDs canónicos = INFORME-5)*

- [ ] **D11:** Posicionamiento — **Owner: D (N2+N3)**; veto: N2 sin D8 = mentira.  
- [ ] **D12:** Verify — **Owner: A** (L0→L1 post-publish) **solo si** revisor &lt;24h nombrado; si no D8 → pause-only, **sin** pitch “verificado”.  
- [ ] **D13:** Quién paga — **Owner: A+B**; **veto C** fee verify aparte en MVP.  
- [ ] **D8** nombre ops + **D10** WA.  
- [ ] ¿Quién hace L1? ¿Roster 3 especialistas D60?

### Asks con severidad

| Ask | Para | Sev |
|-----|------|-----|
| No perseguir parity 44k / mapa / BCV / directorio | PM (veto) | **scope** |
| D11=D solo con D8 verde | Joaquín / PM | **estratégico** |
| D12=A condicionado a revisor | Joaquín | **major** |
| Roster Preferencial mínimo + SLA | Joaquín | **blocker** comercial |
| Checklist L1 v0 (5–10 min) | PM + ops | **P1** |
| WA ficha (D10) | Joaquín | **major** hábito VE |

### Handoff

- **PM:** IDs D11–D13 = INFORME-5. Owner no rubber-stamp L1&lt;24h sin nombre. Ranking §4 vigente.  
- **Tech:** prod wiring primero; `verificationLevel` solo tras D12 + D8.  
- **Design:** “Musas revisa la propiedad” ≠ “agente verificado Propiedash”; no directorio.  
- **User:** beta mide trust claim + WA.  
- **Coordinador:** refresh Oficina — INFORME-OWNER-4 (+4b).

---

## INFORME-OWNER-4b — Challenge a INFORME-5 (no rubber-stamp)

*Fecha:* 2026-11-12  
*Autor:* musas-owner  
*Antecedente:* INFORME-5 propone D11=D, D12=A, D13=A+B, score 3→6→8.

### Acuerdo

- Score 10 vs 3, no chase 44k/mapa/BCV/Wasi/directorio: **OK**.  
- Moat = verify **propiedad/listing** + Preferencial roster cerrado: **OK** (H1+H2 bien formulados).  
- Robar WA + wizard/fotos + sector/bandas: **OK**.

### Objeciones (PM no asuma OK)

| # | Objeción | Sev |
|---|----------|-----|
| 1 | D12=A con L1&lt;24h **sin D8 nombrado** = teatro de badge (peor que no badge). | **Crítico** |
| 2 | KPI D30 “≥50% L1” agresivo con stock chico. Mejor: **100% de lo badged en &lt;24h** + capear volumen. | **Mayor** |
| 3 | Pitch “verificado” antes de ≥5 fichas L1 reales quema marca. Beta = soft copy. | **Mayor** |
| 4 | L2 docs asusta FSBO: L2 **solo** Preferencial/opt-in; no pedir cédula day-1 publish. | **Mayor** |
| 5 | Score 8 en 90d es vanity si `me/sync`/Clerk live siguen rojos. Semana 0 intacta. | **Crítico** |

### Veredicto sobre recs PM

| ID | Rec PM | Owner | Condición |
|----|--------|-------|-----------|
| D11 | D | **Aprobar con veto copy** | No “verificado” público hasta ≥5 L1 + D8 |
| D12 | A | **Aprobar condicional** | Revisor &lt;24h; si no → pause-only |
| D13 | A+B | **Aprobar** | Veto fee verify (C) MVP |
| D8/D10 | Oblig./A | **Blocker** | Sin esto INFORME-5 = estrategia, no producto |

**Al PM:** INFORME-5 bien orientado. No es “moat live” hasta D8 + primer L1 en prod.

---

## INFORME-5 — Brainstorm Propiedash=10 / Musas=3 → moat validación + especialistas

*Fecha:* 2026-11-12  
*Autor:* musas-pm  
*Antecedente:* Joaquín acepta score **Propiedash=10 · Musas=3**; Propiedash = referente UX #1; diferencial propuesto = **validación de publicaciones reales + red de especialistas Musas** (vs directorio Propiedash).  
*Estado del gate:* **ABIERTO** — Semana 0 prod sigue P0; este informe **no** asume D11/D12 aprobadas  
*Aprobaciones nuevas asumidas:* **Ninguna**

### Veredicto PM (1 párrafo)

Propiedash gana por **densidad + producto portal completo** (44k pubs, freemium, chat, verify profesional, Wasi). Musas no cierra 3→10 copiando el directorio ni el volumen. Cierra **3→6→8** si: (1) roba UX de contacto/publicar que ya duele vs Propiedash, (2) construye moat **“listing verificado + humano Musas”** que Propiedash no prioriza (ellos verifican **identidad profesional**, no propiedad), (3) Preferencial deja de ser banner y se vuelve **red de especialistas con SLA**. Semana 0 (prod + stock Caracas) sigue siendo prerequisito: sin listings reales no hay nada que validar.

---

### (1) Matriz gap — Propiedash vs Musas

Leyenda de acción: **Robar** (copiar UX/flujo) · **Diferenciar** (moat) · **Ignorar** (fuera de apuesta 90d) · **Parcial** (tenemos base, falta cierre)

| Capacidad | Propiedash tiene | Musas tiene | Acción |
|-----------|------------------|-------------|--------|
| Inventario / density | **44k pubs** | Seed + pubs beta escasas; prod stock frágil | **Ignorar** chase 44k · **Diferenciar** densid Caracas *verificada* |
| Mapa / geo | Sí | No | **Ignorar** 90d (salvo pin liviano post-score 6) |
| Directorio profesionales | Sí (core) | No | **Ignorar** directorio · **Diferenciar** especialistas *bajo marca Musas* |
| Verify identidad profesional | Sí (no propiedad) | No | **Ignorar** cosplay “agente verificado” · **Diferenciar** verify **listing/propiedad** |
| Chat in-app | Sí | Q&A hilos (inbox) | **Robar** fricción baja contacto · **no** clonar chat full |
| WA / contacto rápido | Chat + hábito mercado | Solo Q&A + login | **Robar** → **D10** WA opt-in |
| DASHCODE / share code | Sí | URL slug | **Robar** light (copy link / código corto) W2–D60 |
| Freemium / planes listing | Sí | Publicar gratis + Preferencial pago fuera | **Parcial** · no inventar paywall sin tráfico |
| Venta + alquiler | Sí | Solo venta USD (**D7=A**) | **Ignorar** alquiler 90d |
| Multi-moneda / BCV | Sí | Solo USD | **Diferenciar** (claridad USD) · **Ignorar** BCV theater |
| Integración Wasi / MLS-ish | Sí | No | **Ignorar** 90d |
| Wizard publicar | Fuerte | 3 pasos PASS local | **Robar** checklist temprana + ≥3–6 fotos |
| Filtros ciudad/tipo/precio | Sí | Sí base | **Robar** bandas &lt;150k + sector Caracas |
| Upsell servicio humano | Débil / no empaquetado | **Preferencial** (fotos/legal/acompaña) | **Diferenciar** — único moat comercial hoy |
| Validación publicación real | **No** (hueco) | Post-publish + pause admin | **Diferenciar** — producto central propuesto |
| Red especialistas propia | Directorio abierto | Preferencial intake sin red formal | **Diferenciar** — roster cerrado + SLA |
| Trust / anti-estafa UI | Parcial | Sin T&C/badge demo | **Robar** badge demo/real + disclaimer · **Diferenciar** badge “Musas Verificado” |
| Admin ops | — | `/admin` pause/Preferencial | **Parcial** — sumar cola de verificación |

**Síntesis:** Robar lo que hace que un caraqueño no se vaya en 40 min (WA, filtros, wizard, share). Diferenciar en lo que Propiedash **no hace**: propiedad/listing verificado + especialistas Musas. Ignorar mapa/BCV/Wasi/44k/directorio/alquiler.

---

### (2) Tres narrativas de posicionamiento

| # | Narrativa | Promesa 1 línea | Pros | Contras | ¿Cuándo gana? |
|---|-----------|-----------------|------|---------|----------------|
| **N1 — “Portal limpio USD”** | Musas = Propiedash light, solo venta USD, UI dark | “Publicá y encontrá en dólares sin ruido BCV” | Fácil de explicar; alinea D7 | Competimos en cancha de ellos (producto portal); score techo ~5–6 | Si solo robamos UX y no ops |
| **N2 — “Listings reales, no basura”** *(recomendada)* | Musas = marketplace donde **lo publicado está validado** + ayuda humana | “En Musas no comprás humo: fichas revisadas y especialistas cuando atasás” | Hueco real vs Propiedash (verify pro ≠ verify propiedad); trust VE; escala Preferencial | Costo ops; SLA si falla = peor que no tener badge; inventory slow | Si D11 validación + D8 ops cierran |
| **N3 — “Red de especialistas”** | Musas = capa de servicio sobre listings (fotos/legal/visitas), no portal | “No sos un anuncio más: tenés equipo Musas” | Moat servicio; ARPU Preferencial | Sin stock verificado suena a agencia; choca vs “no somos broker” | Post-score 6, con roster real |

**Recomendación PM: N2** como narrativa maestra 90 días.  
- N1 = *cómo se siente el producto* (UX robada).  
- N3 = *cómo se monetiza/cumple* Preferencial (brazo de N2).  
- Pitch externo corto: *“Venta USD en Caracas con publicaciones verificadas y especialistas Musas — no un directorio más.”*

**Decisión D11 (nueva):** ¿Aprobamos N2 como posicionamiento oficial beta/90d?  
- **Opciones:** A N2 · B N1 · C N3 · D híbrido N2+N3 (copy N2, ops N3)  
- **Rec PM:** **D** (narrativa N2 + ejecución Preferencial = N3)  
- **Estado:** **Pendiente Joaquín**

---

### (3) Roadmap 30 / 60 / 90 — copiar UX vs construir moat

| Horizonte | Score target | Copiar UX (Propiedash/mercado) | Construir moat (validación + especialistas) | Gate |
|-----------|--------------|--------------------------------|-----------------------------------------------|------|
| **D0–30** | **3 → 6** | WA ficha (**D10**); bandas precio; checklist fotos; chips sector; share link; Q&A E2E | Definir **nivel L1** verificación (abajo); cola admin “por verificar”; badge “En revisión / Verificado L1”; D8 ops Preferencial &lt;24h; ≥10 pubs Caracas reales | Prod sana + stock + contacto + **primer badge L1 en ≥5 fichas** |
| **D31–60** | **6 → 7** | Polish galería; wizard asistido (hints Propiedash); empty states honestos; **no** mapa/BCV | **L2** selectivo (docs o visita remote); roster **3–5 especialistas** (foto/legal/acompaña); SLA Preferencial medido; playbook “rechazo / pedir más fotos” | ≥30% pubs activas con L1; ≥3 Preferencial fulfilled; churn verify &lt;20% |
| **D61–90** | **7 → 8** | Solo UX que métricas digan (no vanity mapa) | **L2** escalado Caracas; programa referidos especialistas; copy público “Musas Verificado”; decidir si L3 visita física vale la pena | Comprador reporta “más confianza que Propiedash” en form ≥40%; score interno ≥8 en checklist PM |

**Reglas de scope 90d**

| Hacer | No hacer |
|-------|----------|
| Robar contacto + publicar + filtros Caracas | Perseguir 44k / Wasi / DASHCODE cripto |
| Validación L1→L2 con humanos | Auto-AI verify como promesa de marketing |
| Especialistas *roster cerrado* Musas | Directorio abierto tipo Propiedash |
| Venta USD only | Alquiler / BCV dual |
| Preferencial con SLA | Paywall listing sin tráfico |

**Nota Owner-align:** D0–14 siguen siendo G-Prod + G-Stock + G-Ops; el moat **empieza a medir** cuando hay pubs reales que validar.

---

### (4) Costos / ops — “validar listings”

#### Niveles de verificación (propuesta)

| Nivel | Qué se verifica | Quién | SLA | Costo unitario estimado* | Badge |
|-------|-----------------|-------|-----|--------------------------|-------|
| **L0 — Publicado** | Checklist auto (foto≥1, desc, precio USD) | Sistema (hoy) | Instantáneo | ~$0 | Sin badge / “Sin verificar” |
| **L1 — Escrito + visual** | ≥3 fotos coherentes; no stock/watermark obvio; precio USD creíble zona; datos contacto; no texto scam | Ops Musas (admin/QA) **remoto** | **&lt;24h** laborables | **USD 1–3** tiempo (5–10 min) | “Revisado Musas” |
| **L2 — Evidencia** | L1 + (A) doc identidad dueño *o* (B) recibo/servicio/catastro parcial *o* (C) video walkthrough WA | Ops + checklist; especialista si Preferencial | **&lt;72h** | **USD 8–25** (tiempo + fricción user) | “Verificado” |
| **L3 — Visita** | L2 + visita física / sesión foto Preferencial en sitio | Especialista red Musas | Agenda 3–7 días | **USD 40–120+** (cubre paquete fotos) | “Verificado en sitio” |

\*Costo = tiempo interno o payout especialista; **no** cobro in-app. L3 se financia vía Preferencial (fotos/acompaña).

#### Qué NO verificar en MVP (evitar teatro)

- Escritura completa / due diligence legal (eso es paquete `legal`, no badge gratis).  
- “Agente certificado” estilo Propiedash.  
- Visita L3 gratis a todos (quiebra el moat).

#### Modelo ops D30

| Rol | Responsabilidad | Capacidad |
|-----|-----------------|-----------|
| **Dueño ops** (D8) | Triage cola L1 + Preferencial | 1 humano nombrado |
| Admin (`ADMIN_EMAILS`) | Pause basura; marcar L1/L2 en Convex | Mismo o dual |
| Especialistas (3–5) | L3 / paquetes Preferencial | Roster WhatsApp, no directorio público |
| Joaquín | Excepciones precio/zona; hiring especialistas | Escalamiento |

**Capacidad L1:** ~6–10 listings/hora → **~40–60/día** teórico; realista beta Caracas: **5–15/semana** al inicio.  
**Riesgo:** si prometemos L2 a todos sin docs, ops colapsa → **L1 default público; L2 opt-in o Preferencial**.

#### Decisión D12 (nueva) — política de verificación

| Opción | Descripción | Rec PM |
|--------|-------------|--------|
| **A** | Post-publish L0; L1 manual &lt;24h en cola; badge cuando pasa | **Sí MVP** |
| **B** | Pre-publish under_review (rompe D2 default) | Solo si estafas beta |
| **C** | Solo Preferencial obtiene verify | Debilita moat público |
| **D** | L2 obligatorio para aparecer en explore | Mata density D30 |

- **Recomendación:** **A** + L2 opcional/Preferencial; explore puede filtrar “Solo verificados” cuando haya ≥10 L1.  
- **Estado:** **Pendiente Joaquín**

---

### (5) Métricas que cierran el gap 3 → 6 → 8

Score = promedio ponderado interno (no vanity). Pesos sugeridos:

| Pilar | Peso | 3 hoy | 6 (D30) | 8 (D90) |
|-------|------|-------|---------|---------|
| **Prod + stock Caracas** | 25% | 1 (prod parcial / stock demo) | Dominio sano + ≥10 pubs reales | ≥40 pubs reales Caracas |
| **Contacto (WA/Q&A)** | 20% | 2 (solo Q&A frágil) | D10 live + ≥30% fichas con WA o hilo | Respuesta &lt;48h en ≥50% contactos |
| **Trust / verificación** | 25% | 1 (pause only) | ≥50% pubs activas L1; badge visible | ≥30% L2 o L3; filtro “verificados” usado |
| **Especialistas / Preferencial** | 20% | 2 (form sin ops) | D8 + ≥3 solicitudes con respuesta &lt;24h | ≥5 fulfilled; roster ≥5; NPS Preferencial ≥4/5 |
| **UX paridad Propiedash (subset)** | 10% | 3 (wizard base) | Bandas+sector+checklist+share | Galería/orden fotos; time-to-publish ≤10 min |

**KPIs operativos (tablero semanal)**

| KPI | D30 | D60 | D90 | Si falla… |
|-----|-----|-----|-----|-----------|
| Pubs L1 / pubs activas | ≥50% | ≥70% | ≥80% | Bajar promesa badge o contratar ops |
| Tiempo L0→L1 | &lt;24h p50 | &lt;12h | &lt;8h | Cola ciega = teatro |
| Contact rate / ficha vista | ≥1/10 | ≥1.5/10 | ≥2/10 | Robar más UX contacto |
| Preferencial contacted &lt;24h | 100% casos | 100% | 100% | Quitar pitch N2/N3 |
| “¿Confías más en Musas que en un portal grande?” (1–5) | n≥5 avg≥3.0 | ≥3.5 | ≥4.0 | Narrativa N2 no creíble |
| Score gap vs Propiedash (Joaquín+PM) | 6 | 7 | 8 | Revisar D11/D12 |

**Anti-métricas:** # features shipped · pageviews · “parecemos Propiedash” · seed count.

---

### (6) Decisiones abiertas (este brainstorm)

| ID | Tema | Opciones | Rec PM | Estado |
|----|------|----------|--------|--------|
| **D11** | Posicionamiento 90d | A N1 · B N2 · C N3 · **D N2+N3** | **D** | Pendiente |
| **D12** | Política verify | A L0→L1 cola · B pre-publish · C solo Pref · D L2 obligatorio explore | **A** | Pendiente |
| **D13** *(nueva)* | Quién paga L2/L3 | A Musas absorbe L1 · B user Preferencial para L2+ · C fee verify aparte (no in-app) | **A+B** | Pendiente |
| D8 | Ops Preferencial | Nombre + WA | Obligatorio | Pendiente |
| D10 | WA ficha | A opt-in | **A** | Pendiente |
| D1–D6 | Defaults | OK / ajuste | Sin asumir | Deadline 2026-11-13 19:20 UTC |

---

### Riesgos

| Riesgo | Sev | Mitigación |
|--------|-----|------------|
| Prometer “verificado” sin capacidad L1 | **Crítico** | Capear volumen; badge solo tras review |
| L2 docs asusta FSBO → 0 pubs | **Mayor** | L1 default; L2 opt-in/Preferencial |
| Especialistas = directorio disfrazado | **Mayor** | Roster cerrado, marca Musas, SLA |
| Robar UX y olvidar moat → techo score 5 | **Mayor** | 50% esfuerzo D30 a verify+ops |
| Visita L3 sin Preferencial = quiebra | **Mayor** | L3 solo vía paquete fotos/acompaña |
| Prod/stock sigue rojo | **Crítico** | Moat no empieza sin G-Prod+G-Stock |

---

### Recomendación PM (orden)

1. Cerrar **D11=D** y **D12=A** (+ D13 A+B) esta semana.  
2. No pausar Semana 0 prod/stock/ops.  
3. En paralelo design/tech: badge estados + cola admin L1 (post-smoke).  
4. UX robada = habilitar comparación justa; moat = razón para quedarse.  
5. Score 8 ≠ empatar 44k; = **confianza percibida + cumplimiento Preferencial** en Caracas.

### Decisión del gate

| Pregunta | Estado |
|----------|--------|
| ¿Propiedash referente UX? | **Sí** (Joaquín) |
| ¿Moat = validación + especialistas? | **Propuesto — pendiente D11/D12** |
| ¿Aprobaciones nuevas? | **Ninguna** |

### Asks explícitos para Joaquín

1. **D11:** ¿Posicionamiento **D (N2+N3)** — “listings verificados + especialistas Musas”?  
2. **D12:** ¿Verify **A** (post-publish + L1 &lt;24h + badge)?  
3. **D13:** ¿Musas absorbe L1 gratis y L2/L3 vía Preferencial?  
4. **D8:** Nombre + WA ops (sin esto N2 es copy vacío).  
5. **D10:** ¿WA opt-in en ficha (**A**)?  
6. **Roster:** ¿Tenés 3 candidatos especialistas (foto / legal / visitas) para D60 o hay que reclutar?  
7. **Budget ops L1:** ¿OK ~USD 1–3/listing en tiempo (vos/admin) las primeras 50 pubs?  
8. **D1–D6 + floors Preferencial:** OK / ajustes antes del deadline.  
9. **Prod:** confirmar `/api/me/sync` + Clerk live — sin esto el score sigue en 3.

---

### Handoff

- **Coordinador:** refresh Oficina (INFORME-5).  
- **Design:** estados badge L0/L1/L2 + copy N2; no directorio.  
- **Tech:** modelo `verificationLevel` + cola admin (tras G-Prod).  
- **Owner:** stress-test si L1 remoto basta vs estafa VE.  
- **User:** en beta medir “¿confiarías más con badge?”.

---

## INFORME-6 — Fallo de gate: vendedor post-login sin panel (IA)

*Fecha:* 2026-11-12  
*Autor:* musas-pm  
*Gate:* Proceso — descubrimiento vendedor  
*Estado:* **Cerrado parcial** — parche «Mi panel»; gates proceso **pendientes**

### Problema

Tras login Gmail, el vendedor no encontraba **Mis inmuebles** ni **mensajes** sin URL directa o footer. Rutas y layouts existían; falló **descubrimiento** en home global.

### Dónde falló el proceso

| Rol | Fallo |
|-----|--------|
| **QA / User** | Scripts 2–6 entran por `/publicar`, `/admin`, etc.; ningún **S0** «solo desde `/` tras login». PASS = flujo técnico, no cold return. |
| **Tech** | DoD `dodHappyPath` sin fila IA global; redirect post-publicar a dashboard contó como «panel OK». |
| **Design** | Handoff Propiedash marcó **panel P0**; no hubo sign-off de nav persistente vs referente antes de cerrar UX. |
| **PM** | Fases 0–5 «completed» por features; métricas no incluían **clics hasta inventario** post-login. |
| **Owner** | Gate en prod/WA/densidad (correcto mercado); no vetó por «¿dónde está mi cosa?». |

### Por qué Propiedash no bastó

Referente usado como **lista de features** (WA, galería, wizard), no como **contrato de IA** (header → mis anuncios / inbox en ≤2 clics). Sin script de paridad login→panel, el gap no era medible.

### Recomendación (proceso)

1. **Script S0** obligatorio antes de cualquier PASS beta (`BETA_SCRIPTS.md`).  
2. **DoD IA global:** sesión `SignedIn` en marketing → panel visible (Design + Tech sign-off vs Propiedash).  
3. **Scorecard happy path:** fila «Vendedor recurrente — descubrimiento»; Owner veta reclutas si FAIL.

### Decisión

| Ítem | Estado |
|------|--------|
| Parche «Mi panel» | **Hecho** |
| S0 + DoD IA + scorecard | **Pendiente Joaquín** |

### Ask Joaquín

¿Apruebas los 3 gates como **bloqueantes** para invitar publicadores beta (además de G-Prod)?
