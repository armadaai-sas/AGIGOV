import 'dotenv/config';

import { DidRegistry } from './did-registry.js';
import { loadBusNodeConfig } from './config.js';
import { SovereignBusWorker } from './mqtt/sovereign-worker.js';
import { SqliteOutbox } from './outbox/sqlite-outbox.js';
import { createSwarmHandler, resolveAgentRole } from '../agents/dispatcher.js';
import { disconnectCoreDb } from '../db/client.js';

async function main(): Promise<void> {
  const config = loadBusNodeConfig();
  const registry = new DidRegistry();
  registry.loadFromFile(config.registryPath);

  const role = resolveAgentRole(
    config.nodeDid,
    process.env.AGENT_ROLE?.trim(),
  );

  const outbox = new SqliteOutbox(config.outboxDbPath);
  const worker = new SovereignBusWorker({
    mqttUrl: config.mqttUrl,
    clientId: config.clientId,
    shard: config.shard,
    nodeDid: config.nodeDid,
    encryption: config.encryption,
    registry,
    outbox,
    panicMode: config.panicMode,
    subscribeAudit: config.subscribeAudit || role === 'centinela',
    flushIntervalMs: config.flushIntervalMs,
  });

  const swarmHandler = createSwarmHandler({
    role,
    nodeDid: config.nodeDid,
    shard: config.shard,
    signing: config.signing,
    registry,
    worker,
    panicMode: config.panicMode,
    originNodeId: process.env.ORIGIN_NODE_ID?.trim() || 'node-local-01',
    humanInLoop: process.env.FREEZE_APPROVED !== 'true',
  });

  worker.onMessage(swarmHandler);

  const shutdown = async (signal: string) => {
    console.log(`[IAP] ${signal} — deteniendo worker (${role})...`);
    await worker.stop();
    outbox.close();
    await disconnectCoreDb();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  console.log(
    `[IAP] Agente ${role} → ${config.mqttUrl} shard=${config.shard}`,
  );
  await worker.start();
  console.log('[IAP] Enjambre activo');
}

main().catch((error) => {
  console.error('[IAP] Error fatal:', error);
  process.exit(1);
});
