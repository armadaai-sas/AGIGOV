#!/usr/bin/env bash
# Fase A — migración + tenant piloto demo (ministerio + rubro + token ingest).
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[Fase A] Generando cliente Prisma…"
npm run db:generate

echo "[Fase A] Aplicando migraciones…"
npx prisma migrate deploy

echo "[Fase A] Provisionando tenant piloto (AGIGOV_ISO=${AGIGOV_ISO:-VEN})…"
npm run pilot:provision

echo ""
echo "[Fase A] ✅ Listo."
echo "  Terminal 1: npm run api:public"
echo "  Terminal 2: npm run dev"
echo "  Tenants:    curl -s http://127.0.0.1:3001/api/ops/tenants | head"
echo "  Ingest demo: npm run pilot:ingest-demo"
