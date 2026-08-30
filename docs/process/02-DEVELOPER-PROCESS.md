# Proceso 02 — Desarrollo (integradores y contribuidores)

Pasos estándar para contribuir código al OS AGIGOV o integrar sobre la API pública.

## Prerrequisitos

- Node.js ≥ 22
- Git
- Docker (opcional, para Postgres/API local)

```bash
git clone <repo>
cd AGIGOV   # o Armada-VZLA junction
npm install
```

## Entorno local (UI)

```bash
# Terminal 1 — PWA
npx vite --port=3010 --host=0.0.0.0

# Terminal 2 (opcional) — API pública con datos demo
npm run db:generate
npm run infra:up:dev
npm run db:migrate && npm run db:seed
npm run api:public   # :3001, proxy /api desde Vite
```

Proxy Vite → droplet por defecto (`vite.config.ts`). Override: `VITE_API_PROXY=http://127.0.0.1:3001`.

## Flujo de contribución (PR)

| Paso | Acción | Evidencia |
|------|--------|-----------|
| 1 | Leer [AGENTS.md](../../AGENTS.md) + skill del área | — |
| 2 | Issue o descripción: pilar afectado (ledger, PWA, modelo, IAP) | Link issue |
| 3 | Rama corta, PR pequeño | `git diff` |
| 4 | `npm run lint && npm run build && npm run test:smoke` | CI green |
| 5 | Si toca catálogo: `npm run models:audit` | log audit |
| 6 | Review humano; centinela vía CI | GitHub Actions |
| 7 | Merge → deploy según [05-SERVER-DEPLOY-OPS.md](./05-SERVER-DEPLOY-OPS.md) | health 200 |

## API pública (integradores)

| Recurso | Ruta |
|---------|------|
| Health | `GET /api/public/health` |
| Dashboard demo | `GET /api/public/dashboard` |
| Config | `GET /api/public/config` |

Página producto: `/desarrolladores` · Código: `src/server/public-api.ts`

**Reglas:**

- No exponer PII en respuestas públicas
- Respetar `PANIC_MODE` (mutaciones congeladas)
- Verificar firmas IAP antes de efectos irreversibles

## Estructura del repo (dónde tocar)

| Qué | Dónde |
|-----|-------|
| PWA / rutas | `src/citizen/` |
| Iconos UI | `agigovIconProps()` · [ICON-SYSTEM.md](../design/ICON-SYSTEM.md) |
| Nav sidebar desk | `src/citizen/platform/deskNav.ts` |
| API | `src/server/` |
| Agentes | `src/agents/` |
| Protocolo IAP | `src/protocol/` |
| Infra | `infra/` · `scripts/` |
| Docs proceso | `docs/process/` |

## Comandos de gate (antes de pedir merge)

```bash
npm run lint
npm run build
npm run test:smoke
npm run models:audit    # si tocaste modelos/manifest
npm run doctor        # diagnóstico config
```

Suite completa: `npm run audit:run` ([P7](../P7-AUDIT-GATE.md)).

## Lo que no se acepta

- Claves privadas en el repo
- Bypass multi-sig o FREEZE de centinela
- PRs que mezclen refactor masivo + feature sin necesidad
- “Funciona en mi máquina” sin build/lint

## Referencias

- [CONTRIBUCION.md](../AGIGOV/CONTRIBUCION.md)
- [07-INTEGRATOR-GUIDE.md](./07-INTEGRATOR-GUIDE.md)
- [MODEL-MANIFEST-v1.md](../AGIGOV/MODEL-MANIFEST-v1.md)
