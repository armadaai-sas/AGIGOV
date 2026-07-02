import type { EdgeConfig } from './config.js';

/**
 * Política de equidad territorial: nodos periféricos usan el mismo pipeline
 * FIFO que nodos core-adjacentes. No hay cola secundaria ni TTL reducido.
 */
export interface EquityPolicy {
  tier: EdgeConfig['tier'];
  ordering: 'fifo-created-at';
  rejectAfterAttempts: number;
  description: string;
}

export function getEquityPolicy(config: EdgeConfig): EquityPolicy {
  return {
    tier: config.tier,
    ordering: 'fifo-created-at',
    rejectAfterAttempts: config.maxSyncAttempts,
    description:
      config.tier === 'peripheral'
        ? 'Nodo periférico: misma prioridad FIFO; sync al reconectar sin degradación'
        : 'Nodo core-adjacente: FIFO estándar',
  };
}

export function logEquityPolicy(policy: EquityPolicy, originNodeId: string): void {
  console.log(
    `[Edge/Equity] ${originNodeId} tier=${policy.tier} ordering=${policy.ordering}`,
  );
}
