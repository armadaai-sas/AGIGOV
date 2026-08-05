#!/usr/bin/env bash
# Gate: verify OCI_HOST SSH readiness before deploy/tunnel.
# Exit 0 = SSH OK · Exit 2 = waiting for VM · Exit 1 = misconfig
set -euo pipefail

if [ -z "${OCI_HOST:-}" ]; then
  cat <<'EOF' >&2
[OCI ready] WAITING_OCI_HOST

Create an Oracle Always Free A1.Flex VM (Ubuntu 22.04 aarch64), then:

  export OCI_HOST="<IP_PUBLICA>"
  export OCI_USER=ubuntu   # if needed
  npm run oci:deploy       # rsync + prod-up-light + health
  npm run oci:tunnel       # Cloudflare smoke HTTPS

Guide: infra/deploy/oracle-always-free.md
EOF
  exit 2
fi

OCI_USER="${OCI_USER:-ubuntu}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -o BatchMode=yes)
if [ -n "${OCI_SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$OCI_SSH_KEY")
fi

echo "[OCI ready] Probing ${OCI_USER}@${OCI_HOST}..."
if ssh "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" 'echo SSH_OK; uname -m; command -v docker >/dev/null && docker --version || echo DOCKER_PENDING'; then
  echo "[OCI ready] SSH_OK — run: npm run oci:deploy"
  exit 0
fi

echo "[OCI ready] SSH_FAIL — check security list (port 22), key, and OCI_HOST" >&2
exit 1
