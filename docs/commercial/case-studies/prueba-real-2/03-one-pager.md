# AGIGOV Trust Pack — one-pager (plantilla venta)

**Estado:** BORRADOR / no-sale hasta `prueba-real-2` PASS Operador B.

## Una frase

AGIGOV hace auditable el ciclo fiscal EGS (baseline → evidencia → Q-close) con ledger y health verificables por el comprador en URL pública.

## Qué compra el cliente

| Entrega | Evidencia |
|---------|-----------|
| Piloto EGS en cloud | Trust Pack case-study + URL live |
| Catálogo de cobro transparente | `GET /api/public/billing/catalog` |
| Freeze / centinela visible | Health + UI piloto |

## Qué NO prometemos hoy

- Dominio propio permanente (túnel CF efímero o IP HTTP)
- PQC híbrido en producción (`hybridClaimAllowed=false`)
- Lighthouse perf ≥90
- Cobro fiat automático sin PSP conectado

## Prueba independiente (buyer)

1. Abrir health: `http://137.184.66.163/api/ops/health` → `ok:true`
2. Abrir UI / piloto
3. Pedir carpeta `docs/commercial/case-studies/prueba-real-2/` con screenshots B

## Precio (propuesta — validar en G4)

Ver `docs/commercial/world-offer-draft.md`. Live plan hoy: **`free`**.
