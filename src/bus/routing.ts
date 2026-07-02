import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { buildOpaqueTopic } from '../protocol/types.js';

/** ID opaco derivado — no expone DID ni processId en el topic. */
export function deriveOpaqueTopicId(
  recipientDid: string,
  processId: string,
): string {
  const digest = sha256(utf8ToBytes(`${recipientDid}:${processId}`));
  return Array.from(digest.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function resolveDeliveryTopic(
  shard: string,
  recipientDid: string,
  processId: string,
): string {
  return buildOpaqueTopic(shard, deriveOpaqueTopicId(recipientDid, processId));
}

export function resolveAuditTopic(shard: string): string {
  return buildOpaqueTopic(shard, 'audit');
}

export function parseArmadaTopic(topic: string): {
  shard: string;
  opaqueId: string;
} | null {
  const parts = topic.split('/');
  if (parts.length !== 4 || parts[0] !== 'armada' || parts[1] !== 'v1') {
    return null;
  }
  return { shard: parts[2]!, opaqueId: parts[3]! };
}
