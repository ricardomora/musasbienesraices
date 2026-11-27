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

---

## INFORME-7 — Línea Realtors: corte lunes (validación, no rebuild)

*Fecha:* 2026-11-14  
*Autor:* musas-pm  
*Antecedente:* Fases 0–5 cableadas (explore/publicar/Q&A/Preferencial/admin); prod Semana 0 aún frágil; INFORME-5 moat = listing verify + Preferencial. **Nuevo input Joaquín:** validar línea de negocio **Realtors** el lunes sin reconstruir.  
*Estado del gate:* **ABIERTO** — sin asumir D14–D20  
*Aprobaciones nuevas asumidas:* **Ninguna**

### Veredicto PM (1 párrafo)

El producto actual ya es un **marketplace FSBO venta USD** con publicación, explore, contacto (Q&A ± WA pendiente D10), Preferencial request-only y admin ops. **No existe** cuenta Realtor, planes/suscripciones, badge “Realtor Verificado” ni cola admin de solicitudes Realtor. Para el lunes se valida la **hipótesis comercial** (¿un realtor paga/solicita Plan 1 y publica bajo marca Musas?), reutilizando el patrón Preferencial — **no** un CRM ni un segundo producto. Si se construye Plan 2, pagos, contenido educativo full o verify estricto de realtor antes de 3 solicitudes reales, se quema la ventana de lunes y se diluye el moat FSBO ya en curso.

**Tradeoff explícito:** Semana 0 (prod + stock Caracas + D8 Preferencial) sigue siendo P0 de mercado. Realtors lunes = **slice paralelo mínimo** sobre lo existente, no sustituto de G-Prod. Si prod sigue rota, la validación Realtor también es teatro.

---

### (1) Qué ya cubre el producto vs qué falta

| Capacidad pedida MVP Realtors | Estado hoy | Evidencia | Gap lunes |
|-------------------------------|------------|-----------|-----------|
| Explore / filtros / ficha venta USD | **Cubierto** (local PASS; prod frágil) | `/`, listings, `listPublished` | Mantener; no tocar |
| Publicar (mismo sistema) | **Cubierto** | Wizard + UploadThing + `publishListing` | Reusar 100%; realtor usa mismo flujo |
| Contacto comprador↔vendedor | **Parcial** | Q&A PASS código / N/A E2E; WA = D10 pendiente | Mantener; no bloquear Realtors por WA |
| Preferencial (servicios FSBO) | **Cubierto** request+admin | `preferentialRequests` + `/preferencial` + `/admin` | **Precedente** — no confundir con Plan Realtor |
| Admin gestiona solicitudes | **Cubierto** (Preferencial + pause + trust listing) | `updateStatus`, pause, `trustBadge` listing | Extender cola a **solicitudes Realtor** |
| Registro particular vs Realtor | **Falta** | `users.role` solo `user` \| `admin` | Campo `accountKind` o flag + UI registro/onboarding |
| Identificar Realtors en UI | **Falta** | Sin badge/perfil realtor | Badge en ficha/owner + filtro opcional light |
| Sección suscripciones + solicitar | **Falta** | Solo Preferencial (otro producto) | Página Plan 1 + request (clone Preferencial) |
| Admin aprueba plan / verifica realtor | **Falta** | No hay tabla ni status realtor | Cola admin + status machine |
| Realtor Verificado (concepto inicial) | **Falta** (≠ `musas_reviewed` listing) | Trust es de **listing**, no de profesional | Badge soft post-aprobación admin |
| Perfil realtor + contacto clientes | **Parcial** | `contactPhone` user; WA listing opcional | Perfil mínimo (nombre, ciudad, WA, bio corta) |
| Contenido educativo Plan 1 | **Falta** | — | **Out** lunes o 1 link externo (Notion/Drive) |
| Plan 2 | **TBD** | — | **Out** |
| CRM avanzado / pipeline leads | **Falta (bien)** | — | **Out** |
| Pagos recurrentes in-app | **No (correcto MVP)** | Preferencial = fuera de app | **Out** salvo decisión D16=pago |

**Síntesis:** ~70% del happy path marketplace ya sirve al realtor como **publicador**. El 30% faltante es **identidad + plan request + badge + admin cola** — mismo DNA que Preferencial.

---

### (2) Alcance lunes cortado (IN / OUT)

#### IN — ship mínimo validable (DoD lunes)

| # | Ítem | Criterio PASS |
|---|------|---------------|
| R1 | Onboarding: elegir **Particular** vs **Realtor** (post-signup o primer login) | Persiste en Convex; reversible solo vía admin si hace falta |
| R2 | Realtor puede **publicar** con wizard actual sin fork | Listing creado; owner marcado realtor |
| R3 | UI identifica realtor (badge “Realtor” en ficha o perfil público mínimo) | Comprador ve señal; no confunde con `musas_reviewed` |
| R4 | Página **Planes / Suscripciones**: solo **Plan 1** definido + CTA “Solicitar” | Copy beneficios Plan 1; Plan 2 = “Próximamente” o oculto |
| R5 | Solicitud Plan 1 → status `requested` (+ notas/contacto) | Fila en dashboard realtor + admin |
| R6 | Admin: listar solicitudes + cambiar status (+ marcar **Realtor Verificado** soft) | Igual UX que Preferencial status |
| R7 | Explore/contacto/compra **intactos** | Sin regress S0/scripts 1–4+6 |

#### OUT — veto PM lunes (backlog explícito)

| Out | Por qué |
|-----|---------|
| Plan 2 features / pricing | TBD; diluye mensaje |
| Pagos recurrentes / Stripe / BNC | No indispensable; Preferencial ya prueba “pago fuera” |
| CRM, pipeline, asignación leads, inbox realtor dedicado | Scope agencia; mata validación |
| Contenido educativo in-app (cursos, LMS) | 1 URL externa basta para claim Plan 1 |
| Directorio público de realtors | Copia Propiedash; choca con Preferencial cerrada |
| Verify estricto docs (cédula/RIF/colegio) gate publish | Sin ops nombrado = cola muerta; soft badge post-request |
| Fork del wizard / listing schema “solo realtor” | Rebuild disfrazado |
| Alquiler, mapa nacional, analytics vanity | Ya vetados D7 / INFORME-4–5 |
| Sustituir Preferencial por “suscripción” genérica | Dos líneas: FSBO Preferencial ≠ Realtor Plan |

#### Capacidad / dependencia

| Dependencia | Impacto lunes |
|-------------|----------------|
| Prod usable (auth+publish) **o** local invite cerrado | Sin URL real, métricas Realtor = lab |
| ≥3 realtors beta con WA | Sin reclutas, R1–R6 no validan negocio |
| D8 ops (humano &lt;24h) | Misma persona puede triage Preferencial **y** Realtor requests |

---

### (3) Decisiones de producto — Joaquín debe confirmar **antes** de construir

