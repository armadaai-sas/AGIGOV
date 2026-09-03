#!/usr/bin/env bash
# Bloque A — GitHub: verificar acceso y push a origin/main
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO_URL="https://github.com/armadaai-sas/AGIGOV"
SSH_KEY_ED25519="$HOME/.ssh/id_ed25519.pub"
SSH_KEY_RSA="$HOME/.ssh/id_rsa.pub"

step() { echo ""; echo "━━ $1"; echo ""; }

github_ssh_ok() {
  ssh -T git@github.com 2>&1 | grep -qi 'successfully authenticated'
}

github_gh_ok() {
  command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1
}

show_block_a_help() {
  step "Bloque A — qué hacer ahora"
  echo "Guía completa: docs/SETUP-GUIA-MAC.md"
  echo ""
  echo "── Opción 1: SSH (recomendado) ──"
  echo ""
  if [ -f "$SSH_KEY_ED25519" ]; then
    echo "  1. Copiar clave:"
    echo "     pbcopy < ~/.ssh/id_ed25519.pub"
  elif [ -f "$SSH_KEY_RSA" ]; then
    echo "  1. Copiar clave:"
    echo "     pbcopy < ~/.ssh/id_rsa.pub"
  else
    echo "  1. Crear clave:"
    echo '     ssh-keygen -t ed25519 -C "tu-email@ejemplo.com" -f ~/.ssh/id_ed25519 -N ""'
    echo "  2. Copiar clave:"
    echo "     pbcopy < ~/.ssh/id_ed25519.pub"
  fi
  echo "  2. Registrar en GitHub:"
  echo "     open https://github.com/settings/ssh/new"
  echo "  3. Verificar:"
  echo "     ssh -T git@github.com"
  echo "  4. Push:"
  echo "     npm run github:push"
  echo ""
  echo "── Opción 2: GitHub CLI ──"
  echo ""
  echo "  gh auth login"
  echo "  npm run github:push"
  echo ""
}

step "A.0 — Estado del repositorio"
git status -sb
echo ""
echo "Último commit:"
git log -1 --oneline
echo ""
echo "Remote:"
git remote -v

AHEAD=0
if git rev-parse origin/main >/dev/null 2>&1; then
  AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
elif git rev-parse origin/HEAD >/dev/null 2>&1; then
  AHEAD=$(git rev-list --count origin/HEAD..HEAD 2>/dev/null || echo 1)
else
  AHEAD=1
fi

if [ "$AHEAD" -eq 0 ] 2>/dev/null; then
  step "A.1 — GitHub"
  echo "✓ No hay commits pendientes de push."
  echo "  Repo: $REPO_URL"
  exit 0
fi

echo ""
echo "→ Commits por subir: $AHEAD"

step "A.1 — Comprobar acceso a GitHub"

if github_ssh_ok; then
  echo "✓ SSH autenticado con GitHub"
  METHOD=ssh
elif github_gh_ok; then
  echo "✓ GitHub CLI autenticado"
  METHOD=gh
else
  echo "✗ Sin acceso a GitHub todavía"
  show_block_a_help
  exit 1
fi

step "A.2 — Push a origin/main"
git push -u origin main

step "A.3 — Confirmación"
git status -sb
echo ""
echo "✓ Push completado"
echo "  Commits: $REPO_URL/commits/main/"
echo ""
echo "Siguiente: Bloque B → npm run setup:local"
echo "  Guía: docs/SETUP-GUIA-MAC.md#bloque-b--docker-local-paso-3"
