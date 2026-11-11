# Oficina Musas — estado vivo

## Qué es

`docs/OFFICE_STATE.json` es la **fuente de verdad** del simulador de oficina ([musas-office.canvas.tsx](../../.cursor/projects/Users-joaquinmolina-Documents-musasbienesraices/canvases/musas-office.canvas.tsx) en el workspace Cursor).

El Canvas de Cursor **no puede hacer fetch** al repo: cuando cambie el JSON, el agente coordinador debe **refrescar el Canvas** embebiendo el snapshot.

## Quién actualiza qué

| Agente | Debe actualizar |
|--------|-----------------|
| `musas-tech` | `agents.tech`, alertas de keys/infra, `codeReady`, feed `work` |
| `musas-design` | `agents.design`, feed tras review UX |
| `musas-user` | `agents.user`, hallazgos QA en feed, blockers de scripts |
| `musas-pm` | `agents.pm`, `alerts` de negocio, `phase`, resumen |
| Coordinador | `updatedAt`, sincroniza Canvas + INSUMOS |

## Status válidos

`idle` | `working` | `collab` | `needs_help`

## Alerta al humano

Si `status === "needs_help"` o hay `alerts` con severity `blocker`/`major`, el Canvas muestra Callout. Nunca pedir keys de Biosite.

## Comando mental

> “Actualiza OFFICE_STATE y refresca la oficina”

1. Editar `docs/OFFICE_STATE.json`
2. Reescribir el snapshot embebido en el Canvas
3. Confirmar al usuario con link al Canvas
