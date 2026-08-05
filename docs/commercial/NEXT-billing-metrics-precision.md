# Tarea — Precisión de cobro (métricas + cuándo facturar)

**Estado P0:** cerrado en [`billing-p0-catalog.md`](./billing-p0-catalog.md) + `src/billing/*`.

## 0. Free sin costo AGIGOV — hecho

BYO hosting · email outbox (o Resend BYO) · IA off · caps · kill vía freeze.

## Capas

| Capa | Disparo | Métrica |
|------|---------|---------|
| Free | never · costo ≈ $0 | BYO + caps |
| SaaS | activate / anual | license-year |
| IaaU | fin de mes | **milestone-validated** (+ secundarias) |
| EGS | Q-close PUBLISHED | **10% Δ** · $0 si Δ≤0 |
| B2B | evidencia aceptada | evidenceId |

## Checklist

- [x] Unidad canónica IaaU
- [x] Free costo-cero
- [x] Fórmula Δ EGS 10%
- [x] FREEZE factura
- [x] P1: metering ↔ ProcessCheckpoint rows
- [x] P1: seats SaaS (PilotTenant + `/api/ops/tenants/:slug/seats`)
- [ ] P2 nacional: restore test / reconcile / soak (ver `docs/P2-FASE6-NACIONAL.md`)
