# Matriz Propiedash → Musas (rutas + funciones)

**Propósito:** contrato de paridad de *intención / descubribilidad*, no clon de volumen.  
**Referente vivo:** [propiedash.com](https://propiedash.com/) (nov 2026).  
**Diferenciación Musas:** USD (venta + alquiler/mes) · Musas Revisado (inmueble) · Preferencial cerrada (venta) · mapa nacional por ciudades · sin directorio / BCV / corto plazo.

**Gate:** ningún PASS de scripts 2–5 sin **S0** (`BETA_SCRIPTS.md`) + fila **IA post-login** OK abajo.

---

## IA Propiedash (patrón)

| Superficie | Rutas / CTAs típicos |
|------------|----------------------|
| Público | `/` · Comprar · Alquilar · Corto plazo · Directorio · Publicar · Inicio sesión |
| Descubrir | Buscar + filtros · mapa · ficha · favoritos · share / DASHCODE |
| Contacto | Chat in-app · (tel/WA en perfil) |
| Vendedor | Panel · Nueva propiedad · Mis propiedades · Mensajes · Destacados · PDF · Wasi |
| Confianza | Verificación **agente** · report fake ~48h |
| Monetiza | Planes $0/$19/$49 |

**Header logueado (a emular en descubribilidad):** Explorar · Mapa · **Publicar** · **Mis propiedades** · **Mensajes** · avatar.

---

## Cobertura Musas

| # | Propiedash | Musas | Estado | Pri | Acción |
|---|------------|-------|--------|-----|--------|
| 1 | Home + inventario | `/` `#inmuebles` | OK | P0 | Mantener |
| 2 | Buscar / filtros zona-precio | Hero search + chips | PARCIAL→OK | P0 | Chips + q + bandas |
| 3 | Mapa | `/mapa` nacional | **OK** | Hecho | Ciudades VE + filtro op |
| 4 | Ficha | `/inmuebles/[slug]` | OK | P0 | Galería + Q&A |
| 5 | BCV dual | — | NO-ROBAR | — | Solo USD |
| 6 | Alquiler | `op=alquiler` + wizard | **OK** | Hecho | USD/mes; sin corto plazo |
| 7 | Favoritos | `/?favoritos=1` | OK | P1 | — |
| 8 | Share / código | Share URL + WA | **OK** | Hecho | Copiar link + WA grupo |
| 9 | Report fake | Report → admin | **OK** | Hecho | `listingReports` + admin cola |
| 10 | Chat realtime | Q&A + `/dashboard/mensajes` | PARCIAL | P1 | Async OK beta |
| 11 | WA en ficha | Opt-in publish | OK | P0 | — |
| 12 | Wizard publicar | `/publicar` | **OK** | Hecho | Sector + desc + hint 3–6 fotos |
| 13 | Mis propiedades | `/dashboard/inmuebles` | OK | P0 | + **Mi panel** header |
| 14 | Mensajes panel | `/dashboard/mensajes` | OK | P0 | Visible desde home |
| 15 | IA global post-login | `AppChrome` | **OK** | Hecho | Ficha/mapa/pref/publicar/ayuda |
| 16 | Verif. agente | Musas Revisado listing | PARCIAL | P0 | Sello + cola admin |
| 17 | Preferencial / ayuda | `/preferencial` | OK | P0 | Cerrado ≠ directorio |
| 18 | Directorio pro | — | NO-ROBAR | — | — |
| 19 | Planes / destacados | — | NO-ROBAR | — | Post-density |
| 20 | Wasi / PDF / Dashtag | — | NO-ROBAR | — | — |
| 21 | FAQ / ayuda | `/ayuda` | **OK** | Hecho | Trust + rutas |
| 22 | Admin ops | `/admin` | OK | P0 | + cola reports |

---

## DoD paridad IA (bloqueante)

Tras login Gmail en **cualquier** página marketing (`/`, `/mapa`, `/inmuebles/*`, `/preferencial`, `/ayuda`):

1. CTA visible **Mi panel** → `/dashboard/inmuebles` (≤2 clics, sin tipiar URL).  
2. Acceso **Mensajes** visible (nav o icono).  
3. CTA **Publicar** visible.  
4. S0 PASS el mismo día (`BETA_SCRIPTS.md`).

---

## Plan de ejecución (esta entrega)

| Orden | Ítem | Done cuando |
|-------|------|-------------|
| 1 | Matriz en este doc | Archivo en repo |
| 2 | `AppChrome` en rutas marketing | Header + Mi panel fuera de home |
| 3 | Share ficha (copiar + WA) | Botones en detalle |
| 4 | Reportar → Convex + admin | Mutation + UI |
| 5 | Wizard checklist ≥3 fotos hint + sector | Copy + validación suave |
| 6 | `/ayuda` mínima | Rutas + trust copy |
| 7 | Admin cola reports | Lista + pausar |

**Diferir:** mapa nacional, chat realtime, watermark, planes pago, Wasi, perfil público agente.
