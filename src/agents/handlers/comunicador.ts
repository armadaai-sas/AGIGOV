import { advanceProcess } from '../state-machine.js';
import type { AgentHandler } from '../context.js';

export const comunicadorHandler: AgentHandler = async (ctx, message) => {
  const { evidenceBundle, processId } = message.payload;

  const metrics = {
    processId,
    status: evidenceBundle.status,
    factCount: evidenceBundle.facts.length,
    hashCount: evidenceBundle.hashes.length,
    publishedAt: new Date().toISOString(),
  };

  await advanceProcess({
    processId,
    from: 'committed',
    to: 'published',
    agentId: 'comunicador',
    evidenceBundle: { ...evidenceBundle, publicMetrics: metrics },
    originNodeId: ctx.originNodeId,
  });

  console.log('[comunicador] dashboard:', JSON.stringify(metrics, null, 2));

  return {
    action: 'métricas publicadas',
    nextStatus: 'published',
    handoff: undefined,
  };
};
