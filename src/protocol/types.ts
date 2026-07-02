/** Agentes del enjambre institucional A.R.M.A.D.A. */
export type AgentId =
  | 'centinela'
  | 'logistico'
  | 'soberano'
  | 'conciliador'
  | 'comunicador';

/** Intents de handoff entre agentes (IAP v1). */
export type AgentIntent =
  | 'validate-request'
  | 'validation-result'
  | 'allocate-resources'
  | 'legal-opinion'
  | 'mediate-dispute'
  | 'publish-metrics'
  | 'unfreeze-request';

/** Intents bloqueados cuando PANIC_MODE está activo. */
export const MUTABLE_INTENTS: readonly AgentIntent[] = [
  'validate-request',
  'validation-result',
  'allocate-resources',
  'legal-opinion',
  'mediate-dispute',
  'publish-metrics',
] as const;

/** Único intent permitido en bus durante pánico (recuperación). */
export const PANIC_SAFE_INTENTS: readonly AgentIntent[] = [
  'unfreeze-request',
] as const;

export type ProcessStatus =
  | 'received'
  | 'validated'
  | 'decided'
  | 'committed'
  | 'published'
  | 'frozen';

/** Hechos verificables — no incluir razonamiento del LLM. */
export interface EvidenceBundle {
  processId: string;
  facts: unknown[];
  hashes: string[];
  rulesTriggered: string[];
  status: ProcessStatus;
}

/** Payload cifrado dentro del envelope. */
export interface AgentMessagePayload {
  v: 1;
  processId: string;
  agent: AgentId;
  intent: AgentIntent;
  evidenceBundle: EvidenceBundle;
}

/** Envelope firmado en el bus soberano (wire format v1). */
export interface SignedAgentEnvelope {
  v: 1;
  messageId: string;
  processId: string;
  nonce: string;
  senderDid: string;
  recipientDid: string;
  agent: AgentId;
  intent: AgentIntent;
  issuedAt: number;
  expiresAt: number;
  /** Clave efímera X25519 (base64, 32 bytes). */
  ephemeralPublicKey: string;
  /** xnonce(24) || ciphertext AEAD (base64). */
  ciphertext: string;
  /** Firma Ed25519 sobre campos externos canónicos (base64). */
  signature: string;
}

export interface AgentSigningKeys {
  did: string;
  ed25519SecretKey: Uint8Array;
  ed25519PublicKey: Uint8Array;
}

export interface AgentEncryptionKeys {
  did: string;
  x25519SecretKey: Uint8Array;
  x25519PublicKey: Uint8Array;
}

export interface CreateEnvelopeInput {
  payload: AgentMessagePayload;
  sender: AgentSigningKeys;
  recipient: Pick<AgentEncryptionKeys, 'did' | 'x25519PublicKey'>;
  messageId?: string;
  nonce?: string;
  issuedAt?: number;
  ttlMs?: number;
  paddingBytes?: number;
}

export interface VerifyEnvelopeInput {
  envelope: SignedAgentEnvelope;
  recipient: AgentEncryptionKeys;
  /** Mapa DID → clave pública Ed25519 del emisor. */
  resolveSenderPublicKey: (did: string) => Uint8Array | undefined;
  replayGuard: ReplayGuard;
  now?: number;
  panicMode?: boolean;
}

export interface OpenEnvelopeResult {
  payload: AgentMessagePayload;
  envelope: SignedAgentEnvelope;
}

export type ProtocolErrorCode =
  | 'INVALID_VERSION'
  | 'EXPIRED'
  | 'NOT_YET_VALID'
  | 'REPLAY'
  | 'UNKNOWN_SENDER'
  | 'INVALID_SIGNATURE'
  | 'DECRYPT_FAILED'
  | 'PANIC_BLOCKED'
  | 'STATUS_MISMATCH';

export class ProtocolError extends Error {
  constructor(
    public readonly code: ProtocolErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ProtocolError';
  }
}

/** Anti-replay con ventana temporal (implementación en replay.ts). */
export interface ReplayGuard {
  check(envelope: SignedAgentEnvelope, now?: number): boolean;
  record(envelope: SignedAgentEnvelope, now?: number): void;
}

/** Topic opaco del bus soberano: armada/v1/{shard}/{opaqueId} */
export function buildOpaqueTopic(shard: string, opaqueId: string): string {
  return `armada/v1/${shard}/${opaqueId}`;
}

/** Topic de auditoría para centinela. */
export function buildAuditTopic(): string {
  return 'armada/v1/+/audit';
}
