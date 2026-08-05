/**
 * Preview / registro fee EGS (10% Δ) — alineado a computeQuarterClose.
 */
import { computeQuarterClose, EGS_SPLIT, type QuarterCloseResult } from '../db/egs/quarter-close.js';

export type EgsFeeInvoice = {
  billable: boolean;
  delta: number;
  feeRate: number;
  feeAmount: number;
  reinversionAmount: number;
  meritPoolAmount: number;
  currency: string;
  reason: string;
};

export function computeEgsFeeInvoice(
  input: {
    baselineTrimestral: number;
    gastosVerificados: number;
    ajustesFuerzaMayor?: number;
    currency?: string;
    egsAddonEnabled?: boolean;
  },
): EgsFeeInvoice & { computed: QuarterCloseResult } {
  const computed = computeQuarterClose({
    baselineTrimestral: input.baselineTrimestral,
    gastosVerificados: input.gastosVerificados,
    ajustesFuerzaMayor: input.ajustesFuerzaMayor ?? 0,
  });

  const egsAddonEnabled = input.egsAddonEnabled !== false;
  const currency = input.currency ?? 'USD';

  if (!egsAddonEnabled) {
    return {
      billable: false,
      delta: computed.calculoAhorroFinal,
      feeRate: EGS_SPLIT.agigovFee,
      feeAmount: 0,
      reinversionAmount: computed.reinversionAmount,
      meritPoolAmount: computed.meritPoolAmount,
      currency,
      reason: 'EGS addon disabled',
      computed,
    };
  }

  if (computed.calculoAhorroFinal <= 0) {
    return {
      billable: false,
      delta: computed.calculoAhorroFinal,
      feeRate: EGS_SPLIT.agigovFee,
      feeAmount: 0,
      reinversionAmount: 0,
      meritPoolAmount: 0,
      currency,
      reason: 'Δ ≤ 0 → fee AGIGOV = 0',
      computed,
    };
  }

  return {
    billable: true,
    delta: computed.calculoAhorroFinal,
    feeRate: EGS_SPLIT.agigovFee,
    feeAmount: computed.agigovFeeAmount,
    reinversionAmount: computed.reinversionAmount,
    meritPoolAmount: computed.meritPoolAmount,
    currency,
    reason: `EGS ${EGS_SPLIT.agigovFee * 100}% of certified Δ`,
    computed,
  };
}
