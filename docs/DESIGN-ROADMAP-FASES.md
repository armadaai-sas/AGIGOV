# AGIGOV — Roadmap de diseño por fases

Lista detallada de mejoras acordadas por el equipo (product-design, diseno-landing, premium-civic-design, product-content, comunicador, centinela, tactical-pwa, product-innovation).

**Estado:** Fases A–H ✅ completas. Listo para retomar **parte funcional**.

---

## Fase A — Landing marketing (`/`)

Objetivo: home de impacto, narrativa clara, sin CTAs duplicados, nav ligera.

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| A1 | Nav marketing simplificada | Desktop: `Explorar ▾ · Modelo · Aprender · Más ▾` + CTA `Explorar plataforma`. `Más` = Participar, Gobiernos, Protocolo | ✅ |
| A2 | Dedupe CTAs en home | Hero: 2 CTAs. Telemetría: datos + enlace a `#acceso`. Un solo bloque `#acceso` con 3 caminos | ✅ |
| A3 | Orden narrativo scroll | Hero → Modelo → Implementaciones → Telemetría → Acceso → Academia | ✅ |
| A4 | Tokens botón marketing (`ds-*`) | `ds-btn-primary` (pill blanco), `ds-btn-secondary`, `ds-btn-ghost` — base del design system | ✅ |
| A5 | Espaciado entre secciones | Más aire (`py-20`/`py-28`), sensación Coinbase/Apple | ✅ |
| A6 | Telemetría copy humano | Métricas con etiquetas ciudadanas (comunicador) | ✅ |
| A7 | Academia sin CTA triple | Fin de academia: enlace a `#acceso`, no repetir 3 botones | ✅ |
| A8 | Footer home completo | Columnas Modelo, Aprender, Explorar, Acceso (ya parcial) | ✅ |
| A9 | Hash nav activo en home | Resaltar Modelo/Aprender cuando `#modelo` / `#aprender` | ✅ |
| A10 | Lazy-load bajo fold | Academia + Implementaciones con `React.lazy` | ✅ |

---

## Fase B — Design system global + nav app

Objetivo: una sola gramática visual en toda la PWA.

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| B1 | Unificar botones | `ds-btn-*` + aliases `agigov-btn-*` | ✅ |
| B2 | Radio por contexto | Pill marketing · xl app (`ds-btn-app-shape`) | ✅ |
| B3 | Fondo único | `CitizenApp` → `bg-agigov-void` | ✅ |
| B4 | Nav modo app | Fuera de `/`: Participar, Ayuda, Más institucional | ✅ |
| B5 | Footer mínimo global | `SiteFooterCompact` en rutas internas | ✅ |
| B6 | Breadcrumbs | `AppBreadcrumbs` + `breadcrumbsForPath()` | ✅ |
| B7 | DESIGN-SYSTEM.md | `docs/DESIGN-SYSTEM.md` | ✅ |

**Estado:** Fase B completa. Siguiente: **Fase C** (copy interior AGIGOV-first).

---

## Fase C — Copy e identidad interior

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| C1 | Eyebrows AGIGOV-first | Quitar `AGIGOV-VEN` de Dashboard, Participar, Propuestas, Proyectos, Suministros | ✅ |
| C2 | Jerarquía implementación | Venezuela solo en `/institucional` y card Implementaciones | ✅ |
| C3 | Estados vacíos premium | Mismo tono que telemetría offline en todas las páginas | ✅ |
| C4 | Loading unificado | Un spinner/skeleton pattern (`LoadingState` + `DsSpinner`) | ✅ |

**Estado:** Fase C completa. Siguiente: **Fase D** (tipografía y color).

---

## Fase D — Tipografía y color

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| D1 | 2 familias + mono | Cuerpo: Inter. Display/hero: Outfit (sin Space Grotesk) | ✅ |
| D2 | Escala fija | Tokens `--text-agigov-*` · clases `.agigov-text-xs` … `2xl` | ✅ |
| D3 | Rol amber | Solo concierge, implementaciones, alertas, REVISAR | ✅ |
| D4 | Contraste WCAG | `slate-500` → `agigov-text-muted` en UI principal | ✅ |
| D5 | Modo claro (opcional) | `[data-agigov-theme="light"]` estilo gov.uk | ✅ |

**Estado:** Fase D completa.

---

