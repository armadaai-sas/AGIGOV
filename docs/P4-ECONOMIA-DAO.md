# P4 — Economía DAO (aporte trazable)

**Fecha:** 2026-08-05 · Criterio PLAN: *1 proyecto financiado end-to-end con trazabilidad pública*.

## Hecho en este corte

| Capacidad | Estado |
|-----------|--------|
| UI `/proyectos` + detalle + aporte | ✅ |
| API `POST /api/public/contributions` | ✅ |
| Webhook VES + HMAC → mismo ledger | ✅ (P3) |
| Aporte actualiza `raisedAmount` + `LedgerEntry ESCROW` | ✅ |
| Escrow `PENDING→LOCKED` / meta→`RELEASED` | ✅ |
| Badge **Meta financiada** en UI | ✅ |
| Script `npm run p4:finance-e2e` | ✅ |
| Token gobernanza mainnet | ❌ roadmap (dictamen soberano + legal) |
| Pasarela fiat proveedor real | ❌ HMAC listo; contrato proveedor pendiente |

## Cómo verificar

```bash
npm run db:seed          # si no hay proj-dao-*
npm run p4:finance-e2e   # aporte + HMAC + asserts
npm run test:webhook
```

UI: `/proyectos/<id>` → Registrar aporte → receipt + progreso.

## Honestidad comercial

- **No** afirmar “pagos bancarios en producción” hasta proveedor + secret en prod.
- **No** afirmar token AGIGOV en mainnet.
- **Sí** afirmar: aporte piloto en ledger, escrow visible, dashboard público sin PII.

## Criterio de cierre P4 (código)

PASS si `p4:finance-e2e` OK y UI muestra raised/escrow coherentes.  
Token + pasarela banco = cola post-P4 (legal / comercial).
