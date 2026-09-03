# Proceso 01 — Diseño UI/UX AGIGOV

Estándar para cambios visuales en landing, shell (`.app-shell`) y páginas de producto.

## Principios (no negociables)

1. **Neutros zinc** — fondos `#fff` / `#fafafa` / `#f4f4f5`; texto `#18181b` / `#71717a`
2. **Azul `#0052ff` solo en logo/marca** — no cyan/teal/purple como acento de UI
3. **Taxonomía** — [TAXONOMY.md](../design/TAXONOMY.md): Modelos, Escritorio, Consola, Gestión pública
4. **Un CTA primario por zona** — no competir “Hablar” + “Comenzar” + icono login en la misma barra
5. **Shell = trabajo** — filas, no cards decorativas; sin footer marketing en app

## Herramientas y fuentes de verdad

| Artefacto | Ruta |
|-----------|------|
| Tokens mínimos | [OS-MINIMAL-TOKENS.md](../design/OS-MINIMAL-TOKENS.md) |
| Design system institucional | [CONSOLE-DESIGN-SYSTEM.md](../design/CONSOLE-DESIGN-SYSTEM.md) |
| CSS tokens | `src/styles/console-design-system.css` |
| Landing layout | `src/styles/landing-system.css` |
| Shell layout | `src/styles/app.css` + `.app-shell` |
| Skin trust light | `src/citizen/theme/trust-light.css` |
| Landing IA (keep/modify/remove) | [LANDING-IA-INTL.md](../design/LANDING-IA-INTL.md) |
| i18n | `src/i18n/locales/es.ts` (keys desde `en.ts`) |

## Flujo de trabajo (pasos)

### D0 — Brief

- [ ] Área afectada: landing \| shell \| página \| consola modelo
- [ ] Usuario objetivo: ciudadano \| institución \| integrador
- [ ] No usar términos prohibidos (Productos, Apps store, Resultados como nav)

### D1 — Tokens antes de píxeles

- [ ] ¿Requiere nuevo token? → añadir en `console-design-system.css` o `OS-MINIMAL-TOKENS.md`
- [ ] ¿Es landing? → solo clases `ls-*` en `landing-system.css`
- [ ] ¿Es app? → clases `app-*` / `os-*` bajo `.app-shell`

### D2 — Implementación

- [ ] Componente en `src/citizen/components/` o página en `src/citizen/pages/`
- [ ] Copy en i18n (ES + EN)
- [ ] Sin hardcode cyan/sky en Tailwind (`text-sky-*`, `#22d3ee`)

### D3 — Verificación local

```bash
npx vite --port=3010 --host=0.0.0.0
# Rutas: /  /escritorio  /modelos  /institucional
```

- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Consola del navegador sin `Uncaught` / `ReferenceError`
- [ ] Contraste legible (crumbs, muted, CTA)

### D4 — Release UI

Seguir [06-UI-UX-RELEASE.md](./06-UI-UX-RELEASE.md) antes de merge.

## Checklist de rechazo (design review)

| Fallo | Acción |
|-------|--------|
| Tres CTAs compitiendo en header | Dejar uno primario + login texto |
| Sección `#resultados` como producto | Renombrar a `#utilidad` |
| Cards oscuras con texto blanco en fondo claro | Neutros zinc |
| Sidebar label “Apps” | “Modelos” |
| Concierge en todas las rutas | Solo ayuda/institucional/dev |

## Agente responsable

**artesano-ui** · skill **ui-product-craft** · skill **civic-institutional-ux**