## Fase E — Pedagogía y confianza

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| E1 | Glosario `/aprender/glosario` | Ledger, propuesta, dictamen, escrow | ✅ |
| E2 | Micro-lecciones inline | `MicroLesson` en telemetría y gestión | ✅ |
| E3 | Feed → detalle | Clic en publicación → `/gestion#report-{id}` | ✅ |
| E4 | Badges dictamen | `DictamenBadge` CONFORME / REVISAR | ✅ |
| E5 | PANIC / FREEZE UI | `PanicBanner` si `panicMode` en health | ✅ |

**Estado:** Fase E completa. Siguiente: **Fase F**.

---

## Fase F — Innovación producto

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| F1 | Onboarding 3 pasos | Ciudadano / Explorador / Gobierno (`OnboardingModal`) | ✅ |
| F2 | Command palette ⌘K | `CommandPalette` + botón Buscar en header | ✅ |
| F3 | Selector implementación | `ImplementationSelector` — jurisdicción sin badge VEN en logo | ✅ |
| F4 | Hero mini-telemetría | `HeroMiniTelemetry` — 3 métricas; detalle en `#telemetria` | ✅ |
| F5 | PWA icons / splash | Manifest + apple-touch-icon + copy AGIGOV-first | ✅ |

**Estado:** Fase F completa.

---

## Fase G — Performance (tactical-pwa)

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| G1 | Subset fuentes | Inter/Outfit/JetBrains — pesos reducidos | ✅ |
| G2 | Code-split landing | Lazy: implementaciones, telemetría, acceso, academia | ✅ |
| G3 | SVG hero | `CityProsperityIllustration` simplificado (~50% nodos) | ✅ |

**Estado:** Fase G completa.

---

## Fase H — Centro de ayuda y menú claro

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| H1 | Centro de ayuda `/ayuda` | Hub con tutoriales por categoría | ✅ |
| H2 | Tutorial por sección | `/ayuda/gestion`, propuestas, proyectos, suministros, participar, institucional, modelo | ✅ |
| H3 | Menú unificado | Explorar ▾ · Participar · Ayuda ▾ · Institucional — mismo esquema home + app | ✅ |
| H4 | Dropdowns con contexto | Hint bajo cada ítem en Explorar y Ayuda | ✅ |
| H5 | Enlace contextual | «¿Qué es esto?» en cada página app → tutorial | ✅ |
| H6 | Bottom nav móvil | Inicio/Explorar · Participar · Ayuda · Menú | ✅ |

**Estado:** Fase H completa. Siguiente: **Fase I** (catálogo modelos — agente **artesano-ui**).

---

## Fase I — Catálogo y fichas de modelos (`/modelos`)

Objetivo: producto vendible con diseño premium e honestidad técnica. Agente: **artesano-ui** · skill `ui-product-craft` · 6 h/día hasta cerrar ítems.

| ID | Cambio | Detalle | Estado |
|----|--------|---------|--------|
| I1 | Grid catálogo | Cards uniformes: problema, badge, audiencia, 1 CTA | ✅ |
| I2 | Ficha modelo | Problema · beneficios · operación · negocio · validación | ✅ |
| I3 | Bloque validación 3 etapas | pass/partial/fail visual; barra progreso; sync catálogo | ✅ |
| I4 | Pricing por modelo | M1–M9 / fee EGS; simulador Δ en ficha EGS | ✅ |
| I5 | Simulador Δ EGS | Inputs simples en ficha EGS; sin tesorería real | ⬜ |
| I6 | Consola EGS | Layout app + breadcrumbs en `/modelos/egs/consola` | ⬜ |
| I7 | Filtros catálogo | Audiencia + status | ⬜ |
| I8 | Comparador modelos | `?compare=a,b` side-by-side | ⬜ |
| I9 | Empty / error | Mismo tono `LoadingState` | ⬜ |
| I10 | Mobile catálogo | Stack + touch ≥ 44px | ⬜ |
| I11 | Sync status visual | `agigovModels` ↔ `modelValidationState` | ⬜ |
| I12 | Redirects legacy | Banner suave `/ven/servicios/*` → `/modelos` | ⬜ |

**Estado:** Fase I en progreso. Paralelo comercial: **comercial-agigov** (one-pagers en `docs/commercial/`).

---

## Criterio de cierre por fase

- **A:** Home ≤ 6 secciones, ≤ 2 CTAs en hero, 1 bloque `#acceso`, nav ≤ 4 + CTA
- **B:** Mismo botón en home y `/gestion`; nav app distinta documentada
- **C:** Cero eyebrows VEN fuera de institucional
- **D:** Audit contraste AA en textos principales
- **E:** Glosario accesible desde footer
- **F–G:** Backlog priorizado por product-manager
- **I:** 12/12 ítems ✅; `npm run lint` + build; badges honestos vs `models:audit`
