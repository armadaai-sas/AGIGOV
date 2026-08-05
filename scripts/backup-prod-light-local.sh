#!/usr/bin/env bash
# Backup local prod-light (Postgres dump + data/) — cron on Droplet
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="${BACKUP_DIR:-$ROOT/backups}"
mkdir -p "$OUT"
cd "$ROOT"
if [ -f "$ROOT/infra/.env.prod" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/infra/.env.prod"
  set +a
fi
if docker ps --format '{{.Names}}' | grep -q '^armada-postgres-light$'; then
  docker exec armada-postgres-light pg_dump -U "${POSTGRES_USER:-armada}" "${POSTGRES_DB:-armada_core}" \
    | gzip > "$OUT/pg-${STAMP}.sql.gz"
fi
if [ -d "$ROOT/data" ]; then
  tar -czf "$OUT/data-${STAMP}.tar.gz" -C "$ROOT" data
fi
find "$OUT" -type f -mtime +7 -delete 2>/dev/null || true
echo "[Backup] OK $STAMP → $OUT"
