# Oracle Cloud Always Free — nodo territorial ARM

## Recursos objetivo

| Recurso | Spec free tier |
|---------|----------------|
| Compute | VM.Standard.A1.Flex (4 OCPU / 24 GB RAM) |
| Disco | 200 GB boot |
| Egress | 10 TB/mes |

## Pasos

1. Crear VM Ampere ARM64 (Ubuntu 22.04).
2. Instalar Docker + Docker Compose plugin.
3. Clonar repo Armada; copiar `.env` con `DATABASE_URL` del core (VPN/WireGuard).
4. Levantar edge:

```bash
export ORIGIN_NODE_ID=node-vzla-maracaibo-01
export TERRITORY_CODE=MAR_NORTH_01
export NODE_TIER=peripheral
docker compose -f infra/docker-compose.edge.yml up -d --build
```

5. Cron backup:

```bash
0 3 * * * /opt/armada/infra/backup/backup-edge.sh >> /var/log/armada-backup.log 2>&1
```

## Validación diferida (Fase 6)

- Soak 72h offline en hardware real
- Failover si core cae > 24h
- Cuota egress OCI
