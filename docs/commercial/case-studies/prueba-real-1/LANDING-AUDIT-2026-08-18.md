# Landing layout audit — 2026-08-18 (overnight)

Live: `http://137.184.66.163/`  
Health: `ok:true` · `panicMode:false` · postgres true  

## Root causes (qué estaba pasando)

1. **Alturas 100vh forzadas** — cada slide `min-h-[100svh]` + centrado = islas en vacío negro (FireShot desastre).
2. **CSS `.landing-section` duplicado** — `max-w-[1200px]` + `items-center` bandaba fondos y encogía hijos.
3. **Footer sin CSS en `/`** — `app.css` solo carga fuera de home; el pie salía crudo a la izquierda.
4. **Modal “Bienvenido a AGIGOV”** sobre la home — tapaba el producto (confirmado en screenshot headless).
5. **`transform` en page-transition** — rompía `position:fixed` (nav/rail); ya corregido a opacity-only.

## Commits de la noche

| Commit | Qué |
|--------|-----|
| `6f3cde2` | Quitar voids 100vh + footer en landing |
| `3fcd88f` | Modal off en `/` + slides full-bleed |
| follow-up | Deduplicar reglas `.landing-section` |

## Mañana (1 minuto)

1. Hard refresh: `http://137.184.66.163/` (Ctrl+Shift+R)
2. Verificar: **sin** modal de bienvenida, secciones pegadas, footer 3 columnas, rail con iconos (pantalla XL)
3. Si aún se ve mal → un FireShot full-page **después** del hard refresh

Evidencia modal: `lighthouse/landing-audit-2026-08-18.png`
