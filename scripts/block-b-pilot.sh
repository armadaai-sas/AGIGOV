#!/usr/bin/env bash
# Bloque B — Terminal 3: flujo agentes + piloto multi-sig
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() { echo ""; echo "━━ $1"; echo ""; }

step "B.pilot — Comprobaciones previas"
if ! docker exec agigov-postgres-dev pg_isready -U agigov -d agigov_core >/dev/null 2>&1; then
  echo "✗ Postgres no está listo. Ejecuta primero: npm run setup:local"
  exit 1
fi
echo "✓ Postgres OK"

if ! curl -sf http://127.0.0.1:3001/api/public/health >/dev/null 2>&1; then
  echo "⚠ API pública no responde en :3001"
  echo "  En otra terminal: npm run api:public"
  echo "  Continuando solo flujo agentes + DB..."
  API_UP=false
else
  echo "✓ API pública OK"
  API_UP=true
fi

step "B.pilot — Pipeline agentes (demo local)"
npm run agents:flow

step "B.pilot — Piloto multi-sig"
npm run pilot:init
npm run pilot:ratify

if [ "$API_UP" = true ]; then
  npm run pilot:verify
else
  echo ""
  echo "⚠ pilot:verify omitido — levanta api:public y ejecuta:"
  echo "  npm run pilot:verify"
fi

step "B.pilot — Listo"
echo "PWA: http://localhost:3000 (npm run dev en otra terminal)"
echo "Verificación infra: npm run block-b:verify -- --api"
