import { upsertTrustEdge } from '../../db/ledger/index.js';
import { advanceProcess } from '../state-machine.js';
import { AGENT_DID_SUFFIX, mergeEvidence } from '../types.js';
import type { AgentHandler } from '../context.js';

export const conciliadorHandler: AgentHandler = async (ctx, message) => {
  const { evidenceBundle, processId } = message.payload;

  const dispute = evidenceBundle.facts.find(
    (f) => typeof f === 'object' && f !== null && 'fromDid' in f,
  ) as {
    fromDid?: string;
    toDid?: string;
    territoryId?: string;
    weight?: number;
  } | undefined;

  if (dispute?.fromDid && dispute?.toDid && dispute?.territoryId) {
    await upsertTrustEdge({
      fromCitizenDid: dispute.fromDid,
      toCitizenDid: dispute.toDid,
      territoryId: dispute.territoryId,
      weight: dispute.weight ?? 0.5,
      evidenceRef: processId,
      originNodeId: ctx.originNodeId,
      agentId: 'conciliador',
    });
  }

  await advanceProcess({
    processId,
    from: 'validated',
    to: 'decided',
    agentId: 'conciliador',
    evidenceBundle,
    originNodeId: ctx.originNodeId,
  });

  const resolved = mergeEvidence(evidenceBundle, {
    status: 'decided',
    facts: [
      ...evidenceBundle.facts,
      { mediation: 'resuelto por grafo de confianza' },
    ],
  });

  return {
    action: 'disputa mediada',
    nextStatus: 'decided',
    handoff: {
      recipientDid: AGENT_DID_SUFFIX.soberano,
      intent: 'legal-opinion',
      agent: 'conciliador',
      evidenceBundle: resolved,
    },
  };
};
