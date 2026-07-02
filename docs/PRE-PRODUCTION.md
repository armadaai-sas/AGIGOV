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

**~1 GB RAM** — Oracle/GCP e2-micro:

```bash
./scripts/prod-up-light.sh
# Con honeypot: HONEYPOT=1 ./scripts/prod-up-light.sh
```

| Stack | Comando | RAM |
|-------|---------|-----|
| **Ligero** (recomendado) | `./scripts/prod-up-light.sh` | ~900 MB–1.2 GB |
| Completo (5 agentes) | `npm run infra:up:prod` | ~2.5–3.5 GB |

Sizing: **[SERVER-SIZING.md](SERVER-SIZING.md)**

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
- systemd: `infra/systemd/armada-centinela.service`
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

1. Soak 72h offline en VM edge (Oracle/GCP)
2. LoRaWAN RF E2E con gateway físico
3. Backup rclone restore test
4. Centinela post-sync nodo periférico
5. WireGuard MQTT E2E (Fase 1)
6. Multi-sig acta piloto nacional (checklist + `pilot:verify`)
7. Dashboard público vs ledger sin discrepancias
8. Lighthouse PWA ≥ 90 Slow 4G

## Criterio de cierre nacional

Acta de piloto ratificada por multi-sig; `npm run pilot:verify` OK.
