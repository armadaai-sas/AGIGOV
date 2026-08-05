#!/usr/bin/env bash
# P7 — audit run unificado P0–P6 (gate pre piloto #4 / pre-prod).
# Uso: npm run audit:run
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0
run() {
  local name="$1"
  shift
  echo ""
  echo "── $name ──"
  if "$@"; then
    echo "PASS $name"
  else
    echo "FAIL $name" >&2
    FAIL=$((FAIL + 1))
  fi
}

echo "[AuditRun] AGIGOV gate P0–P6 · $(date -u +%Y-%m-%dT%H:%M:%SZ)"

run lint npm run lint
run smoke npm run test:smoke
run billing npm run test:billing
run webhook npm run test:webhook
run pqc npm run pqc:inventory
run panic npm run panic:drill
run p5 npm run p5:verify-network
run p6 npm run p6:verify
run build npm run build

# Opcionales (no fallan el gate si DB/APIs ausentes)
echo ""
echo "── optional:p4 finance (needs Postgres) ──"
if npm run p4:finance-e2e; then
  echo "PASS optional:p4"
else
  echo "SKIP/FAIL optional:p4 (Postgres?) — no bloquea gate offline"
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "[AuditRun] GATE PASS ($FAIL fails)"
  exit 0
fi
echo "[AuditRun] GATE FAIL — $FAIL checks" >&2
exit 1
