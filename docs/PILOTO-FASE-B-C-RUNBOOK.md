# Piloto Fases B y C — Onboarding institucional + pipeline EGS

## Fase B — Registro institucional y baseline multi-sig

Por cada tenant (ministerio/rubro):

1. **DIDs institucionales** — ministerio, contraloría, centinela (`did:armada:ven:…`)
2. **Claves Ed25519** — `data/pilot-tenants/<slug>.institution-keys.json` (gitignored)
3. **Registro en DidRegistry** — merge en `data/did-registry.json`
4. **Acta baseline** — escrow multi-sig `acta-baseline-<slug>`
5. **Ratificación** — firmas verificadas contra registry (no keygen aleatorio)
6. **Estado `ingest_ready`** — habilita ingest Bearer

### Comandos

```bash
# Requiere tenant Fase A activo
npm run pilot:onboard -- mppi-trust-pilot
npm run pilot:baseline-ratify -- mppi-trust-pilot

# Estado
npm run pilot:onboard -- status mppi-trust-pilot
curl -s localhost:3001/api/ops/tenants/mppi-trust-pilot/onboarding | jq
```

### API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ops/tenants/:slug/onboarding` | Estado B |
| `POST` | `/api/ops/tenants/:slug/onboard` | Registro + baseline pending |
| `POST` | `/api/ops/tenants/:slug/baseline/ratify` | Multi-sig institucional |

### Signatarios (threshold 3)

| Rol | DID ejemplo (MPPI) |
|-----|-------------------|
| Ministerio | `did:armada:ven:ministerio:mppi` |
| Contraloría | `did:armada:ven:contraloria:mppi` |
| Centinela | `did:armada:ven:centinela:mppi` |

Re-demo en tenant existente:

```bash
npm run pilot:onboard -- --reset mppi-trust-pilot
npm run pilot:onboard -- mppi-trust-pilot
npm run pilot:baseline-ratify -- mppi-trust-pilot
```

---

## Fase C — Baseline firmada → ingest → centinela → Q-close

```
Baseline ratificada (B)
  → POST /api/ops/ingest/:slug (hitos verificados)
  → centinela reconcileQuarterClose (automático si accepted > 0)
  → POST /api/ops/tenants/:slug/q-close { "publish": true }
  → checkpoint published + QuarterClose PUBLISHED
```

### Ingest (requiere `ingest_ready`)

Responde `403 baseline_not_ratified` si Fase B no completada.

Tras ingest exitoso, la respuesta incluye bloque `centinela`:

```json
{
  "accepted": 1,
  "skipped": 0,
  "quarterCloseId": "…",
  "centinela": {
    "reconcileOk": true,
    "status": "PENDING_VALIDATION",
    "calculoAhorroFinal": 12345.67,
    "discrepancies": []
  }
}
```

### Publicar cierre trimestral

```bash
npm run pilot:q-close -- mppi-trust-pilot --publish
# o
curl -X POST localhost:3001/api/ops/tenants/mppi-trust-pilot/q-close \
  -H 'Content-Type: application/json' \
  -d '{"publish":true}'
```

### Bootstrap completo B+C

```bash
npm run pilot:phase-bc
# equivale a: migrate + onboard + ratify + ingest-demo + q-close --publish
```

---

## Verificación

```bash
npm run api:public   # :3001
curl -s localhost:3001/api/public/egs/ministry-health/MPPI | jq '.published, .quarterCloseStatus, .reconcileOk'
```

## Siguiente — Fase D

Billing success fee sobre Δ; metering reconciliado con ledger (`src/billing/metering.ts`).

Ver también: [PILOTO-FASE-A-RUNBOOK.md](./PILOTO-FASE-A-RUNBOOK.md)
