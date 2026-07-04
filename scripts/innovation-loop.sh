#!/usr/bin/env bash
# Loop innovación semanal — Paso 14 (A10)
# Genera puntero latest.md; el brief real requiere Cursor /loop o agente con state-innovation.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATE="$(date +%Y-%m-%d)"
LATEST="$ROOT/docs/innovation/latest.md"
BRIEF="$ROOT/docs/innovation/${DATE}-innovation-brief.md"

mkdir -p "$ROOT/docs/innovation"

if [[ ! -f "$BRIEF" ]]; then
  cat > "$BRIEF" <<EOF
# Innovation brief — ${DATE}

> Generado por \`npm run innovation:loop\`. Completar con skill state-innovation antes de ratificar.

## Contexto

- Piloto: MAR_NORTH_01
- Roadmap: docs/AGIGOV/ROADMAP-EJECUCION.md

## Propuesta (UNA sola)

_Describir aquí la innovación candidata._

## Evidencia requerida

- [ ] Impacto ciudadano medible
- [ ] Sin bypass multi-sig / centinela
- [ ] Human-in-the-loop definido

## Decisión

- [ ] Ratificar (acta soberano)
- [ ] Descartar
- [ ] Diferir

EOF
  echo "Created $BRIEF"
else
  echo "Brief already exists: $BRIEF"
fi

cat > "$LATEST" <<EOF
# Loop innovación semanal — AGIGOV (Paso 14)

**Próximo brief:** $(date -v+7d +%Y-%m-%d 2>/dev/null || date -d '+7 days' +%Y-%m-%d 2>/dev/null || echo '+7 días')
**Skill:** \`.cursor/skills/state-innovation/SKILL.md\`

## Última ejecución

| Campo | Valor |
|-------|-------|
| Fecha | ${DATE} |
| Brief | \`docs/innovation/${DATE}-innovation-brief.md\` |
| Estado | Pendiente revisión humana |

Ver \`${BRIEF#$ROOT/}\` para completar el brief.
EOF

echo "Updated $LATEST"
