import 'dotenv/config';

import { generateAgentKeys } from '../protocol/index.js';
import { DidRegistry } from '../bus/did-registry.js';
import { getCoreDb, disconnectCoreDb } from '../db/client.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { HANDLERS } from './dispatcher.js';
import { AGENT_DID_SUFFIX } from './types.js';
import type { AgentContext } from './context.js';
import type { AgentId, AgentIntent, EvidenceBundle } from '../protocol/types.js';

const noopWorker = { publish: async () => 'sent' as const };

function buildCtx(
  role: AgentId,
  registry: DidRegistry,
  signing: ReturnType<typeof generateAgentKeys>['signing'],
): AgentContext {
  return {
    role,
    nodeDid: AGENT_DID_SUFFIX[role],
    shard: process.env.BUS_SHARD?.trim() || 'core',
    signing,
    registry,
    worker: noopWorker as unknown as AgentContext['worker'],
    panicMode: process.env.PANIC_MODE === 'true',
    originNodeId: process.env.ORIGIN_NODE_ID?.trim() || 'node-flow-demo',
    humanInLoop: true,
  };
}

async function runStep(
  role: AgentId,
  intent: AgentIntent,
  bundle: EvidenceBundle,
  registry: DidRegistry,
) {
  const keys = generateAgentKeys(AGENT_DID_SUFFIX[role]);
  const ctx = buildCtx(role, registry, keys.signing);
  const payload = { v: 1 as const, processId: bundle.processId, agent: role, intent, evidenceBundle: bundle };
  const result = await HANDLERS[role](ctx, {
    payload,
    envelope: {} as never,
  }, { topic: 'local/demo', shard: ctx.shard, opaqueId: 'demo' });
  console.log(`[Flow] ${role}/${intent} → ${result.action} (${result.nextStatus ?? '-'})`);
  return result;
}

async function main(): Promise<void> {
  const registry = new DidRegistry();
  registry.loadFromFile(process.env.DID_REGISTRY_PATH?.trim() || 'data/did-registry.json');

  const territory = await getCoreDb().territorialNode.findUnique({
    where: { code: 'BOG_CENTER_01' },
  });
  if (!territory) {
    throw new Error('Ejecuta npm run db:seed antes del demo de flujo');
  }

  const processId = `proc-flow-${Date.now()}`;
  let bundle: EvidenceBundle = {
    processId,
    facts: [{ resource: 'agua', amount: 1200, unit: 'litros', territoryId: territory.id }],
    hashes: [payloadHash({ processId, sensor: 'node-mobile-7' })],
    rulesTriggered: ['sensor-integrity-ok'],
    status: 'received',
  };

  console.log('[Flow] Pipeline:', processId);

  const r1 = await runStep('centinela', 'validate-request', bundle, registry);
  if (!r1.handoff) return;

  bundle = r1.handoff.evidenceBundle;
  const r2 = await runStep('logistico', 'validation-result', bundle, registry);
  if (!r2.handoff) return;

  bundle = r2.handoff.evidenceBundle;
  const r3 = await runStep('centinela', 'allocate-resources', bundle, registry);
  if (!r3.handoff) return;

  bundle = r3.handoff.evidenceBundle;
  await runStep('comunicador', 'publish-metrics', bundle, registry);

  const checkpoint = await getCoreDb().processCheckpoint.findUnique({ where: { processId } });
  console.log('[Flow] Estado final:', checkpoint?.status ?? 'unknown');
  await disconnectCoreDb();
}

main().catch(async (error) => {
  console.error('[Flow] Error:', error);
  await disconnectCoreDb();
  process.exit(1);
});
