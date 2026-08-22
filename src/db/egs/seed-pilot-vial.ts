import type { JurisdictionIso } from '../../config/sovereign/jurisdictions.js';
import type { CoreDb } from '../client.js';
import { payloadHash } from '../sync/conflicts.js';
import {
  getPilotProfileForIso,
  type PilotJurisdictionProfile,
} from '../../pilot/pilot-jurisdiction-profiles.js';
import {
  baselineTrimestralFromActa,
  computeQuarterClose,
  toTreasuryPayload,
} from './quarter-close.js';

export type SeedEgsPilotOptions = {
  iso?: JurisdictionIso;
  ministryCode?: string;
  budgetCode?: string;
  programName?: string;
  territoryCode?: string;
  fiscalYear?: number;
  quarter?: number;
  originNodeId?: string;
  contractCount?: number;
  currency?: string;
  /** Override escala monetaria (p. ej. tests). */
  egsScale?: PilotJurisdictionProfile['egsScale'];
};

function seedTenantKey(ministryCode: string, budgetCode: string): string {
  return `${ministryCode}-${budgetCode}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function resolveSeedContext(options: SeedEgsPilotOptions) {
  const iso = options.iso ?? 'VEN';
  const profile = getPilotProfileForIso(iso);
  const scale = options.egsScale ?? profile.egsScale;
  const ministryCode = options.ministryCode ?? profile.ministryCode;
  const budgetCode = options.budgetCode ?? profile.budgetCode;
  const currency = options.currency ?? profile.currency;
  const didNs = profile.didNamespace;
  const escrowPrefix = profile.escrowPrefix;
  const tenantKey = seedTenantKey(ministryCode, budgetCode);

  return {
    iso,
    profile,
    scale,
    ORIGIN: options.originNodeId ?? profile.originNodeId,
    MINISTRY: ministryCode,
    BUDGET_CODE: budgetCode,
    FISCAL_YEAR: options.fiscalYear ?? 2026,
    QUARTER: options.quarter ?? 2,
    programName: options.programName ?? profile.programName,
    territoryCode: options.territoryCode ?? profile.territoryCode,
    currency,
    didNs,
    escrowPrefix,
    tenantKey,
    contractCount: options.contractCount ?? scale.contractCount,
    releasePerMilestone: scale.releasePerMilestone,
    milestonesPerContract: scale.milestonesPerContract,
    annualBaseline: scale.annualBaseline,
    // Per-tenant IDs — shared iso-only IDs collide when provisioning many sandboxes.
    actaProcessId: `acta-baseline-${iso.toLowerCase()}-${tenantKey}-2026`,
    pilotTag: profile.pilotEvidenceTag,
  };
}

/** Contratos + hitos EGS — montos y moneda por jurisdicción (VEN/COL/USA). */
export async function seedEgsPilotVial(db: CoreDb, options: SeedEgsPilotOptions = {}) {
  const ctx = resolveSeedContext(options);
  const {
    ORIGIN,
    MINISTRY,
    BUDGET_CODE,
    FISCAL_YEAR,
    QUARTER,
    contractCount,
    programName,
    territoryCode,
    currency,
    didNs,
    escrowPrefix,
    releasePerMilestone,
    milestonesPerContract,
    annualBaseline,
    actaProcessId,
    pilotTag,
  } = ctx;

  const territory = await db.territorialNode.upsert({
    where: { code: territoryCode },
    create: {
      code: territoryCode,
      name: `Territorio piloto — ${MINISTRY}`,
      originNodeId: ORIGIN,
    },
    update: { name: `Territorio piloto — ${MINISTRY}`, originNodeId: ORIGIN },
  });

  const budgetLine = await db.budgetLinePilot.upsert({
    where: { ministryCode_budgetCode: { ministryCode: MINISTRY, budgetCode: BUDGET_CODE } },
    create: {
      ministryCode: MINISTRY,
      budgetCode: BUDGET_CODE,
      programName,
      currency,
      pilotStatus: 'active',
      originNodeId: ORIGIN,
    },
    update: { pilotStatus: 'active', programName, currency },
  });

  const baselineContent = {
    ministry: MINISTRY,
    budgetCode: BUDGET_CODE,
    annualBaseline,
    months: 24,
    iso: ctx.iso,
  };

  await db.baselineAct.upsert({
    where: { actaProcessId },
    create: {
      budgetLinePilotId: budgetLine.id,
      fiscalYear: FISCAL_YEAR,
      historicalMonths: 24,
      annualAmountBaseline: annualBaseline,
      contentHash: payloadHash(baselineContent),
      actaProcessId,
      signedAt: new Date('2026-04-01T00:00:00Z'),
      signers: [
        `did:armada:${didNs}:ministerio:${MINISTRY.toLowerCase()}`,
        `did:armada:${didNs}:contraloria:${MINISTRY.toLowerCase()}`,
        `did:armada:${didNs}:centinela:observer`,
      ],
      originNodeId: ORIGIN,
    },
    update: {
      annualAmountBaseline: annualBaseline,
      contentHash: payloadHash(baselineContent),
    },
  });

  const baselineQ = baselineTrimestralFromActa(
    annualBaseline,
    (QUARTER >= 1 && QUARTER <= 4 ? QUARTER : 2) as 1 | 2 | 3 | 4,
  );

  const quarterClose = await db.quarterClose.upsert({
    where: {
      budgetLinePilotId_fiscalYear_quarter: {
        budgetLinePilotId: budgetLine.id,
        fiscalYear: FISCAL_YEAR,
        quarter: QUARTER,
      },
    },
    create: {
      budgetLinePilotId: budgetLine.id,
      fiscalYear: FISCAL_YEAR,
      quarter: QUARTER,
      status: 'COLLECTING',
      baselineTrimestral: baselineQ,
      currency,
      originNodeId: ORIGIN,
    },
    update: { status: 'COLLECTING', baselineTrimestral: baselineQ, currency },
  });

  let milestoneIndex = 0;
  for (let c = 1; c <= contractCount; c++) {
    const processId = `${escrowPrefix}-${ctx.tenantKey}-c${String(c).padStart(2, '0')}`;
    const contractTotal = releasePerMilestone * milestonesPerContract;

    const escrow = await db.escrow.upsert({
      where: { processId },
      create: {
        processId,
        territoryId: territory.id,
        budgetLinePilotId: budgetLine.id,
        amount: contractTotal,
        currency,
        status: 'RELEASED',
        threshold: 3,
        signers: [
          `did:armada:${didNs}:logistico`,
          `did:armada:${didNs}:${MINISTRY.toLowerCase()}`,
          `did:armada:${didNs}:centinela`,
        ],
        originNodeId: ORIGIN,
      },
      update: {
        budgetLinePilotId: budgetLine.id,
        status: 'RELEASED',
        amount: contractTotal,
        currency,
      },
    });

    for (let m = 1; m <= milestonesPerContract; m++) {
      milestoneIndex++;
      const evidenceRef = payloadHash({
        contract: processId,
        milestone: m,
        iso: ctx.iso,
        iot: `lorawan-uplink-${milestoneIndex}`,
        citizens: [
          `did:armada:${didNs}:auditor:${milestoneIndex}a`,
          `did:armada:${didNs}:auditor:${milestoneIndex}b`,
        ],
        centinela: 'verified',
      });

      await db.quarterCloseRelease.upsert({
        where: {
          quarterCloseId_escrowId_milestoneIndex: {
            quarterCloseId: quarterClose.id,
            escrowId: escrow.id,
            milestoneIndex: m,
          },
        },
        create: {
          quarterCloseId: quarterClose.id,
          escrowId: escrow.id,
          milestoneIndex: m,
          amount: releasePerMilestone,
          evidenceRef,
          verifiedAt: new Date(
            `2026-0${QUARTER}-${String(Math.min(m * 5, 28)).padStart(2, '0')}T12:00:00Z`,
          ),
          originNodeId: ORIGIN,
        },
        update: { amount: releasePerMilestone, evidenceRef },
      });
    }
  }

  const gastos = releasePerMilestone * milestonesPerContract * contractCount;
  const computed = computeQuarterClose({
    baselineTrimestral: baselineQ,
    gastosVerificados: gastos,
    ajustesFuerzaMayor: 0,
  });

  const ledgerProcessId = `proc-quarter-close-${ctx.iso.toLowerCase()}-${ctx.tenantKey}-${FISCAL_YEAR}-q${QUARTER}`;
  const treasuryPayload = toTreasuryPayload(
    quarterClose.id,
    FISCAL_YEAR,
    QUARTER,
    currency,
    ledgerProcessId,
    computed,
  );

  await db.quarterClose.update({
    where: { id: quarterClose.id },
    data: {
      gastosVerificados: computed.gastosVerificados,
      calculoAhorroFinal: computed.calculoAhorroFinal,
      reinversionAmount: computed.reinversionAmount,
      meritPoolAmount: computed.meritPoolAmount,
      agigovFeeAmount: computed.agigovFeeAmount,
      status: 'PENDING_VALIDATION',
      ledgerProcessId,
      contentHash: payloadHash(treasuryPayload),
    },
  });

  await db.processCheckpoint.upsert({
    where: { processId: ledgerProcessId },
    create: {
      processId: ledgerProcessId,
      status: 'validated',
      agentId: 'centinela',
      evidenceBundle: {
        pilot: pilotTag,
        iso: ctx.iso,
        milestones: milestoneIndex,
        contracts: contractCount,
        treasuryPayload,
      },
      originNodeId: ORIGIN,
    },
    update: {
      status: 'validated',
      agentId: 'centinela',
      evidenceBundle: {
        pilot: pilotTag,
        iso: ctx.iso,
        milestones: milestoneIndex,
        contracts: contractCount,
        treasuryPayload,
      },
    },
  });

  return {
    iso: ctx.iso,
    currency,
    escrowPrefix,
    firstEscrowRef: `${escrowPrefix}-${ctx.tenantKey}-c01`,
    budgetLineId: budgetLine.id,
    quarterCloseId: quarterClose.id,
    baselineTrimestral: baselineQ,
    gastosVerificados: gastos,
    delta: computed.calculoAhorroFinal,
    agigovFee: computed.agigovFeeAmount,
    contracts: contractCount,
    milestones: milestoneIndex,
    treasuryPayload,
  };
}
