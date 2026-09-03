import 'dotenv/config';

import { getCoreDb, disconnectCoreDb } from '../src/db/client.js';
import { disconnectEdgeDb } from '../src/db/edge-client.js';
import { countSyncByStatus, enqueueSyncMutation } from '../src/db/sync/outbox.js';
import { replicatePendingSync } from '../src/db/sync/replicator.js';

const ORIGIN = process.env.ORIGIN_NODE_ID?.trim() || 'node-offline-test-01';
const MUTATIONS = Number.parseInt(process.env.OFFLINE_MUTATIONS ?? '24', 10);

async function main(): Promise<void> {
  console.log('[Offline72h] Simulación de cola edge (soak 72h real → validación Fase 6)');

  const core = getCoreDb();
  const territory = await core.territorialNode.findUnique({
    where: { code: 'BOG_CENTER_01' },
  });

  if (!territory) {
    throw new Error('Ejecuta npm run db:seed primero');
  }

  for (let i = 0; i < MUTATIONS; i += 1) {
    const processId = `proc-offline-${i}-${Date.now()}`;
    await enqueueSyncMutation({
      mutationType: 'create',
      entityType: 'vote',
      entityId: processId,
      payload: {
        citizenDid: 'did:agigov:bog:demo-citizen-01',
        territoryId: territory.id,
        processId,
        signature: `offline-demo-${i}-${Date.now()}`,
        payload: { choice: 'si', batch: i },
        agentId: 'centinela',
      },
      originNodeId: ORIGIN,
    });
  }

  const before = await countSyncByStatus();
  console.log('[Offline72h] Encoladas sin sync:', before);

  const synced = await replicatePendingSync(MUTATIONS + 10);
  const after = await countSyncByStatus();

  console.log('[Offline72h] Replicadas:', synced);
  console.log('[Offline72h] Estado final:', after);

  const pending = (after.pending ?? 0) + (after.failed ?? 0);
  if (pending > 0) {
    console.warn('[Offline72h] Quedan pendientes — revisar conexión core');
    process.exitCode = 1;
  } else {
    console.log('[Offline72h] OK — cola drenada sin pérdida aparente');
    console.log('[Offline72h] NOTA: soak 72h real se valida al cierre de Fase 6');
  }

  await disconnectCoreDb();
  await disconnectEdgeDb();
}

main().catch(async (error) => {
  console.error('[Offline72h] Error:', error);
  await disconnectCoreDb();
  await disconnectEdgeDb();
  process.exit(1);
});
