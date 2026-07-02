import { buildOutboundEnvelope } from '../bus/send.js';
import type { AgentContext, HandlerResult } from './context.js';
import type { AgentMessagePayload } from '../protocol/types.js';

export async function executeHandoff(
  ctx: AgentContext,
  handoff: NonNullable<HandlerResult['handoff']>,
): Promise<'sent' | 'queued'> {
  const payload: AgentMessagePayload = {
    v: 1,
    processId: handoff.evidenceBundle.processId,
    agent: handoff.agent,
    intent: handoff.intent,
    evidenceBundle: handoff.evidenceBundle,
  };

  const { envelope, topic, opaqueId } = buildOutboundEnvelope(
    {
      payload,
      sender: ctx.signing,
      recipientDid: handoff.recipientDid,
      shard: ctx.shard,
    },
    ctx.registry,
  );

  return ctx.worker.publish(envelope, topic, opaqueId, true);
}

export async function executeHandoffs(
  ctx: AgentContext,
  result: HandlerResult,
): Promise<void> {
  if (!result.handoff) return;
  const status = await executeHandoff(ctx, result.handoff);
  console.log(
    `[${ctx.role}] handoff → ${result.handoff.recipientDid} (${status})`,
  );
}
