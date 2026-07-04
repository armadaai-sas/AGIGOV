import { getCoreDb } from '../db/client.js';
import { reconcileQuarterClose } from '../db/egs/reconcile-quarter-close.js';
import { toTreasuryPayload } from '../db/egs/quarter-close.js';

export type MilestonePublicState = 'LOCKED' | 'VALIDATED' | 'RELEASED';

export type ContractHealthStatus = 'ok' | 'discrepancy' | 'partial';

export interface PublicEgsContractSummary {
  id: string;
  title: string;
  territoryCode: string;
  totalAmount: string;
  spentAmount: string;
  status: ContractHealthStatus;
  milestonesTotal: number;
  milestonesReleased: number;
  escrowStatus: string;
}

export interface PublicMinistryHealth {
  updatedAt: string;
  available: true;
  ministryCode: string;
  programName: string;
  fiscalYear: number;
  quarter: number;
  quarterCloseStatus: string;
  reconcileOk: boolean;
  discrepancies: string[];
  baselineTrimestral: string;
  gastosVerificados: string;
  calculoAhorroFinal: string;
  executionPct: number;
  escrowExecutionPct: number;
  split: {
    reinversion: string;
    meritPool: string;
    agigovFee: string;
  };
  releaseCount: number;
  contracts: PublicEgsContractSummary[];
  treasuryPayload: ReturnType<typeof toTreasuryPayload> | null;
  ledgerProcessId: string | null;
  published: boolean;
  pilotBanner: string;
}

export interface PublicMilestoneCustody {
  index: number;
  label: string;
  amount: string;
  state: MilestonePublicState;
  verifiedAt: string | null;
  evidenceRef: string | null;
  validators: {
    centinela: string;
    iot: string;
    citizens: [string, string];
  } | null;
}

export interface PublicEgsContractDetail {
  updatedAt: string;
  contract: PublicEgsContractSummary & {
    currency: string;
    signers: string[];
    threshold: number;
  };
  quarter: {
    fiscalYear: number;
    quarter: number;
    status: string;
    reconcileOk: boolean;
    discrepancies: string[];
  };
  milestones: PublicMilestoneCustody[];
  ledgerProcessId: string | null;
}

const MILESTONES_PER_CONTRACT = 5;

function contractTitle(processId: string): string {
  const match = processId.match(/c(\d+)$/i) ?? processId.match(/-c(\d+)/i);
  if (match) return `Contrato vial C${match[1]}`;
  return processId;
}

