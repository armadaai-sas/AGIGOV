import type { MinistryHealthResponse } from '../../api.js';
import { fetchMinistryHealth } from '../../api.js';
import type { SovereignConfig } from '../../../config/sovereign/index.js';

type DemoScale = {
  baselineTrimestral: string;
  gastosVerificados: string;
  calculoAhorroFinal: string;
  reinversion: string;
  meritPool: string;
  agigovFee: string;
  contractTotal: string;
  contractSpent: string;
};

const DEMO_SCALES: Record<string, DemoScale> = {
  VES: {
    baselineTrimestral: '2400000',
    gastosVerificados: '2220000',
    calculoAhorroFinal: '180000',
    reinversion: '126000',
    meritPool: '36000',
    agigovFee: '18000',
    contractTotal: '240000',
    contractSpent: '220800',
  },
  COP: {
    baselineTrimestral: '960000000',
    gastosVerificados: '888000000',
    calculoAhorroFinal: '72000000',
    reinversion: '50400000',
    meritPool: '14400000',
    agigovFee: '7200000',
    contractTotal: '96000000',
    contractSpent: '88320000',
  },
  USD: {
    baselineTrimestral: '600000',
    gastosVerificados: '555000',
    calculoAhorroFinal: '45000',
    reinversion: '31500',
    meritPool: '9000',
    agigovFee: '4500',
    contractTotal: '60000',
    contractSpent: '55200',
  },
};

/** Demo EGS por jurisdicción — montos coherentes con la moneda del país. */
export function getHeroDemoData(
  sovereign: Pick<
    SovereignConfig,
    'iso' | 'currency' | 'territoryCode' | 'ministryCode'
  >,
  programName: string,
): MinistryHealthResponse {
  const scale = DEMO_SCALES[sovereign.currency] ?? DEMO_SCALES.USD!;

  return {
    updatedAt: new Date().toISOString(),
    available: true,
    ministryCode: sovereign.ministryCode,
    programName,
    fiscalYear: 2026,
    quarter: 2,
    quarterCloseStatus: 'PUBLISHED',
    reconcileOk: true,
    discrepancies: [],
    baselineTrimestral: scale.baselineTrimestral,
    gastosVerificados: scale.gastosVerificados,
    calculoAhorroFinal: scale.calculoAhorroFinal,
    currency: sovereign.currency,
    executionPct: 92,
    escrowExecutionPct: 94,
    split: {
      reinversion: scale.reinversion,
      meritPool: scale.meritPool,
      agigovFee: scale.agigovFee,
    },
    releaseCount: 50,
    contracts: Array.from({ length: 10 }, (_, i) => ({
      id: `EGS-${String(i + 1).padStart(2, '0')}`,
      title: `EGS-${String(i + 1).padStart(2, '0')}`,
      territoryCode: sovereign.territoryCode,
      totalAmount: scale.contractTotal,
      spentAmount: scale.contractSpent,
      status: (i === 7 ? 'partial' : 'ok') as 'ok' | 'partial',
      milestonesTotal: 5,
      milestonesReleased: 5,
      escrowStatus: 'ACTIVE',
    })),
    treasuryPayload: null,
    ledgerProcessId: `q-close-${sovereign.iso.toLowerCase()}-demo`,
    published: true,
    pilotBanner: '',
  };
}

export async function fetchHomeHeroEgs(ministryCode = 'MPPI') {
  return fetchMinistryHealth(ministryCode);
}
