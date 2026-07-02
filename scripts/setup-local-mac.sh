#!/usr/bin/env bash
# Bloque B — Docker: Postgres + Mosquitto + ledger + instrucciones finales
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() { echo ""; echo "━━ $1"; echo ""; }
fail() { echo "✗ $1"; echo ""; echo "Guía: docs/SETUP-GUIA-MAC.md"; exit 1; }

step "B.0 — Comprobar herramientas"

for cmd in node npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "Falta $cmd. Instala Node 22+ desde https://nodejs.org/"
  fi
  echo "✓ $cmd ($($cmd -v 2>/dev/null || $cmd --version | head -1))"
done

if ! command -v docker >/dev/null 2>&1; then
  step "B.1 — Docker no instalado"
  echo "1. Descarga Docker Desktop:"
  echo "   open https://www.docker.com/products/docker-desktop/"
  echo "2. Instala y abre Docker desde Applications"
  echo "3. Espera ícono verde 'Running' en la barra superior"
  echo "4. Reintenta: npm run setup:local"
  fail "Docker CLI no encontrado"
fi

echo "✓ docker $(docker --version | awk '{print $3}' | tr -d ',')"

if ! docker info >/dev/null 2>&1; then
  step "B.1 — Docker instalado pero no corriendo"
  echo "1. Abre Docker Desktop (Applications → Docker)"
  echo "2. Espera hasta ver 'Engine running' o ícono verde"
  echo "3. Reintenta: npm run setup:local"
  fail "Docker daemon no responde"
fi

echo "✓ Docker daemon activo"

step "B.2 — Configuración .env"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ Creado .env desde .env.example"
else
  echo "✓ .env ya existe"
fi

# Ajustar MQTT para dev local (macOS sed)
if grep -q '^MQTT_URL=' .env; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|^MQTT_URL=.*|MQTT_URL="mqtt://127.0.0.1:1883"|' .env
  else
    sed -i 's|^MQTT_URL=.*|MQTT_URL="mqtt://127.0.0.1:1883"|' .env
  fi
  echo "✓ MQTT_URL → mqtt://127.0.0.1:1883"
fi

step "B.3 — Levantar Postgres + Mosquitto"
npm run infra:up:dev

step "B.4 — Esperar Postgres (máx. 60s)"
READY=false
for i in $(seq 1 30); do
  if docker exec armada-postgres-dev pg_isready -U armada -d armada_core >/dev/null 2>&1; then
    READY=true
    echo "✓ Postgres listo (${i}x2s)"
    break
  fi
  printf "  esperando... %s/30\r" "$i"
  sleep 2
done
echo ""

if [ "$READY" != true ]; then
  fail "Postgres no respondió. Ejecuta: docker compose -f infra/docker-compose.dev.yml logs postgres"
fi

step "B.5 — Migraciones y seed"
npm run db:generate
npx prisma migrate deploy --schema prisma/schema.prisma
npm run db:migrate:edge
npm run db:seed

if [ ! -f data/did-registry.json ]; then
  npm run bus:seed >/dev/null
  echo "✓ DID registry generado"
else
  echo "✓ DID registry ya existe"
fi

step "B.6 — Verificación rápida"
docker compose -f infra/docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null || \
  docker compose -f infra/docker-compose.dev.yml ps

step "B.7 — Siguiente: 3 terminales"

cat <<'EOF'
Infra lista ✓

┌─ Terminal 1 ─────────────────────────────────────
│  cd /Users/macbook/Downloads/Armada_VZLA-main
│  npm run api:public
│  → http://127.0.0.1:3001/api/ops/health
└─────────────────────────────────────────────────

┌─ Terminal 2 ─────────────────────────────────────
│  cd /Users/macbook/Downloads/Armada_VZLA-main
│  npm run dev
│  → http://localhost:3000
└─────────────────────────────────────────────────

┌─ Terminal 3 (con T1 activa) ─────────────────────
│  npm run agents:flow
│  npm run pilot:init
│  npm run pilot:ratify
│  npm run pilot:verify
└─────────────────────────────────────────────────

Verificación final: npm run setup:check
Guía completa: docs/SETUP-GUIA-MAC.md
EOF
