# Hero AGIGOV — Estándar global

Landing `/` = **solo HeroPage**. Arquitectura "Sistema Vivo" sin prototipo web.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Vite + React 19 |
| Estilos | Tailwind v4 + `hero-trust.css` (variables Trust / Legacy) |
| Motion | `motion/react` (Framer Motion) — única lib de animación UI |
| Visual | SVG React (`LogoCoreMark`, `GovernanceStructure`) |
| Estado | `PlatformContext` (`heroBeatIndex`, `heroPathDraw`) |
| Datos | Fetch API → `/api/public/health`, `fetchLandingTelemetry` |

## Árbol de componentes

```
HomePage
└── HeroPage                    ← entrada canónica
    ├── HeroTrustScene
    │   ├── LogoCore            ← pulso Motion
    │   └── GovernanceStructure ← draw path (stroke-dashoffset)
    ├── HeroNarrativeOverlay    ← actos + progreso + CTA
    └── HeroStatusMonitor       ← telemetría real
```

## Config

- `src/citizen/hero/heroConfig.ts` — `HERO_STORY_BEATS`, `HERO_CONFIG`
- `src/citizen/hero/useHeroNarrativeController.ts` — scroll + reloj
- `src/citizen/hero/useHeroStoryBeat.ts` — lee PlatformContext

## Narrativa

1. **Acto I** — reloj automático (logo respira)
2. **Actos II–III** — scroll despliega edges (`pathDraw`)
3. **Actos IV–V** — scroll continúa en `hero-scroll-track`

## Skins

- Default: `[data-agigov-skin='trust']` — variables `--hero-*` claras
- Toggle sidebar: `legacy` — mismas variables, valores oscuros
- Transición: `transition-colors` en `html` / `body`

## Degradación

- API caída → StatusMonitor en "Exploración local", métricas `—`
- `prefers-reduced-motion` → sin loop Motion
- Sin WebGL, sin video obligatorio

## Comandos

```bash
npm run dev          # :3000
npm run api:public   # :3001 telemetría real
```