| ID | Problema | Opciones | Rec. PM | Bloquea build? |
|----|----------|----------|---------|----------------|
| **D14** | ¿Qué es un Realtor en MVP? | **A** `accountKind: particular\|realtor` + plan request · **B** solo solicitud sin cambiar cuenta · **C** rol Clerk separado | **A** | **Sí** |
| **D15** | Beneficios Plan 1 (scope copy) | **A** publicar + perfil + contacto + badge Verificado *post-aprobación* + link educativo externo · **B** incluir LMS in-app · **C** solo badge sin perfil | **A** | **Sí** (copy) |
| **D16** | Monetización Plan 1 lunes | **A** solicitar + “a cotizar / pago fuera” (como Preferencial) · **B** precio referencial USD/mes visible · **C** cobro in-app | **A** (o **B** si hay floor cumplible) | **Sí** comercial |
| **D17** | Relación Preferencial vs Realtor | **A** productos **separados** (FSBO servicios vs plan profesional) · **B** unificar en “Suscripciones” · **C** Preferencial solo para realtors | **A** | **Sí** (IA/nav) |
| **D18** | Realtor Verificado = ¿qué? | **A** admin marca tras request + checklist liviano (nombre comercial, WA, ciudad) · **B** docs obligatorios día 1 · **C** auto al elegir accountKind | **A** | **Sí** trust |
| **D19** | ¿Listing de realtor requiere plan aprobado para publicar? | **A** No — publica ya; plan = upgrade/badge · **B** Sí — gate pre-publish | **A** (liquidez lunes) | **Sí** |
| **D20** | Reclutas lunes | ¿Quiénes (nombres) + canal? | Obligatorio ≥3 realtors | **Sí** métricas |
| D8 | Ops &lt;24h | Nombre + WA (cubre Pref + Realtor) | Obligatorio | Pitch |
| D10 | WA ficha | A opt-in (sigue recomendado; no bloquea R1–R6) | A | No lunes Realtors |
| D11–D13 | Moat listing verify | No mezclar con Realtor Verificado | Separar copy | No |

**Regla copy:** “Realtor Verificado” ≠ “Musas revisó la propiedad” (`musas_reviewed`). Dos sellos distintos o quemamos trust.

---

### (4) Cómo reutilizar Preferencial como precedente

| Pieza Preferencial | Reuso Realtor Plan 1 |
|--------------------|----------------------|
| Catálogo estático (`preferential-packages.ts`) | `realtor-plans.ts` — **solo Plan 1** + stub Plan 2 |
| `create` → `requested` + notes + phone/email | Misma mutation shape (`realtorPlanRequests` o tabla genérica `planRequests`) |
| `myRequests` dashboard | `/dashboard/suscripciones` o sección hermana |
| `listAdmin` + `updateStatus` | Misma UX admin (tabs: Preferencial \| Realtors) |
| Status machine | Subset: `requested → reviewing → active/verified → cancelled` (no hace falta `in_progress` físico) |
| Copy “pago / activación fuera de la app” | Idéntico principio (D16=A) |
| Ops humano D8 | Misma cola humana; no automatizar |

**No hacer:** fusionar paquetes fotos/legal con Plan Realtor en una sola tabla sin discriminador — confunde métricas y pitch.

**Esfuerzo estimado (orden mag.):** S–M si clone Preferencial; L+ si se inventa CRM/perfil social/pagos.

---

### (5) Métricas de validación con Realtors reales (lunes → +7d)

| # | Métrica | Umbral lunes / 7d | Cómo medir | Señal |
|---|---------|-------------------|------------|-------|
| MR1 | Realtors onboarded (`accountKind=realtor`) | ≥3 | Convex / admin | Hay quién validar |
| MR2 | Solicitudes Plan 1 `requested` | ≥2 | Admin cola | Intención de pago/plan |
| MR3 | Time-to-request (signup→solicitar) | ≤20 min p50 | Timestamp | Fricción onboarding |
| MR4 | Listings publicados por realtors | ≥1 (≥3 ideal 7d) | owner realtor + published | Plan sin inventario = vanity |
| MR5 | Admin: `requested` → contacted/verified &lt;24h | 100% de las solicitudes | Status + nota ops | Sin esto = teatro |
| MR6 | “¿Pagarías Plan 1 fuera de app?” (1–5) | n≥3 avg ≥3.5 | Entrevista / form | Willingness to pay |
| MR7 | Confusión Preferencial vs Plan | ≤1/3 dice “es lo mismo” | Quote cualitativa | Si confunden → falló D17 |
| MR8 | Regresión marketplace | Scripts 1–4+6 no peores | QA | No romper FSBO |

**Anti-métricas:** # features Realtor shipped · página suscripciones vistas sin request · badge sin humano.

**Criterio go/no-go línea:** si MR2≥2 **y** MR5=100% **y** MR6≥3.5 → invertir en Plan 1 polish (perfil, educativo). Si MR2=0 con ≥3 onboarded → problema de oferta/precio/copy, no de CRM.

---

### (6) Riesgos de negocio si se sobre-construye

| Riesgo | Sev | Efecto | Mitigación |
|--------|-----|--------|------------|
| Rebuild “portal de agentes” | **Crítico** | Pierde lunes; FSBO sin cuidado | Clone Preferencial only |
| Pagos recurrentes día 1 | **Mayor** | Compliance + scope; 0 users que paguen aún | D16=A fuera de app |
| Mezclar Realtor Verificado con listing verified | **Mayor** | Trust claim mentiroso vs Propiedash | Copy + badges separados |
| Gate publish solo con plan (D19=B) | **Mayor** | 0 inventario realtor en beta | D19=A |
| Directorio / CRM | **Mayor** | Ops infinito; Propiedash peor | Veto OUT |
| Educativo LMS | **Medio** | Semanas de contenido sin WTP medido | 1 link externo |
| Abandonar G-Prod / D8 por features Realtor | **Crítico** | Validación en lab vacío | Prod+ops siguen P0 |
| Canibalizar Preferencial FSBO | **Medio** | Mensaje confuso | D17=A nav separada |

---

### Recomendación PM (orden)

1. **Hoy:** Joaquín cierra **D14–D20** (tabla §3) en un mensaje.  
2. **Tech:** clone Preferencial → Plan Realtor + `accountKind` + badge soft; **cero** pagos/CRM.  
3. **Design:** 1 página suscripciones + badge + onboarding 2 opciones; no landing nueva.  
4. **Ops:** D8 cubre Pref + Realtor.  
5. **Lunes:** 3 realtors reales corren MR1–MR6; QA vigila MR8.  
6. **No** pausar G-Prod: sin dominio usable, Realtors no valida negocio.

### Decisión del gate

