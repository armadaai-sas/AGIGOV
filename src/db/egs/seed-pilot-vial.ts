import type { CoreDb } from '../client.js';
import { payloadHash } from '../sync/conflicts.js';
import {
  baselineTrimestralFromActa,
  computeQuarterClose,
  toTreasuryPayload,
} from './quarter-close.js';

const ORIGIN = 'node-ven-vial-pilot-01';
const MINISTRY = 'MPPI';
const BUDGET_CODE = '4.01.02.01.00';
const FISCAL_YEAR = 2026;
const QUARTER = 2;

/** 10 contratos · 50 hitos (5 por contrato) · Δ positivo demo. */
export async function seedEgsPilotVial(db: CoreDb) {
  const territory = await db.territorialNode.upsert({
    where: { code: 'VEN_VIAL_PILOT_01' },
    create: {
      code: 'VEN_VIAL_PILOT_01',
      name: 'Piloto Vial Venezuela — Miranda/Zulia demo',
      originNodeId: ORIGIN,
    },
    update: { name: 'Piloto Vial Venezuela — Miranda/Zulia demo' },
  });

  const budgetLine = await db.budgetLinePilot.upsert({
    where: { ministryCode_budgetCode: { ministryCode: MINISTRY, budgetCode: BUDGET_CODE } },
    create: {
      ministryCode: MINISTRY,
      budgetCode: BUDGET_CODE,
      programName: 'Mantenimiento vial verificable — Piloto EGS',
      currency: 'VES',
      pilotStatus: 'active',
      originNodeId: ORIGIN,
    },
    update: { pilotStatus: 'active' },
  });

  const annualBaseline = 4_000_000;
  const actaProcessId = 'acta-baseline-vial-pilot-2026';
  const baselineContent = { ministry: MINISTRY, budgetCode: BUDGET_CODE, annualBaseline, months: 24 };

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
        'did:armada:ven:ministerio:mppi',
        'did:armada:ven:contraloria:pilot',
        'did:armada:ven:centinela:observer',
      ],
      originNodeId: ORIGIN,
    },
    update: {},
  });

  const baselineQ = baselineTrimestralFromActa(annualBaseline, QUARTER);
  const releasePerMilestone = 16_400;
  const milestonesPerContract = 5;
  const contractCount = 10;

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
      currency: 'VES',
      originNodeId: ORIGIN,
    },
    update: { status: 'COLLECTING', baselineTrimestral: baselineQ },
  });

  let milestoneIndex = 0;
  for (let c = 1; c <= contractCount; c++) {
    const processId = `escrow-vial-pilot-c${String(c).padStart(2, '0')}`;
    const contractTotal = releasePerMilestone * milestonesPerContract;

    const escrow = await db.escrow.upsert({
      where: { processId },
      create: {
        processId,
        territoryId: territory.id,
        budgetLinePilotId: budgetLine.id,
        amount: contractTotal,
        currency: 'VES',
        status: 'RELEASED',
        threshold: 3,
        signers: ['did:armada:ven:logistico', 'did:armada:ven:mppi', 'did:armada:ven:centinela'],
        originNodeId: ORIGIN,
      },
      update: {
        budgetLinePilotId: budgetLine.id,
        status: 'RELEASED',
        amount: contractTotal,
      },
    });

    for (let m = 1; m <= milestonesPerContract; m++) {
      milestoneIndex++;
      const evidenceRef = payloadHash({
        contract: processId,
        milestone: m,
        iot: `lorawan-uplink-${milestoneIndex}`,
        citizens: [`did:armada:ven:auditor:${milestoneIndex}a`, `did:armada:ven:auditor:${milestoneIndex}b`],
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
          verifiedAt: new Date(`2026-0${QUARTER}-${String(Math.min(m * 5, 28)).padStart(2, '0')}T12:00:00Z`),
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

  const ledgerProcessId = `proc-quarter-close-vial-${FISCAL_YEAR}-q${QUARTER}`;
  const treasuryPayload = toTreasuryPayload(
    quarterClose.id,
    FISCAL_YEAR,
    QUARTER,
    'VES',
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
        pilot: 'egs-vial-ven',
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
        pilot: 'egs-vial-ven',
        milestones: milestoneIndex,
        contracts: contractCount,
        treasuryPayload,
      },
    },
  });

  return {
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
