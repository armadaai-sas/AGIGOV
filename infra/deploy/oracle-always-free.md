# Oracle Cloud Always Free — ARM (core + edge)

## Recursos objetivo

| Recurso | Spec free tier |
|---------|----------------|
| Compute | VM.Standard.A1.Flex (Ampere ARM64; p.ej. 1–4 OCPU / 6–24 GB) |
| Disco | hasta 200 GB boot |
| Egress | 10 TB/mes |

**Imagen:** Ubuntu 22.04 **aarch64**.

**Firewall OCI (security list):** solo **SSH 22** desde tu IP. No abrir 5432, 1883 ni 3001 — la API sale por Cloudflare Tunnel.

---

## Core prod-light (recomendado para P0)

Stack: [`infra/docker-compose.prod.light.yml`](../docker-compose.prod.light.yml) vía [`scripts/prod-up-light.sh`](../../scripts/prod-up-light.sh) (~900 MB–1.2 GB).  
Este Mac débil **no** corre Docker; la VM Oracle es el runtime.

### 1. Crear la VM

1. Oracle Cloud → Compute → Create instance.
2. Shape: `VM.Standard.A1.Flex` (Always Free eligible).
3. OS: Canonical Ubuntu 22.04 (aarch64).
4. Añadir tu clave SSH pública.
5. Anota la IP pública → `OCI_HOST`.

### 2. Sync desde el Mac (default; sin GitHub SSH)

En este Mac el push a GitHub puede fallar (`Permission denied (publickey)`). **Default:** rsync directo Mac → VM.

```bash
export OCI_HOST="<IP_PUBLICA>"
export OCI_USER="${OCI_USER:-ubuntu}"
export OCI_DIR="${OCI_DIR:-/opt/agigov}"

# Desde la raíz del repo
./scripts/oci-prod-light-sync.sh
```

Exclusiones: `node_modules`, `.env`, claves `*.core-keys.json` / `*.institution-keys.json`, outbox de email, caches.  
Alternativa en la VM: `git clone` por HTTPS si el remoto es accesible.

### 3. Bootstrap en la VM (Docker + stack)

Desde el Mac (SSH remoto idempotente):

```bash
export OCI_HOST="<IP_PUBLICA>"
./scripts/oci-prod-light-bootstrap.sh
```

O orquestado (sync + bootstrap + health):

```bash
export OCI_HOST="<IP_PUBLICA>"
./scripts/oci-prod-light-deploy.sh
```

El bootstrap:

1. Instala Docker Engine + plugin Compose (ARM).
2. Asegura `infra/.env.prod` (desde example; genera claves swarm si faltan).
3. Ejecuta `./scripts/prod-up-light.sh`.
4. Verifica `curl -sf http://127.0.0.1:3001/api/ops/health`.

### 4. Cloudflare Tunnel (exposición HTTPS)

En la VM, **sin** abrir el puerto 3001 en OCI:

**Smoke (rápido):**

```bash
# En la VM, con el stack ya healthy
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o /tmp/cloudflared
chmod +x /tmp/cloudflared
sudo mv /tmp/cloudflared /usr/local/bin/cloudflared
cloudflared tunnel --url http://127.0.0.1:3001
```

Copia la URL `https://*.trycloudflare.com` y prueba:

```bash
curl -sf "https://<TUNNEL_HOST>/api/ops/health"
```

**Producción (túnel named + DNS):**

```bash
cloudflared tunnel login
cloudflared tunnel create agigov-prod-light
# Configura ingress → http://127.0.0.1:3001
# DNS CNAME al túnel en el dashboard Cloudflare
sudo cloudflared service install
```

Helper desde el Mac (SSH):

```bash
export OCI_HOST="<IP_PUBLICA>"
./scripts/oci-cloudflare-tunnel.sh          # smoke (foreground remoto)
# o TUNNEL_MODE=install ./scripts/oci-cloudflare-tunnel.sh
```

### 5. Criterio de done

| Check | Comando |
|-------|---------|
| Contenedores | `ssh $OCI_USER@$OCI_HOST 'cd /opt/agigov && docker compose -f infra/docker-compose.prod.light.yml ps'` |
| Health local VM | `ssh ... 'curl -sf http://127.0.0.1:3001/api/ops/health'` → `"ok":true`, `"postgres":true` |
| Health vía Cloudflare | `curl -sf https://<host>/api/ops/health` |
| Piloto (opcional) | `PUBLIC_API_BASE=https://<host> npm run pilot:verify` (desde Mac o VM) |

---

## Edge territorial (periférico)

Cuando el core ya existe y hay WireGuard/VPN:

1. Instalar Docker en otra VM o en la misma (perfil edge).
2. Sync repo; copiar `.env` con `DATABASE_URL` del core (VPN).
3. Levantar edge:

```bash
export ORIGIN_NODE_ID=node-vzla-maracaibo-01
export TERRITORY_CODE=MAR_NORTH_01
export NODE_TIER=peripheral
docker compose -f infra/docker-compose.edge.yml up -d --build
```

4. Cron backup:

```bash
0 3 * * * /opt/agigov/infra/backup/backup-edge.sh >> /var/log/agigov-backup.log 2>&1
```

## Validación diferida (Fase 6)

- Soak 72h offline en hardware real
- Failover si core cae > 24h
- Cuota egress OCI

## Variables de entorno

| Variable | Default | Uso |
|----------|---------|-----|
| `OCI_HOST` | (requerida) | IP o hostname SSH |
| `OCI_USER` | `ubuntu` | Usuario SSH |
| `OCI_DIR` | `/opt/agigov` | Ruta remota del repo |
| `OCI_SSH_KEY` | (agent / default) | Clave privada opcional `-i` |
| `HONEYPOT` | `0` | `1` añade perfil honeypot en prod-light |
