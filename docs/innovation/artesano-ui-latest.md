# artesano-ui — 2026-07-04

Fase K cerrada — alertas legibles y dedupe EGS.

## Entregables K1–K7

| ID | Cambio |
|----|--------|
| K1 | `PlatformAlert` — info · warning · error · offline · success |
| K2 | Overrides trust-light en `agigov-alert--*` |
| K3 | `ServiceConnectionPanel` → PlatformAlert warning |
| K4 | `ErrorState` + `NetworkBanner` → PlatformAlert |
| K5 | Kicker empty state legible en skin claro |
| K6 | Una alerta por vista (sin stack EgsServiceUnavailable + ErrorState + banner) |
| K7 | `/gestion`, `/contratos`, `/proyectos`, `/modelos/egs/consola` auditados |

## Archivos clave

- `src/citizen/components/PlatformAlert.tsx`
- `src/citizen/components/NetworkBanner.tsx`
- `src/citizen/components/PageShell.tsx` (`ErrorState`)
- `src/citizen/components/services/ServiceConnectionPanel.tsx`
- `src/citizen/components/egs/MinistryHealthPanel.tsx`
- `src/index.css` · `src/citizen/theme/trust-light.css`

## Probar contraste (T1 + T2 activos)

| Ruta | Sin API (error único) |
|------|------------------------|
| `/gestion` | ErrorState + sin banner duplicado |
| `/contratos` | Idem |
| `/proyectos?tab=salud` | Idem |
| `/modelos/egs/consola` | ServiceConnectionPanel o ErrorState, no triple stack |

## Dev

Terminal 1: `npm run api:public` · Terminal 2: `npm run dev`
