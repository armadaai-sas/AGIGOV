# Checklist — Ratificación piloto nacional (multi-sig)

Acta: **`acta-piloto-nacional-2026`** · Territorio: **`MAR_NORTH_01`** · Duración piloto: **30 días**

## Fase A — Pre-requisitos infra (servidor ligero)

- [ ] Stack ligero desplegado: `./scripts/prod-up-light.sh`
- [ ] `GET /api/ops/health` → `ok: true`, `panicMode: false`
- [ ] RAM estable bajo 1.2 GB (`docker stats`)
- [ ] Backup configurado: `./infra/backup/backup-edge.sh` (cron)
- [ ] `PANIC_MODE=false` en `.env.prod`

## Fase B — Gobernanza (Soberano + whitepaper)

- [ ] Propuesta leída contra `docs/WHITEPAPER.md`
- [ ] Dictamen soberano: propuesta cita ≥2 secciones del whitepaper
- [ ] Riesgo legal marcado **CONFORME** o **REVISAR** con justificación
- [ ] KPIs del piloto definidos (ver `docs/innovation/2026-07-01-brief.md`)

## Fase C — Multi-sig institucional

Signatarios requeridos (`PILOT_THRESHOLD=3`):

| # | DID | Rol | Firmó |
|---|-----|-----|-------|
| 1 | `did:armada:core:soberano` | Gobernanza | ☐ |
| 2 | `did:armada:core:centinela` | Auditoría | ☐ |
| 3 | `did:armada:core:comunicador` | Transparencia | ☐ |

### Comandos (dev / staging)

```bash
npm run pilot:init      # borrador + escrow PENDING
npm run pilot:ratify    # claves durables + verify DidRegistry → committed / LOCKED
npm run pilot:verify    # incluye check crypto multisigVerified
```

Claves: `data/pilot-tenants/nacional.core-keys.json` (gitignore) o env  
`NODE_ED25519_SECRET_KEY_B64_{SOBERANO|CENTINELA|COMUNICADOR}`.

### Producción real

- [x] Firmas Ed25519 ligadas a DID + verificación vs DidRegistry antes de `LOCKED`
- [x] Escrow `LOCKED` solo con ≥ threshold firmas válidas
- [x] Claves privadas fuera de repo (`*.core-keys.json` gitignore)
- [ ] Ceremonia humana / HSM por signatario (fuera de auto-sign local) — siguiente fase

## Fase D — Integridad ledger ↔ dashboard

- [ ] `npm run pilot:verify` → `ledgerAligned: true`
- [ ] Centinela audit sin alertas críticas post-ratificación
- [ ] PWA `/` muestra reporte del piloto sin PII
- [ ] Checkpoint `published` con `pilotRatification: true`

## Fase E — Validaciones diferidas (cierre nacional)

No bloquean firma del checklist; ejecutar al cierre de todas las fases:

- [ ] Soak 72h edge offline (Fase 5)
- [ ] LoRaWAN RF E2E
- [ ] WireGuard MQTT prod
- [ ] rclone restore test
- [ ] Lighthouse PWA ≥ 90 Slow 4G
- [ ] Drill pánico en staging con `PANIC_MODE=true`

## Criterio de cierre

**Todos** los ítems de Fases A–D marcados + verificación automática OK:

```bash
npm run pilot:verify
# → "Verificación cierre: OK" y checks.* true
```

## Rollback del piloto

Si `ledgerAligned: false` en 2 auditorías consecutivas:

1. `PANIC_MODE=true`
2. Comunicador aviso ciudadano genérico
3. Revisar centinela + conciliador
4. No ampliar a otros territorios hasta nuevo acta multi-sig
