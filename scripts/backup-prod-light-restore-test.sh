#!/usr/bin/env bash
# P2: backup → restore-to-temp → row-count verify (prod-light Postgres).
# Uso (en Droplet o local con contenedor agigov-postgres-light):
#   ./scripts/backup-prod-light-restore-test.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="${BACKUP_DIR:-$ROOT/backups}/restore-test"
mkdir -p "$OUT"

if [ -f "$ROOT/infra/.env.prod" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/infra/.env.prod"
  set +a
fi

PG_USER="${POSTGRES_USER:-agigov}"
PG_DB="${POSTGRES_DB:-agigov_core}"
TMP_DB="agigov_restore_test_${STAMP}"
DUMP="$OUT/pg-${STAMP}.sql.gz"
CONTAINER="${POSTGRES_CONTAINER:-agigov-postgres-light}"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "[RestoreTest] FAIL: contenedor $CONTAINER no está up" >&2
  exit 1
fi

echo "[RestoreTest] Dump $PG_DB → $DUMP"
docker exec "$CONTAINER" pg_dump -U "$PG_USER" "$PG_DB" | gzip > "$DUMP"

SRC_ENTRIES=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAc \
  'SELECT COUNT(*) FROM "LedgerEntry";' | tr -d '[:space:]')
SRC_CHECKPOINTS=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAc \
  'SELECT COUNT(*) FROM "ProcessCheckpoint";' | tr -d '[:space:]')

echo "[RestoreTest] Create temp DB $TMP_DB"
docker exec "$CONTAINER" psql -U "$PG_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TMP_DB\";" >/dev/null
docker exec "$CONTAINER" psql -U "$PG_USER" -d postgres -c "CREATE DATABASE \"$TMP_DB\";" >/dev/null

echo "[RestoreTest] Restore dump into $TMP_DB"
gunzip -c "$DUMP" | docker exec -i "$CONTAINER" psql -U "$PG_USER" -d "$TMP_DB" >/dev/null

DST_ENTRIES=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$TMP_DB" -tAc \
  'SELECT COUNT(*) FROM "LedgerEntry";' | tr -d '[:space:]')
DST_CHECKPOINTS=$(docker exec "$CONTAINER" psql -U "$PG_USER" -d "$TMP_DB" -tAc \
  'SELECT COUNT(*) FROM "ProcessCheckpoint";' | tr -d '[:space:]')

echo "[RestoreTest] Cleanup temp DB"
docker exec "$CONTAINER" psql -U "$PG_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TMP_DB\";" >/dev/null

echo "[RestoreTest] LedgerEntry: src=$SRC_ENTRIES dst=$DST_ENTRIES"
echo "[RestoreTest] ProcessCheckpoint: src=$SRC_CHECKPOINTS dst=$DST_CHECKPOINTS"

if [ "$SRC_ENTRIES" != "$DST_ENTRIES" ] || [ "$SRC_CHECKPOINTS" != "$DST_CHECKPOINTS" ]; then
  echo "[RestoreTest] FAIL: row counts diverge after restore" >&2
  exit 1
fi

echo "[RestoreTest] OK — dump/restore integrity verified ($STAMP)"
echo "[RestoreTest] Artifact: $DUMP"
