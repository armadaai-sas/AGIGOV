#!/usr/bin/env bash
# Verificación global — Bloques A, B y paso 1
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

section() { echo ""; echo "▸ $1"; }

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; FAIL=$((FAIL + 1)); }
warn() { echo "  ⚠ $1"; }

FAIL=0
BLOCK_A=0
BLOCK_B=0

section "Clone correcto (no placeholders en raíz)"
ROOT_PLACEHOLDERS=0
for f in setup-local-mac.sh block-b-setup.sh block-b-verify.sh api-public.sh agents-flow.sh; do
  if [ -f "$ROOT/$f" ]; then
    fail "Script obsoleto en raíz: $f (elimínalo; usa scripts/$f)"
    ROOT_PLACEHOLDERS=1
  fi
done
if [ "$ROOT_PLACEHOLDERS" -eq 0 ]; then
  pass "Scripts solo en scripts/ (estructura correcta)"
fi
if [ ! -f infra/docker-compose.dev.yml ]; then
  fail "Falta infra/docker-compose.dev.yml — clona Armada-2026/Armada-VZLA y git pull"
elif [ -f docker-compose.yml ] && [ ! -f infra/docker-compose.dev.yml ]; then
  warn "docker-compose.yml en raíz es incorrecto; la infra está en infra/"
else
  pass "infra/docker-compose.dev.yml"
fi
echo ""

section "Paso 1 — Node (verificación código)"
command -v node >/dev/null && pass "Node $(node -v)" || fail "Node.js"
command -v npm >/dev/null && pass "npm $(npm -v)" || fail "npm"
[ -d node_modules ] && pass "node_modules" || fail "npm install pendiente"
[ -d dist ] && pass "build PWA (dist/)" || warn "npm run build no ejecutado aún"
echo ""

section "Bloque A — GitHub"
SSH_OK=false
GH_OK=false
ssh -T git@github.com 2>&1 | grep -qi 'successfully authenticated' && SSH_OK=true
command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1 && GH_OK=true

if $SSH_OK; then pass "SSH → GitHub"; BLOCK_A=1; fi
if $GH_OK; then pass "gh autenticado"; BLOCK_A=1; fi
if ! $SSH_OK && ! $GH_OK; then
  fail "Sin acceso GitHub → docs/SETUP-GUIA-MAC.md (Bloque A)"
fi

AHEAD=0
if git rev-parse origin/main >/dev/null 2>&1; then
  AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
fi

if [ "$AHEAD" -gt 0 ] 2>/dev/null; then
  warn "$AHEAD commit(s) sin push → npm run github:push"
elif [ "$BLOCK_A" -eq 1 ]; then
  pass "Rama sincronizada con origin/main"
  BLOCK_A=2
fi
echo ""

section "Bloque B — Docker local"
command -v docker >/dev/null && pass "Docker CLI" || warn "Docker CLI ausente → usa npm run setup:local:native (Mac viejo)"
if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  pass "Docker daemon"
  BLOCK_B=1
else
  if command -v brew >/dev/null 2>&1; then
    warn "Sin Docker → alternativa: npm run setup:local:native"
  else
    fail "Docker daemon → abrir Docker Desktop o instalar Homebrew"
  fi
fi

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q armada-postgres-dev; then
  pass "Contenedor Postgres"
  BLOCK_B=2
elif lsof -iTCP:5432 -sTCP:LISTEN >/dev/null 2>&1; then
  pass "Postgres nativo en :5432"
  BLOCK_B=2
else
  warn "Postgres no corriendo → npm run setup:local o setup:local:native"
fi

[ -f .env ] && pass ".env" || warn ".env faltante (setup:local lo crea)"
[ -f data/did-registry.json ] && pass "DID registry" || warn "npm run bus:seed pendiente"
echo ""

section "Resumen"
if [ "$BLOCK_A" -ge 2 ] && [ "$BLOCK_B" -ge 2 ]; then
  echo "  ✓ Bloques A y B completos — abre 3 terminales (ver docs/SETUP-GUIA-MAC.md B.3)"
elif [ "$BLOCK_A" -ge 2 ]; then
  echo "  → Bloque A OK. Siguiente: npm run setup:local"
elif [ "$BLOCK_B" -ge 2 ]; then
  echo "  → Bloque B OK. Siguiente: npm run github:push"
else
  echo "  → Guía paso a paso: docs/SETUP-GUIA-MAC.md"
fi

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "  $FAIL comprobación(es) pendiente(s)"
  exit 1
fi
exit 0
