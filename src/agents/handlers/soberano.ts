import { registerActa } from '../../db/ledger/index.js';
import { advanceProcess } from '../state-machine.js';
import { AGENT_DID_SUFFIX, mergeEvidence } from '../types.js';
import { payloadHash } from '../../db/sync/conflicts.js';
import { assessConformity, getWhitepaperIndex } from '../whitepaper/index.js';
import type { AgentHandler } from '../context.js';

export const soberanoHandler: AgentHandler = async (ctx, message) => {
  const { evidenceBundle, processId, intent } = message.payload;
  const whitepaper = getWhitepaperIndex();

  if (intent === 'legal-opinion') {
    const proposal = evidenceBundle.facts.find(
      (f) => typeof f === 'object' && f !== null && 'proposal' in f,
    ) as { proposal?: string } | undefined;

    const text = proposal?.proposal ?? '';
    const assessment = assessConformity(text, whitepaper);

    const opinionHash = payloadHash({
      processId,
      text,
      conforme: assessment.conforme,
      score: assessment.score,
      sections: assessment.matchedSections,
    });

    await registerActa({
      processId,
      title: `Dictamen ${processId}`,
      contentHash: opinionHash,
      sovereignDid: ctx.nodeDid,
      status: assessment.conforme ? 'committed' : 'received',
      originNodeId: ctx.originNodeId,
      agentId: 'soberano',
    });

    return {
      action: assessment.conforme
        ? `dictamen CONFORME (${assessment.matchedSections.length} secciones)`
        : 'dictamen REVISAR',
      nextStatus: assessment.conforme ? 'committed' : 'received',
    };
  }

  await advanceProcess({
    processId,
    from: 'validated',
    to: 'decided',
    agentId: 'soberano',
    evidenceBundle,
    originNodeId: ctx.originNodeId,
  });

  const simplified = mergeEvidence(evidenceBundle, {
    status: 'decided',
    facts: [
      ...evidenceBundle.facts,
      {
        citizenSummary:
          'Propuesta evaluada contra carta de gobernanza A.R.M.A.D.A.',
        whitepaperSections: whitepaper.map((s) => s.title),
      },
    ],
  });

  return {
    action: 'opinión legal emitida',
    nextStatus: 'decided',
    handoff: {
      recipientDid: AGENT_DID_SUFFIX.comunicador,
      intent: 'publish-metrics',
      agent: 'soberano',
      evidenceBundle: simplified,
    },
  };
};
