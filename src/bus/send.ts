import {
  createSignedEnvelope,
  generateAgentKeys,
  verifyAndOpenEnvelope,
  InMemoryReplayGuard,
} from '../protocol/index.js';
import { DidRegistry } from './did-registry.js';
import { SqliteOutbox } from './outbox/sqlite-outbox.js';
import {
  deriveOpaqueTopicId,
  resolveDeliveryTopic,
} from './routing.js';
import type { AgentMessagePayload, SignedAgentEnvelope } from '../protocol/types.js';
import type { AgentSigningKeys } from '../protocol/types.js';

export interface SendEnvelopeInput {
  payload: AgentMessagePayload;
  sender: AgentSigningKeys;
  recipientDid: string;
  shard: string;
  publish?: (envelope: SignedAgentEnvelope, topic: string, opaqueId: string) => Promise<'sent' | 'queued'>;
}

/** Construye envelope firmado y resuelve topic opaco de entrega. */
export function buildOutboundEnvelope(
  input: SendEnvelopeInput,
  registry: DidRegistry,
): { envelope: SignedAgentEnvelope; topic: string; opaqueId: string } {
  const recipientX25519 = registry.resolveX25519PublicKey(input.recipientDid);
  if (!recipientX25519) {
    throw new Error(`DID receptor desconocido: ${input.recipientDid}`);
  }

  const envelope = createSignedEnvelope({
    payload: input.payload,
    sender: input.sender,
    recipient: {
      did: input.recipientDid,
      x25519PublicKey: recipientX25519,
    },
  });

  const opaqueId = deriveOpaqueTopicId(
    input.recipientDid,
    input.payload.processId,
  );
  const topic = resolveDeliveryTopic(
    input.shard,
    input.recipientDid,
    input.payload.processId,
  );

  return { envelope, topic, opaqueId };
}

export { generateAgentKeys, verifyAndOpenEnvelope, InMemoryReplayGuard };
