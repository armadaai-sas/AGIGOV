# QuarterClose Schema v0.1 — Agente Logístico

**Piloto EGS · Infraestructura Vial · AGIGOV-VEN**  
**Implementación:** `prisma/schema.prisma` (modelos `BudgetLinePilot`, `BaselineAct`, `QuarterClose`, …)

---

## Objetivo

Parametrizar la lógica contable **Baseline vs. Gasto Efectivo** para que el sistema calcule **Δ (calculo_ahorro_final)** y el reparto **70/20/10** sin intervención manual, integrable con tesorería ministerial vía `treasuryRef`.

---

## Fórmula canónica (aplicación automática)

```
gastos_verificados      = Σ QuarterCloseRelease.amount WHERE verified = true
ajustes_fuerza_mayor    = Σ ForceMajeureAdjustment.amount (tope 5% baseline_trimestral)
calculo_ahorro_final (Δ)= baseline_trimestral − gastos_verificados − ajustes_fuerza_mayor

IF Δ > 0:
  reinversion_amount = Δ × 0.70
  merit_pool_amount  = Δ × 0.20
  agigov_fee_amount  = Δ × 0.10
ELSE:
  reinversion_amount = merit_pool_amount = agigov_fee_amount = 0
```

Implementación de referencia: `src/db/egs/quarter-close.ts` (función `computeQuarterClose`).

---

## Modelos Prisma

### `BudgetLinePilot`

Partida presupuestaria incluida en el piloto ministerial.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ministryCode` | String | Ej. `MPPI` |
| `budgetCode` | String | Código ONAPRE / interno |
| `programName` | String | Nombre programa vial |
| `currency` | String | Default `VES` |
| `pilotStatus` | Enum | draft · active · closed · frozen |

### `BaselineAct`

Acta baseline 24 meses — fuente de verdad para trimestres.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `annualAmountBaseline` | Decimal | Baseline anual firmado |
| `historicalMonths` | Int | Default 24 |
| `contentHash` | String | Hash acta |
| `actaProcessId` | String | processId ledger |
| `signers` | Json | Multi-sig |

### `QuarterClose` — núcleo EGS

| Campo Prisma | Alias negocio | Descripción |
|--------------|---------------|-------------|
| `baselineTrimestral` | baseline_trimestral | Monto acordado trimestre |
| `gastosVerificados` | gastos_verificados | Suma releases verificados (auto) |
| `ajustesFuerzaMayor` | ajustes_fuerza_mayor | Suma ajustes aprobados (auto) |
| `calculoAhorroFinal` | calculo_ahorro_final | Δ calculado |
| `reinversionAmount` | 70% | Bucket a) |
| `meritPoolAmount` | 20% | Bucket b) |
| `agigovFeeAmount` | 10% | Bucket c) |
| `treasuryRef` | — | ID externo tesorería |
| `ledgerProcessId` | — | Commit ledger cierre |

**Estados (`QuarterCloseStatus`):**

```
DRAFT → BASELINE_LOCKED → COLLECTING → PENDING_VALIDATION
  → DELTA_CALCULATED → SPLIT_APPROVED → PUBLISHED
  | (irregularidad) → FROZEN
```

### `QuarterCloseRelease`

Vincula cada liberación Smart Escrow al trimestre.

| Campo | Descripción |
|-------|-------------|
| `escrowId` | FK Escrow |
| `amount` | Monto RELEASED |
| `evidenceRef` | Hash evidencia hito |
| `verifiedAt` | Timestamp centinela |

### `ForceMajeureAdjustment`

Ajustes documentados (tope 5%).

| Campo | Descripción |
|-------|-------------|
| `amount` | Monto ajuste |
| `reason` | Texto acta |
| `actaProcessId` | Ledger |

---

## Integración tesorería

| Evento | Webhook / API | Acción |
|--------|---------------|--------|
| `SPLIT_APPROVED` | `POST /treasury/egs/split` | Ordena 70/20/10 |
| Confirmación banco | `treasuryRef` en QuarterClose | Marca `PUBLISHED` |
| Discrepancia | centinela FREEZE | Estado `FROZEN` |

Payload mínimo export:

```json
{
  "quarterCloseId": "uuid",
  "fiscalYear": 2026,
  "quarter": 2,
  "baseline_trimestral": "1000000.0000",
  "gastos_verificados": "820000.0000",
  "ajustes_fuerza_mayor": "0.0000",
  "calculo_ahorro_final": "180000.0000",
  "reinversion": "126000.0000",
  "merit_pool": "36000.0000",
  "agigov_fee": "18000.0000",
  "currency": "VES",
  "ledgerProcessId": "process-uuid"
}
```

---

## Pipeline automático (logistico)

```
1. Cron trimestre T → crear QuarterClose (DRAFT)
2. Copiar baseline_trimestral desde BaselineAct + factor estacional
3. Agregar QuarterCloseRelease desde Escrow RELEASED en T
4. Sumar gastos_verificados
5. Validar ajustes ≤ 5% baseline
6. computeQuarterClose() → Δ y split
7. centinela valida → PENDING_VALIDATION → DELTA_CALCULATED
8. Multi-sig SPLIT_APPROVED → webhook tesorería
9. comunicador publica → PUBLISHED
```

---

## Migración

```bash
npm run db:generate
npm run db:migrate
```

Nombre sugerido migración: `egs_quarter_close_pilot_v1`

---

## Handoffs

| Agente | Tarea |
|--------|--------|
| **centinela** | Job reconciliación `gastos_verificados` ↔ ledger |
| **soberano** | Alinear términos AEI con campos schema |
| **comunicador** | Dashboard trimestre en `/proyectos` |

---

## Referencias código

- `prisma/schema.prisma` — modelos EGS
- `src/db/egs/quarter-close.ts` — cálculo puro
- `.cursor/skills/sovereign-economics-monetization/egs-escrow-spec.md`
