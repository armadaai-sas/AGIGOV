# G5 — Fiat real (checklist cloud)

**Estado:** BLOCKED — falta elegir PSP + secretos en Droplet.  
Código webhook HMAC: `POST /api/public/payments/webhook` (`src/pilot/payment-webhook.ts`).

## Hecho en producto

- [x] Endpoint webhook con firma HMAC (`X-Agigov-Signature`)
- [x] Catalog / usage / freeze billing APIs
- [x] Free cost-zero guards

## Pendiente (externo)

| # | Acción | Owner |
|---|--------|-------|
| 1 | Elegir PSP (Stripe / PayPal / pasarela VES) | humano |
| 2 | Crear webhook secret en `.env.prod` del Droplet | A / ops |
| 3 | Configurar URL webhook → `https://<host>/api/public/payments/webhook` | A |
| 4 | Pago de prueba $1 → ledger event + evidencia JSON | A+B |
| 5 | Documentar en Trust Pack `payments-smoke.json` | A |

## Comando smoke (cuando haya secret)

```bash
# Desde máquina con secret — no en repo
curl -sf -X POST "$BASE/api/public/payments/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Agigov-Signature: sha256=..." \
  -d '{"...":"..."}'
```

**No PASS** hasta pago real + artifact.
