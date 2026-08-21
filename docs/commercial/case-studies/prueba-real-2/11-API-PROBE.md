# API probe — camino Trust Pack (NO es G20 PASS)

**Actor:** agent automated probe (no Operador B humano)  
**Env:** `do-prod-light` · `http://137.184.66.163`  
**UTC:** 2026-08-21T16:20Z  
**Veredicto G20:** sigue **NO-GO** (falta UI screenshots + informe humano)

## Resultados (live writes)

| Paso | Resultado |
|------|-----------|
| `POST /api/ops/auth/register` | **201** |
| `POST /api/ops/tenants/provision` | **201** slug `probe-g20-20260821112012` |
| `POST .../onboard` | `baseline_pending` · 3 signers COL |
| `POST .../baseline/ratify` | `ratified:true` · validCount **3**/3 |
| onboarding | `ingest_ready` · `ingestReady:true` |
| `POST /api/ops/ingest/:slug` (3 filas) | accepted **3** · `reconcileOk:true` |
| `POST .../q-close` `{publish:true}` | `ok:true` · `status:PUBLISHED` · `published:true` |

## Implicación

Backend del piloto fiscal **no bloquea** G20. El gap P0 sigue siendo **capturas UI humanas** (`artifacts/01`…`09` + `05-informe.md` PASS).

## Residual observado (no bloquea publish)

- `calculoAhorroFinal` muy negativo en este probe (dato demo/baseline) — revisar UX del paso 8 si confunde a B.
- `/api/public/pilot` nacional sigue `ok:false` (`multisigVerified:false`) — acta nacional distinta del tenant probe.
