# Proceso 05 — Servidores, deploy y operaciones

Runbook para desplegar y operar AGIGOV en cloud (referencia: droplet `137.184.66.163`).

## Perfiles de stack

| Perfil | Script / comando | RAM | Uso |
|--------|------------------|-----|-----|
| Dev local | `npm run infra:up:dev` | — | Postgres + Mosquitto local |
| Prod-light | `./scripts/prod-up-light.sh` | ~1 GB | Piloto / demo mundial |
| Prod completo | `npm run infra:up:prod` | ~2.5–3.5 GB | Enjambre 5 agentes |

Sizing: [SERVER-SIZING.md](../SERVER-SIZING.md) · Pre-prod: [PRE-PRODUCTION.md](../PRE-PRODUCTION.md)

## Deploy prod-light (pasos)

### S1 — Preparar VM

- [ ] Docker instalado
- [ ] Puertos 80/443 (o reverse proxy)
- [ ] `.env.prod` desde `infra/.env.prod.example`

### S2 — Levantar stack

```bash
./scripts/prod-up-light.sh
# o remoto:
npm run infra:up:prod:light
```

### S3 — Base de datos

```bash
npm run db:migrate
# seed solo demo/staging:
npm run db:seed
```

### S4 — Verificación

```bash
curl -s http://127.0.0.1:3001/api/ops/health
curl -s http://127.0.0.1/api/public/health
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/
```

Desde fuera: `http://137.184.66.163/api/public/health`

### S5 — CI deploy (recomendado)

Workflow: `.github/workflows/deploy-prod-light.yml`

- [ ] Push a rama acordada dispara deploy
- [ ] Post-deploy: health + smoke manual o script

## Operaciones diarias

| Tarea | Comando / URL |
|-------|----------------|
| Health ops | `GET /api/ops/health` |
| Health público | `GET /api/public/health` |
| Logs Docker | `npm run infra:logs` |
| Doctor | `npm run doctor` |
| Piloto multi-sig | `npm run pilot:verify` |

## Gates release (servidor)

Orden obligatorio antes de anunciar release:

```bash
npm run doctor
npm run audit:run
npm run p8:verify
npm run p9:go
```

Docs: [P8-OPS-CI.md](../P8-OPS-CI.md) · [P9-RELEASE-GO.md](../P9-RELEASE-GO.md)

## Incidentes

| Síntoma | Primer paso |
|---------|-------------|
| Health != ok | `doctor` + logs contenedor API |
| UI 502/reset | Verificar Vite/nginx/static + proceso node |
| Pánico activo | [PANIC-RUNBOOK.md](../PANIC-RUNBOOK.md) |
| Postgres down | `docker compose` status + restart advisory |

## WireGuard / edge (fase territorial)

Ver [FASE-5-NODOS-TERRITORIALES.md](../FASE-5-NODOS-TERRITORIALES.md). WireGuard activo antes de `bus:worker` en modo soberano.

## Evidencia para terceros (SLA demo)

Proveer:

1. URL pública PWA
2. JSON health con timestamp
3. Versión/commit desplegado (`/api/public/config` si expone build)
4. Contacto humano `/institucional` (no mezclar con registro)

## Restricción operativa

**No ejecutar runtime del OS en PC Windows del operador** — solo git/editor local. Runtime en GitHub Actions, Cursor cloud o droplet.
