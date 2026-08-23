#!/usr/bin/env bash
# Despliegue pre-prod OPTIMIZADO (~1–2 GB RAM)
# Uso: ./scripts/prod-up-light.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="infra/.env.prod"
COMPOSE="infra/docker-compose.prod.light.yml"

if [ ! -f "$ENV_FILE" ]; then
  cp infra/.env.prod.example "$ENV_FILE"
  echo "[ProdLight] Creado $ENV_FILE"
fi

if ! grep -q 'NODE_ED25519_SECRET_KEY_B64_CENTINELA' "$ENV_FILE" 2>/dev/null; then
  echo "[ProdLight] Generando claves swarm-lite + DID registry..."
  mkdir -p data
  npm run bus:seed >/dev/null
  npx tsx scripts/export-swarm-env.ts >> "$ENV_FILE"
  echo "[ProdLight] Claves añadidas a $ENV_FILE (revisar antes de prod real)"
fi

# Perfil honeypot opcional: HONEYPOT=1 ./scripts/prod-up-light.sh
# HTTPS quick tunnel: TUNNEL=1 ./scripts/prod-up-light.sh  (URL en logs: docker logs armada-tunnel-light)
# Named CF tunnel: TUNNEL_NAMED=1 + CLOUDFLARE_TUNNEL_TOKEN in .env.prod
PROFILES=""
if [ "${HONEYPOT:-0}" = "1" ]; then
  PROFILES="$PROFILES --profile honeypot"
fi
if [ "${TUNNEL:-0}" = "1" ]; then
  PROFILES="$PROFILES --profile tunnel"
fi
if [ "${TUNNEL_NAMED:-0}" = "1" ]; then
  PROFILES="$PROFILES --profile tunnel-named"
fi

echo "[ProdLight] Levantando stack ligero..."
docker compose -f "$COMPOSE" --env-file "$ENV_FILE" $PROFILES up -d --build

echo "[ProdLight] Migraciones + seed (one-shot)..."
docker compose -f "$COMPOSE" --env-file "$ENV_FILE" run --rm migrate

echo "[ProdLight] Health checks..."
for _i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/ops/health" >/dev/null; then
    break
  fi
  sleep 2
done
# Refresh nginx upstream after core recreate (avoids sticky stale DNS → 502 on /api/).
docker compose -f "$COMPOSE" --env-file "$ENV_FILE" $PROFILES restart web >/dev/null
sleep 2
curl -sf "http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/ops/health" | head -c 500 || true
echo ""
for _i in $(seq 1 15); do
  if curl -sf "http://127.0.0.1:${WEB_PORT:-80}/api/ops/health" >/dev/null; then
    break
  fi
  sleep 2
done
curl -sf "http://127.0.0.1:${WEB_PORT:-80}/api/ops/health" | head -c 200 || echo "[ProdLight] WARN: nginx /api still unhealthy"
echo ""
echo "[ProdLight] Listo."
echo "  AGIGOV UI:  http://127.0.0.1:${WEB_PORT:-80}/"
echo "  API ops:    http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/ops/health"
echo "  Dashboard:  http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/public/dashboard"
echo "  Piloto:     npm run pilot:verify"
if [ "${HONEYPOT:-0}" = "1" ]; then
  echo "  Honeypot:   http://127.0.0.1:8088/admin"
fi
if [ "${TUNNEL:-0}" = "1" ]; then
  echo "  HTTPS:      docker logs armada-tunnel-light 2>&1 | grep trycloudflare"
  for _i in $(seq 1 20); do
    _url="$(docker logs armada-tunnel-light 2>&1 | grep -Eo 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' | tail -n 1 || true)"
    if [ -n "${_url}" ]; then
      echo "  HTTPS_URL=${_url}"
      break
    fi
    sleep 1
  done
fi
if [ "${TUNNEL_NAMED:-0}" = "1" ]; then
  echo "  HTTPS:      named Cloudflare tunnel (CLOUDFLARE_TUNNEL_TOKEN)"
fi
