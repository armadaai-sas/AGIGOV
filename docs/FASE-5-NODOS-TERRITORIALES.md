# Fase 5 — Nodos territoriales y edge

Runbook operativo para nodos periféricos: sync diferido, LoRaWAN, backup y equidad territorial.

## Arquitectura

```
Sensor LoRaWAN → ChirpStack → MQTT → lorawan-handler
                                              ↓
                                    edge SQLite outbox
                                              ↓
                              sync-daemon (al reconectar)
                                              ↓
                                    Core Postgres ledger
```

## Componentes

| Componente | Ruta | Script |
|------------|------|--------|
| Bootstrap territorial | `src/edge/bootstrap.ts` | `npm run edge:bootstrap` |
| Sync diferido | `src/edge/sync-daemon.ts` | `npm run edge:daemon` |
| Ingest LoRaWAN | `src/ingest/lorawan-handler.ts` | `npm run ingest:lorawan` |
| Verificación firma sensor | `src/ingest/payload-verify.ts` | — |
| Demo uplink MQTT | `src/ingest/lorawan-demo-pub.ts` | `npm run ingest:lorawan-demo` |
| Simulación offline | `scripts/simulate-offline-72h.ts` | `npm run test:offline-72h` |

## Quick start (local)

```bash
npm run infra:up:dev
npm run db:seed
./scripts/edge-provision.sh

# Terminal 1 — sync diferido
npm run edge:daemon

# Terminal 2 — ingest LoRaWAN (requiere Mosquitto)
npm run ingest:lorawan

# Terminal 3 — demo uplink firmado
npm run ingest:lorawan-demo
```

## Equidad territorial

- Todos los nodos usan **FIFO por `createdAt`** — sin cola secundaria para periféricos.
- `NODE_TIER=peripheral` documenta el nodo; **no degrada** prioridad de sync.
- Cada registro lleva `originNodeId` en core y edge.

## Infra Docker

```bash
# Edge node (sync + LoRaWAN handler)
docker compose -f infra/docker-compose.edge.yml up -d --build

# ChirpStack (opcional — requiere Mosquitto dev)
docker compose -f infra/docker-compose.lorawan.yml up -d
```

Guías Always Free: `infra/deploy/oracle-always-free.md`, `infra/deploy/gcp-e2-micro.md`

## Backup off-site

```bash
cp infra/backup/rclone.conf.example infra/backup/rclone.conf
# Editar credenciales
chmod +x infra/backup/backup-edge.sh
./infra/backup/backup-edge.sh
```

Cron recomendado: diario 03:00 UTC.

## Validaciones diferidas → Fase 6

Estas pruebas requieren hardware, VPN o tiempo prolongado. Se ejecutan al **cierre de todas las fases**:

| Validación | Motivo de diferimiento |
|------------|------------------------|
| Soak 72h offline real | Requiere VM edge dedicada + desconexión controlada |
| Gateway LoRaWAN físico + ChirpStack E2E | Requiere hardware LoRa y región RF configurada |
| Despliegue Oracle/GCP en producción | Requiere cuentas cloud y WireGuard al core |
| Backup rclone a destino real | Requiere bucket/credenciales off-site |
| Centinela post-sync en nodo periférico | Integración Fase 3 + 5 en prod |

La simulación `npm run test:offline-72h` verifica **drenado de cola** en dev; no sustituye el soak 72h.
