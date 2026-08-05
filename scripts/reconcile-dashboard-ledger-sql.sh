#!/usr/bin/env bash
# P2: dashboard↔ledger via SQL on prod-light (no host Prisma engine needed).
# Uso: ./scripts/reconcile-dashboard-ledger-sql.sh
set -euo pipefail
CONTAINER="${POSTGRES_CONTAINER:-armada-postgres-light}"
PG_USER="${POSTGRES_USER:-armada}"
PG_DB="${POSTGRES_DB:-armada_core}"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "[ReconcileSQL] FAIL: $CONTAINER no up" >&2
  exit 1
fi

PUBLISHED=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAc \
  "SELECT COUNT(*) FROM \"ProcessCheckpoint\" WHERE status = 'published';" | tr -d '[:space:]')
MISSING=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAc \
  "SELECT COUNT(*) FROM \"ProcessCheckpoint\" pc
   WHERE pc.status = 'published'
   AND NOT EXISTS (
     SELECT 1 FROM \"LedgerEntry\" le
     WHERE le.\"processId\" = pc.\"processId\"
       AND le.\"entryType\" IN ('PROCESS', 'ACTA', 'ESCROW', 'VOTE')
   );" | tr -d '[:space:]')
PII_KEYS=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAc \
  "SELECT COUNT(*) FROM \"ProcessCheckpoint\"
   WHERE status = 'published'
   AND (
     \"evidenceBundle\"::text ILIKE '%\"email\"%'
     OR \"evidenceBundle\"::text ILIKE '%\"passwordHash\"%'
     OR \"evidenceBundle\"::text ILIKE '%\"privateKey\"%'
     OR \"evidenceBundle\"::text ILIKE '%\"ingestToken\"%'
   );" | tr -d '[:space:]')

echo "[ReconcileSQL] published=$PUBLISHED missingLedger=$MISSING piiKeyHits=$PII_KEYS"
if [ "$MISSING" != "0" ] || [ "$PII_KEYS" != "0" ]; then
  echo "[ReconcileSQL] FAIL" >&2
  exit 1
fi
echo "[ReconcileSQL] OK"
