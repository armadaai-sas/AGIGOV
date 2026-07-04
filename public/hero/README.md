# Hero cinematográfico — assets

| Archivo | Origen |
|---------|--------|
| `poster.svg` | Ilustración estática (LCP) |
| `agigov-dream.webm` / `.mp4` | **Placeholder** generado con `npm run hero:generate` |

Para regenerar el loop desde el poster (sin After Effects):

```bash
npm install --no-save @resvg/resvg-js ffmpeg-static
npm run hero:generate
```

## Export final After Effects (opcional, calidad motion picture)

Cuando tengas composición AE de 5 actos (~48 s), exporta MP4 y optimiza:

```bash
./scripts/hero-optimize.sh ruta/a/export.mp4
```

Ver `docs/AGIGOV/HERO-FILM-EXPORT.md`.
