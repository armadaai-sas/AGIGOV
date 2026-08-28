import type { JurisdictionIso } from '../config/sovereign/jurisdictions.js';
import { jurisdictionByIso } from '../config/sovereign/jurisdictions.js';

/** Escala monetaria EGS por moneda — Δ positivo demo (misma lógica 70/20/10). */
export type PilotEgsScale = {
  annualBaseline: number;
  releasePerMilestone: number;
  milestonesPerContract: number;
  contractCount: number;
};

export type PilotJurisdictionProfile = {
  iso: JurisdictionIso;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  displayName: string;
  programName: string;
  territoryCode: string;
  originNodeId: string;
  currency: string;
  didNamespace: string;
  escrowPrefix: string;
  pilotEvidenceTag: string;
  egsScale: PilotEgsScale;
};

const EGS_SCALE: Record<string, PilotEgsScale> = {
  VES: {
    annualBaseline: 4_000_000,
    releasePerMilestone: 16_400,
    milestonesPerContract: 5,
    contractCount: 10,
  },
  COP: {
    annualBaseline: 4_000_000_000,
    releasePerMilestone: 16_400_000,
    milestonesPerContract: 5,
    contractCount: 10,
  },
  USD: {
    annualBaseline: 2_400_000,
    releasePerMilestone: 4_100,
    milestonesPerContract: 5,
    contractCount: 10,
  },
};

function profile(
  iso: JurisdictionIso,
  overrides: Omit<
    PilotJurisdictionProfile,
    'iso' | 'currency' | 'didNamespace' | 'egsScale' | 'escrowPrefix' | 'pilotEvidenceTag'
  > & {
    currency?: string;
    didNamespace?: string;
    escrowPrefix?: string;
    pilotEvidenceTag?: string;
    egsScale?: PilotEgsScale;
  },
): PilotJurisdictionProfile {
  const j = jurisdictionByIso(iso)!;
  const currency = overrides.currency ?? j.currency;
  return {
    iso,
    currency,
    didNamespace: overrides.didNamespace ?? iso.toLowerCase(),
    escrowPrefix: overrides.escrowPrefix ?? `escrow-${iso.toLowerCase()}-pilot`,
    pilotEvidenceTag: overrides.pilotEvidenceTag ?? `egs-vial-${iso.toLowerCase()}`,
    egsScale: overrides.egsScale ?? EGS_SCALE[currency] ?? EGS_SCALE.USD!,
    slug: overrides.slug,
    ministryCode: overrides.ministryCode,
    budgetCode: overrides.budgetCode,
    displayName: overrides.displayName,
    programName: overrides.programName,
    territoryCode: overrides.territoryCode,
    originNodeId: overrides.originNodeId,
  };
}

export const PILOT_JURISDICTION_PROFILES: Record<JurisdictionIso, PilotJurisdictionProfile> = {
  VEN: profile('VEN', {
    slug: 'mppi-trust-pilot',
    ministryCode: 'MPPI',
    budgetCode: '4.01.02.01.00',
    displayName: 'Ministerio de Obras Públicas — Piloto Fiscal',
    programName: 'Mantenimiento vial verificable — Trust Pilot Fiscal',
    territoryCode: 'VEN_VIAL_PILOT_01',
    originNodeId: 'node-pilot-mppi-01',
  }),
  COL: profile('COL', {
    slug: 'mintrans-trust-pilot',
    ministryCode: 'MINTRANS',
    budgetCode: '2.01.03.01.00',
    displayName: 'Ministerio de Transporte — Piloto Fiscal AGIGOV-COL',
    programName: 'Mantenimiento vial verificable — Reparto del ahorro por eficiencia',
    territoryCode: 'COL_PILOT_01',
    originNodeId: 'node-pilot-mintrans-01',
  }),
  USA: profile('USA', {
    slug: 'usdot-trust-pilot',
    ministryCode: 'USDOT',
    budgetCode: '69.010.001',
    displayName: 'US Department of Transportation — Fiscal Pilot',
    programName: 'Highway maintenance — Efficiency Gain Share',
    territoryCode: 'USA_PILOT_01',
    originNodeId: 'node-pilot-usdot-01',
  }),
  SBX: profile('SBX', {
    slug: 'sbx-trust-pilot',
    ministryCode: 'DEMO',
    budgetCode: '0.00.00.00',
    displayName: 'Sandbox — Trust Pilot Fiscal',
    programName: 'Interop EGS sandbox',
    territoryCode: 'SBX_WEST_01',
    originNodeId: 'node-pilot-sbx-01',
  }),
  GEN: profile('GEN', {
    slug: 'global-trust-pilot',
    ministryCode: 'DEMO',
    budgetCode: '0.00.00.00',
    displayName: 'Global pilot — EGS demo',
    programName: 'Obras públicas piloto — Reparto del ahorro por eficiencia',
    territoryCode: 'GLOBAL',
    originNodeId: 'node-pilot-global-01',
  }),
};

export function getPilotProfileForIso(iso: string): PilotJurisdictionProfile {
  const key = iso.toUpperCase() as JurisdictionIso;
  return PILOT_JURISDICTION_PROFILES[key] ?? PILOT_JURISDICTION_PROFILES.GEN;
}

export function isoFromMinistryCode(ministryCode: string): JurisdictionIso {
  const code = ministryCode.toUpperCase();
  for (const profile of Object.values(PILOT_JURISDICTION_PROFILES)) {
    if (profile.ministryCode === code) return profile.iso;
  }
  return 'VEN';
}

export function firstEscrowContractRef(profile: PilotJurisdictionProfile): string {
  return `${profile.escrowPrefix}-c01`;
}
