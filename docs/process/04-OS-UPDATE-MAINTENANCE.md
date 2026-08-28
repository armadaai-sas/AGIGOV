# Proceso 04 — Actualización y mantenimiento del OS

Mantenimiento del **kernel** AGIGOV: agentes, ledger, filtros Centinela, dependencias, migraciones.

## Componentes del OS

```
Sensores → centinela → logistico | soberano → ledger → comunicador → dashboard
```

| Componente | Código | Mantenimiento |
|------------|--------|---------------|
| Centinela (FREEZE) | `src/agents/` | [PANIC-RUNBOOK.md](../PANIC-RUNBOOK.md) |
| Ledger | `src/db/` · Prisma | migraciones |
| IAP | `src/protocol/` | versiones envelope |
| Bus MQTT | `src/bus/` | `npm run bus:worker` |
| API pública | `src/server/public-api.ts` | deploy |
| PWA | `src/citizen/` | [06-UI-UX-RELEASE.md](./06-UI-UX-RELEASE.md) |

## Tipos de update

| Tipo | Riesgo | Proceso |
|------|--------|---------|
| Patch deps (npm) | Medio | PR + audit:run + deploy |
| Migración DB | Alto | backup + migrate + rollback plan |
| Agente / IAP | Alto | multi-sig + panic drill |
| Filtro Centinela | Alto | panic:drill + ops review |
| Solo UI/CSS | Bajo | lint + build + UI verify |
| Modelo catálogo | Medio | [03-MODEL-LIFECYCLE.md](./03-MODEL-LIFECYCLE.md) |

## Flujo de update OS (pasos)

### U1 — Planificar

- [ ] Changelog interno (qué pilar: ledger, agentes, PWA, infra)
- [ ] ¿Requiere migración? → `npm run db:migrate` en staging primero
- [ ] ¿Toca FREEZE/pánico? → leer PANIC-RUNBOOK

### U2 — Desarrollo y gates locales

```bash
npm run lint
npm run build
npm run test:smoke
npm run agents:flow      # pipeline demo local
npm run panic:drill      # si toca centinela/ledger
npm run audit:run
```

### U3 — Staging / prod-light

```bash
./scripts/prod-up-light.sh   # en VM
npm run pilot:verify
curl http://<host>/api/ops/health
```

### U4 — Despliegue producción

Ver [05-SERVER-DEPLOY-OPS.md](./05-SERVER-DEPLOY-OPS.md).

### U5 — Post-deploy

- [ ] Health público + ops 200
- [ ] Smoke rutas críticas: `/` `/escritorio` `/modelos` `/api/public/health`
- [ ] Registrar evidencia en case study si es release mayor
- [ ] `npm run p9:go` si es corte de release

## Filtros y Centinela

| Situación | Acción |
|-----------|--------|
| Anomalía ledger | Centinela FREEZE automático |
| Investigación | Human-in-the-loop; no bypass |
| Recuperación | [PANIC-RUNBOOK.md](../PANIC-RUNBOOK.md) RECOVER |
| Drill programado | `npm run panic:drill` en CI/local |

## Dependencias npm

```bash
npm outdated
npm update <pkg>   # PR acotado, no big-bang
npm run build && npm run audit:run
```

No actualizar Vite/React major sin ventana de prueba UI completa.

## Migraciones de datos

```bash
npm run db:generate
npm run db:migrate        # Postgres core
npm run db:migrate:edge   # SQLite edge
npm run db:seed           # solo dev/staging
```

**Producción:** backup antes de migrate; nunca seed destructivo en prod.

## Rollback

| Capa | Rollback |
|------|----------|
| UI estática | Redeploy commit anterior (GitHub Action / rsync) |
| API | Misma imagen/tag anterior + health check |
| DB | Restore backup + migrate down si existe |
| Pánico activo | RECOVER según runbook antes de redeploy |

## Agente responsable

**centinela** (seguridad) · **production-readiness-orchestrator** (gates)
