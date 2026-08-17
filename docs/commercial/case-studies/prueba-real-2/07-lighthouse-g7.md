# G7 Lighthouse — post CSS split (HTTPS)

| Campo | Valor |
|-------|-------|
| UTC | `2026-08-16T23:23:48.065Z` |
| URL | https://photos-speaking-editing-dicke.trycloudflare.com/ |
| Method | mobile · simulate |
| Performance | **63** |
| Accessibility | **93** |
| Best-practices | **96** |
| SEO | **91** |
| Meta | perf ≥90 → **FAIL** |

## Comparativa

| Run | Perf | Nota |
|-----|------|------|
| Baseline HTTP 19:30Z | 56 | pre-gzip/CSS |
| CSS split mid | ~67 | HomePage CSS ~120KB |
| Este run HTTPS | **63** | HomePage CSS ~75KB; TBT/LCP aún limitan |

## Veredicto

**FAIL** vs meta. Optimización CSS **FIXED** parcialmente (critical bajó); score no cierra gap.
