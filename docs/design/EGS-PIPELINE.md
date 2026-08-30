# EGS — Pipeline multiagente

Pipeline honesto para el modelo EGS (Efficiency Gain Sharing). La consola **no infiere** progreso desde spinners: lee Postgres + `processCheckpoint.agentId`.

## Superficie API

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/public/models/egs/pipeline` | GET | Estado en vivo (stages + swarm) |
| `/api/public/models/egs/connect` | POST | `{ mode, ministryCode? }` |
| `/api/public/models/egs/disconnect` | POST | Limpia contexto consola |
| `/api/public/egs/ministry-health` | GET | Telemetría fiscal publicada |

## Modos connect

| mode | Qué significa |
|------|----------------|
| `pilot_read` | Lectura del seed piloto vial (MPPI) |
| `institutional_ingest` | Operador ministerio con Bearer → ops ingest |
| `ops_api` | Provision + q-close vía scripts ops |

## Etapas y agentes (código hoy)

| Stage | Agente | Evidencia |
|-------|--------|-----------|
| provision | ops | `PilotTenant` activo |
| baseline | institution | `onboardingStatus` → ingest_ready |
| ingest | human | `releaseCount` / milestones |
| reconcile | **centinela** | `reconcileQuarterClose`, FREEZE |
| delta | logistico (centinela calcula) | `calculoAhorroFinal` |
| sovereign | **soberano** | **blocked** — SPLIT_APPROVED no implementado |
| publish | **comunicador** | `processCheckpoint` agentId=comunicador |
| serve | comunicador | ministry-health API |

## Enjambre vs IAP

- **Runtime real:** Centinela + Comunicador en `tenant-q-close.ts` y `reconcile-quarter-close.ts`.
- **Roadmap:** Soberano (dictamen reparto), Logístico (allocación vía bus), Conciliador (disputas).
- **IAP MQTT:** `swarm.iapWired: false` — ingest/Q-close no enrutan por bus aún.

## Código

- Backend: `src/egs/pipeline.ts`
- Consola: `src/citizen/pages/EgsVialConsolePage.tsx`
- UI enjambre: `src/citizen/components/egs/EgsAgentPipeline.tsx`
- Connect: `src/citizen/components/egs/EgsConnectWizard.tsx`

## Ops local

```bash
npm run db:seed:egs-pilot
npm run api:public
npm run dev
# Consola → /modelos/egs/consola → Conectar lectura piloto
```