| Pregunta | Estado |
|----------|--------|
| ¿Rebuild marketplace? | **No** |
| ¿Línea Realtors = clone Preferencial + identidad? | **Propuesto** |
| ¿D14–D20 aprobadas? | **D14–D19 = A** (Joaquín 2026-11-14 «si arranca con eso»). **D20/D8** ops siguen pendientes. |
| ¿Aprobaciones nuevas asumidas? | Solo D14–D19=A |

### Asks residuales (ops)

1. **D20:** Nombres de ≥3 realtors + fecha/hora sesión lunes.  
2. **D8:** Nombre + WA ops (Preferencial + Realtor &lt;24h).  
3. **Prioridad prod:** redeploy + seed sigue P0 en paralelo.

### Handoff

- **Tech:** **SHIPPED** slice D14–D19 (accountKind, `/suscripciones`, admin cola, Verificado soft).  
- **Design:** review copy Plan 1 + badges.  
- **Owner:** stress-test Verificado vs Musas Revisado.  
- **User/QA:** scripts R1–R7 + MR8 con realtors reales (D20).

---

## INFORME-OWNER-5 — Triage feedback beta (asesores + particular)

*Fecha:* 2026-11-25  
*Autor:* musas-owner  
*Input:* Feedback Jimena · Gustavo · Matías · Elaine · Javier (particular) · Robert  
*Lente:* Happy path producción = **publicar → Preferencial (pagar fuera) → contacto → confiar**. Todo lo demás pelea por oxígeno.

### Veredicto (sin filtro)

El feedback mezcla **dolor real de marketplace VE** con **vanity de portal grande** y **features que matan el MVP**.  
**Vale dinero / producción:** contacto en ficha, borrar/pausar mi publicación, clarificar quién es quién (particular/asesor/Musas), aceptación de políticas al pedir plan, share sin filtrar teléfono, comprobante Preferencial (ops, no pasarela), y **no fingir pasarela**.  
**Ruido / prematuro:** team page, Instagram+ads paid como producto, Idealista crédito/financiamiento, pixel ads sin tráfico, “cobrar menos que competencia” sin oferta definida, subir límite fotos (ya 12), persistencia upload background fancy.

**Jimena no pudo probar pasarela = señal correcta del producto, no un bug.** Preferencial = pago fuera. Si le prometimos “pasarela”, el PM mintió.

### Score happy path (contexto vivo)

| # | Criterio | Estado | Nota vs feedback |
|---|----------|--------|------------------|
| 1 | Ver venta USD | Local PASS / prod frágil | Sin stock real, ningún “$20 vs Rex” importa |
| 2 | Publicar + fotos | PASS local; UT `maxFileCount: 12` | Pedido “más fotos” = **ruido** hasta que midamos ≥6 usados |
| 3 | Contacto en ficha | **WA opt-in ya en wizard/ficha** | Jimena/Robert: validar descubrimiento + copy, no rebuild |
| 4 | Preferencial + pagar | Form OK; **sin pasarela (correcto)**; D8 ops vacío | Gustavo = email/comprobante **ops**; no Stripe |
| 5 | Confiar / control dueño | Pause admin sí; **borrar dueño = gap** | Javier = P0 UX dueño |
| 6 | Identidad 3 tipos | Realtor slice shipped; copy confusa | Robert: onboarding copy, no página “equipo” |

---

### Triage ítem por ítem

| # | Quién | Pedido | Valor mercado | Pri | Veredicto owner |
|---|-------|--------|---------------|-----|-----------------|
| 1 | Jimena | Ficha con contacto | **Crítico** (hábito VE) | **P0** | **SHIP / verificar** — `contactWhatsapp` + CTA ya existen. Si “no lo vio”, es discoverability/copy, no feature nueva. |
| 2 | Javier | Botón solicitud **borrar** publicación | **Alto** (control FSBO = trust) | **P0** | **HACER** — soft-delete o “solicitar baja” + pause inmediato. Sin esto el dueño siente rehén. |
| 3 | Robert | Clarificar 3 tipos (particular / asesor / Musas) | **Alto** (evita confusión Preferencial vs Plan Realtor) | **P0** | **HACER copy** en onboarding + nav. No landing educativa. |
| 4 | Robert | Aceptación políticas al suscribirse | **Alto** pre-apertura / Plan Realtor | **P0** | **HACER** checkbox T&C al request Plan/Preferencial. Bloquea litigio, no vanity. |
| 5 | Gustavo | Comprobante de pago por correo | **Medio-alto** (confianza post-pago fuera) | **P1** | **OPS primero** — plantilla WA/email manual al confirmar pago Preferencial/Plan. Resend automático = después. **No** pasarela. |
| 6 | Robert | Compartir inmueble **sin** datos de contacto | **Medio-alto** (viral WA grupos sin doxxear) | **P1** | **HACER** — share ya manda título+precio+URL; auditar que **no** meta teléfono en el texto. Toggle “ocultar WA en share” si hace falta. |
| 7 | Robert | Qué significa WhatsApp grupo | **Medio** (expectativa ops) | **P1** | **COPY** 1 frase en onboarding/beta: canal soporte/invites, no MLS ni leads. Si no hay grupo real → **quitar mención**. |
| 8 | Robert | Botón Publicar más grande junto a Explorar | **Medio** (descubrimiento vendedor) | **P1** | **HACER** micro-IA (INFORME-6 alineado). No rediseño home. |
| 9 | Robert | $20 competitivo vs Rex/Wasi | **Comercial** | **P1 decisión** | **NO bajar por vanidad.** $20 solo si Plan Realtor entrega badge+perfil+prioridad ops. Si es “listar gratis + $20 por nada”, somos Rex peor. Decisión Joaquín: precio Plan 1 vs Preferencial floors. |
| 10 | Jimena | Subir límite fotos | **Bajo** hoy | **P2 / no** | Límite UploadThing = **12**. Pedido prematuro. Empujar **≥3–6 usados**, no techo. |
| 11 | Jimena | No pudo probar pasarela | **N/A — correcto** | — | **NO construir pasarela.** Educar: pago fuera + comprobante (fila 5). |
| 12 | Jimena | Instagram + publicidad paga extra | **Prematuro** | **Veto W0–W2** | Sin density Caracas, ads queman plata. Pixel (fila 16) tampoco. |
| 13 | Matías | Cobrar menos que competencia | **Ruido estratégico** | **Veto precio por miedo** | Competir en **verified + Preferencial humano**, no en race-to-bottom vs Wasi/Rex. Precio bajo sin ops = teatro. |
| 14 | Matías | Persistencia carga en background | **Nice / mid** | **P2** | Solo si uploads fallan en 3G VE medido. No inventar service worker ahora. |
| 15 | Matías | Idealista-style crédito/financiamiento | **Vanity mortal** | **VETO** | Bancos VE/USD ≠ Idealista ES. Cero partnerships. Diluye marca venta FSBO. |
| 16 | Robert | Pixel tracking ads | **Prematuro** | **Veto hasta tráfico pago** | Sin campaña activa = privacidad risk + noise. Meta pixel post-primera ad real. |
| 17 | Robert | Ficha del equipo Musas | **Vanity** | **Veto** | Trust se gana con listings revisados + ops &lt;24h, no con “About us”. Roster Preferencial = privado. |
| 18 | Elaine | Todo bien | Señal | — | No diluir scope porque “alguien más pidió features”. |

