# P2 — Cierre Fase 6 (nacional / diferido)

**Fecha arranque:** 2026-08-05  
**Precedencia:** no bloquea piloto pagado #4. Bloquea dictamen **GO producción nacional**.

## Checklist ejecutable

| # | Ítem | Cómo | Estado |
|---|------|------|--------|
| 20 | Backup restore test | `./scripts/backup-prod-light-restore-test.sh` en Droplet | **PASS** 2026-08-05 (6/6 entries) |
| 23 | Dashboard vs ledger | `npm run reconcile:dashboard-ledger:sql` | **PASS** published=5 missing=0 |
| 18 | Soak 72h (sim) | `npm run test:offline-72h` (simulación cola) | sim pendiente wall-clock |
| 24 | Tests billing | `npm run test:billing` | **PASS** local + DO |
| 25 | Observabilidad mínima | `/api/ops/health` incluye `plan` + `billingFreeze` | **PASS** DO |
| 22 | Multi-sig acta | `npm run pilot:verify` en prod-light | **PASS** DO post-regenerate |
| 21 | Lighthouse ≥ 90 Slow 4G | manual / CI futuro | pendiente |
| 17 | WireGuard MQTT E2E | mesh + broker prod | **bloqueado** (VPN prod) |
| 19 | LoRaWAN RF E2E | gateway físico | **bloqueado** (hardware) |

### Evidencia 2026-08-05 (DO `armada-prod-light`)

- Deploy P1+P2 sync OK; migrate conflict limpio; `prod-up-light` healthy.
- Health: `postgres:true`, `panicMode:false`, `plan:free`, `billingFreeze.frozen:false`.
- Prisma: 7 migraciones (incl. seats) — sin pendientes.
- Restore test: LedgerEntry 6→6, ProcessCheckpoint 6→6.
- Reconcile SQL: OK (ACTA cuenta como ledger alineado).
- `pilot:verify`: OK (multisig 3/3, ledgerAligned).
- Host scripts: `binaryTargets` incluye `debian-openssl-3.0.x`.

## Criterio de cierre parcial P2 (sin hardware)

PASS si:

1. Restore test OK en Droplet  
2. `reconcile:dashboard-ledger` OK contra Postgres del nodo  
3. `test:billing` + `test:smoke` OK  
4. Health reporta `postgres: true`, `panicMode: false`, freeze facturación visible  
5. Offline-72h sim OK (o documentado FAIL con cause)

Hardware/VPN quedan **N/A** hasta gateway + WireGuard.

## Comandos Droplet (prod-light)

```bash
cd /opt/armada
./scripts/backup-prod-light-restore-test.sh
# Host scripts need localhost DB URL (not docker hostname postgres):
export DATABASE_URL='postgresql://…@127.0.0.1:5432/armada_core'
npm run reconcile:dashboard-ledger
npm run test:billing
npm run test:offline-72h   # requiere seed territorial
```
