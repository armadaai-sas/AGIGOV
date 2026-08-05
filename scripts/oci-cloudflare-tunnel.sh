#!/usr/bin/env bash
# Install cloudflared on OCI VM and expose local :3001 (no OCI port open).
# Uso:
#   OCI_HOST=<ip> ./scripts/oci-cloudflare-tunnel.sh
#   TUNNEL_MODE=install OCI_HOST=<ip> ./scripts/oci-cloudflare-tunnel.sh
set -euo pipefail

OCI_HOST="${OCI_HOST:?Set OCI_HOST to the VM public IP or hostname}"
OCI_USER="${OCI_USER:-ubuntu}"
TUNNEL_MODE="${TUNNEL_MODE:-smoke}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
if [ -n "${OCI_SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$OCI_SSH_KEY")
fi

echo "[tunnel] Ensuring cloudflared on ${OCI_USER}@${OCI_HOST}..."
ssh "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" 'bash -s' <<'REMOTE'
set -euo pipefail
ARCH="$(uname -m)"
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  CF_ARCH=arm64
elif [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; then
  CF_ARCH=amd64
else
  echo "Unsupported arch: $ARCH" >&2
  exit 1
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "[tunnel] Installing cloudflared ($CF_ARCH)..."
  curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${CF_ARCH}" -o /tmp/cloudflared
  chmod +x /tmp/cloudflared
  sudo mv /tmp/cloudflared /usr/local/bin/cloudflared
fi
cloudflared --version
REMOTE

if [ "$TUNNEL_MODE" = "install" ]; then
  cat <<EOF
[tunnel] Binary installed. For a named production tunnel on the VM:

  cloudflared tunnel login
  cloudflared tunnel create armada-prod-light
  # configure ingress → http://127.0.0.1:3001
  sudo cloudflared service install

Smoke (ephemeral URL):

  OCI_HOST=${OCI_HOST} TUNNEL_MODE=smoke ./scripts/oci-cloudflare-tunnel.sh

EOF
  exit 0
fi

echo "[tunnel] Starting smoke tunnel (foreground). Copy the https://*.trycloudflare.com URL."
echo "[tunnel] Ctrl+C stops the tunnel. Stack on :3001 must already be healthy."
ssh -t "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" \
  'curl -sf http://127.0.0.1:3001/api/ops/health >/dev/null && cloudflared tunnel --url http://127.0.0.1:3001'
