/**
 * Preview / registro fee EGS (10% Δ) + rev-share Model Manifest v1.
 */
import { computeQuarterClose, EGS_SPLIT, type QuarterCloseResult } from '../db/egs/quarter-close.js';
import {
  getModelManifest,
  splitProtocolFee,
  type ProtocolFeeShare,
} from '../citizen/platform/modelManifest.js';

export type EgsFeeInvoice = {
  billable: boolean;
  delta: number;
  feeRate: number;
  feeAmount: number;
  reinversionAmount: number;
  meritPoolAmount: number;
  currency: string;
  reason: string;
  /** Model Manifest v1 */
  modelId: 'egs';
  publisherId: string;
  feeShare: ProtocolFeeShare;
};

function emptyShare(feeAmount = 0): ProtocolFeeShare {
  const manifest = getModelManifest('egs')!;
  return splitProtocolFee(feeAmount, manifest.billing);
}

export function computeEgsFeeInvoice(
  input: {
    baselineTrimestral: number;
    gastosVerificados: number;
    ajustesFuerzaMayor?: number;
    currency?: string;
    egsAddonEnabled?: boolean;
  },
): EgsFeeInvoice & { computed: QuarterCloseResult } {
  const manifest = getModelManifest('egs');
  if (!manifest) {
    throw new Error('EGS model manifest missing from registry');
  }

  const computed = computeQuarterClose({
    baselineTrimestral: input.baselineTrimestral,
    gastosVerificados: input.gastosVerificados,
    ajustesFuerzaMayor: input.ajustesFuerzaMayor ?? 0,
  });

  const egsAddonEnabled = input.egsAddonEnabled !== false;
  const currency = input.currency ?? 'USD';
  const base = {
    modelId: 'egs' as const,
    publisherId: manifest.publisherId,
    currency,
    computed,
  };

  if (!egsAddonEnabled) {
    return {
      ...base,
      billable: false,
      delta: computed.calculoAhorroFinal,
      feeRate: EGS_SPLIT.agigovFee,
      feeAmount: 0,
      reinversionAmount: computed.reinversionAmount,
      meritPoolAmount: computed.meritPoolAmount,
      reason: 'EGS addon disabled',
      feeShare: emptyShare(0),
    };
  }

  if (computed.calculoAhorroFinal <= 0) {
    return {
      ...base,
      billable: false,
      delta: computed.calculoAhorroFinal,
      feeRate: EGS_SPLIT.agigovFee,
      feeAmount: 0,
      reinversionAmount: 0,
      meritPoolAmount: 0,
      reason: 'Δ ≤ 0 → fee AGIGOV = 0',
      feeShare: emptyShare(0),
    };
  }

  const feeAmount = computed.agigovFeeAmount;
  const feeShare = splitProtocolFee(feeAmount, manifest.billing);

  return {
    ...base,
    billable: true,
    delta: computed.calculoAhorroFinal,
    feeRate: EGS_SPLIT.agigovFee,
    feeAmount,
    reinversionAmount: computed.reinversionAmount,
    meritPoolAmount: computed.meritPoolAmount,
    reason: `EGS ${EGS_SPLIT.agigovFee * 100}% Δ · rev-share builder ${manifest.billing.builderShareOfFee * 100}% → ${manifest.publisherId}`,
    feeShare,
  };
}
