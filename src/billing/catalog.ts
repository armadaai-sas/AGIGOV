/**
 * Catálogo de cobro P0 — unidad → precio → ledger → pagador → cuándo.
 * EGS fee = EGS_SPLIT.agigovFee (10%) en src/db/egs/quarter-close.ts
 */
import { EGS_SPLIT } from '../db/egs/quarter-close.js';
import type { MeterUnit } from './metering.js';
import { freePlanCaps, resolvePlan, type AgigovPlan } from './plan.js';

export type ChargeLayer = 'free' | 'saas' | 'iaau' | 'egs' | 'addon' | 'b2b';

export type ChargeLine = {
  id: string;
  layer: ChargeLayer;
  unit: string;
  priceUsd: number | 'included' | 'pct_delta';
  priceNote: string;
  ledgerSource: string;
  payer: 'none' | 'tenant_state' | 'tenant_private' | 'contractor' | 'agigov_absorbed';
  invoiceWhen: string;
  billable: boolean;
};

/** Unidad canónica IaaU P0: hito validado (milestone-validated). Secundarias: metering. */
export const IAAU_PRIMARY_UNIT: MeterUnit = 'milestone-validated';

export const IAAU_RATES_USD: Record<MeterUnit, number> = {
  'iap-envelope': 0.002,
  'ledger-commit': 0.005,
  'api-call': 0.02,
  'sync-node': 0.08,
  'milestone-validated': 0.5,
};

export const SAAS_ANNUAL_USD: Record<Exclude<AgigovPlan, 'free'>, number> = {
  saas: 18_000,
  sovereign: 60_000,
};

export function buildChargeCatalog(plan: AgigovPlan = resolvePlan()): {
  plan: AgigovPlan;
  egsFeeRate: number;
  iaauPrimary: MeterUnit;
  lines: ChargeLine[];
  freeCaps: ReturnType<typeof freePlanCaps>;
} {
  const lines: ChargeLine[] = [
    {
      id: 'free-pilot',
      layer: 'free',
      unit: 'pilot-day',
      priceUsd: 0,
      priceNote: 'BYO infra · sin Resend/IA AGIGOV · cap 90d',
      ledgerSource: 'n/a',
      payer: 'none',
      invoiceWhen: 'never',
      billable: false,
    },
    {
      id: 'saas-license',
      layer: 'saas',
      unit: 'license-year',
      priceUsd: plan === 'free' ? 0 : SAAS_ANNUAL_USD[plan === 'sovereign' ? 'sovereign' : 'saas'],
      priceNote: plan === 'free' ? 'Upgrade a saas/sovereign' : 'Licencia plataforma',
      ledgerSource: 'tenant.licenseActivatedAt',
      payer: 'tenant_state',
      invoiceWhen: 'on_license_activate + annual renewal',
      billable: plan !== 'free',
    },
    {
      id: 'iaau-milestone',
      layer: 'iaau',
      unit: IAAU_PRIMARY_UNIT,
      priceUsd: IAAU_RATES_USD['milestone-validated'],
      priceNote: 'Unidad canónica IaaU P0',
      ledgerSource: 'escrow RELEASED / Q-close validated hito',
      payer: 'tenant_state',
      invoiceWhen: 'end_of_month if plan≠free && !billingFrozen',
      billable: plan !== 'free',
    },
    {
      id: 'iaau-ledger-commit',
      layer: 'iaau',
      unit: 'ledger-commit',
      priceUsd: IAAU_RATES_USD['ledger-commit'],
      priceNote: 'Secundaria',
      ledgerSource: 'ProcessCheckpoint committed',
      payer: 'tenant_state',
      invoiceWhen: 'end_of_month if plan≠free',
      billable: plan !== 'free',
    },
    {
      id: 'iaau-api',
      layer: 'iaau',
      unit: 'api-call',
      priceUsd: IAAU_RATES_USD['api-call'],
      priceNote: 'Consulta API certificada',
      ledgerSource: 'public-api access log hash',
      payer: 'tenant_state',
      invoiceWhen: 'end_of_month if plan≠free',
      billable: plan !== 'free',
    },
    {
      id: 'egs-delta',
      layer: 'egs',
      unit: 'delta_certified',
      priceUsd: 'pct_delta',
      priceNote: `${EGS_SPLIT.agigovFee * 100}% Δ · $0 si Δ≤0 · add-on opcional`,
      ledgerSource: 'QuarterClose.calculoAhorroFinal + agigovFeeAmount (published)',
      payer: 'tenant_state',
      invoiceWhen: 'after Q-close PUBLISHED and EGS addon enabled',
      billable: plan !== 'free',
    },
    {
      id: 'b2b-evidence',
      layer: 'b2b',
      unit: 'evidence-accepted',
      priceUsd: 0.1,
      priceNote: 'Rango comercial $0.10–$1.00; default piso P0',
      ledgerSource: 'evidenceId + contentHash',
      payer: 'contractor',
      invoiceWhen: 'per accepted evidence if B2B addon',
      billable: plan !== 'free',
    },
    {
      id: 'addon-ai',
      layer: 'addon',
      unit: 'ai-seat-month',
      priceUsd: 'included',
      priceNote: 'Cotizar seat; off en Free',
      ledgerSource: 'ai.session → evidenceBundle ids',
      payer: 'tenant_state',
      invoiceWhen: 'monthly if AGIGOV_AI_ENABLED',
      billable: false,
    },
  ];

  return {
    plan,
    egsFeeRate: EGS_SPLIT.agigovFee,
    iaauPrimary: IAAU_PRIMARY_UNIT,
    lines,
    freeCaps: freePlanCaps(),
  };
}
