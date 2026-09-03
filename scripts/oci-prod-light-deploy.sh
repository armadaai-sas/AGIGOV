#!/usr/bin/env bash
# Orchestrate: sync → bootstrap → health (Oracle Always Free).
# Uso: OCI_HOST=<ip> ./scripts/oci-prod-light-deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OCI_HOST="${OCI_HOST:?Set OCI_HOST to the VM public IP or hostname (see infra/deploy/oracle-always-free.md)}"
export OCI_HOST
export OCI_USER="${OCI_USER:-ubuntu}"
export OCI_DIR="${OCI_DIR:-/opt/agigov}"
export HONEYPOT="${HONEYPOT:-0}"
if [ -n "${OCI_SSH_KEY:-}" ]; then
  export OCI_SSH_KEY
fi

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
if [ -n "${OCI_SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$OCI_SSH_KEY")
fi

echo "[OCI deploy] Checking SSH ${OCI_USER}@${OCI_HOST}..."
if ! ssh "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" 'echo SSH_OK; uname -m'; then
  echo "[OCI deploy] ERROR: SSH failed. Create the Always Free VM and set OCI_HOST." >&2
  echo "  Guide: infra/deploy/oracle-always-free.md" >&2
  exit 1
fi

bash "$ROOT/scripts/oci-prod-light-sync.sh"
bash "$ROOT/scripts/oci-prod-light-bootstrap.sh"

echo "[OCI deploy] Remote health:"
ssh "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" \
  'curl -sf http://127.0.0.1:3001/api/ops/health' | head -c 500
echo ""
echo "[OCI deploy] DONE"
echo "  Next: Cloudflare Tunnel → ./scripts/oci-cloudflare-tunnel.sh"
echo "  Docs: infra/deploy/oracle-always-free.md"
