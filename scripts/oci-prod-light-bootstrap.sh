#!/usr/bin/env bash
# Bootstrap prod-light on Oracle Always Free ARM VM (idempotent, via SSH).
# Uso: OCI_HOST=<ip> ./scripts/oci-prod-light-bootstrap.sh
# Requiere sync previo (./scripts/oci-prod-light-sync.sh) o repo ya en OCI_DIR.
set -euo pipefail

OCI_HOST="${OCI_HOST:?Set OCI_HOST to the VM public IP or hostname}"
OCI_USER="${OCI_USER:-ubuntu}"
OCI_DIR="${OCI_DIR:-/opt/agigov}"
HONEYPOT="${HONEYPOT:-0}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
if [ -n "${OCI_SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$OCI_SSH_KEY")
fi

echo "[OCI bootstrap] ${OCI_USER}@${OCI_HOST}:${OCI_DIR}"
ssh "${SSH_OPTS[@]}" "${OCI_USER}@${OCI_HOST}" \
  "export OCI_DIR=$(printf %q "$OCI_DIR"); export HONEYPOT=$(printf %q "$HONEYPOT"); bash -s" <<'REMOTE'
set -euo pipefail
cd "$OCI_DIR"

echo "[OCI bootstrap] arch=$(uname -m) cwd=$OCI_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "[OCI bootstrap] Installing Docker Engine..."
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  if [ ! -f /etc/apt/keyrings/docker.asc ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
    sudo chmod a+r /etc/apt/keyrings/docker.asc
  fi
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker "$USER" || true
fi

if ! command -v node >/dev/null 2>&1; then
  NEED_NODE=1
else
  NODE_MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
  if [ "$NODE_MAJOR" -lt 22 ]; then
    NEED_NODE=1
  else
    NEED_NODE=0
  fi
fi

if [ "$NEED_NODE" = "1" ]; then
  echo "[OCI bootstrap] Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if [ ! -f package.json ]; then
  echo "[OCI bootstrap] ERROR: $OCI_DIR missing package.json — run oci-prod-light-sync.sh first" >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "[OCI bootstrap] npm ci..."
  npm ci
fi

ENV_FILE="infra/.env.prod"
if [ ! -f "$ENV_FILE" ]; then
  cp infra/.env.prod.example "$ENV_FILE"
  if grep -q 'change-me-strong-password' "$ENV_FILE"; then
    GEN_PW="$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"
    sed -i "s/change-me-strong-password/${GEN_PW}/g" "$ENV_FILE"
    echo "[OCI bootstrap] Generated POSTGRES_PASSWORD in $ENV_FILE"
  fi
  echo "[OCI bootstrap] Created $ENV_FILE — review before production use"
fi

export HONEYPOT
if docker info >/dev/null 2>&1; then
  bash ./scripts/prod-up-light.sh
else
  sg docker -c "HONEYPOT=${HONEYPOT} bash ./scripts/prod-up-light.sh"
fi

echo "[OCI bootstrap] Health..."
i=0
while [ "$i" -lt 10 ]; do
  if curl -sf "http://127.0.0.1:3001/api/ops/health" | head -c 400; then
    echo ""
    echo "[OCI bootstrap] HEALTH_OK"
    exit 0
  fi
  i=$((i + 1))
  sleep 3
done
echo "[OCI bootstrap] HEALTH_FAIL" >&2
exit 1
REMOTE
