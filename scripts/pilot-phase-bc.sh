#!/usr/bin/env bash
# Fase B + C — onboarding institucional, baseline multi-sig, ingest demo, Q-close publicado.
set -euo pipefail

cd "$(dirname "$0")/.."

SLUG="${1:-mppi-trust-pilot}"

echo "[Fase B/C] Migración onboarding…"
npm run db:generate
npx prisma migrate deploy

echo "[Fase B] Onboard institucional ($SLUG)…"
npm run pilot:onboard -- --reset "$SLUG" 2>/dev/null || true
npm run pilot:onboard -- "$SLUG"

echo "[Fase B] Ratificar baseline multi-sig…"
npm run pilot:baseline-ratify -- "$SLUG"

echo "[Fase C] Ingest demo + centinela automático…"
npm run pilot:ingest-demo -- "$SLUG" || true

echo "[Fase C] Publicar Q-close…"
npm run pilot:q-close -- "$SLUG" --publish

echo ""
echo "[Fase B/C] ✅ Listo."
echo "  Onboarding: curl -s localhost:3001/api/ops/tenants/$SLUG/onboarding | head"
echo "  Health:     curl -s localhost:3001/api/public/egs/ministry-health/MPPI | head"