---

### Orden de importancia (producción)

```
P0  Contacto ficha usable (verify Jimena) → Borrar/baja listing (Javier)
    → Copy 3 tipos usuario → Checkbox políticas en request plan/Preferencial
P1  Comprobante pago ops (Gustavo) → Share limpio sin teléfono → Copy WA grupo
    → Publicar más visible → Decisión precio Plan ($20?) con oferta real
P2  Fotos límite (solo si data) · upload background si falla red
VETO Pasarela · financiamiento bancario · team page · ads/IG paid · pixel sin campaña
     · “cobrar menos” como estrategia · directorio / Idealista cosplay
```

### Preguntas duras al PM

1. **¿Le dijimos a Jimena que había pasarela?** Si sí, corrige el pitch YA. Preferencial/Plan = pago fuera + ops.  
2. **¿D8 tiene nombre?** Sin humano, comprobante de Gustavo y “$20 vs Rex” son humo.  
3. **¿Plan Realtor a $20 incluye qué en 1 línea?** Si no cabe en una línea, no cobres $20.  
4. **¿El grupo WA existe y tiene dueño?** Si no, bórralo del copy esta semana.  
5. **¿Por qué Matías pide financiamiento?** ¿Lo prometimos en demo o es reflejo Idealista? Owner veta scope.  
6. **Contacto en ficha:** ¿Jimena falló por bug, por listing sin WA opt-in, o por build viejo en prod? Evidencia antes de “reconstruir ficha”.

### Esta semana vs backlog

| Ship esta semana (si hay capacidad post G-Prod) | Backlog / veto |
|------------------------------------------------|----------------|
| Verify CTA WA en ficha prod | Pasarela / Stripe / BNC |
| Botón baja/borrar (o pause dueño + request) | Financiamiento / crédito Idealista |
| Copy 3 tipos + checkbox T&C en requests | Team page / About Musas |
| Playbook comprobante Preferencial (WA/email manual) | IG ads + pixel |
| Share audit sin teléfono; Publicar más visible | Subir max fotos >12 |
| Decisión precio Plan 1 (¿$20 con qué bundle?) | Background upload fancy |

### Decisiones pedidas a Joaquín / PM

- [ ] **D21 (nueva):** Baja de publicación — **A** soft-delete dueño · **B** pause + “solicitar eliminación” admin · **C** solo admin. **Owner: B** (rápido + audit trail).  
- [ ] **D22 (nueva):** Precio Plan Realtor — ¿**$20/mes referencial** con bundle X, o “a cotizar” como Preferencial? No race vs Rex sin oferta.  
- [ ] Confirmar pitch beta: **sin pasarela**; pago fuera + comprobante ops.  
- [ ] D8 ops nombrado (sigue blocker).  
- [ ] ¿Grupo WA beta existe? Sí con dueño / No → quitar copy.

### Asks con severidad

| Ask | Para | Sev |
|-----|------|-----|
| Auditar ficha WA en prod (repro Jimena) | tech + user | **P0** |
| Ship baja/borrar listing (D21) | tech | **P0** |
| Copy 3 tipos + políticas checkbox | design + tech | **P0** |
| Playbook comprobante pago Preferencial/Plan | PM / ops | **P1** |
| Share sin contacto + Publicar visible | design + tech | **P1** |
| Decidir D22 precio Plan vs Preferencial floors | Joaquín | **P1 comercial** |
| Veto financiamiento / team / ads / pasarela | PM | **scope** |

### Handoff

- **PM:** no metas Idealista/financiamiento ni pasarela en roadmap; cierra D21/D22 con Joaquín; corrige expectativa “pasarela” con beta.  
- **Tech:** P0 = baja listing + audit WA/share; no max fotos; no pixel.  
- **Design:** copy 3 tipos + políticas + WA grupo (o borrar mención); Publicar más visible.  
- **User:** repro Jimena contacto; script Javier borrar; no marcar PASS pasarela.  
- **Coordinador:** refresh Oficina — INFORME-OWNER-5.

---

## INFORME-8 — Triage feedback beta (asesores + particular)

*Fecha:* 2026-11-25  
*Autor:* musas-pm  
*Input:* 6 beta testers (Jimena, Gustavo, Matias, Elaine, Javier, Robert)  
*Contexto precio:* Preferencial / plan ~**USD 20** vs Rex **37** / Wasi **60** (señal Robert)  
*Estado del gate:* **ABIERTO** — sin asumir D21–D23; no expandir a pasarela in-app ni crédito Idealista  
*Aprobaciones nuevas asumidas:* **Ninguna**

### Veredicto PM (1 párrafo)

El feedback confirma **precio competitivo a ~$20** y pide **fricción de publicación + contacto + claridad de audiencia**, no un portal de crédito ni ads internacionales. Ship esta semana = quick wins de contacto/copy/CTA publicar + borrado + (si cabe) más fotos; **no** pasarela, pixel vanity, ficha “quiénes son las Musas”, ni financiamiento tipo Idealista. Comprobante por correo = ops (fuera de app), alineado a “pago fuera”. Persistencia de upload = bug P0 de happy path publicar.

---

### (1) Lista priorizada (orden importancia)

