#!/usr/bin/env bash
# Bloque B — Mac viejo / poca RAM: Postgres + Mosquitto nativos (sin Docker)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() { echo ""; echo "━━ $1"; echo ""; }
fail() { echo "✗ $1"; echo ""; echo "Guía Mac viejo: docs/SETUP-GUIA-MAC.md#mac-viejo-sin-docker"; exit 1; }

step "N.0 — Comprobar herramientas"

for cmd in node npm brew; do
  command -v "$cmd" >/dev/null 2>&1 || fail "Falta $cmd. Instala Homebrew: https://brew.sh/"
  echo "✓ $cmd"
done

step "N.1 — Instalar Postgres 16 + Mosquitto (Homebrew)"

brew list postgresql@16 >/dev/null 2>&1 || brew install postgresql@16
brew list mosquitto >/dev/null 2>&1 || brew install mosquitto

PG_BIN="$(brew --prefix postgresql@16)/bin"
export PATH="$PG_BIN:$PATH"

step "N.2 — Configurar Mosquitto"

MOSQ_CONF_DIR="$(brew --prefix)/etc/mosquitto/conf.d"
mkdir -p "$MOSQ_CONF_DIR"
cp "$ROOT/infra/mosquitto/mosquitto.conf" "$MOSQ_CONF_DIR/armada.conf"
echo "✓ Config Mosquitto → $MOSQ_CONF_DIR/armada.conf"

step "N.3 — Arrancar servicios"

PG_DATA="$(brew --prefix)/var/postgresql@16"
if [ ! -d "$PG_DATA" ] || [ ! -f "$PG_DATA/PG_VERSION" ]; then
  echo "Inicializando Postgres (primera vez)..."
  mkdir -p "$PG_DATA"
  "$PG_BIN/initdb" --locale=C -E UTF-8 "$PG_DATA"
  echo "✓ initdb completado"
fi

brew services start postgresql@16
brew services start mosquitto

step "N.4 — Esperar Postgres (máx. 60s)"
READY=false
for i in $(seq 1 30); do
  if "$PG_BIN/pg_isready" -q 2>/dev/null; then
    READY=true
    echo "✓ Postgres listo (${i}x2s)"
    break
  fi
  printf "  esperando... %s/30\r" "$i"
  sleep 2
done
echo ""
[ "$READY" = true ] || fail "Postgres no arrancó. Prueba: brew services restart postgresql@16"

step "N.5 — Crear usuario y base de datos"

"$PG_BIN/psql" postgres -v ON_ERROR_STOP=0 <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'armada') THEN
    CREATE ROLE armada WITH LOGIN PASSWORD 'armada' SUPERUSER;
  END IF;
END
$$;
SQL

if ! "$PG_BIN/psql" postgres -tAc "SELECT 1 FROM pg_database WHERE datname='armada_core'" | grep -q 1; then
  "$PG_BIN/createdb" -O armada armada_core
  echo "✓ Base armada_core creada"
else
  echo "✓ Base armada_core ya existe"
fi

step "N.6 — Configuración .env"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ Creado .env desde .env.example"
else
  echo "✓ .env ya existe"
fi

if grep -q '^MQTT_URL=' .env; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|^MQTT_URL=.*|MQTT_URL="mqtt://127.0.0.1:1883"|' .env
  else
    sed -i 's|^MQTT_URL=.*|MQTT_URL="mqtt://127.0.0.1:1883"|' .env
  fi
  echo "✓ MQTT_URL → mqtt://127.0.0.1:1883"
fi

if grep -q '^DATABASE_URL=' .env; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://armada:armada@127.0.0.1:5432/armada_core?schema=public"|' .env
  else
    sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://armada:armada@127.0.0.1:5432/armada_core?schema=public"|' .env
  fi
  echo "✓ DATABASE_URL → Postgres local"
fi

step "N.7 — Migraciones y seed"

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

step "N.8 — Listo (modo nativo, sin Docker)"

cat <<'EOF'
Infra nativa lista ✓  (Postgres + Mosquitto vía Homebrew)

Cierra apps pesadas (Chrome con muchas pestañas) — este Mac tiene 4 GB RAM.

┌─ Terminal 1 ─────────────────────────────────────
│  npm run api:public
└─────────────────────────────────────────────────

┌─ Terminal 2 ─────────────────────────────────────
│  npm run dev
└─────────────────────────────────────────────────

┌─ Terminal 3 ─────────────────────────────────────
│  npm run block-b:pilot
└─────────────────────────────────────────────────

Verificar: npm run block-b:verify -- --native --api
Parar servicios: brew services stop postgresql@16 mosquitto
EOF
