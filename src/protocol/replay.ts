import type { SignedAgentEnvelope } from './types.js';

interface ReplayEntry {
  expiresAt: number;
}

/** Guard anti-replay in-memory; en producción respaldar con Redis/SQLite. */
export class InMemoryReplayGuard {
  private readonly seen = new Map<string, ReplayEntry>();

  constructor(private readonly maxEntries = 10_000) {}

  check(envelope: SignedAgentEnvelope, now = Date.now()): boolean {
    this.prune(now);
    const key = `${envelope.senderDid}:${envelope.nonce}:${envelope.messageId}`;
    return !this.seen.has(key);
  }

  record(envelope: SignedAgentEnvelope, now = Date.now()): void {
    this.prune(now);
    if (this.seen.size >= this.maxEntries) {
      const firstKey = this.seen.keys().next().value;
      if (firstKey) this.seen.delete(firstKey);
    }
    const key = `${envelope.senderDid}:${envelope.nonce}:${envelope.messageId}`;
    this.seen.set(key, { expiresAt: envelope.expiresAt });
  }

  private prune(now: number): void {
    for (const [key, entry] of this.seen) {
      if (entry.expiresAt <= now) {
        this.seen.delete(key);
      }
    }
  }
}
