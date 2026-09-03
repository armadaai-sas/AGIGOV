# Catálogo de cobro P0 — precisión operativa

**Estado:** implementado en código (`src/billing/*`) · 2026-07-26  
**Principio Free:** costo AGIGOV ≈ **$0** (BYO infra).

---

## Tabla unidad → precio → ledger → pagador → cuándo

| ID | Capa | Unidad | Precio | Fuente ledger | Pagador | Cuándo factura |
|----|------|--------|--------|---------------|---------|----------------|
| free-pilot | free | pilot-day | $0 | n/a | — | never |
| saas-license | saas | license-year | $18k (saas) / $60k+ (sovereign) | licenseActivatedAt | tenant | activate + anual |
| iaau-milestone | iaau | **milestone-validated** (canónica) | $0.50 | escrow RELEASED / Q-close | tenant | fin de mes si plan≠free |
| iaau-ledger | iaau | ledger-commit | $0.005 | ProcessCheckpoint | tenant | fin de mes |
| iaau-api | iaau | api-call | $0.02 | API access hash | tenant | fin de mes |
| egs-delta | egs | delta_certified | **10% Δ** | `calculoAhorroFinal` + `agigovFeeAmount` | tenant | Q-close PUBLISHED + addon |
| b2b-evidence | b2b | evidence-accepted | $0.10 piso | evidenceId + hash | contratista | por evidencia |
| addon-ai | addon | ai-seat-month | cotizar | evidenceBundle | tenant | mensual; **off en free** |

**EGS (ya en código):** `EGS_SPLIT.agigovFee = 0.1` en [`src/db/egs/quarter-close.ts`](../../src/db/egs/quarter-close.ts).  
Δ = baseline − gastosVerificados − ajustesFM. Si Δ ≤ 0 → fee = **0**.

---

## Free sin costo compañía

| Env | Valor Free |
|-----|------------|
| `AGIGOV_PLAN` | `free` |
| `AGIGOV_HOSTING` | `byo` (nunca `agigov` en free) |
| `AGIGOV_EMAIL_MODE` | `outbox` o Resend solo con `AGIGOV_EMAIL_BYO=1` |
| `AGIGOV_AI_ENABLED` | `0` |
| Caps | 90 días · 1 tenant · 500 API/día · 2 Q-closes |

Enforce: `assertFreeCostZero()` · email dispatch fuerza outbox si free sin BYO.

---

## APIs

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/public/billing/catalog` | Catálogo + caps free |
| GET | `/api/public/billing/usage` | Uso + invoice IaaU + freeze + freeGuard |
| POST | `/api/public/billing/egs-preview` | Preview 10% Δ |
| POST | `/api/ops/billing/unfreeze` | Human-in-the-loop (X-Ops-Key) |
| POST | `/api/ops/tenants/:slug/q-close` | Devuelve `agigovFeeAmount` + meter hito |

---

## FREEZE factura

Si `reconcileMeteringWithLedger` detecta hashes duplicados → escribe `data/billing-freeze.json` → IaaU **no billable** hasta `POST /api/ops/billing/unfreeze`.

---

## Checklist

- [x] Unidad canónica IaaU = milestone-validated
- [x] Free costo-cero (plan + hosting + email)
- [x] EGS 10% formal (reusa EGS_SPLIT)
- [x] FREEZE factura metering
- [x] P1: enlazar metering a ProcessCheckpoint real (no solo hash evento)
- [x] P1: seats SaaS en DB tenant
- [ ] P2: backup restore test + dashboard↔ledger (ver `docs/P2-FASE6-NACIONAL.md`)

---

## Deploy DO (2026-08-05)

- Droplet: `agigov-prod-light` · health OK · backup cron daily 03:15 UTC
- Smoke tunnel: ephemeral `*.trycloudflare.com` (reinicia cambia URL)
- **Túnel named (pendiente cuenta CF):** en el Droplet  
  `cloudflared tunnel login` → `cloudflared tunnel create agigov-prod-light` → ingress `http://127.0.0.1:3001` → DNS CNAME
