#!/usr/bin/env bash
# Provisiona un nodo territorial edge en local (sin Docker)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export ORIGIN_NODE_ID="${ORIGIN_NODE_ID:-node-mar-north-01}"
export TERRITORY_CODE="${TERRITORY_CODE:-MAR_NORTH_01}"
export NODE_TIER="${NODE_TIER:-peripheral}"
export EDGE_DATABASE_URL="${EDGE_DATABASE_URL:-file:./data/edge.db}"

mkdir -p data data/keys

echo "[Provision] Generando clientes Prisma..."
npm run db:generate
npm run db:migrate:edge

echo "[Provision] Bootstrap territorial..."
npm run edge:bootstrap

echo "[Provision] Listo. Inicia sync con: npm run edge:daemon"
