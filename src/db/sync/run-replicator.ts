import 'dotenv/config';

import { disconnectCoreDb } from '../client.js';
import { disconnectEdgeDb } from '../edge-client.js';
import { countSyncByStatus } from './outbox.js';
import { replicatePendingSync } from './replicator.js';

async function main(): Promise<void> {
  const before = await countSyncByStatus();
  const synced = await replicatePendingSync();
  const after = await countSyncByStatus();

  console.log('[Sync] Replicadas:', synced);
  console.log('[Sync] Estado antes:', before);
  console.log('[Sync] Estado después:', after);

  await disconnectCoreDb();
  await disconnectEdgeDb();
}

main().catch((error) => {
  console.error('[Sync] Error:', error);
  process.exit(1);
});
