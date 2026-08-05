# P5 — Red AGIGOV global

**Fecha:** 2026-08-05 · Criterio PLAN: *Segundo Estado en sandbox conectado a la red*.

## Hecho

| Ítem | Evidencia |
|------|-----------|
| Protocolo `AGIGOV-[ISO]` | `CARTA-AGIGOV-BASE.md` + `ANEXO-LOCAL-TEMPLATE.md` + catálogo `JURISDICTIONS` |
| 2º Estado sandbox | `AGIGOV-SBX` + `sbx:handshake` + adhesión multi-sig |
| Interop ledger (thin) | `GET /api/public/federation/outbox` · mirror/pull hashes published |
| Carta base + anexos | Base + COL anexo + plantilla |
| Docs ministro / TI | `GUIA-MINISTRO-INNOVACION-TI.md` |

## Verificar

```bash
npm run p5:verify-network          # catálogo + docs (+ DB si hay)
# Con red viva:
npm run api:public &               # :3001
npm run api:sandbox &              # :3002
npm run sbx:handshake
curl -X POST http://127.0.0.1:3002/api/public/federation/pull
npm run p5:verify-network
```

## Límites honestos

- Federation = **hashes** published, no réplica completa del ledger entre Postgres estatales.
- COL/USA = perfiles piloto + anexo; **no** adhesión multi-sig todavía.
- WireGuard / MQTT cross-border = P2 residual (nacional).