| # | Ítem | Fuente | Veredicto | Por qué | Tipo |
|---|------|--------|-----------|---------|------|
| 1 | Carga que se cae / background persistence (llamada o bloquear teléfono) | Matias | **ALTO** | Rompe happy path **publicar+foto**; asesores pierden tiempo → churn a Wasi/Rex | **Epic** (tech mobile/UT) |
| 2 | Ficha con número de contacto | Jimena | **ALTO** | Hábito VE = WA/tel; alinea **D10**; sin contacto la ficha no convierte | **Quick win** si campo existe; si no → cierra D10=A |
| 3 | CTA **Publicar** más grande, junto a Explorar | Robert | **ALTO** | Fuente de inventario (= ingreso Preferencial/Realtor); discovery post-login ya falló (INFORME-6) | **Quick win** UX |
| 4 | Clarificar audiencia: particulares + asesores + Musas (no solo asesores) | Robert | **ALTO** | Confusión de quién puede publicar = menos supply FSBO; copy onboarding/suscripciones | **Quick win** copy |
| 5 | Clarificar “Whatsapp grupo” (qué significa) | Robert | **ALTO** | Friction de confianza/copy; si nadie entiende el CTA, no hay acción | **Quick win** copy |
| 6 | Botón solicitud para **borrar** publicación | Javier (particular) | **MEDIO→ALTO** | Trust + ownership; sin delete el particular no controla su anuncio (riesgo reputación) | **Quick win** (request+admin) o soft delete owner |
| 7 | Aumentar límite de fotos | Jimena | **MEDIO** | Calidad de ficha (Owner: ≥3–6 fotos); no es moat pero desbloquea listings que venden | **Quick win** config + hint |
| 8 | Aceptación de políticas al suscribirse | Robert | **MEDIO** | Trust / pre-apertura (D9 T&C); no bloquea beta cerrada si invite-only | **Quick win** checkbox + link T&C v0 |
| 9 | Asesores compartan inmuebles **sin** datos de contacto | Robert | **MEDIO** | Privacy lead para realtor; útil línea Realtors; no bloquea FSBO | **Epic** light (flag hideContact + share) |
| 10 | Comprobante de pago por correo | Gustavo | **MEDIO** | Señal de que **pagan fuera** y esperan recibo; **no** construir pasarela — ops email/WA | **Ops** (manual o Resend) |
| 11 | No pudo probar pasarela de pago | Jimena | **MEDIO (señal)** / **DESCARTAR build** | Expectativa de cobro in-app; MVP = pago fuera. Fix = copy + flujo ops, **no** gateway | **Copy/ops** · **no** epic pagos |
| 12 | $20 competitivo vs Rex/Wasi | Robert (+ Matias “cobrar menos”) | **ALTO valor comercial** / **BAJO feature** | Validación de precio Preferencial/plan; no bajar más sin datos de conversión | **Pricing hold** |
| 13 | Pixel ads (asesores por publicidad) | Robert | **BAJO** | Útil solo si ya hay campañas activas; sin tráfico ads = vanity | **Diferir** hasta ads reales |
| 14 | Instagram bidireccional + publicidad paga internacional | Jimena | **BAJO / DESCARTAR producto** | Marketing growth, no MVP marketplace; diluye Semana 0 | **Diferir** marketing |
| 15 | Ficha “quiénes componen las Musas” | Robert | **BAJO** | Brand vanity; Owner vetó polish sin density | **Diferir** post-stock |
| 16 | Enfoque “cobrar menos que competencia” como estrategia | Matias | **BAJO como roadmap** | Ya estamos ~$20 vs 37/60; guerra de precios sin density = race to bottom | **Hold precio** |
| 17 | Crédito/financiamiento tipo Idealista | Matias | **DESCARTAR / diferir** | Epic bancario; fuera de happy path; cero ops Musas para bancos | **Backlog v2+** |
| 18 | “Todo bien” | Elaine | **Señal positiva** | No pide features; ancla NPS soft | — |

**Regla PM:** no inventar features no pedidas. No pasarela in-app. No Idealista crédito. No directorio Musas team.

---

### (2) Top 5 acciones esta semana (Joaquín)

| # | Acción | Dueño | Por qué esta semana |
|---|--------|-------|---------------------|
| 1 | **Bug P0:** diagnosticar/fallar-safe upload cuando app va a background (Matias) | Tech | Sin publicar estable no hay beta útil |
| 2 | **Ship contacto en ficha** (tel/WA visible) — cierra o ejecuta **D10=A** | Tech + Design | Pedido #1 Jimena; hábito VE |
| 3 | **UX discovery:** Publicar grande + Explorar; copy audiencia particular/asesor/Musa; renombrar/explicar “Whatsapp grupo” | Design + Tech | 3 quick wins Robert; inventario + claridad |
| 4 | **Borrar/solicitar baja** de publicación (Javier) + ops admin | Tech | Trust particular; bajo esfuerzo vs epic |
| 5 | **Ops Preferencial pago fuera:** checklist comprobante email/WA (Gustavo) + copy “no hay pasarela in-app” (Jimena) — **sin** construir gateway | Joaquín / ops (D8) | Cierra expectativa de pago sin scope creep |

*Paralelo si cabe:* subir límite fotos (Jimena). *No esta semana:* Idealista crédito, pixel, IG internacional, ficha equipo Musas.

---

### (3) Señales de validación de precio Preferencial ~$20

| Señal | Lectura PM |
|-------|------------|
| Robert: “$20 es competitivo” vs Rex 37 / Wasi 60 | **Validación cualitativa fuerte** — no pedir bajar precio |
| Matias: “enfoque en cobrar menos” | Confirma sensibilidad a precio; **ya estamos debajo**; no es pedido de feature |
| Jimena: no pudo probar pasarela | Quiere **pagar/activar**, no necesariamente precio más bajo — gap = **flujo de pago claro fuera de app** |
| Gustavo: comprobante por correo | Implica **intención de pago real** + necesidad de recibo ops |
| Elaine: todo bien | No objeta precio |
| Nadie dijo “$20 es caro” | Ausencia de objeción de precio en 6 testers = **hold $20** |

**Recomendación pricing:** mantener **~$20** Preferencial/plan. No bajar. No subir hasta ≥3 conversiones reales + ops &lt;24h. Paquetes servicio (fotos 120 / acompañamiento 150 / legal 200) = línea distinta; no mezclar con el $20 en pitch.

**Métricas W+1 (feedback loop):**

| Métrica | Umbral |
|---------|--------|
| Upload publish sin drop (móvil) | 0 reportes “se cayó” en 5 pubs |
| % fichas beta con tel/WA visible | ≥70% |
| Time-to-find Publicar post-login | ≤2 taps |
| Solicitudes baja listing | Respondidas &lt;24h |
| Preferencial/plan: pago fuera + comprobante enviado | 100% de pagos reportados |
| Objeción precio espontánea | Track; si 0 en n≥10 → hold $20 |

---

### Decisiones nuevas (no asumir)

| ID | Tema | Opciones | Rec PM | Estado |
|----|------|----------|--------|--------|
| **D21** | Contacto en ficha | **A** WA/tel opt-in visible (D10) · B solo Q&A | **A** | Pendiente (= cierra D10) |
| **D22** | Borrado listing | **A** owner soft-delete · **B** solicitud → admin · C ambos | **C** (owner delete + admin audit) | Pendiente |
| **D23** | Persistencia upload | **A** fix P0 esta semana · B defer | **A** | Pendiente |
| — | Pasarela in-app | — | **Veto** MVP | Confirmado por defaults |
| — | Precio ~$20 | Hold / bajar / subir | **Hold** | Pendiente OK Joaquín |

### Asks explícitos para Joaquín

1. **¿Apruebas Top 5 de esta semana** (upload P0 → contacto → CTA/copy → borrado → ops comprobante)?  
2. **D21/D10:** ¿WA/tel en ficha **sí** esta semana?  
3. **D22:** ¿Owner puede borrar o solo “solicitar baja”? Rec: **ambos**.  
4. **Precio:** ¿confirmas **hold $20** Preferencial/plan vs Rex/Wasi?  
5. **¿Hay campañas ads activas?** Si no → pixel = diferir.  
6. **D8:** ¿quién envía el comprobante hoy cuando alguien paga fuera?

