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
- [ ] P1: metering ↔ ProcessCheckpoint rows
