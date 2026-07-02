import 'dotenv/config';

import { getCoreDb, disconnectCoreDb } from './client.js';
import { disconnectEdgeDb } from './edge-client.js';
import { enqueueSyncMutation } from './sync/outbox.js';
import { replicatePendingSync } from './sync/replicator.js';
import { countSyncByStatus } from './sync/outbox.js';

const ORIGIN = 'node-edge-demo-01';

async function main(): Promise<void> {
  const core = getCoreDb();
  const territory = await core.territorialNode.findUnique({
    where: { code: 'BOG_CENTER_01' },
  });

  if (!territory) {
    throw new Error('Ejecuta npm run db:seed primero');
  }

  const votePayload = {
    citizenDid: 'did:armada:bog:demo-citizen-01',
    territoryId: territory.id,
    processId: 'proc-vote-demo-001',
    signature: 'demo-signature-base64',
    payload: { choice: 'si', referendum: 'demo-2026' },
    agentId: 'centinela',
  };

  await enqueueSyncMutation({
    mutationType: 'create',
    entityType: 'vote',
    entityId: 'proc-vote-demo-001',
    payload: votePayload,
    originNodeId: ORIGIN,
  });

  console.log('[Demo] Encolado voto en edge outbox');
  console.log('[Demo] Pendientes:', await countSyncByStatus());

  const synced = await replicatePendingSync();
  console.log('[Demo] Replicadas al core:', synced);
  console.log('[Demo] Estado final:', await countSyncByStatus());

  const vote = await core.vote.findFirst({
    where: { processId: 'proc-vote-demo-001' },
  });
  console.log('[Demo] Voto en ledger:', vote?.payloadHash ?? 'no encontrado');

  await disconnectCoreDb();
  await disconnectEdgeDb();
}

main().catch(async (error) => {
  console.error('[Demo] Error:', error);
  await disconnectCoreDb();
  await disconnectEdgeDb();
  process.exit(1);
});