### Handoff

- **Coordinador:** refresh Oficina (INFORME-8).  
- **Tech:** D23 upload + D21 contacto + CTA Publicar + D22 delete.  
- **Ops/Joaquín:** playbook comprobante (Gustavo).  
- **Owner:** veto Idealista crédito / pasarela / ficha equipo esta semana.  
- **Design:** copy audiencia + “Whatsapp grupo” + tamaño CTA.

---

## INFORME-OWNER-5b — Challenge a INFORME-8 (no rubber-stamp)

*Fecha:* 2026-11-25  
*Autor:* musas-owner  
*Antecedente:* INFORME-8 (PM) + INFORME-OWNER-5 (triage propio)

### Acuerdo con PM

- Veto **pasarela / Idealista crédito / pixel sin ads / team page / IG paid**: **OK**.  
- Hold **no bajar precio por miedo**: **OK**.  
- Borrado listing + contacto + copy 3 tipos + comprobante ops: **en el happy path**: **OK**.  
- Jimena “no pudo probar pasarela” = copy/ops, no gateway: **OK**.

### Objeciones (PM no asuma Top5 tal cual)

| # | Objeción | Sev |
|---|----------|-----|
| 1 | **D23 upload background como acción #1 P0** sin repro QA (script interrupt + tasa de fallo). Un quote de Matías ≠ epic UT/móvil antes de trust/contacto. Si 1/20 pubs cae → P1; si 5/5 asesores lo reproducen → P0. | **Crítico** |
| 2 | **Contacto ficha tratado como “ship D10”**. Código ya tiene `contactWhatsapp` + CTA en ficha/wizard (`maxFileCount: 12`). Primero **repro Jimena** (¿no opt-in? ¿prod vieja? ¿UI invisible?). Rebuild = vanity. | **Crítico** |
| 3 | **“Subir límite fotos” = MEDIO en INFORME-8**. Owner: **ruido**. Techo ya 12. Empujar uso ≥3–6, no ticket maxFileCount. | **Mayor** |
| 4 | **Mezclar $20 Preferencial con Plan Realtor / paquetes 120–200**. Robert habla competitividad portal (~Rex/Wasi). Preferencial fotos/legal ≠ fee $20. Hold $20 solo del **Plan Realtor** (o fee listing si existe); no reescribir floors Preferencial. | **Mayor** |
| 5 | **Borrado Javier debajo de CTA Publicar / WA grupo**. Control del dueño sobre su anuncio = trust FSBO. Owner: borrado **≥** Publicar grande. | **Mayor** |
| 6 | **Políticas al suscribirse = MEDIO**. Pre-apertura Plan/Preferencial: checkbox T&C es P0 legal-light, no “si cabe”. | **Medio** |
| 7 | **Share sin contacto diferido post-Top5**. Auditar texto share (ya manda título+precio+URL) es 30 min — no epic. | **Menor** |

### Top 5 Owner (reemplaza orden PM si chocan)

| # | Acción | vs INFORME-8 |
|---|--------|--------------|
| 1 | **Repro + fix contacto ficha** (no rebuild si ya existe) | Sube; deja de ser “cerrar D10 ciego” |
| 2 | **Baja/borrar listing (D22)** — rec Owner: pause + request admin **o** soft-delete + audit | Sube vs CTA |
| 3 | **Copy 3 tipos + checkbox políticas** en request Plan/Preferencial | Políticas suben a P0 |
| 4 | **Ops comprobante** (Gustavo) + copy “pago fuera / sin pasarela” + **D8 nombre** | Igual; sin D8 = teatro |
| 5 | **Publicar más visible + clarificar WA grupo** (o borrar mención) | Baja un puesto vs PM |

**D23 upload:** entra al Top5 **solo** si User/QA reproduce drop al bloquear pantalla en ≥2 dispositivos. Si no → cola P1.

**Fuera del Top5 Owner:** límite fotos · pixel · team · Idealista · pasarela · “cobrar menos” como feature.

### Veredicto sobre recs PM (IDs INFORME-8)

| ID | Rec PM | Owner | Condición |
|----|--------|-------|-----------|
| D21 contacto | A | **Aprobar condicional** | Repro primero; ship solo si gap real |
| D22 borrado | C ambos | **Aprobar** (B o C OK) | Pause inmediato mínimo |
| D23 upload | A P0 esta semana | **Aprobar solo con repro** | Sin repro → B defer / P1 |
| Hold $20 | Hold Preferencial/plan | **Hold Plan Realtor $20**; no tocar floors Preferencial 120/150/200 sin datos | Separar líneas en copy |
| Veto pasarela/Idealista/team/pixel | Veto | **Aprobar** | — |

### Preguntas duras al PM

1. ¿Mediste fallo de upload o solo anotaste el quote?  
2. ¿Jimena vio ficha **sin** WA porque el listing no tenía opt-in?  
3. ¿El “$20” que defiendes es Plan Realtor o estás baratizando Preferencial fotos?  
4. ¿D8 tiene nombre esta semana o el “comprobante Gustavo” es slideware?

### Decisión pedida a Joaquín

- [ ] Top5 **Owner** (arriba) vs Top5 PM — ¿cuál apruebas?  
- [ ] D23: ¿QA repro antes de epic, o forzar P0? (**Owner: repro primero**)  
- [ ] Hold $20 = **Plan Realtor**; Preferencial paquetes intactos — ¿OK?  
- [ ] D8 + playbook comprobante

### Handoff

- **PM:** no ship D23 ni “más fotos” sin evidencia; separa precio Plan vs Preferencial.  
- **Tech:** P0 = audit WA + D22 baja; D23 solo post-repro.  
- **User/QA:** script interrupt upload + repro Jimena contacto.  
- **Design:** 3 tipos + políticas + Publicar; no team page.  
- **Coordinador:** refresh Oficina — OWNER-5 + 5b vs INFORME-8.

---

## INFORME-9 — Publish-first y tag «por revisar»

*Fecha:* 2026-11-26  
*Autor:* musas-pm  
*Gate:* Comercial — happy path publicar (D2 / D12)

### Problema

¿Mostrar inmuebles **no validados** en explore con tag público **«por revisar»** es aceptable si el wizard ya dice que la ficha es visible al instante y **Musas Revisado** llega después?

### Impacto

| Dimensión | A publish-first (sin tag negativo público) | B pre-publish | C hybrid (público + orden/filtro) |
|-----------|---------------------------------------------|---------------|-----------------------------------|
| **Supply** | Máximo — asesor ve su anuncio vivo al clic (crítico vs Rex/Wasi) | Alto churn beta; ≥3 publicadores en riesgo | Bueno si no penaliza ranking de forma agresiva |
| **Trust comprador** | OK si solo hay sello **positivo** (Musas Revisado); sin «por revisar» en card | Máximo pero inventario vacío | Mejor discoverability de verificados |
| **Ops** | Cola admin «por revisar» (ya existe) — **condicionado D8 &lt;24h** | Cuello de botella sin revisor nombrado | Medio: reglas sort + SLA |

