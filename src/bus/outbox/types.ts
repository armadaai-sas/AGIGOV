import type { SignedAgentEnvelope } from '../../protocol/types.js';

export type OutboxStatus = 'pending' | 'sending' | 'sent' | 'failed';

export interface OutboxEntry {
  id: number;
  messageId: string;
  shard: string;
  opaqueId: string;
  topic: string;
  recipientDid: string;
  envelope: SignedAgentEnvelope;
  publishAuditCopy: boolean;
  status: OutboxStatus;
  attempts: number;
  lastError: string | null;
  createdAt: number;
  updatedAt: number;
  sentAt: number | null;
}

export interface EnqueueOutboxInput {
  envelope: SignedAgentEnvelope;
  shard: string;
  opaqueId: string;
  topic: string;
  publishAuditCopy?: boolean;
}
