# AGIGOV · Sistema de diseño único (fuente de la verdad)

> **Un solo sistema de diseño para todo el producto**: landing `/` y `.app-shell`.
> Este documento es la **fuente única**. `OS-MINIMAL-TOKENS.md` y `CONSOLE-DESIGN-SYSTEM.md`
> quedan como referencia histórica y se subordinan a lo que aquí se define.
>
> Origen: se toma del **sistema de la landing** (`.ls-min-*`) + la guía UI/UX existente.
> Regla base: **claro, neutro, denso pero legible, app-first.**

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
6. **Densidad de escritorio** — filas compactas con etiqueta, separadores sutiles, sin cards decorativas.
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

## Auditoría Fase 2 — resto del OS (modelos, EGS, escrow, institucional interno)

| Área | Elemento | Audiencia | Veredicto | Acción |
|------|----------|-----------|-----------|--------|
| Modelos | "Modelos operativos del OS — elige uno para operar" | usuario | Simplificar | → "Elige un modelo para empezar." |
| Consola EGS | "Pipeline EGS" / "Ejecutar pipeline" / "enjambre" | usuario | Simplificar | → "Análisis EGS" / "Ejecutar análisis" / "8 pasos" |
| Consola EGS | "Centinela: FREEZE" / "Ancla ledger" / "telemetría" | usuario | Simplificar | → "En pausa por revisión" / "Registro verificable" / "datos" |
| Consola EGS | Nota `IAP bus · MQTT · Postgres · agentId checkpoint` | operador/dev | **Mover** | Gateado a `DEV_MODE` |
| Consola EGS | Roles del enjambre (`Reparto Δ 70/20/10`, `Publica ledger`) + estado enum | usuario | Simplificar | Roles en lenguaje claro + estados traducidos |
| Consola EGS | `<details>` "semáforo / Comunicador / pendiente publish" | operador | Simplificar | → "Estado / Auditoría / Publicación" |
| Escrow | Estado crudo `RELEASED`/`LOCKED` en lista | usuario | Simplificar | Usar `StatusBadge` (Completado / En custodia) |
| Escrow | "Evidencia (hash)" / "Centinela" / "Fondos en escrow" / "Ancla ledger" / id de contrato | usuario | Simplificar | → "Evidencia verificable" / "Validación" / "en custodia" / "Registro verificable" |
| Institucional | "Ingesta manual" / "Reconciliación Centinela" / "token Bearer" / "Telemetría pública" / "cookie httpOnly" | usuario | Simplificar | Lenguaje claro (carga de datos, verificación, resultados públicos, sesión segura) |
| Institucional | Título `text-2xl/3xl`; `inst-pilot-step` `rounded-full` glass oscuro | todas | **Normalizar** | Título 20/24px; chips `rounded-lg` claros |
| Global | Botón "Reintentar" `min-h-11` (44px) | todas | **Normalizar** | → 36px (`min-h-9`) |

### Fase 3 — coherencia (idioma + layout + huérfanos)

| Área | Problema | Acción | Cambio |
|------|----------|--------|--------|
| Idioma | Landing en inglés ↔ escritorio en español (locale UI por defecto `en` en `GEN`/navegador no hispano) | **Corregir** | Español por defecto en `resolveUiLocale` (`resolve-locale.ts`) y `GEN.locale` (`jurisdictions.ts`); el usuario puede cambiarlo en Preferencias |
| Layout | `ContratosPage` usaba `os-workspace` (ancho del shell) mientras el resto del flujo ciudadano usa `desk-page` (34rem) | **Unificar** | Migrada a `desk-page` + `DeskPageHeader` + `getDeskPageMeta('/contratos')` |
| Huérfanos | `ModelValidationPanel` y `ModelComparePanel` construidos pero nunca enrutados | **Eliminar** | Borrados |

### Fase 4 — ancho de página uniforme

Antes: los contenedores de página tenían anchos y centrados distintos — `desk-page` 34rem, `desk-console` 42rem, `os-workspace` sin límite (llenaba el shell de 768–896px), `inst-auth-page` 512px — y el `catálogo`/`desarrolladores` usaban un shell más ancho (`narrow={false}`). Resultado: las páginas "saltaban" de ancho al navegar.

| Área | Acción | Cambio |
|------|--------|--------|
| Token único | **Crear** | `--os-read: 34rem` en `console-design-system.css` como única fuente de verdad del ancho de lectura |
| Contenedores | **Unificar** | `desk-page`, `desk-console`, `desk-home`, `os-workspace`, `inst-auth-page` → todos `max-width: var(--os-read)` |
| Centrado | **Corregir** | `.os-page-content` (padre común de todas las páginas del shell) pasa a columna flex centrada, de modo que `margin-inline:auto` deja de fallar y todos los contenedores quedan centrados igual |
| Shell | **Normalizar** | `ModelsCatalogPage` y `DevelopersPage` pasan de `narrow={false}` a `narrow` para que el shell sea idéntico en todas las rutas |

Verificado (DevTools): las 4 familias de página miden **544px de ancho** con **leftGap == rightGap** (centrado idéntico).

Pendiente (siguiente iteración): migrar la copia hardcodeada del escritorio a claves `t()` para coherencia total al cambiar de idioma; decidir si algún tipo de página (p. ej. catálogo con rejilla) merece un ancho mayor con su propia variante de token.
