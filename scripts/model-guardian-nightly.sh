#!/usr/bin/env bash
# Ejecución nocturna modelo-guardian — cron local o CI.
# Uso: bash scripts/model-guardian-nightly.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "[modelo-guardian] $(date -Iseconds) — audit + sync status"
npm run models:audit

BRIEF="docs/innovation/modelo-guardian-latest.md"
mkdir -p docs/innovation

{
  echo "# modelo-guardian — $(date -Iseconds)"
  echo ""
  echo "Ejecución automática \`npm run models:audit\` (sync agigovModels.ts ON)."
  echo ""
  echo "## Resumen"
  node -e "
    const r = require('./data/model-validation-report.json');
    console.log('- Aprobados:', r.summary.approved + '/' + r.summary.total);
    console.log('- Disponible / beta / roadmap:', r.summary.disponible, r.summary.beta, r.summary.roadmap);
    console.log('');
    console.log('| Modelo | T | O | C | Status |');
    console.log('|--------|---|---|---|--------|');
    for (const m of r.models) {
      console.log('|', m.modelId, '|', m.stages.tecnica, '|', m.stages.operacional, '|', m.stages.comercial, '|', m.recommendedStatus, '|');
    }
  "
} > "$BRIEF"

echo "[modelo-guardian] Brief → $BRIEF"
