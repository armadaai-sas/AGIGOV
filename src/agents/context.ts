import type { DidRegistry } from '../bus/did-registry.js';
import type { SovereignBusWorker } from '../bus/mqtt/sovereign-worker.js';
import type {
  AgentId,
  AgentIntent,
  AgentSigningKeys,
  EvidenceBundle,
  OpenEnvelopeResult,
} from '../protocol/types.js';

export interface AgentContext {
  role: AgentId;
  nodeDid: string;
  shard: string;
  signing: AgentSigningKeys;
  registry: DidRegistry;
  worker: SovereignBusWorker;
  panicMode: boolean;
  originNodeId: string;
  humanInLoop: boolean;
}

export interface HandlerResult {
  action: string;
  nextStatus?: string;
  handoff?: {
    recipientDid: string;
    intent: AgentIntent;
    evidenceBundle: EvidenceBundle;
    agent: AgentId;
  };
}

export type AgentHandler = (
  ctx: AgentContext,
  message: OpenEnvelopeResult,
  meta: { topic: string; shard: string; opaqueId: string },
) => Promise<HandlerResult>;