### Opciones

- **A** — Publish-first: visible al publicar; badge solo **Musas Revisado**; «por revisar» solo admin / panel vendedor.
- **B** — Review obligatorio antes de `published`.
- **C** — Público inmediato pero sin tag negativo; default explore = sort **Revisados primero** + filtro «Musas Revisado» (ya parcial en código).

### Recomendación PM

**A + micro-C (sin tag «por revisar» al comprador).**

- Confirma **D2=A** y **D12=L0→L1** (cola ops, no gate).
- **No** poner «por revisar» en grid/ficha pública: en VE se lee como «no confíes» y erosiona antes que el moat **Musas Revisado**.
- En explore/cards: mantener **«Ficha publicada»** o silencio; reservar «por revisar» al dashboard admin y mensaje al vendedor post-publish.
- **C** solo como producto: ordenar/boost revisados + filtro validados — sin ocultar ni degradar título del no revisado.

### Copy si mantiene A (ajustes mínimos)

**Wizard (paso final)** — sustituir/ampliar el pie actual:

> «Al publicar, tu ficha queda visible de inmediato. **Musas Revisado** es un sello que aplica el equipo cuando revisa datos y fotos (no es certificación legal). Objetivo: en menos de 24 h hábiles. Mientras tanto, los compradores igual pueden preguntarte. ¿Fotos o acompañamiento? Preferencial.»

**Explore** — no añadir «por revisar»; opcional tooltip en filtro «Musas Revisado»: «Anuncios que el equipo ya revisó.»

**Ayuda** — una línea: publicar ≠ revisado; reportar ficha desde detalle.

### Riesgo

Sin **D8** nombrado, prometer revisión en 24h es teatro → acotar copy a «cuando el equipo lo revise» hasta tener ops.

### Decisión

- **D24 — Tag «por revisar» público:** **Pendiente** — PM recomienda **rechazar** en superficie comprador; **Aprobada implícita publish-first** salvo objeción.
- **Joaquín:** ¿Confirmas **A + no tag negativo** y activamos sort/filtro revisados como **C** en explore?

---

## INFORME-OWNER-6 — ¿Publish-first visible con «revisión pendiente»?

*Fecha:* 2026-11-26  
*Autor:* musas-owner  
*Antecedente:* INFORME-9 (PM); D2=A · D12=A condicional · D19=A; copy wizard + ficha en código.

### Respuesta directa a Joaquín

| Pregunta | Veredicto |
|----------|-----------|
| **1) ¿Es seguro/aceptable mostrar al instante sin validación previa?** | **Sí — aceptable y obligatorio en cold start.** No es “seguro” en sentido legal si vendes la marca como “todo verificado”; **sí** es aceptable si el único sello de confianza positivo es **Musas Revisado** (admin) y el resto es publicación del anunciante con disclaimer. Alineado con D2/D19 ya aprobados. |
| **2) ¿Gate pre-publish?** | **No** sin ops 24/7 — mata liquidez y repite error #5 INFORME-OWNER-4. |
| **3) ¿Híbrido?** | **Sí — publish-first + orden/filtro revisados**, no ocultar ni `under_review` masivo. |

### Evidencia en producto (auditable)

| Superficie | Comportamiento hoy | Owner |
|------------|-------------------|-------|
| `publishListing` | `published` + `trustBadge: none` | OK publish-first |
| Ficha detalle | «Publicado · revisión Musas pendiente» si no `musas_reviewed` | **OK — honesto** |
| Grid explore | «Ficha publicada» + ✓ sin distinción | **FAIL suave** — parece validado |
| Filtro | `verifiedOnly` → solo `musas_reviewed` | OK moat |
| Admin | cola «por revisar» + pause + reportes | OK si D8 existe |
| Wizard | visible inmediato; Musas Revisado después | OK |

**Objeción al PM (INFORME-9):** quitar «por revisar» al comprador y dejar «Ficha publicada» con check es **peor** que la ficha: en VE, silencio = confianza falsa. Si pitch N2 (listings reales), el comprador debe ver **ausencia de sello**, no un check verde.

### Riesgos reales VE (no teóricos)

| Riesgo | Por qué duele | Mitigación mínima |
|--------|---------------|-------------------|
| Precio señuelo USD / anticipo WA | Estafa clásica; 1 caso quema marca | Reporte + pause admin; bandas precio Caracas; **nunca** badge sin humano |
| Fotos robadas / pin falso | Bait-and-switch visita | Checklist publish + cola L1; Preferencial fotos |
| Spam competidor / basura | Ruido explore | Pause; no pre-publish global |
| Confundir con Propiedash | Ellos verifican **agente**, no inmueble | Copy: Musas Revisado = revisión ficha, no certificación legal/título |
| «Verificado» en marketing sin stock L1 | Publicidad engañosa VE | Beta cerrada; sin ads «validados» hasta ≥5 L1 + T&C v0 |
| Promesa «&lt;24h» sin D8 | Teatro ops | Copy: «cuando el equipo revise» hasta nombrar revisor |

**Publish-first no inventa estos riesgos** — Propiedash/Rex ya tienen basura visible. El riesgo Musas es **mentir** que revisaste cuando no.

### Pass/fail happy path (moderación)

| Paso | Pass? | Nota |
|------|-------|------|
| Vendedor publica → ve ficha live | **Pass** | Liquidez |
| Comprador distingue revisado vs no | **Parcial** | Detalle sí; grid no |
| Admin pause &lt;24h ante reporte | **Condicional D8** | Sin nombre = fail ops |
| Badge solo post-admin | **Pass** | `setTrustBadge` |
| Moat marketing honesto | **Pass** si no vendes N2 público aún | |

### Recomendación dura (Owner)

**Mantener publish-first. Veto pre-publish. Híbrido C sin ocultar.**

1. **No cambiar** a cola `under_review` antes de explore — confirma **D2=A**.  
2. **Mantener** en ficha pública la línea de revisión pendiente (o renombrar a «Sin sello Musas Revisado» — mismo significado, menos alarmista que «no confíes»).  
3. **Corregir grid:** quitar ✓ «Ficha publicada» en no revisados; alinear con detalle (misma micro-etiqueta neutra).  
4. **Ship micro-C:** sort explore **Musas Revisado primero**; filtro ya existe — default «Todos» pero filtro visible arriba. **No** enterrar no-revisados en página 4 (demotion agresiva = supply churn).  
5. **Admin:** SLA pause/reporte manual; L1 badge solo con checklist 5–10 min.  
6. **Copy wizard:** PM propuesta INFORME-9 OK salvo **no prometer 24h** hasta D8.  
7. **Marketing Joaquín:** puedes decir «revisamos fichas y ponemos Musas Revisado» — **no** «todo lo publicado está verificado».

