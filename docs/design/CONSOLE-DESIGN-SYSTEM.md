# AGIGOV · Console Design System (light)

Sistema unificado para **landing**, **shell de trabajo** y **aplicaciones** del OS.

## Principios
- Claro, neutro, app-first
- Blanco / gris claro / gris / negro — sin cyan marketing ni gradientes decorativos
- **Iconos Lucide: 3 tamaños** (`sm` 14px · `md` 16px · `lg` 20px) — ver [ICON-SYSTEM.md](./ICON-SYSTEM.md)
- Botones de aplicación (32px, radius 6px)

## Tokens (`console-design-system.css`)

| Token | Valor |
|-------|--------|
| `--console-bg` | `#ffffff` |
| `--console-bg-subtle` | `#fafafa` |
| `--console-bg-muted` | `#f4f4f5` |
| `--console-border` | `#e4e4e7` |
| `--console-text` | `#18181b` |
| `--console-text-muted` | `#71717a` |
| `--console-primary` | `#18181b` (botón negro) |
| `--console-icon-md` | `16px` (default Lucide) |
| `--console-hit-nav` | `28px` (wrap sidebar) |

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
- [`docs/design/ICON-SYSTEM.md`](./ICON-SYSTEM.md) — escala, nav tiers, tooltips
- [`src/styles/console-design-system.css`](../../src/styles/console-design-system.css)
- [`src/citizen/theme/trust-light.css`](../../src/citizen/theme/trust-light.css)
- [`src/styles/app.css`](../../src/styles/app.css) — shell + workspace
- [`src/styles/landing-system.css`](../../src/styles/landing-system.css) — landing `/`
