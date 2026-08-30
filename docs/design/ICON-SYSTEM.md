# AGIGOV · Sistema de iconos

Reglas únicas para **Lucide** en landing, desk, consolas y formularios. Objetivo: simetría, ergonomía y jerarquía clara sin tamaños ad hoc.

## Principio

| Regla | Por qué |
|-------|---------|
| **Máximo 3 tamaños de glifo** | Reduce ruido visual; el ojo aprende una escala |
| **Tamaño ≠ área de toque** | Icono 16px dentro de hit 32–36px — estándar accesibilidad |
| **Un stroke** (`1.75`) | Coherencia con Cursor / VS Code light |
| **Primary vs secondary en nav** | Lo frecuente lleva etiqueta; lo complementario, icono + tooltip |

## Escala de glifos

| Token | px | Clase | Cuándo usar |
|-------|-----|-------|-------------|
| `--cursor-icon-sm` | 14 | `agigov-icon--sm` | Chevrons en filas densas, indicadores inline |
| `--cursor-icon-md` | 16 | `agigov-icon--md` | **Default** — nav, listas, botones, acciones |
| `--cursor-icon-lg` | 20 | `agigov-icon--lg` | CTA principal del hub, estados vacíos, énfasis |

**No usar** `h-3`, `h-5`, `h-6` sueltos en componentes nuevos. Excepción: isotipo de marca (`AgigovLogo`).

## Áreas de toque (hit targets)

| Token | px | Clase | Cuándo usar |
|-------|-----|-------|-------------|
| `--cursor-hit-nav` | 28 | `agigov-icon-hit--nav` | Wrap del icono en sidebar |
| `--cursor-hit-sm` | 32 | `agigov-icon-hit--sm` | Botones ghost del shell (colapsar, prefs) |
| `--cursor-hit-md` | 36 | `agigov-icon-hit--md` | Acciones de fila (Leer, Descargar) |

## Opacidad y estado

| Estado | Opacidad del glifo |
|--------|-------------------|
| Reposo en nav / lista | `0.75` (clase `.app-sidebar-link-icon`) |
| Hover | `1` + fondo `--cursor-bg-hover` |
| Activo | `1` + wrap `--cursor-bg-subtle` |
| Acción secundaria (doc row) | `0.6` en icono de categoría |

## Navegación sidebar (desk)

Cada ítem en `deskNav.ts` puede declarar `tier`:

| Tier | Expandido | Colapsado |
|------|-----------|-----------|
| `primary` (default) | Icono + etiqueta + resultado Y | Icono + `SidebarTooltip` lateral |
| `secondary` | Solo icono + `DeskIconHint` (nube arriba) | Icono + `SidebarTooltip` lateral |

**Ciudadano — primary:** Hub, Participar, Gestión pública.  
**Ciudadano — secondary:** Dictámenes, Transparencia.

Criterio: ¿el usuario entra aquí cada sesión? → primary. ¿Consulta ocasional o referencia? → secondary.

## Tooltips

| Componente | Posición | Uso |
|------------|----------|-----|
| `SidebarTooltip` | Derecha del rail | Nav colapsada, footer del sidebar |
| `DeskIconHint` | Arriba del icono | Acciones inline (Leer/Descargar), nav secondary expandida |

Estilo común: fondo blanco, borde `--cursor-border`, texto label `--cursor-text-muted`, detalle `--cursor-text-subtle`.

## Código

### React (recomendado)

```tsx
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { Download } from 'lucide-react';

<Download {...agigovIconProps('md')} />
```

### CSS puro

```html
<span class="agigov-icon-hit agigov-icon-hit--md">
  <svg class="agigov-icon agigov-icon--md">…</svg>
</span>
```

## Marca (isotipo)

`AgigovLogo` usa escala aparte — no mezclar con Lucide:

| Size | Uso |
|------|-----|
| `xs` (24px) | Sidebar rail |
| `sm`–`md` | Footer, landing |
| `lg`+ | Hero marketing |

## Checklist PR (UI)

- [ ] ¿Solo `sm` / `md` / `lg` para Lucide?
- [ ] ¿Hit target ≥ 32px en controles clicables?
- [ ] ¿`strokeWidth` vía `agigovIconProps` o token CSS?
- [ ] ¿Nav secondary con tooltip, no etiqueta duplicada?
- [ ] ¿Sin botones negro pesado donde basta `app-btn--secondary`?

## Archivos

- Tokens: [`src/styles/cursor-design-system.css`](../../src/styles/cursor-design-system.css)
- Helper TS: [`src/citizen/components/icons/agigovIcon.ts`](../../src/citizen/components/icons/agigovIcon.ts)
- Nav tiers: [`src/citizen/platform/deskNav.ts`](../../src/citizen/platform/deskNav.ts)
- Tooltips: `DeskIconHint.tsx`, `SidebarTooltip.tsx`

Ver también: [CURSOR-DESIGN-SYSTEM.md](./CURSOR-DESIGN-SYSTEM.md) · [06-UI-UX-RELEASE.md](../process/06-UI-UX-RELEASE.md)