### Decisión pedida

| ID | Decisión Owner | Joaquín |
|----|----------------|---------|
| **D24** | Publish-first + etiqueta honesta comprador (detalle + grid alineados); **rechazar** ocultar pendiente | [ ] Confirmo |
| **D2 / D12** | Sin cambio — post-publish + cola L1 | [ ] Confirmo |
| Pre-publish | **Veto** | — |

### Esta semana vs backlog

| Esta semana | Backlog |
|-------------|---------|
| Alinear grid con etiqueta pendiente / quitar ✓ engañoso | Pre-publish masivo |
| Sort revisados primero | Auto-reject ML |
| D8 nombre + playbook pause/reporte | Certificación legal L2 |

### Preguntas al PM

1. ¿Por qué INFORME-9 pide quitar «por revisar» si la ficha **ya** lo muestra? ¿O corregimos código?  
2. ¿Quién revisa la cola esta semana (nombre)? Sin eso L1 es backlog, no moat.

### Handoff

- **PM:** cerrar **D24** con Owner (no tag negativo ≠ ocultar estado).  
- **Design:** microcopy neutro «Sin sello Musas Revisado» vs «por revisar».  
- **Tech:** sort revisados + grid parity con `convex-listing-detail`.  
- **Coordinador:** refresh Oficina — INFORME-OWNER-6 vs INFORME-9.

---

## INFORME-10 — D25 Preferencial fuera del nav dashboard (por inmueble)

*Fecha:* 2026-11-26  
*Autor:* musas-pm  
*Gate:* UX vendedor — alineación modelo comercial (upsell por ficha)  
*Estado:* **Pendiente Joaquín**

### Problema

Hoy **Preferencial** aparece como ítem global en `DashboardNav` (`/dashboard/preferencial`) junto a Mis inmuebles / Cuenta. El servicio (fotos, legal, acompañamiento) es **por inmueble**: el realtor puede activarlo en una ficha y no en otra. El nav global sugiere un “producto de cuenta”, mezcla con **Suscripciones Realtor** (D17 = productos separados) y el formulario público `/preferencial` no obliga contexto de ficha (`listingId` opcional en schema).

### Opciones UX (vendedor logueado)

| # | Opción | Qué ve el realtor | Pros comerciales / claridad | Contras |
|---|--------|-------------------|----------------------------|---------|
| **A** | **CTA en cada tarjeta de Mis inmuebles** — quitar nav; botón «Pedir una Musa» / «Acompañamiento» por ficha → flujo paquetes con ficha preseleccionada | Lista de inmuebles = centro de control | Mental model correcto; mayor conversión en el momento (acabo de publicar o veo ficha débil); ops siempre con `listingId` | Descubrimiento baja si no educas en wizard/post-publish; hay que mostrar estado de solicitud en la tarjeta |
| **B** | **Bloque en editar inmueble** (`/dashboard/inmuebles/[id]`) — sección «Acompañamiento Preferencial» (paquetes + historial de esa ficha) | Entra por Editar | Claro para quien ya está afinando la ficha; buen sitio para copy «pago y coordinación fuera de la app» | Editar ya es largo; quien no edita nunca ve el upsell; descubrimiento tardío |
| **C** | **Solo post-publicar** — éxito de wizard + link contextual; sin nav; sin CTA en lista | Flujo único al publicar | Nav limpio; CTA en pico de motivación | Late adopters y fichas viejas casi no convierten; parece one-shot, no servicio ongoing |
| **D** | **Híbrido A + B (+ agregado en Mis inmuebles)** — CTA en tarjeta + bloque en editar; **historial de solicitudes** al pie de Mis inmuebles (no ítem de nav); `/preferencial` marketing solo con deep link `?listing=` | Primario por ficha; secundario portfolio | Mejor claridad + conversión; respeta D17 (no mezclar con Plan Realtor en nav); agregado sin tercer destino en menú | Dos entradas por ficha (card + editar) — mitigar con mismo copy y estado sincronizado |

### Recomendación #1

**Opción D (híbrido), con prioridad visual en A:**

1. **Quitar** «Preferencial» del `DashboardNav` del dashboard vendedor.  
2. **Mantener** `/preferencial` público (home, SEO, compradores curiosos) y **Suscripciones** aparte para Realtors (D17).  
3. **CTA principal** en cada tarjeta de Mis inmuebles: «Acompañamiento» → solicitud amarrada a esa ficha.  
4. **Bloque compacto** en editar inmueble (mismos paquetes, mismo estado).  
5. **Agregado** «Mis solicitudes Preferencial» como sección/link en Mis inmuebles (no nav global).  
6. **Copy VE:** «Una Musa para **este** inmueble» · «Fotos, legal o acompañamiento completo» · «Coordinamos contigo; pago fuera de la app».

### Qué NO hacer

| Anti-patrón | Por qué |
|-------------|---------|
| Dejar `/dashboard/preferencial` en nav “por si acaso” | Sigue pareciendo producto de cuenta; compite con Mis inmuebles |
| Solicitud Preferencial sin ficha (logueado) | Ops no sabe qué propiedad; rompe upsell por listing |
| Toggle “activar Preferencial en todos mis inmuebles” | No refleja realidad comercial ni paquetes distintos por ficha |
| Mezclar CTA Plan Realtor ($20) y paquetes 120/150/200 en el mismo control | Confusión de SKU (alerta `precio-hold-20` en Oficina) |
| Esconder por completo `/preferencial` marketing | Pierdes funnel desde home «Ver Acompañamiento» |
| Duplicar ítem «Preferencial» en nav guest **y** dashboard como dos productos distintos sin copy | Guest = educación; dashboard = acción por ficha — debe leerse distinto |

### Impacto / riesgo

| Área | Impacto |
|------|---------|
| Conversión Preferencial | ↑ si CTA en tarjeta + post-publish; ↓ breve si usuarios buscaban nav viejo |
| Ops (D8) | ↑ calidad leads (siempre con `listingId`) |
| Métrica beta | Trackear **solicitudes / ficha publicada** y **% fichas con ≥1 solicitud** |

### Decisión pedida

| ID | Recomendación | Joaquín |
|----|---------------|---------|
| **D25** | Quitar nav dashboard; híbrido A+B+agregado en Mis inmuebles; `/preferencial` público con deep link | [ ] Apruebo **D** · [ ] Solo **A** · [ ] Otra: _____ |

### Preguntas a Joaquín

1. ¿Confirmas **D25 = Opción D** (recomendación)?  
2. ¿Etiqueta del CTA en tarjeta: «Pedir una Musa», «Acompañamiento» o «Preferencial»?  
3. ¿Solicitudes abiertas sin ficha (legacy) — mostrar igual en agregado o ocultar en MVP?
