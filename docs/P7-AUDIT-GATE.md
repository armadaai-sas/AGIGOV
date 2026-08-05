# P7 — Audit gate (post P0–P6)

**Objetivo:** Tras cerrar P0–P6, **correr** la suite unificada, diagnosticar gaps y dejar un gate reproducible antes de piloto #4 / venta.

## Criterio de cierre

| Check | Comando | Estado gate |
|-------|---------|-------------|
| Lint/build/smoke/billing/webhook | `npm run audit:run` | **obligatorio** |
| PQC + panic + P5 + P6 | incluido en `audit:run` | **obligatorio** |
| Doctor config | `npm run doctor` | **obligatorio** (APIs soft) |
| Handshake VEN↔SBX | `npm run p8:verify` (o APIs + `sbx:handshake`) | **P8 obligatorio** |
| Release GO | `npm run p9:go` | **P9 obligatorio** |
| p4 finance E2E | Postgres + seed | **opcional** offline |

## Run (2026-08-05)

Ejecutado local:

- lint · smoke · billing · webhook · pqc · panic · p5 · p6 · build → **PASS**
- Postgres local: ausente → federation DB / p4 skipped
- Handshake: APIs no levantadas → soft fail (esperado offline)

## Comandos

```bash
npm run audit:run     # gate completo
npm run doctor        # diagnóstico rápido
DOCTOR_STRICT=1 npm run doctor   # falla si API caída

# Red viva (recomendado):
npm run api:public &
npm run api:sandbox &
npm run sbx:handshake
npm run doctor
```

## Gaps conocidos (no bloquean P7 código)

| Gap | Prioridad | Notas |
|-----|-----------|-------|
| Postgres + p4:finance-e2e en CI | P1 | Requiere servicio DB |
| Handshake en CI | P1 | Levantar dos APIs o mock |
| IAP v2 PQC híbrido | P6 residual | Sin claim productivo |
| WireGuard / LoRaWAN / Lighthouse | P2 | Hardware / wall-clock |
| Proveedor fiat real | P3 residual | HMAC listo |
| Free + Resend sin BYO en `.env` local | Soft en doctor | Usar `AGIGOV_EMAIL_MODE=outbox` o `AGIGOV_EMAIL_BYO=1` |

## Dictamen

**GO-CONDICIONADO** a piloto #4 cuando: `audit:run` PASS + corrida Operador B documentada + deploy health OK.
