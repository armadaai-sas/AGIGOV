import { upsertEscrow } from '../../db/ledger/index.js';
import { advanceProcess } from '../state-machine.js';
import { AGENT_DID_SUFFIX, mergeEvidence } from '../types.js';
import type { AgentHandler } from '../context.js';

export const logisticoHandler: AgentHandler = async (ctx, message) => {
  const { evidenceBundle, processId } = message.payload;

  const resourceFact = evidenceBundle.facts.find(
    (f) => typeof f === 'object' && f !== null && 'resource' in f,
  ) as { resource?: string; amount?: number; unit?: string } | undefined;

  await upsertEscrow({
    processId,
    amount: resourceFact?.amount ?? 0,
    status: 'PENDING',
    threshold: 2,
    signers: [AGENT_DID_SUFFIX.logistico, AGENT_DID_SUFFIX.centinela],
    originNodeId: ctx.originNodeId,
    agentId: 'logistico',
  });

  await advanceProcess({
    processId,
    from: 'validated',
    to: 'decided',
    agentId: 'logistico',
    evidenceBundle,
    originNodeId: ctx.originNodeId,
  });

  const nextBundle = mergeEvidence(evidenceBundle, {
    status: 'decided',
    facts: [
      ...evidenceBundle.facts,
      {
        allocation: resourceFact?.resource ?? 'general',
        amount: resourceFact?.amount ?? 0,
        unit: resourceFact?.unit ?? 'units',
      },
    ],
  });

  return {
    action: 'recursos asignados',
    nextStatus: 'decided',
    handoff: {
      recipientDid: AGENT_DID_SUFFIX.centinela,
      intent: 'allocate-resources',
      agent: 'logistico',
      evidenceBundle: nextBundle,
    },
  };
};
