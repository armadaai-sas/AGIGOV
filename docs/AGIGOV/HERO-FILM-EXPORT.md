# Hero cinematográfico — pipeline After Effects

Poster instantáneo + video lazy. Calidad motion picture, carga mínima.

## Flujo de carga

1. `poster.svg` / `poster.webp` — LCP inmediato
2. `requestIdleCallback` — monta `<video preload="none">`
3. WebM/MP4 — fade-in al `canplay`
4. Sin video — poster + ken-burns CSS

Respeta `prefers-reduced-motion`, `saveData` y red 2G.

## After Effects (5 actos · 48 s)

| Tiempo | Acto |
|--------|------|
| 0–10 s | Amanecer, tierra vacía |
| 10–18 s | Comunidades caminando |
| 18–26 s | Camino / cimientos |
| 26–38 s | Obra, columnas, grúa |
| 38–48 s | Templo completo, victoria → loop |

Export 1280×720, 24 fps, sin audio → `public/hero/`.

```bash
chmod +x scripts/hero-optimize.sh
./scripts/hero-optimize.sh ruta/a/export.mp4
```

## Archivos de código

- `src/citizen/hero/heroFilmConfig.ts`
- `src/citizen/components/HeroFilmBackground.tsx`
