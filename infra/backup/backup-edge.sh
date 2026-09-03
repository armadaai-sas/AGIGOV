#!/usr/bin/env bash
# Backup off-site de volúmenes edge (cron diario recomendado)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DATA_DIR="${EDGE_DATA_DIR:-$ROOT/data}"
KEYS_DIR="${EDGE_KEYS_DIR:-$ROOT/data/keys}"
REMOTE="${RCLONE_REMOTE:-agigov-backup:agigov-edge}"
STAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE="/tmp/agigov-edge-${STAMP}.tar.gz"

mkdir -p "$DATA_DIR" "$KEYS_DIR"

FILES=()
for f in edge.db iap-outbox.db did-registry.json; do
  [ -f "$DATA_DIR/$f" ] && FILES+=("$f")
done

if [ ${#FILES[@]} -eq 0 ]; then
  echo "[Backup] Sin archivos edge en $DATA_DIR"
  exit 1
fi

tar -czf "$ARCHIVE" -C "$DATA_DIR" "${FILES[@]}"

if [ -d "$KEYS_DIR" ] && [ "$(ls -A "$KEYS_DIR" 2>/dev/null)" ]; then
  tar -czf "${ARCHIVE}.keys" -C "$KEYS_DIR" .
fi

if command -v rclone >/dev/null 2>&1 && [ -f "$ROOT/infra/backup/rclone.conf" ]; then
  RCLONE_CONFIG="$ROOT/infra/backup/rclone.conf" \
    rclone copy "$ARCHIVE" "$REMOTE/" --progress
  [ -f "${ARCHIVE}.keys" ] && \
    RCLONE_CONFIG="$ROOT/infra/backup/rclone.conf" \
      rclone copy "${ARCHIVE}.keys" "$REMOTE/" --progress
  echo "[Backup] Subido a $REMOTE"
else
  echo "[Backup] rclone no configurado — local: $ARCHIVE"
fi

rm -f "$ARCHIVE" "${ARCHIVE}.keys" 2>/dev/null || true
