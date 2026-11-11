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

