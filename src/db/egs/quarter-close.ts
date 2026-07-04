/**
 * Cálculo EGS trimestral — Efficiency Gain Share (70/20/10).
 * Lógica pura; persistencia vía Prisma QuarterClose.
 */

export const EGS_SPLIT = {
  reinversion: 0.7,
  meritPool: 0.2,
  agigovFee: 0.1,
} as const;

export const FORCE_MAJEURE_CAP_RATIO = 0.05;

export type QuarterCloseInput = {
  baselineTrimestral: number;
  gastosVerificados: number;
  ajustesFuerzaMayor: number;
};

export type QuarterCloseResult = QuarterCloseInput & {
  calculoAhorroFinal: number;
  reinversionAmount: number;
  meritPoolAmount: number;
  agigovFeeAmount: number;
};

function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/** Valida tope ajustes fuerza mayor (5% baseline). */
export function assertForceMajeureCap(baselineTrimestral: number, ajustesFuerzaMayor: number): void {
  const cap = baselineTrimestral * FORCE_MAJEURE_CAP_RATIO;
  if (ajustesFuerzaMayor > cap + 1e-6) {
    throw new Error(
      `Ajustes fuerza mayor (${ajustesFuerzaMayor}) exceden tope 5% baseline (${cap})`,
    );
  }
}

/** baseline_trimestral desde acta anual y factor estacional por trimestre. */
export function baselineTrimestralFromActa(
  annualAmountBaseline: number,
  quarter: 1 | 2 | 3 | 4,
  seasonalFactors: [number, number, number, number] = [1, 1, 1, 1],
): number {
  const factor = seasonalFactors[quarter - 1] ?? 1;
  return round4((annualAmountBaseline / 4) * factor);
}

/**
 * Calcula Δ y reparto 70/20/10.
 * Si Δ ≤ 0, buckets de distribución = 0 (fee AGIGOV incluido).
 */
export function computeQuarterClose(input: QuarterCloseInput): QuarterCloseResult {
  assertForceMajeureCap(input.baselineTrimestral, input.ajustesFuerzaMayor);

  const calculoAhorroFinal = round4(
    input.baselineTrimestral - input.gastosVerificados - input.ajustesFuerzaMayor,
  );

  if (calculoAhorroFinal <= 0) {
    return {
      ...input,
      calculoAhorroFinal,
      reinversionAmount: 0,
      meritPoolAmount: 0,
      agigovFeeAmount: 0,
    };
  }

  return {
    ...input,
    calculoAhorroFinal,
    reinversionAmount: round4(calculoAhorroFinal * EGS_SPLIT.reinversion),
    meritPoolAmount: round4(calculoAhorroFinal * EGS_SPLIT.meritPool),
    agigovFeeAmount: round4(calculoAhorroFinal * EGS_SPLIT.agigovFee),
  };
}

/** Suma releases verificados → gastos_verificados. */
export function sumVerifiedReleases(releases: { amount: number }[]): number {
  return round4(releases.reduce((acc, r) => acc + r.amount, 0));
}

/** Payload export tesorería (ver QUARTER-CLOSE-SCHEMA-v0.1.md). */
export function toTreasuryPayload(
  quarterCloseId: string,
  fiscalYear: number,
  quarter: number,
  currency: string,
  ledgerProcessId: string,
  result: QuarterCloseResult,
) {
  return {
    quarterCloseId,
    fiscalYear,
    quarter,
    baseline_trimestral: result.baselineTrimestral.toFixed(4),
    gastos_verificados: result.gastosVerificados.toFixed(4),
    ajustes_fuerza_mayor: result.ajustesFuerzaMayor.toFixed(4),
    calculo_ahorro_final: result.calculoAhorroFinal.toFixed(4),
    reinversion: result.reinversionAmount.toFixed(4),
    merit_pool: result.meritPoolAmount.toFixed(4),
    agigov_fee: result.agigovFeeAmount.toFixed(4),
    currency,
    ledgerProcessId,
  };
}
