# Pre-producción — A.R.M.A.D.A. VZLA

Checklist y runbooks para pasar de implementación a **piloto nacional** desplegable.

## Estado

| Área | Dev | Staging/Prod |
|------|-----|--------------|
| Ledger + agentes | ✅ | Stack ligero o completo |
| PWA ciudadana | ✅ | CDN estático recomendado en VM pequeña |
| Edge + LoRaWAN | ✅ código | RF + 72h soak → diferido |
| Pánico FREEZE/RECOVER | ✅ drill | WireGuard prod → diferido |
| Honeypots | ✅ | Perfil opcional (+64 MB) |
| Whitepaper soberano | ✅ indexado | — |
| CI | ✅ GitHub Actions | — |
| PQC guardian-cuantico | ✅ plan doc | Piloto → diferido |
| Acta piloto multi-sig | ✅ scripts | Checklist humano |

## Despliegue recomendado (servidor pequeño)

**~1 GB RAM** — Oracle Always Free / GCP e2-micro:

```bash
# En la VM (con Docker):
./scripts/prod-up-light.sh
# Con honeypot: HONEYPOT=1 ./scripts/prod-up-light.sh

# Desde Mac (rsync + bootstrap + health) — requiere OCI_HOST:
# export OCI_HOST=<IP>; npm run oci:deploy
# Túnel HTTPS: npm run oci:tunnel
# Guía: infra/deploy/oracle-always-free.md
```

| Stack | Comando | RAM |
|-------|---------|-----|
| **Ligero** (recomendado) | `./scripts/prod-up-light.sh` | ~900 MB–1.2 GB |
| Completo (5 agentes) | `npm run infra:up:prod` | ~2.5–3.5 GB |

Sizing: **[SERVER-SIZING.md](SERVER-SIZING.md)** · P7 audit: **[P7-AUDIT-GATE.md](P7-AUDIT-GATE.md)** · P6: **[P6-LEGITIMIDAD-SEGURIDAD.md](P6-LEGITIMIDAD-SEGURIDAD.md)** · P5 red: **[P5-RED-AGIGOV-GLOBAL.md](P5-RED-AGIGOV-GLOBAL.md)** · P4 economía: **[P4-ECONOMIA-DAO.md](P4-ECONOMIA-DAO.md)** · Limpieza P3: **[P3-CLEANUP.md](P3-CLEANUP.md)** · P2 nacional: **[P2-FASE6-NACIONAL.md](P2-FASE6-NACIONAL.md)**

## Piloto multi-sig

Checklist humano: **[PILOTO-MULTISIG-CHECKLIST.md](PILOTO-MULTISIG-CHECKLIST.md)**

```bash
npm run pilot:init
npm run pilot:ratify
npm run pilot:verify
```

## Despliegue completo (más recursos)

```bash
cp infra/.env.prod.example infra/.env.prod
npm run infra:up:prod
npm run db:migrate && npm run db:seed
curl http://127.0.0.1:3001/api/ops/health
```

## Verificación automatizada

```bash
npm run lint
npm run build
npm run test:smoke
npm run panic:drill
npm run agents:flow
npm run pilot:verify
```

## Centinela 24/7

- **Ligero**: `core-lite` incluye centinela + comunicador (`SWARM_LITE_ROLES`)
- **Completo**: `agent-centinela` aislado
- systemd: `infra/systemd/agigov-centinela.service`
- Health: `GET /api/ops/health`

## Documentación relacionada

| Doc | Contenido |
|-----|-----------|
| [SERVER-SIZING.md](SERVER-SIZING.md) | RAM, perfiles, escalado |
| [PILOTO-MULTISIG-CHECKLIST.md](PILOTO-MULTISIG-CHECKLIST.md) | Ratificación piloto |
| [PANIC-RUNBOOK.md](PANIC-RUNBOOK.md) | FREEZE → RECOVER |
| [WHITEPAPER.md](WHITEPAPER.md) | Carta de gobernanza |
| [PQC-GUARDIAN-CUANTICO.md](PQC-GUARDIAN-CUANTICO.md) | Migración post-cuántica |

## Validaciones finales (cierre Fase 6)

Runbook P2: **[P2-FASE6-NACIONAL.md](P2-FASE6-NACIONAL.md)**

1. Soak 72h offline en VM edge (Oracle/GCP) — sim: `npm run test:offline-72h`
2. LoRaWAN RF E2E con gateway físico
3. Backup rclone restore test — local: `npm run backup:restore-test`
4. Centinela post-sync nodo periférico
5. WireGuard MQTT E2E (Fase 1)
6. Multi-sig acta piloto nacional (checklist + `pilot:verify`)
7. Dashboard público vs ledger sin discrepancias — `npm run reconcile:dashboard-ledger`
8. Lighthouse PWA ≥ 90 Slow 4G
9. Tests billing automatizados — `npm run test:billing`

## Criterio de cierre nacional

Acta de piloto ratificada por multi-sig; `npm run pilot:verify` OK.
