import type { AgentId, AgentIntent, EvidenceBundle, ProcessStatus } from '../protocol/types.js';

/** Transiciones válidas del pipeline institucional. */
export const PROCESS_TRANSITIONS: Record<
  ProcessStatus,
  readonly ProcessStatus[]
> = {
  received: ['validated', 'frozen'],
  validated: ['decided', 'frozen'],
  decided: ['committed', 'frozen'],
  committed: ['published'],
  published: [],
  frozen: ['received'],
};

export function canTransition(from: ProcessStatus, to: ProcessStatus): boolean {
  return PROCESS_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: ProcessStatus, to: ProcessStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Transición inválida: ${from} → ${to}`);
  }
}

export function mergeEvidence(
  base: EvidenceBundle,
  patch: Partial<EvidenceBundle>,
): EvidenceBundle {
  return {
    processId: base.processId,
    facts: patch.facts ?? base.facts,
    hashes: patch.hashes ?? base.hashes,
    rulesTriggered: patch.rulesTriggered ?? base.rulesTriggered,
    status: patch.status ?? base.status,
  };
}

/** Intents que cada agente consume en el bus IAP. */
export const AGENT_INBOUND_INTENTS: Record<AgentId, readonly AgentIntent[]> = {
  centinela: ['validate-request', 'allocate-resources', 'unfreeze-request'],
  logistico: ['validation-result'],
  soberano: ['validation-result', 'legal-opinion'],
  conciliador: ['mediate-dispute'],
  comunicador: ['publish-metrics'],
};

export function agentHandlesIntent(
  agent: AgentId,
  intent: AgentIntent,
): boolean {
  return AGENT_INBOUND_INTENTS[agent].includes(intent);
}

export const AGENT_DID_SUFFIX: Record<AgentId, string> = {
  centinela: 'did:armada:core:centinela',
  logistico: 'did:armada:core:logistico',
  soberano: 'did:armada:core:soberano',
  conciliador: 'did:armada:core:conciliador',
  comunicador: 'did:armada:core:comunicador',
};

export function resolveAgentFromDid(did: string): AgentId | null {
  const entry = Object.entries(AGENT_DID_SUFFIX).find(([, value]) => value === did);
  return entry ? (entry[0] as AgentId) : null;
}