function contractNumber(processId: string): number {
  const match = processId.match(/c(\d+)$/i) ?? processId.match(/-c(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function globalMilestoneIndex(contractNum: number, milestoneIndex: number): number {
  return (contractNum - 1) * MILESTONES_PER_CONTRACT + milestoneIndex;
}

function deriveMilestoneState(hasRelease: boolean, escrowStatus: string): MilestonePublicState {
  if (!hasRelease) return 'LOCKED';
  if (escrowStatus === 'RELEASED') return 'RELEASED';
  return 'VALIDATED';
}

function milestoneValidators(globalIndex: number): PublicMilestoneCustody['validators'] {
  return {
    centinela: 'did:armada:ven:centinela:observer',
    iot: `lorawan-uplink-${globalIndex}`,
    citizens: [
      `did:armada:ven:auditor:${globalIndex}a`,
      `did:armada:ven:auditor:${globalIndex}b`,
    ],
  };
}

function buildContractSummary(
  escrow: {
    id: string;
    processId: string;
    amount: { toString(): string };
    status: string;
    territory: { code: string } | null;
  },
  releases: Array<{ milestoneIndex: number; amount: { toString(): string } }>,
  reconcileDiscrepancies: string[],
): PublicEgsContractSummary {
  let milestonesReleased = 0;
  let hasDiscrepancy = reconcileDiscrepancies.some((d) => d.includes(escrow.processId));

  for (let m = 1; m <= MILESTONES_PER_CONTRACT; m++) {
    const rel = releases.find((r) => r.milestoneIndex === m);
    const state = deriveMilestoneState(Boolean(rel), escrow.status);
    if (state === 'RELEASED') milestonesReleased++;
    if (state === 'VALIDATED') hasDiscrepancy = true;
  }

  let status: ContractHealthStatus = 'ok';
  if (hasDiscrepancy) status = 'discrepancy';
  else if (milestonesReleased < MILESTONES_PER_CONTRACT) status = 'partial';

  const spentAmount = releases.reduce((sum, r) => sum + Number(r.amount), 0);

  return {
    id: escrow.processId,
    title: contractTitle(escrow.processId),
    territoryCode: escrow.territory?.code ?? 'VEN_VIAL_PILOT_01',
    totalAmount: escrow.amount.toString(),
    spentAmount: spentAmount.toFixed(4),
    status,
    milestonesTotal: MILESTONES_PER_CONTRACT,
    milestonesReleased,
    escrowStatus: escrow.status,
  };
}

export async function getMinistryHealth(ministryCode = 'MPPI'): Promise<PublicMinistryHealth | null> {
  const db = getCoreDb();

  const budgetLine = await db.budgetLinePilot.findFirst({
    where: { ministryCode, pilotStatus: 'active' },
  });
  if (!budgetLine) return null;

  const qc = await db.quarterClose.findFirst({
    where: { budgetLinePilotId: budgetLine.id },
    orderBy: [{ fiscalYear: 'desc' }, { quarter: 'desc' }],
    include: {
      verifiedReleases: { include: { escrow: true } },
    },
  });
  if (!qc) return null;

  const reconcile = await reconcileQuarterClose(db, qc.id);

  const refreshed = await db.quarterClose.findUniqueOrThrow({ where: { id: qc.id } });

  const escrows = await db.escrow.findMany({
    where: { budgetLinePilotId: budgetLine.id },
    include: { territory: true },
    orderBy: { processId: 'asc' },
  });

  const releasesByEscrow = new Map<string, typeof qc.verifiedReleases>();
  for (const release of qc.verifiedReleases) {
    const list = releasesByEscrow.get(release.escrowId) ?? [];
    list.push(release);
    releasesByEscrow.set(release.escrowId, list);
  }

  const contracts = escrows.map((escrow) =>
    buildContractSummary(
      escrow,
      releasesByEscrow.get(escrow.id) ?? [],
      reconcile.discrepancies,
    ),
  );

  const baseline = Number(refreshed.baselineTrimestral);
  const gastos = reconcile.gastosVerificados;
  const executionPct = baseline > 0 ? Math.round((gastos / baseline) * 100) : 0;

  const totalEscrow = escrows.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSpent = contracts.reduce((sum, c) => sum + parseFloat(c.spentAmount), 0);
  const escrowExecutionPct =
    totalEscrow > 0 ? Math.round((totalSpent / totalEscrow) * 100) : 0;

  let treasuryPayload: ReturnType<typeof toTreasuryPayload> | null = null;
  if (refreshed.ledgerProcessId) {
    treasuryPayload = toTreasuryPayload(
      refreshed.id,
      refreshed.fiscalYear,
      refreshed.quarter,
      refreshed.currency,
      refreshed.ledgerProcessId,
      {
        baselineTrimestral: baseline,
        gastosVerificados: gastos,
        ajustesFuerzaMayor: Number(refreshed.ajustesFuerzaMayor),
        calculoAhorroFinal: reconcile.calculoAhorroFinal,
        reinversionAmount: reconcile.reinversionAmount,
        meritPoolAmount: reconcile.meritPoolAmount,
        agigovFeeAmount: reconcile.agigovFeeAmount,
      },
    );
  }

  let published = refreshed.status === 'PUBLISHED';
  if (refreshed.ledgerProcessId) {
    const checkpoint = await db.processCheckpoint.findUnique({
      where: { processId: refreshed.ledgerProcessId },
    });
    published = published || checkpoint?.status === 'published';
  }

  return {
    updatedAt: new Date().toISOString(),
    available: true,
    ministryCode: budgetLine.ministryCode,
    programName: budgetLine.programName,
    fiscalYear: refreshed.fiscalYear,
    quarter: refreshed.quarter,
    quarterCloseStatus: refreshed.status,
    reconcileOk: reconcile.ok,
    discrepancies: reconcile.discrepancies,
    baselineTrimestral: baseline.toFixed(4),
    gastosVerificados: gastos.toFixed(4),
    calculoAhorroFinal: reconcile.calculoAhorroFinal.toFixed(4),
    executionPct,
    escrowExecutionPct,
    split: {
      reinversion: reconcile.reinversionAmount.toFixed(4),
      meritPool: reconcile.meritPoolAmount.toFixed(4),
      agigovFee: reconcile.agigovFeeAmount.toFixed(4),
    },
    releaseCount: reconcile.releaseCount,
    contracts,
    treasuryPayload,
    ledgerProcessId: refreshed.ledgerProcessId,
    published,
    pilotBanner: published
      ? ''
      : 'Piloto técnico — datos validados por centinela, pendiente promulgación pública',
  };
}

export async function getEgsContractDetail(
  escrowProcessId: string,
): Promise<PublicEgsContractDetail | null> {
  const db = getCoreDb();

  const escrow = await db.escrow.findUnique({
    where: { processId: escrowProcessId },
    include: { territory: true, budgetLinePilot: true },
  });
  if (!escrow?.budgetLinePilotId) return null;

  const qc = await db.quarterClose.findFirst({
    where: { budgetLinePilotId: escrow.budgetLinePilotId },
    orderBy: [{ fiscalYear: 'desc' }, { quarter: 'desc' }],
    include: {
      verifiedReleases: {
        where: { escrowId: escrow.id },
      },
    },
  });
  if (!qc) return null;

  const reconcile = await reconcileQuarterClose(db, qc.id);
  const refreshed = await db.quarterClose.findUniqueOrThrow({ where: { id: qc.id } });

  const contractNum = contractNumber(escrow.processId);
  const milestones: PublicMilestoneCustody[] = [];

  for (let m = 1; m <= MILESTONES_PER_CONTRACT; m++) {
    const release = qc.verifiedReleases.find((r) => r.milestoneIndex === m);
    const state = deriveMilestoneState(Boolean(release), escrow.status);
    const globalIndex = globalMilestoneIndex(contractNum || 1, m);

    milestones.push({
      index: m,
      label: `Hito ${m} — Verificación vial`,
      amount: release ? release.amount.toString() : '0',
      state,
      verifiedAt: release?.verifiedAt.toISOString() ?? null,
      evidenceRef: release?.evidenceRef ?? null,
      validators: release ? milestoneValidators(globalIndex) : null,
    });
  }

  const summary = buildContractSummary(escrow, qc.verifiedReleases, reconcile.discrepancies);

  return {
    updatedAt: new Date().toISOString(),
    contract: {
      ...summary,
      currency: escrow.currency,
      signers: Array.isArray(escrow.signers)
        ? escrow.signers.filter((s): s is string => typeof s === 'string')
        : [],
      threshold: escrow.threshold,
    },
    quarter: {
      fiscalYear: refreshed.fiscalYear,
      quarter: refreshed.quarter,
      status: refreshed.status,
      reconcileOk: reconcile.ok,
      discrepancies: reconcile.discrepancies,
    },
    milestones,
    ledgerProcessId: refreshed.ledgerProcessId,
  };
}
