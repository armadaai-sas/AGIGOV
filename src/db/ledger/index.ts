import type { Prisma } from '../../generated/core/index.js';
import {
  getCoreDb,
  type EscrowStatus,
  type LedgerEntryType,
  type ProcessStatus,
} from '../client.js';
import { ConflictError } from '../sync/conflicts.js';
import { assertLedgerWritable } from '../../security/panic.js';
import { recordMeterEvent } from '../../billing/metering.js';

export interface RegisterVoteInput {
  payloadHash: string;
  citizenDid: string;
  territoryId: string;
  processId: string;
  signature: string;
  payload: Prisma.InputJsonValue;
  originNodeId: string;
  agentId?: string;
}

/** Registra voto inmutable — rechaza duplicados por payloadHash. */
export async function registerVote(input: RegisterVoteInput) {
  assertLedgerWritable();
  const db = getCoreDb();

  const existing = await db.vote.findUnique({
    where: { payloadHash: input.payloadHash },
  });
  if (existing) {
    throw new ConflictError(
      'DUPLICATE_IMMUTABLE',
      `Voto duplicado: ${input.payloadHash}`,
    );
  }

  return db.$transaction(async (tx) => {
    const vote = await tx.vote.create({
      data: {
        payloadHash: input.payloadHash,
        citizenDid: input.citizenDid,
        territoryId: input.territoryId,
        processId: input.processId,
        signature: input.signature,
        payload: input.payload,
        originNodeId: input.originNodeId,
      },
    });

    await tx.ledgerEntry.create({
      data: {
        entryType: 'VOTE',
        entityId: vote.id,
        entityHash: input.payloadHash,
        processId: input.processId,
        agentId: input.agentId ?? 'centinela',
        evidenceRef: input.payloadHash,
      },
    });

    return vote;
  });
}

export interface UpsertEscrowInput {
  processId: string;
  amount: number | string;
  currency?: string;
  status?: EscrowStatus;
  threshold: number;
  signers: Prisma.InputJsonValue;
  originNodeId: string;
  version?: number;
  agentId?: string;
}

export async function upsertEscrow(input: UpsertEscrowInput) {
  assertLedgerWritable();
  const db = getCoreDb();
  const entityHash = `${input.processId}:${input.version ?? 1}`;

  return db.$transaction(async (tx) => {
    const escrow = await tx.escrow.upsert({
      where: { processId: input.processId },
      create: {
        processId: input.processId,
        amount: input.amount,
        currency: input.currency ?? 'VES',
        status: input.status ?? 'PENDING',
        threshold: input.threshold,
        signers: input.signers,
        originNodeId: input.originNodeId,
      },
      update: {
        amount: input.amount,
        status: input.status,
        threshold: input.threshold,
        signers: input.signers,
        version: { increment: 1 },
      },
    });

    await tx.ledgerEntry.create({
      data: {
        entryType: 'ESCROW',
        entityId: escrow.id,
        entityHash,
        processId: input.processId,
        agentId: input.agentId ?? 'logistico',
        evidenceRef: entityHash,
      },
    });

    return escrow;
  });
}

export interface RegisterActaInput {
  processId: string;
  title: string;
  contentHash: string;
  sovereignDid: string;
  status?: ProcessStatus;
  originNodeId: string;
  agentId?: string;
}

export async function registerActa(input: RegisterActaInput) {
  assertLedgerWritable();
  const db = getCoreDb();

  const existing = await db.acta.findUnique({
    where: { contentHash: input.contentHash },
  });
  if (existing) {
    throw new ConflictError(
      'DUPLICATE_IMMUTABLE',
      `Acta duplicada: ${input.contentHash}`,
    );
  }

  return db.$transaction(async (tx) => {
    const acta = await tx.acta.create({
      data: {
        processId: input.processId,
        title: input.title,
        contentHash: input.contentHash,
        sovereignDid: input.sovereignDid,
        status: input.status ?? 'committed',
        originNodeId: input.originNodeId,
      },
    });

    await tx.ledgerEntry.create({
      data: {
        entryType: 'ACTA',
        entityId: acta.id,
        entityHash: input.contentHash,
        processId: input.processId,
        agentId: input.agentId ?? 'soberano',
        evidenceRef: input.contentHash,
      },
    });

    return acta;
  });
}

