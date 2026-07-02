# AGENTS.md — Armada VZLA

Sistema operativo soberano para reconstrucción nacional: agentes institucionales 24/7, ledger inmutable y dashboards ciudadanos.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4 (`src/`)
- **Skills:** `.cursor/skills/` (cripto, devops, datos, agentes, ciberseguridad, PWA, IAP, innovación)
- **Protocolo IAP:** `src/protocol/` (envelopes cifrados/firmados entre agentes)
- **Agentes:** `.cursor/agents/` (centinela, logistico, soberano, conciliador, comunicador)
- **Reglas:** `.cursor/rules/` (soberanía, ejecución por evidencia, enjambre)

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Arquitectura de ejecución

```
Sensores → centinela → logistico | soberano → ledger → comunicador → dashboard
```

Disputas: **conciliador** (grafo de confianza). Incidentes: **centinela** FREEZE + human-in-the-loop.

## Enjambre institucional

| Agente | Ministerio virtual | Acción clave |
|--------|-------------------|--------------|
| Centinela | Auditoría y seguridad | Valida ledger; congela irregularidades |
| Logístico | Recursos | Optimiza suministros; escrow programático |
| Soberano | Gobernanza | Dictamen vs whitepaper; lenguaje ciudadano |
| Conciliador | Justicia | Mediación por grafo de confianza |
| Comunicador | Transparencia | Telemetría → dashboards legibles |

Definiciones: `.cursor/agents/*.md`

## Convenciones

- Handoffs inter-agente con **SignedAgentEnvelope** v1 (`createSignedEnvelope` / `verifyAndOpenEnvelope`).
- Decisiones con **evidenceBundle** (hechos, hashes), no opiniones del LLM.
- Multi-sig y firmas Ed25519 antes de efectos irreversibles (`applied-cryptography`).
- Offline-first en nodos territoriales (`resilient-data-architecture`).
- PANIC_MODE congela mutaciones al ledger (`tactical-cybersecurity`).

## Boundaries

| Nivel | Regla |
|-------|-------|
| **Always** | Verificar firmas antes de commit; respetar FREEZE de centinela |
| **Ask first** | Desplegar infra, rotar claves, publicar dictámenes normativos |
| **Never** | Claves privadas en repo; bypass multi-sig; publicar datos pre-validación |

## Protocolo inter-agente (IAP v1)

```
createSignedEnvelope → bus MQTT/WG → verifyAndOpenEnvelope → ReplayGuard → handler
```

- Cifrado: X25519 + XChaCha20-Poly1305
- Firma: Ed25519 sobre campos externos canónicos
- Anti-replay: `nonce` + `messageId` + ventana temporal
- Skill: `.cursor/skills/inter-agent-protocol/`

## Bus soberano (MQTT + outbox)

Requiere **Node.js ≥ 22** (`node:sqlite`).

```bash
npm run bus:seed          # genera data/did-registry.json + claves demo
npm run bus:worker        # worker MQTT (broker vía WireGuard)
```

Código: `src/bus/` — `SovereignBusWorker`, `SqliteOutbox`, `DidRegistry`.

WireGuard debe estar activo antes de levantar el worker en modo soberano; ver `infra/README.md`.

## Ledger y datos (Fase 2)

```bash
npm run infra:up:dev       # incluye Postgres :5432
npm run db:generate
npm run db:migrate         # migración core
npm run db:migrate:edge    # SQLite edge en data/edge.db
npm run db:seed
npm run db:demo-sync       # demo offline → core
```

Código: `src/db/` · Schemas: `prisma/`, `prisma-edge/`

## Enjambre operativo (Fase 3)

```bash
npm run agents:flow    # demo pipeline local
npm run bus:worker     # worker con handler de AGENT_ROLE
```

Código: `src/agents/` · Workflows Dify stub: `workflows/`

## Interfaz ciudadana (Fase 4)

```bash
npm run infra:up:dev && npm run db:seed   # datos publicados demo
npm run api:public   # API pública :3001 (terminal 1)
npm run dev          # PWA :3000 con proxy /api (terminal 2)
npm run agents:flow  # pipeline → checkpoint published
```

Código: `src/citizen/` · API: `src/server/public-api.ts`

Rutas PWA: `/` (gestión), `/propuestas`, `/suministros`, `/institucional`

## Nodos territoriales (Fase 5)

```bash
./scripts/edge-provision.sh
npm run edge:daemon          # sync diferido al reconectar
npm run ingest:lorawan         # MQTT ChirpStack → outbox
npm run ingest:lorawan-demo    # uplink firmado demo
npm run test:offline-72h       # simulación cola (soak 72h → Fase 6)
npm run infra:up:edge          # Docker edge node
npm run infra:up:lorawan       # ChirpStack stack
```

Código: `src/edge/`, `src/ingest/` · Runbook: `docs/FASE-5-NODOS-TERRITORIALES.md`

## Pre-producción (Fase 6)

```bash
./scripts/prod-up-light.sh     # ~1 GB RAM (recomendado)
npm run pilot:init && npm run pilot:ratify && npm run pilot:verify
npm run panic:drill
```

Stack completo: `npm run infra:up:prod` · Docs: `docs/PRE-PRODUCTION.md` · Sizing: `docs/SERVER-SIZING.md` · Piloto: `docs/PILOTO-MULTISIG-CHECKLIST.md`

## Plan de ejecución

Roadmap completo: **[docs/PLAN-EJECUCION-FASES.md](docs/PLAN-EJECUCION-FASES.md)** · Canvas visual: `armada-plan-fases`

```bash
npm run infra:up:dev     # Mosquitto local
npm run bus:seed && npm run bus:worker   # receptor
npm run bus:send-demo    # emisor demo (otra terminal)
```
