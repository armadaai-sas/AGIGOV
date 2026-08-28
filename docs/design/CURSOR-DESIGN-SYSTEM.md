# AGIGOV · Cursor Design System (light)

Sistema unificado para **landing**, **shell de trabajo** y **aplicaciones** del OS.

## Principios
- Claro, neutro, app-first (como Cursor)
- Blanco / gris claro / gris / negro — sin cyan marketing ni gradientes decorativos
- Iconos Lucide 16px, mínimos
- Botones de aplicación (32px, radius 6px)

## Tokens (`cursor-design-system.css`)

| Token | Valor |
|-------|--------|
| `--cursor-bg` | `#ffffff` |
| `--cursor-bg-subtle` | `#fafafa` |
| `--cursor-bg-muted` | `#f4f4f5` |
| `--cursor-border` | `#e4e4e7` |
| `--cursor-text` | `#18181b` |
| `--cursor-text-muted` | `#71717a` |
| `--cursor-primary` | `#18181b` (botón negro) |

## Botones

```html
<button class="app-btn app-btn--primary">Abrir app</button>
<button class="app-btn app-btn--secondary">Cancelar</button>
<button class="app-btn app-btn--ghost">Más</button>
```

Landing usa las mismas reglas vía `.ls-btn--primary|secondary|ghost`.

## Shell de trabajo
- Sidebar 220px, fondo `#fafafa`, labels 13px
- Topbar 40px, sin footer
- Canvas: `os-workspace-*` — filas, no cards

## Aplicaciones
Cada modelo (EGS, escrow, etc.) hereda tokens + botones `app-btn` / `os-btn-*`.

## Archivos
- [`src/styles/cursor-design-system.css`](../../src/styles/cursor-design-system.css)
- [`src/citizen/theme/trust-light.css`](../../src/citizen/theme/trust-light.css)
- [`src/styles/app.css`](../../src/styles/app.css) — shell + workspace
- [`src/styles/landing-system.css`](../../src/styles/landing-system.css) — landing `/`
