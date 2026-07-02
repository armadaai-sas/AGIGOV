import type { Prisma } from '../generated/core/index.js';
import { upsertProcessCheckpoint } from '../db/ledger/index.js';
import type { EvidenceBundle, ProcessStatus } from '../protocol/types.js';
import { assertTransition } from './types.js';

function toJson(bundle: EvidenceBundle | Record<string, unknown>): Prisma.InputJsonValue {
  return bundle as Prisma.InputJsonValue;
}

export async function advanceProcess(input: {
  processId: string;
  from: ProcessStatus;
  to: ProcessStatus;
  agentId: string;
  evidenceBundle: EvidenceBundle | Record<string, unknown>;
  originNodeId: string;
}) {
  assertTransition(input.from, input.to);
  return upsertProcessCheckpoint({
    processId: input.processId,
    status: input.to,
    agentId: input.agentId,
    evidenceBundle: toJson(input.evidenceBundle),
    originNodeId: input.originNodeId,
  });
}

export async function freezeProcess(input: {
  processId: string;
  agentId: string;
  evidenceBundle: EvidenceBundle;
  originNodeId: string;
  reason: string;
}) {
  return upsertProcessCheckpoint({
    processId: input.processId,
    status: 'frozen',
    agentId: input.agentId,
    evidenceBundle: toJson({ ...input.evidenceBundle, freezeReason: input.reason }),
    originNodeId: input.originNodeId,
  });
}

export async function unfreezeProcess(input: {
  processId: string;
  agentId: string;
  evidenceBundle: EvidenceBundle;
  originNodeId: string;
  approvedBy: string;
}) {
  assertTransition('frozen', 'received');
  return upsertProcessCheckpoint({
    processId: input.processId,
    status: 'received',
    agentId: input.agentId,
    evidenceBundle: toJson({
      ...input.evidenceBundle,
      unfreezeApprovedBy: input.approvedBy,
      unfrozenAt: new Date().toISOString(),
    }),
    originNodeId: input.originNodeId,
  });
}