export interface UpsertTrustEdgeInput {
  fromCitizenDid: string;
  toCitizenDid: string;
  territoryId: string;
  weight: number;
  evidenceRef: string;
  originNodeId: string;
  updatedAt?: Date;
  agentId?: string;
}

/** Trust edge: max(updatedAt) gana; requiere nodos existentes. */
export async function upsertTrustEdge(input: UpsertTrustEdgeInput) {
  assertLedgerWritable();
  const db = getCoreDb();
  const updatedAt = input.updatedAt ?? new Date();

  const fromNode = await db.trustNode.findUnique({
    where: { citizenDid: input.fromCitizenDid },
  });
  const toNode = await db.trustNode.findUnique({
    where: { citizenDid: input.toCitizenDid },
  });

  if (!fromNode || !toNode) {
    throw new Error('TrustNode no encontrado para uno o ambos ciudadanos');
  }

  const existing = await db.trustEdge.findUnique({
    where: {
      fromNodeId_toNodeId: {
        fromNodeId: fromNode.id,
        toNodeId: toNode.id,
      },
    },
  });

  if (existing && existing.updatedAt > updatedAt) {
    return existing;
  }

  const entityHash = `${fromNode.id}:${toNode.id}:${updatedAt.getTime()}`;

  return db.$transaction(async (tx) => {
    const edge = await tx.trustEdge.upsert({
      where: {
        fromNodeId_toNodeId: {
          fromNodeId: fromNode.id,
          toNodeId: toNode.id,
        },
      },
      create: {
        fromNodeId: fromNode.id,
        toNodeId: toNode.id,
        weight: input.weight,
        evidenceRef: input.evidenceRef,
        originNodeId: input.originNodeId,
        updatedAt,
      },
      update: {
        weight: input.weight,
        evidenceRef: input.evidenceRef,
        updatedAt,
        version: { increment: 1 },
      },
    });

    await tx.ledgerEntry.create({
      data: {
        entryType: 'TRUST_EDGE',
        entityId: edge.id,
        entityHash,
        processId: input.evidenceRef,
        agentId: input.agentId ?? 'conciliador',
        evidenceRef: input.evidenceRef,
      },
    });

    return edge;
  });
}

export async function upsertProcessCheckpoint(input: {
  processId: string;
  status: ProcessStatus;
  agentId: string;
  evidenceBundle: Prisma.InputJsonValue;
  originNodeId: string;
  version?: number;
}) {
  assertLedgerWritable({ allowFreeze: input.status === 'frozen' });
  const db = getCoreDb();
  const entityHash = `${input.processId}:${input.status}:${input.version ?? 1}`;

  return db.$transaction(async (tx) => {
    const checkpoint = await tx.processCheckpoint.upsert({
      where: { processId: input.processId },
      create: {
        processId: input.processId,
        status: input.status,
        agentId: input.agentId,
        evidenceBundle: input.evidenceBundle,
        originNodeId: input.originNodeId,
      },
      update: {
        status: input.status,
        agentId: input.agentId,
        evidenceBundle: input.evidenceBundle,
        version: { increment: 1 },
      },
    });

    await tx.ledgerEntry.create({
      data: {
        entryType: 'PROCESS',
        entityId: checkpoint.id,
        entityHash,
        processId: input.processId,
        agentId: input.agentId,
        evidenceRef: entityHash,
      },
    });

    return checkpoint;
  }).then((checkpoint) => {
    if (input.status === 'committed' || input.status === 'published') {
      recordMeterEvent({
        unit: 'ledger-commit',
        quantity: 1,
        jurisdictionId: input.originNodeId,
        processId: input.processId,
      });
    }
    return checkpoint;
  });
}
