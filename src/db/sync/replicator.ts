import type { SyncOutbox } from '../../generated/edge/index.js';
import { getCoreDb } from '../client.js';
import {
  registerActa,
  registerVote,
  upsertEscrow,
  upsertProcessCheckpoint,
  upsertTrustEdge,
} from '../ledger/index.js';
import { ConflictError, CONFLICT_RULES } from './conflicts.js';
import {
  markSyncFailed,
  markSyncRejected,
  markSyncSynced,
} from './outbox.js';

type SyncPayload = Record<string, unknown>;

function asPayload(entry: SyncOutbox): SyncPayload {
  return entry.payload as SyncPayload;
}

/** Aplica una mutación del outbox edge al core Postgres. */
export async function applySyncEntry(entry: SyncOutbox): Promise<void> {
  const rule = CONFLICT_RULES[entry.entityType];
  const payload = asPayload(entry);

  try {
    switch (entry.entityType) {
      case 'vote':
        await registerVote({
          payloadHash: entry.payloadHash,
          citizenDid: String(payload.citizenDid),
          territoryId: String(payload.territoryId),
          processId: String(payload.processId),
          signature: String(payload.signature),
          payload: entry.payload,
          originNodeId: entry.originNodeId,
          agentId: String(payload.agentId ?? 'centinela'),
        });
        break;

      case 'escrow':
        await upsertEscrow({
          processId: String(payload.processId),
          amount: String(payload.amount),
          currency: String(payload.currency ?? 'VES'),
          status: payload.status as 'PENDING' | 'LOCKED' | 'RELEASED' | 'FROZEN',
          threshold: Number(payload.threshold),
          signers: payload.signers as object,
          originNodeId: entry.originNodeId,
          version: Number(payload.version ?? 1),
          agentId: String(payload.agentId ?? 'logistico'),
        });
        break;

      case 'acta':
        await registerActa({
          processId: String(payload.processId),
          title: String(payload.title),
          contentHash: entry.payloadHash,
          sovereignDid: String(payload.sovereignDid),
          status: payload.status as 'committed' | 'published',
          originNodeId: entry.originNodeId,
          agentId: String(payload.agentId ?? 'soberano'),
        });
        break;

      case 'trust_edge':
        await upsertTrustEdge({
          fromCitizenDid: String(payload.fromCitizenDid),
          toCitizenDid: String(payload.toCitizenDid),
          territoryId: String(payload.territoryId),
          weight: Number(payload.weight),
          evidenceRef: String(payload.evidenceRef),
          originNodeId: entry.originNodeId,
          updatedAt: payload.updatedAt
            ? new Date(String(payload.updatedAt))
            : undefined,
          agentId: String(payload.agentId ?? 'conciliador'),
        });
        break;

      case 'process':
        await upsertProcessCheckpoint({
          processId: String(payload.processId),
          status: payload.status as
            | 'received'
            | 'validated'
            | 'committed'
            | 'published',
          agentId: String(payload.agentId),
          evidenceBundle: entry.payload,
          originNodeId: entry.originNodeId,
          version: Number(payload.version ?? 1),
        });
        break;

      case 'citizen':
        await getCoreDb().citizen.upsert({
          where: { did: String(payload.did) },
          create: {
            did: String(payload.did),
            displayName: payload.displayName ? String(payload.displayName) : null,
            territoryId: String(payload.territoryId),
            originNodeId: entry.originNodeId,
          },
          update: {
            displayName: payload.displayName ? String(payload.displayName) : null,
            version: { increment: 1 },
          },
        });
        break;

      default:
        throw new Error(`Tipo no soportado: ${entry.entityType}`);
    }

    await markSyncSynced(entry.id);
  } catch (error) {
    if (error instanceof ConflictError) {
      await markSyncRejected(entry.id, error.message);
      return;
    }
    const message = error instanceof Error ? error.message : 'Error de sync';
    await markSyncFailed(entry.id, `[${rule.strategy}] ${message}`);
    throw error;
  }
}

export async function replicatePendingSync(limit = 50): Promise<number> {
  const { fetchPendingSync } = await import('./outbox.js');
  const pending = await fetchPendingSync(limit);
  let synced = 0;

  for (const entry of pending) {
    try {
      await applySyncEntry(entry);
      synced += 1;
    } catch {
      // markSyncFailed ya registrado; continuar con siguiente
    }
  }

  const edge = await import('../edge-client.js');
  await edge.getEdgeDb().edgeMeta.upsert({
    where: { id: 'singleton' },
    create: { originNodeId: pending[0]?.originNodeId ?? 'unknown', lastSyncAt: new Date() },
    update: { lastSyncAt: new Date() },
  });

  return synced;
}
