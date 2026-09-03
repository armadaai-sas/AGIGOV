# AGENTS.md — AGIGOV

Sistema operativo soberano para reconstrucción nacional: agentes institucionales 24/7, ledger inmutable y dashboards ciudadanos.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4 (`src/`)
- **Skills de agentes IA (config local, no versionada):** cripto, devops, datos, agentes, ciberseguridad, PWA, IAP, innovación, producto soberano, **legal-político**, **UX institucional**, **world-market-adviser**
- **Protocolo IAP:** `src/protocol/` (envelopes cifrados/firmados entre agentes)
- **Agentes runtime (producto):** `src/agents/` (centinela, logistico, soberano, conciliador, comunicador)
- **Agentes de desarrollo (config local, no versionada):** artesano-ui, comercial-agigov, modelo-guardian, cso-monetizacion, product-market-adviser
- **Equipo de expertos (comunidad/lanzamiento, versionado):** `.github/agents/*.agent.md` — ver sección [Equipo de expertos](#equipo-de-expertos-prelaunch--comunidad-github) abajo
- **Reglas de agentes IA (config local, no versionada):** soberanía, ejecución por evidencia, enjambre, **world-market-adviser**

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Procesos estándar (playbook)

Índice maestro para diseño, desarrollo, modelos, mantenimiento OS, deploy y terceros:

**[docs/process/README.md](docs/process/README.md)**

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
| **modelo-guardian** | Calidad catálogo | Audita 3 etapas · `npm run models:audit` |
| **artesano-ui** | Craft visual producto | Fase I catálogo · 6 h/día · design system |
| **comercial-agigov** | Ventas y GTM | One-pagers, decks, FAQ · ganar-ganar honesto |
| **product-market-adviser** | Producto → mercado mundial | Terminar producto · pruebas 100% reales · GTM |
| Innovador | Innovación y prosperidad | Monetización, macro, roadmap 24/7 |
| CSO Monetización | Estrategia comercial | Cuadro modelos, auditoría ingresos |

Definiciones (agentes de desarrollo, config local): consultar herramienta IA del equipo. Definiciones del equipo de expertos versionado: `.github/agents/*.agent.md`.

## Equipo de expertos (PRE-LAUNCH · comunidad GitHub)

Subagentes invocables en `.github/agents/` para cerrar el PRE-LAUNCH PILOT y abrir la comunidad open source: `lead-developer`, `lead-backend-developer`, `computer-science-architect`, `agentic-systems-architect`, `llm-research-lead`, `cybersecurity-expert`, `cryptography-expert`, `telemetry-expert`, `blockchain-dao-architect`, `product-manager`, `project-manager`, `app-ux-designer`, `oss-community-lead`, `growth-marketing-lead`, `content-creator-lead`, `ai-marketing-strategist`, `political-science-advisor`, `political-economist`, `social-science-researcher`.

## Producto y visión

Cuando el usuario no entienda qué es el proyecto o pida navegación/diseño/producto final, usar skill **`sovereign-product-studio`**.

| Necesidad | Skill |
|-----------|-------|
| Revisión legal, Carta, DAO, CNE, política VE/intl | **`state-legal-political`** |
| Colores, UX, accesibilidad PWA AGIGOV | **`civic-institutional-ux`** |
| Identidad premium (NASA/SpaceX/gov avanzado), logo, hero | **`premium-civic-design`** |
| Pilotos e innovación institucional | **`state-innovation`** |
| Qué sigue / priorizar muchos frentes | **`agigov-strategic-analysis`** |
| Monetización, tokens, DAO, ingresos | **`sovereign-economics-monetization`** |
| Validación 3 etapas catálogo modelos | **`model-validation`** + agente **`modelo-guardian`** |
| UI producto catálogo / fichas / 6 h craft | **`ui-product-craft`** + agente **`artesano-ui`** |
| Ventas, one-pagers, mercadeo modelos | **`agigov-gtm`** + agente **`comercial-agigov`** |
| CSO / Cuadro modelos / success fee / micro-tx | **`agigov-strategic-analysis`** + **`agigov-cso-deliverable`** + agente **`cso-monetizacion`** |
| País, PIB, geopolítica, proyectos estatales | **`macro-intelligence-governance`** |
| Geopolítica profunda, sanciones, escenarios macro/FX | **`geopolitics-macro-expert`** |
| Sistemas complejos (Estado/global), incentivos, cascadas | **`complex-systems-governance`** |
| Qué falta para prod / gate staging / GTM listo | **`production-readiness-orchestrator`** |
| Terminar producto · pruebas reales · mercado mundial | **`agigov-world-market-adviser`** + agente **`product-market-adviser`** |

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
- Skill: `.cursor/skills/inter-agent-protocol/` (config local)

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

Código: `src/agents/` · Stubs Dify (referencia, no runtime): `workflows/` — ver `workflows/README.md`

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

Roadmap completo: **[docs/PLAN-EJECUCION-FASES.md](docs/PLAN-EJECUCION-FASES.md)** · Canvas visual: `agigov-plan-fases`

```bash
npm run infra:up:dev     # Mosquitto local
npm run bus:seed && npm run bus:worker   # receptor
npm run bus:send-demo    # emisor demo (otra terminal)
```
