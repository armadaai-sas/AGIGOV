import type { Prisma } from '../../generated/edge/index.js';
import { getEdgeDb, type SyncEntityType } from '../edge-client.js';
import { payloadHash } from './conflicts.js';

export interface EnqueueSyncInput {
  mutationType: string;
  entityType: SyncEntityType;
  entityId: string;
  payload: Prisma.InputJsonValue;
  originNodeId: string;
}

/** Encola mutación civic en SQLite edge (offline-first). */
export async function enqueueSyncMutation(input: EnqueueSyncInput) {
  const edge = getEdgeDb();
  const hash = payloadHash(input.payload);

  return edge.syncOutbox.create({
    data: {
      mutationType: input.mutationType,
      entityType: input.entityType,
      entityId: input.entityId,
      payload: input.payload,
      payloadHash: hash,
      originNodeId: input.originNodeId,
    },
  });
}

export async function fetchPendingSync(limit = 50) {
  return getEdgeDb().syncOutbox.findMany({
    where: { status: { in: ['pending', 'failed'] } },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

export async function markSyncSynced(id: string) {
  return getEdgeDb().syncOutbox.update({
    where: { id },
    data: { status: 'synced', syncedAt: new Date(), lastError: null },
  });
}

export async function markSyncFailed(id: string, error: string) {
  return getEdgeDb().syncOutbox.update({
    where: { id },
    data: {
      status: 'failed',
      attempts: { increment: 1 },
      lastError: error,
    },
  });
}

export async function markSyncRejected(id: string, error: string) {
  return getEdgeDb().syncOutbox.update({
    where: { id },
    data: { status: 'rejected', lastError: error },
  });
}

export async function countSyncByStatus() {
  const rows = await getEdgeDb().syncOutbox.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  return Object.fromEntries(rows.map((r) => [r.status, r._count.id]));
}
