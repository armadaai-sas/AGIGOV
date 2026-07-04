# AGIGOV — Design System (Fase B)

Gramática visual única para marketing (`/`) y plataforma (rutas internas).

## Tokens (`src/index.css` @theme)

| Token | Uso |
|-------|-----|
| `--color-agigov-void` | Fondo global app + landing |
| `--color-agigov-primary` | Acciones app, links activos |
| `--color-agigov-accent` | Concierge, implementaciones, CTA especial |
| `--color-agigov-text` / `text-muted` | Cuerpo y secundario |

## Botones

| Clase | Contexto | Forma |
|-------|----------|-------|
| `ds-btn-primary` | Marketing CTA principal | Pill blanco |
| `ds-btn-secondary` | Marketing secundario | Pill borde |
| `ds-btn-app` | Formularios y acciones app | `rounded-xl` azul |
| `ds-btn-secondary ds-btn-app-shape` | Secundario en app | `rounded-xl` borde |
| `ds-btn-accent` | Destacado institucional | `rounded-xl` amber |
| `ds-btn-sm` | Header / compacto | Altura 40px |

**Aliases legacy:** `agigov-btn-primary` → `ds-btn-app`, etc.

## Navegación

### Marketing (`/`)
`Explorar ▾ · Modelo · Aprender · Más ▾` + CTA `Explorar plataforma`

### App (resto de rutas)
`Explorar ▾ · Participar · Ayuda · Más ▾` + CTA contextual (`Participar` o `Explorar plataforma`)

## Layout

| Componente | Rol |
|------------|-----|
| `SiteHeader` | Nav sticky marketing/app |
| `SiteFooter` | Solo home (mapa completo) |
| `SiteFooterCompact` | App: Aprender, Protocolo, © |
| `PageShell` | Contenedor + banner red + breadcrumbs |
| `AppBreadcrumbs` | Migas estándar vía `breadcrumbsForPath()` |

## Tipografía (Fase D)

- Cuerpo: **Inter** (`--font-sans`, 14px base)
- Display / hero: **Outfit** (`--font-display`, `--font-hero`)
- Mono: **JetBrains** (IDs, telemetría)
- Escala: 12 / 14 / 17 / 24 / 32 / 40 px → `.agigov-text-xs` … `.agigov-text-2xl`
- Tema claro opcional: `document.documentElement.dataset.agigovTheme = 'light'`

## Color (Fase D)

- Texto secundario: `agigov-text-muted` (#94a3b8) — contraste AA sobre void
- Amber reservado: concierge, implementaciones, alertas offline, dictamen REVISAR

## Reglas

1. Un CTA primario por vista
2. Amber solo concierge / implementaciones / alertas
3. AGIGOV en marca; implementaciones nacionales secundarias
4. Sin `@apply` de clase custom sobre otra custom en Tailwind v4

## Innovación (Fase F)

| Componente | Uso |
|------------|-----|
| `OnboardingModal` | Primera visita — 3 personas |
| `CommandPalette` | ⌘K / Ctrl+K — rutas y guías |
| `ImplementationSelector` | Jurisdicción en header (sin VEN en logo) |
| `HeroMiniTelemetry` | Métricas resumidas en hero |

## Performance (Fase G)

- Fuentes: subset Google Fonts (400/600/700)
- Landing: lazy-load en 4 secciones bajo fold
- SVG hero optimizado

Ver roadmap: [DESIGN-ROADMAP-FASES.md](./DESIGN-ROADMAP-FASES.md)
