# Piloto Fase A — Tenant por ministerio + ingest

Entorno piloto con **un tenant por ministerio/rubro**, baseline EGS sembrada, token Bearer para ingest de hitos verificados y API ops sin exponer credenciales.

## Requisitos

- Node.js ≥ 22
- Postgres local (`armada_core` en `:5432`)
- Variables en `.env` (ver `.env.example`)

## Bootstrap (una vez)

```bash
npm install
npm run pilot:phase-a
```

Equivale a:

```bash
npm run db:generate
npx prisma migrate deploy
npm run pilot:provision
```

### Provisionar por país (dinámico)

El comando lee `AGIGOV_ISO` del `.env` o acepta `--iso`:

```bash
# Venezuela (default)
npm run pilot:provision

# Colombia — MINTRANS · COP · AGIGOV-COL
AGIGOV_ISO=COL AGIGOV_CURRENCY=COP AGIGOV_LOCALE=es-CO npm run pilot:provision
# o
npm run pilot:provision -- --iso COL

# USA — USDOT · USD
npm run pilot:provision -- --iso USA
```

| ISO | Slug default | Ministerio | Moneda |
|-----|--------------|------------|--------|
| VEN | `mppi-trust-pilot` | MPPI | VES |
| COL | `mintrans-trust-pilot` | MINTRANS | COP |
| USA | `usdot-trust-pilot` | USDOT | USD |

### Provisionar otro ministerio (override manual)

```bash
npm run pilot:provision -- \
  --slug salud-fiscal \
  --ministry MINSALUD \
  --budget 4.02.01.01.00 \
  --name "Ministerio de Salud — Piloto Fiscal"
```

## Artefactos generados

| Archivo | Contenido |
|---------|-----------|
| `data/pilot-tenants/<slug>.manifest.json` | Metadatos publicables (sin token) |
| `data/pilot-tenants/<slug>.credentials.json` | Token ingest + URLs (**gitignored**) |

El token solo se muestra en consola al provisionar. Rotar = re-provisionar (regenera hash).

## API ops

Con `npm run api:public` en `:3001`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ops/tenants` | Lista tenants (sin tokens) |
| `GET` | `/api/ops/health` | Postgres, ledger, panic mode |
| `POST` | `/api/ops/ingest/:slug` | Ingest hitos (`Authorization: Bearer <token>`) |

### Cuerpo ingest

```json
{
  "rows": [
    {
      "contractRef": "escrow-vial-pilot-c01",
      "milestoneIndex": 1,
      "amount": "1200.50",
      "evidenceRef": "hash-o-url-evidencia",
      "verifiedAt": "2026-07-06T12:00:00.000Z"
    }
  ]
}
```

- `contractRef` debe coincidir con `processId` del escrow sembrado en el piloto vial.
- Filas duplicadas (mismo escrow + milestone) se omiten (`skipped`).
- En `PANIC_MODE` el ingest responde `503`.

### Demo rápido

```bash
npm run pilot:ingest-demo
# o con slug:
npm run pilot:ingest-demo -- mppi-trust-pilot
```

Requiere API pública levantada y credenciales en `data/pilot-tenants/`.

## Consola ciudadana

```bash
npm run dev   # :3000
```

- Consola EGS: `/modelos/egs/consola`
- Health ministerio: `/api/public/egs/ministry-health/MPPI` (vía proxy)

## Multisig piloto (opcional, Fase B)

```bash
npm run pilot:init
npm run pilot:ratify
npm run pilot:verify
```

La provision Fase A llama `initPilotActa` por defecto.

## Comandos útiles

```bash
npm run pilot:status          # tenants en DB
curl -s localhost:3001/api/ops/tenants | jq
```

## Siguiente fase

| Fase | Entregable | Runbook |
|------|------------|---------|
| **B** | Registro institucional, DID/multi-sig real, onboarding cliente | [PILOTO-FASE-B-C-RUNBOOK.md](./PILOTO-FASE-B-C-RUNBOOK.md) |
| **C** | Baseline firmada → ingest → centinela → Q-close | [PILOTO-FASE-B-C-RUNBOOK.md](./PILOTO-FASE-B-C-RUNBOOK.md) |
| **D** | Billing success fee sobre Δ; metering en ledger | pendiente |
