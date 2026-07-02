# GCP e2-micro — nodo territorial alternativo

## Recursos objetivo

| Recurso | Spec free tier |
|---------|----------------|
| Compute | e2-micro (us-west1 / us-central1 / us-east1) |
| Disco | 30 GB standard |
| Egress | 1 GB/mes (región dependiente) |

## Pasos

1. Crear VM e2-micro Debian/Ubuntu en región elegible free tier.
2. Firewall: **no** exponer Postgres/MQTT; solo SSH + WireGuard.
3. Instalar Docker; clonar repo.
4. Conectar WireGuard al core (`infra/docker-compose.yml`).
5. Desplegar edge:

```bash
export ORIGIN_NODE_ID=node-vzla-valencia-01
export TERRITORY_CODE=MAR_NORTH_01
export NODE_TIER=peripheral
docker compose -f infra/docker-compose.edge.yml up -d --build
```

6. Backup off-site con `infra/backup/backup-edge.sh` + rclone → GCS bucket.

## Validación diferida (Fase 6)

- Latencia sync sobre VPN real
- Costo egress si dashboard público en mismo VM
