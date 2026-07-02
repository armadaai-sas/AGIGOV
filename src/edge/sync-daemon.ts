import 'dotenv/config';

import { disconnectCoreDb } from '../db/client.js';
import { disconnectEdgeDb, getEdgeDb } from '../db/edge-client.js';
import { countSyncByStatus } from '../db/sync/outbox.js';
import { replicatePendingSync } from '../db/sync/replicator.js';
import { checkCoreConnectivity } from './connectivity.js';
import { getEquityPolicy, logEquityPolicy } from './equity.js';
import { loadEdgeConfig } from './config.js';

async function ensureEdgeMeta(originNodeId: string): Promise<void> {
  await getEdgeDb().edgeMeta.upsert({
    where: { id: 'singleton' },
    create: { originNodeId },
    update: { originNodeId },
  });
}

async function tick(config: ReturnType<typeof loadEdgeConfig>): Promise<void> {
  const status = await checkCoreConnectivity(config.coreHealthUrl);

  if (!status.online) {
    console.log(`[Edge/Sync] Offline — ${status.detail}`);
    return;
  }

  const synced = await replicatePendingSync(config.syncBatchSize);
  if (synced > 0) {
    console.log(`[Edge/Sync] Replicadas ${synced} mutaciones al core`);
  }

  const counts = await countSyncByStatus();
  const pending = (counts.pending ?? 0) + (counts.failed ?? 0);
  if (pending > 0) {
    console.log(`[Edge/Sync] Pendientes: ${JSON.stringify(counts)}`);
  }
}

async function main(): Promise<void> {
  const config = loadEdgeConfig();
  const policy = getEquityPolicy(config);

  await ensureEdgeMeta(config.originNodeId);
  logEquityPolicy(policy, config.originNodeId);

  console.log(
    `[Edge/Sync] Daemon activo — intervalo ${config.syncIntervalMs}ms origin=${config.originNodeId}`,
  );

  const shutdown = async (signal: string) => {
    console.log(`[Edge/Sync] ${signal} — deteniendo...`);
    await disconnectCoreDb();
    await disconnectEdgeDb();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  await tick(config);
  setInterval(() => void tick(config), config.syncIntervalMs);
}

main().catch(async (error) => {
  console.error('[Edge/Sync] Error fatal:', error);
  await disconnectCoreDb();
  await disconnectEdgeDb();
  process.exit(1);
});
