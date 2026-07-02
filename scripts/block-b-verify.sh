#!/usr/bin/env bash
# Bloque B — verificar infra Docker + API (opcional)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_URL="${CORE_HEALTH_URL:-http://127.0.0.1:3001/api/ops/health}"
CHECK_API="${1:-}"

step() { echo ""; echo "━━ $1"; echo ""; }
ok() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; ERR=1; }

ERR=0

step "B.verify — Docker"
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  ok "Docker daemon"
else
  fail "Docker — abre Docker Desktop"
fi

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^armada-postgres-dev$'; then
  ok "Contenedor armada-postgres-dev"
else
  fail "Postgres no corre → npm run setup:local"
fi

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^armada-mosquitto-dev$'; then
  ok "Contenedor armada-mosquitto-dev"
else
  fail "Mosquitto no corre → npm run setup:local"
fi

if docker exec armada-postgres-dev pg_isready -U armada -d armada_core >/dev/null 2>&1; then
  ok "Postgres acepta conexiones"
else
  fail "Postgres no responde pg_isready"
fi

step "B.verify — Archivos locales"
[ -f .env ] && ok ".env" || fail ".env — npm run setup:local"
[ -f data/did-registry.json ] && ok "data/did-registry.json" || fail "npm run bus:seed"
[ -d src/generated/core ] && ok "Prisma client core" || fail "npm run db:generate"

step "B.verify — API pública (opcional)"
if [ "$CHECK_API" = "--api" ]; then
  if curl -sf "$API_URL" >/dev/null 2>&1; then
    ok "API ops health ($API_URL)"
    curl -s "$API_URL" | head -c 300
    echo ""
  else
    fail "API no responde — inicia: npm run api:public"
  fi
else
  echo "  ⚠ Omitido (usa --api para comprobar Terminal 1)"
fi

echo ""
if [ "$ERR" -eq 0 ]; then
  echo "✓ Bloque B infra OK"
  echo "  Siguiente: npm run block-b:pilot  (con api:public + dev en otras terminales)"
  exit 0
fi

echo "✗ Revisa errores arriba — docs/SETUP-GUIA-MAC.md"
exit 1
