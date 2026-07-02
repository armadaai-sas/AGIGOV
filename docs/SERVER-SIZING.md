# Pre-producción ligera — optimizada para servidores pequeños

Perfil objetivo: **Oracle e2-micro (1 GB)** · **GCP e2-micro** · VPS 2 GB.

## Ahorro vs stack completo

| Stack | Contenedores | RAM estimada |
|-------|--------------|--------------|
| `docker-compose.prod.yml` | 9 (5 agentes separados) | ~2.5–3.5 GB |
| **`docker-compose.prod.light.yml`** | **4** (+ honeypot opcional) | **~900 MB–1.2 GB** |

### Optimizaciones aplicadas

- **Un solo contenedor `core-lite`**: API pública + enjambre mínimo (centinela + comunicador)
- **Postgres tuneado**: `shared_buffers=128MB`, `max_connections=30`
- **Node `--max-old-space-size=96`** por worker
- **Imagen Docker**: `npm prune --omit=dev` tras generar Prisma
- **Honeypot**: perfil opcional (`HONEYPOT=1`) — no corre por defecto
- **Agentes logístico/soberano/conciliador**: disponibles bajo perfil `agents-full` en compose completo

## Despliegue rápido

```bash
./scripts/prod-up-light.sh

# Con honeypot (+~64 MB)
HONEYPOT=1 ./scripts/prod-up-light.sh
```

## Piloto multi-sig

Ver checklist humano: **[PILOTO-MULTISIG-CHECKLIST.md](PILOTO-MULTISIG-CHECKLIST.md)**

```bash
npm run pilot:init      # borrador acta + escrow threshold
npm run pilot:ratify    # firmas demo + publicación
npm run pilot:verify    # acta + dashboard vs ledger
```

## Variables de ahorro (`.env.prod`)

```bash
NODE_OPTIONS="--max-old-space-size=96"
SWARM_LITE_ROLES="centinela,comunicador"
BUS_FLUSH_INTERVAL_MS=30000
EDGE_SYNC_INTERVAL_MS=60000
```

## Escalar cuando crezca la carga

1. Añadir roles: `SWARM_LITE_ROLES=centinela,comunicador,soberano`
2. Migrar a `docker-compose.prod.yml` (agentes aislados)
3. Postgres dedicado en managed service
4. PWA en CDN estático (no en el mismo VM)

## Monitoreo mínimo

```bash
curl http://127.0.0.1:3001/api/ops/health
docker stats --no-stream
```

`ok: true` requiere Postgres up y `panicMode: false`.
