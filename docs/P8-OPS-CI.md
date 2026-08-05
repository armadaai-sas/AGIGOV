# P8 — Ops CI + handshake vivo

**Objetivo:** Endurecer el gate post-P7 con CI reproducible y verificación **viva** VEN↔SBX (APIs reales).

## Criterio de cierre

| Check | Comando / artefacto | Estado |
|-------|---------------------|--------|
| CI expandido | `.github/workflows/ci.yml` | lint, build, smoke, billing, webhook, pqc, p5, p6, doctor, panic |
| Handshake vivo | `npm run p8:verify` | Spawnea `api:public` + `api:sandbox` si hace falta |
| Runbook | este doc | obligatorio |

## Comandos

```bash
npm run p8:verify
# o solo handshake si ya hay APIs:
npm run api:public &
npm run api:sandbox &
npm run sbx:handshake
```

## Notas

- `/api/public/health` trata `ok` como proceso sirviendo (no pánico); `postgres` queda como campo advisory. Ops (`/api/ops/health`) sigue exigiendo Postgres.
- Sin Docker/Postgres local, el handshake peer sigue siendo válido; reconciliación ledger/p4 permanece opcional en `audit:run`.

## Gaps residuales (post-P8)

| Gap | Notas |
|-----|-------|
| CI + Postgres service | Endurecer `p4:finance-e2e` como job obligatorio |
| Deploy droplet | Redeploy cuando se pida (fuera de este gate) |
