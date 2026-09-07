# AGIGOV · Sistema de diseño único (fuente de la verdad)

> **Un solo sistema de diseño para todo el producto**: landing `/` y `.app-shell`.
> Este documento es la **fuente única**. `OS-MINIMAL-TOKENS.md` y `CONSOLE-DESIGN-SYSTEM.md`
> quedan como referencia histórica y se subordinan a lo que aquí se define.
>
> Origen: se toma del **sistema de la landing** (`.ls-min-*`) + la guía UI/UX existente.
> Regla base: **claro, neutro, denso pero legible, app-first — estilo Cursor / Gmail.**

## 1. Namespace de tokens (canónico)

Se usa **un solo namespace en runtime: `--console-*`** (definido en
`src/styles/console-design-system.css`, activo siempre). Los demás namespaces
(`--ls-*` en la landing, `--color-agigov-*`, `--agigov-*`) deben **mapear a estos
valores**, no definir valores nuevos.

| Rol | Token canónico | Valor |
|-----|----------------|-------|
| Fondo | `--console-bg` | `#ffffff` |
| Superficie | `--console-bg-subtle` | `#fafafa` |
| Elevado | `--console-bg-muted` | `#f4f4f5` |
| Borde | `--console-border` | `#e4e4e7` |
| Texto | `--console-text` | `#18181b` |
| Texto atenuado | `--console-text-muted` | `#71717a` |
| Texto sutil | `--console-text-subtle` | `#a1a1aa` |
| CTA / primario | `--console-primary` | `#18181b` (hover `#27272a`) |
| Marca (solo logo/acento landing) | — | `#0052ff` |

**Prohibido** como acento de UI: cyan/teal/purple/sky. `#0052ff` **solo** en el
logo y el degradado del hero de la landing.

## 2. Escala de botones (una sola escalera)

Un único set. Altura y radio idénticos en landing y app.

| Nivel | Altura | Radio | Padding-x | Tipografía | Uso |
|-------|--------|-------|-----------|-----------|-----|
| **Primario** | **36px** | **8px** | 14px | 13px / 500 | 1 por vista, acción principal |
| **Secundario** | 36px | 8px | 14px | 13px / 500 | borde `#e4e4e7`, fondo blanco |
| **Fantasma** | 36px | 8px | 12px | 13px / 500 | toolbar / terciario |
| **Compacto** | 32px | 6px | 10px | 12px / 500 | filas densas, chips |

**Retirados / normalizados** (bajo skin `trust`, que es el único activo):
`agigov-btn-*` (eran 48px / radio 12px), `ui-btn-*` (48–52px), `ds-btn-primary`
(52px `rounded-full`), `ds-btn-sm` (40px), `agigov-centinela-trigger` (48px).
Todos se clampan a la escalera de arriba en `trust-light.css`.

## 3. Ancho de lectura y contenedores

| Contexto | max-width |
|----------|-----------|
| Página de texto (desk) | **34rem** |
| Listas / consola | **42rem** |
| Nunca | > 48rem para contenido ciudadano |

Las páginas ciudadanas usan **un solo primitivo de layout** (`desk-page`). No mezclar
`desk-page`, `os-workspace` e `inst-auth-page` para el mismo tipo de contenido.

## 4. Tipografía

- Cuerpo: **Inter 13–14px / 400**
- Meta / atenuado: **12px** `#71717a`
- Título de página: **18–20px / 600** (sin display ornamental en el shell)
- Máximo **3–4 tamaños** por vista.

## 5. Iconografía

Lucide, stroke 1.5, tamaños **14 / 16 / 20px**. Color ink o muted, **nunca** acento cromático.

## 6. Sombras

```css
box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04);
```

Sin glow ni sombras de marketing multicapa.

---

## 7. Contrato de UI/UX (definición de "terminado")

Una pantalla cumple solo si:

1. **Tokens únicos** — solo `--console-*` (o mapeados a él).
2. **Escala de espaciado** — múltiplos de 4/8 (4·8·12·16·24·32).
3. **Ancho de lectura** — ≤ 34rem para texto; nunca a todo el ancho.
4. **Jerarquía tipográfica** — 3–4 tamaños máximo.
5. **Una acción primaria** — un solo botón primario; el resto secundario/fantasma; tamaño estándar (36px), nunca pastillas de 48–52px.
6. **Densidad tipo Cursor/Gmail** — filas compactas con etiqueta, separadores sutiles, sin cards decorativas.
7. **Responsive por defecto** — verificado en móvil / tablet / desktop.

Y, en contenido:

8. **Audiencia correcta** — nada de operador/desarrollador en vistas ciudadanas (ver `## Auditoría`).
9. **Lenguaje ciudadano** — sin jerga (`telemetría`, `ledger`, `nodo API`, nombres internos de agentes) en superficies públicas.

---

## Auditoría Fase 1 — flujo ciudadano

Leyenda veredicto: **Conservar** · **Simplificar** · **Cortar** · **Mover** (a área de operador/dev).

| Ruta | Elemento | Audiencia | Veredicto | Acción |
|------|----------|-----------|-----------|--------|
| `/` | Hero + secciones | ciudadano | Conservar | Es la referencia del sistema |
| `/gestion` | `result` "Telemetría y ledger publicados en vivo" | ciudadano | Simplificar | → "Actos de gobierno publicados y verificables" |
| `/gestion` | Panel "Verificación del nodo / npm run" | operador/dev | **Mover** | Ya gateado a dev (PR #6) |
| `/gestion` | "Centinela ciudadano" / "Conciliador revisará" | ciudadano | Simplificar | Quitar nombres internos de agente |
| `/propuestas` | Título "Dictámenes" (nav dice "Propuestas") | ciudadano | Simplificar | Título → "Propuestas" |
| `/propuestas` | `result` "Dictámenes publicados…" | ciudadano | Simplificar | → "Estado de cada propuesta ciudadana" |
| `/suministros` | Layout `os-workspace` (distinto a las demás) | — | **Normalizar** | Usar `desk-page` como el resto |
| `/suministros` | "Agregados del agente Logístico" | ciudadano | Simplificar | Quitar nombre interno de agente |
| `/institucional` | "Ver consola EGS (telemetría pública)" | operador | Simplificar | → "Ver resultados públicos" |
| Global | Botones 48–52px / `rounded-full` | todas | **Normalizar** | Escalera única 36px / 8px |

Pendiente (fases siguientes, requiere tu OK): badges de dictamen (`CONFORME/REVISAR`),
unificación de i18n landing↔desk, y aplicar el contrato al resto del OS (modelos, EGS, escrow, institucional interno).
