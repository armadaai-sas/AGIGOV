# Infraestructura soberana — Fases 1 y 2

Stack dev (`docker-compose.dev.yml`): **Postgres** (:5432), **Mosquitto** (:1883).

MQTT del bus IAP accesible de dos formas:

| Modo | Compose | MQTT_URL | Cuándo usar |
|------|---------|----------|-------------|
| **Dev** | `docker-compose.dev.yml` | `mqtt://127.0.0.1:1883` | Pruebas locales rápidas |
| **Soberano** | `docker-compose.yml` | `mqtt://10.8.0.1:1883` | Requiere cliente WireGuard |

## Desarrollo rápido

```bash
docker compose -f infra/docker-compose.dev.yml up -d
npm run db:generate && npm run db:migrate && npm run db:migrate:edge
npm run db:seed
npm run bus:seed
# Copiar claves de un agente a .env + MQTT_URL=mqtt://127.0.0.1:1883
npm run bus:worker
```

## Modo soberano (WireGuard)

```bash
cp infra/.env.example infra/.env
docker compose -f infra/docker-compose.yml --env-file infra/.env up -d

# Tras el primer arranque, importar peer en WireGuard:
# infra/wireguard/config/peer1/peer1.conf

# Activar túnel WG, luego:
# MQTT_URL=mqtt://10.8.0.1:1883
npm run bus:worker
```

El broker **no** expone puerto 1883 a internet; solo escucha dentro del namespace de red de WireGuard.

## Verificación

```bash
docker compose -f infra/docker-compose.dev.yml ps
docker compose -f infra/docker-compose.dev.yml logs -f mosquitto
```

## Producción

- Cambiar `allow_anonymous true` en `mosquitto/mosquitto.conf` por ACL + passwords
- No usar `docker-compose.dev.yml` en producción
- Rotar claves DID periódicamente (`npm run bus:seed` solo en entornos demo)

## Fase 5 — Edge territorial

Stack edge (`docker-compose.edge.yml`): **sync daemon**, **LoRaWAN handler**, volúmenes SQLite.

ChirpStack (`docker-compose.lorawan.yml`): LoRaWAN → MQTT → `npm run ingest:lorawan`.

```bash
./scripts/edge-provision.sh
npm run edge:daemon
npm run infra:up:edge
npm run infra:up:lorawan   # opcional
./infra/backup/backup-edge.sh
```

Runbook: `docs/FASE-5-NODOS-TERRITORIALES.md` · Deploy: `infra/deploy/`

## Pre-producción (Fase 6)

**Ligero (~1 GB):** `./scripts/prod-up-light.sh`

**Completo (~3 GB):** `npm run infra:up:prod`

Sizing: `docs/SERVER-SIZING.md` · Piloto: `docs/PILOTO-MULTISIG-CHECKLIST.md`
