#!/usr/bin/env bash
# Sync repo Mac → VM Oracle (rsync). Bypass GitHub SSH.
# Uso: OCI_HOST=<ip> ./scripts/oci-prod-light-sync.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OCI_HOST="${OCI_HOST:?Set OCI_HOST to the VM public IP or hostname}"
OCI_USER="${OCI_USER:-ubuntu}"
OCI_DIR="${OCI_DIR:-/opt/agigov}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
RSYNC_RSH="ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15"
if [ -n "${OCI_SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$OCI_SSH_KEY")
  RSYNC_RSH="${RSYNC_RSH} -i ${OCI_SSH_KEY}"
fi

echo "[OCI sync] ${OCI_USER}@${OCI_HOST}:${OCI_DIR}"

ssh "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" "sudo mkdir -p '${OCI_DIR}' && sudo chown \$(whoami):\$(whoami) '${OCI_DIR}'"

rsync -az --delete \
  -e "$RSYNC_RSH" \
  --exclude 'node_modules/' \
  --exclude '.git/objects/' \
  --exclude '.env' \
  --exclude 'infra/.env' \
  --exclude 'infra/.env.prod' \
  --exclude 'data/*.db' \
  --exclude 'data/*.db-*' \
  --exclude 'data/*-keys.json' \
  --exclude 'data/*.core-keys.json' \
  --exclude 'data/*.institution-keys.json' \
  --exclude 'data/email-outbox.jsonl' \
  --exclude 'data/metering-events.jsonl' \
  --exclude 'dist/' \
  --exclude '.vite/' \
  --exclude 'coverage/' \
  --exclude '.DS_Store' \
  "$ROOT/" "${OCI_USER}@${OCI_HOST}:${OCI_DIR}/"

echo "[OCI sync] OK → ${OCI_USER}@${OCI_HOST}:${OCI_DIR}"
