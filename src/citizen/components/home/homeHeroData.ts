import { fetchMinistryHealth, type MinistryHealthResponse } from '../../api.js';

export const HOME_HERO_DEMO: MinistryHealthResponse = {
  updatedAt: new Date().toISOString(),
  available: true,
  ministryCode: 'MPPI',
  programName: 'Mantenimiento vial · Efficiency Gain Share',
  fiscalYear: 2026,
  quarter: 2,
  quarterCloseStatus: 'PUBLISHED',
  reconcileOk: true,
  discrepancies: [],
  baselineTrimestral: '2400000',
  gastosVerificados: '2220000',
  calculoAhorroFinal: '180000',
  executionPct: 92,
  escrowExecutionPct: 94,
  split: { reinversion: '126000', meritPool: '36000', agigovFee: '18000' },
  releaseCount: 50,
  contracts: Array.from({ length: 10 }, (_, i) => ({
    id: `EGS-${String(i + 1).padStart(2, '0')}`,
    title: `Tramo vial ${i + 1}`,
    territoryCode: 'MAR_NORTH_01',
    totalAmount: '240000',
    spentAmount: '220800',
    status: (i === 7 ? 'partial' : 'ok') as 'ok' | 'partial',
    milestonesTotal: 5,
    milestonesReleased: 5,
    escrowStatus: 'ACTIVE',
  })),
  treasuryPayload: null,
  ledgerProcessId: 'q-close-mppi-demo',
  published: true,
  pilotBanner: '',
};

export function formatHeroVes(value: string): string {
  const n = parseFloat(value);
  return Number.isNaN(n) ? value : n.toLocaleString('es-VE', { maximumFractionDigits: 0 });
}

export async function fetchHomeHeroEgs() {
  return fetchMinistryHealth('MPPI');
}
