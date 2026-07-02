#!/usr/bin/env bash
# Bloque B — atajo: setup completo + verificación infra
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

bash "$ROOT/scripts/setup-local-mac.sh"
bash "$ROOT/scripts/block-b-verify.sh"

echo ""
echo "━━ Bloque B — setup terminado"
echo ""
echo "Abre 2 terminales más y ejecuta:"
echo "  Terminal 1: npm run api:public"
echo "  Terminal 2: npm run dev"
echo "  Terminal 3: npm run block-b:pilot"
