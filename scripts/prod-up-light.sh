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
PROFILES=""
if [ "${HONEYPOT:-0}" = "1" ]; then
  PROFILES="--profile honeypot"
fi

echo "[ProdLight] Levantando stack ligero..."
docker compose -f "$COMPOSE" --env-file "$ENV_FILE" $PROFILES up -d --build

echo "[ProdLight] Migraciones + seed (one-shot)..."
docker compose -f "$COMPOSE" --env-file "$ENV_FILE" run --rm migrate

echo "[ProdLight] Health checks..."
sleep 3
curl -sf "http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/ops/health" | head -c 500 || true
echo ""
echo "[ProdLight] Listo."
echo "  AGIGOV UI:  http://127.0.0.1:${WEB_PORT:-80}/"
echo "  API ops:    http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/ops/health"
echo "  Dashboard:  http://127.0.0.1:${PUBLIC_API_PORT:-3001}/api/public/dashboard"
echo "  Piloto:     npm run pilot:verify"
if [ "${HONEYPOT:-0}" = "1" ]; then
  echo "  Honeypot:   http://127.0.0.1:8088/admin"
fi
