import type { AgentId } from '../protocol/types.js';
import type { AgentContext, AgentHandler } from './context.js';
import { centinelaHandler } from './handlers/centinela.js';
import { comunicadorHandler } from './handlers/comunicador.js';
import { conciliadorHandler } from './handlers/conciliador.js';
import { logisticoHandler } from './handlers/logistico.js';
import { soberanoHandler } from './handlers/soberano.js';
import { executeHandoffs } from './handoff.js';
import { agentHandlesIntent, resolveAgentFromDid } from './types.js';

const HANDLERS: Record<AgentId, AgentHandler> = {
  centinela: centinelaHandler,
  logistico: logisticoHandler,
  soberano: soberanoHandler,
  conciliador: conciliadorHandler,
  comunicador: comunicadorHandler,
};

export function resolveAgentRole(nodeDid: string, explicit?: string): AgentId {
  if (explicit) return explicit as AgentId;
  const fromDid = resolveAgentFromDid(nodeDid);
  if (!fromDid) {
    throw new Error(
      `No se pudo inferir agente desde NODE_DID=${nodeDid}. Define AGENT_ROLE.`,
    );
  }
  return fromDid;
}

export function createSwarmHandler(ctx: AgentContext) {
  const handler = HANDLERS[ctx.role];

  return async (
    message: import('../protocol/types.js').OpenEnvelopeResult,
    meta: { topic: string; shard: string; opaqueId: string },
  ) => {
    const { intent, processId, agent } = message.payload;

    if (!agentHandlesIntent(ctx.role, intent)) {
      console.log(`[${ctx.role}] intent ${intent} ignorado`);
      return;
    }

    console.log(`[${ctx.role}] ← ${agent}/${intent} process=${processId}`);

    try {
      const result = await handler(ctx, message, meta);
      console.log(
        `[${ctx.role}] ${result.action}`,
        result.nextStatus ? `→ ${result.nextStatus}` : '',
      );
      await executeHandoffs(ctx, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[${ctx.role}] error:`, msg);
    }
  };
}

export { HANDLERS };
