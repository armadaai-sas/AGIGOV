# OS Minimal Tokens (neutros — landing + shell)

Aplica en **todo el producto**: landing `/` y `.app-shell`.  
**Azul `#0052ff` solo en el logo / marca.** Nada de cyan/teal/purple como acento de UI.

## Typography

- Body: **Inter 13–14px** / 400
- Meta: **12px** / muted `#71717a`
- Page title: **18–20px** / 600 — sin display ornamental
- Code: 11–13px mono

## Color

| Rol | Valor |
|-----|--------|
| Background | `#ffffff` |
| Surface / alt | `#fafafa` |
| Elevated | `#f4f4f5` |
| Text | `#18181b` |
| Muted | `#71717a` |
| Border | `#e4e4e7` |
| CTA primary | `#18181b` (hover `#27272a`) |
| Logo blue | `#0052ff` (marca únicamente) |
| Freeze / warn | `#a1a1aa` borde + texto amber solo si es alerta real de sistema |

## Shadows

```css
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
```

Sin glow, sin multi-layer marketing.

## Layout (shell)

- Sidebar: **220px**, icon + label
- Topbar: **40px**, contexto `AGIGOV / Página`
- Canvas: max-width 3–4xl
- Sin footer de marketing en shell

## Lists

Filas divididas, hover sutil. Prohibido: cards decorativas de color, kickers neón, badges verdes/cyan.

## Buttons

- Primary: 36px, radius 8px, negro zinc
- Secondary: border `#e4e4e7`, fondo blanco
- Ghost: toolbar

## Icons

Lucide 16px, stroke 1.5, color ink/muted (no acento cromático).
