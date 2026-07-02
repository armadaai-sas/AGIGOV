import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import type { SyncEntityType } from '../../generated/edge/index.js';

export type ConflictStrategy =
  | 'immutable-reject-duplicate'
  | 'server-wins'
  | 'merge-non-critical'
  | 'max-timestamp'
  | 'arbitrator';

export interface ConflictRule {
  entityType: SyncEntityType;
  strategy: ConflictStrategy;
  description: string;
}

/** Reglas de resolución — alineadas con resilient-data-architecture skill. */
export const CONFLICT_RULES: Record<SyncEntityType, ConflictRule> = {
  vote: {
    entityType: 'vote',
    strategy: 'immutable-reject-duplicate',
    description: 'Votos inmutables; rechazar duplicados por payloadHash',
  },
  citizen: {
    entityType: 'citizen',
    strategy: 'server-wins',
    description: 'Server-wins en DID; merge campos no críticos en edge',
  },
  escrow: {
    entityType: 'escrow',
    strategy: 'arbitrator',
    description: 'Inventario/logística arbitrada por agente logístico',
  },
  acta: {
    entityType: 'acta',
    strategy: 'immutable-reject-duplicate',
    description: 'Actas inmutables por contentHash',
  },
  trust_edge: {
    entityType: 'trust_edge',
    strategy: 'max-timestamp',
    description: 'Trust edge: max(updatedAt) + auditoría centinela',
  },
  process: {
    entityType: 'process',
    strategy: 'server-wins',
    description: 'Checkpoint de proceso: server-wins con version',
  },
};

export function payloadHash(payload: unknown): string {
  return Buffer.from(sha256(utf8ToBytes(JSON.stringify(payload)))).toString(
    'hex',
  );
}

export class ConflictError extends Error {
  constructor(
    public readonly code:
      | 'DUPLICATE_IMMUTABLE'
      | 'VERSION_CONFLICT'
      | 'REJECTED_BY_RULE',
    message: string,
  ) {
    super(message);
    this.name = 'ConflictError';
  }
}
