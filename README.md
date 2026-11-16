# Musas Bienes Raíces

Marketplace mínimo real (Venezuela / USD) para feedback: explorar, publicar, Q&A y Atención Preferencial **sin pagos in-app**.

## Stack

- Next.js App Router + TypeScript
- Clerk (auth) + Convex (DB) + UploadThing (fotos)
- Tailwind + shadcn-style UI Musas (dark neon)

**Importante:** crea proyectos Clerk/Convex/UploadThing **nuevos** para Musas. No reutilices keys ni webhooks de Biosite (solo referencia de patrones). Ver [docs/SETUP_MUSAS.md](docs/SETUP_MUSAS.md).

## Desarrollo

```bash
cp .env.example .env.local   # llena keys Musas
npx convex dev               # en otra terminal, proyecto Musas nuevo
npm run dev                  # http://127.0.0.1:4321
```

Sin keys: la home usa seed local de demostración; rutas protegidas muestran gate de setup.

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Explorar |
| `/inmuebles/[slug]` | Ficha + Q&A |
| `/publicar` | Wizard vendedor |
| `/dashboard/*` | Inmuebles, mensajes, preferencial |
| `/preferencial` | Paquetes + solicitud |
| `/suscripciones` | Plan Realtor (solicitud; pago fuera) |
| `/dashboard/cuenta` | Particular vs Realtor |
| `/admin` | Ops + Preferencial + Realtor + seed |
| `/landing` | Story de marca |

## Docs

- [docs/INSUMOS.md](docs/INSUMOS.md) — qué debe entregar Joaquín
- [docs/INFORME_DECISIONES.md](docs/INFORME_DECISIONES.md) — gates PM
- [docs/BETA_SCRIPTS.md](docs/BETA_SCRIPTS.md) — QA usuario
- Agentes: `.cursor/agents/musas-{pm,design,user,tech}.md`
