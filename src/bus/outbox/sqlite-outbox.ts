import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import type { SignedAgentEnvelope } from '../../protocol/types.js';
import type { EnqueueOutboxInput, OutboxEntry, OutboxStatus } from './types.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS iap_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT NOT NULL UNIQUE,
  shard TEXT NOT NULL,
  opaque_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  recipient_did TEXT NOT NULL,
  envelope_json TEXT NOT NULL,
  publish_audit_copy INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  sent_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_iap_outbox_status
  ON iap_outbox(status, created_at);
`;

function rowToEntry(row: Record<string, unknown>): OutboxEntry {
  return {
    id: row.id as number,
    messageId: row.message_id as string,
    shard: row.shard as string,
    opaqueId: row.opaque_id as string,
    topic: row.topic as string,
    recipientDid: row.recipient_did as string,
    envelope: JSON.parse(row.envelope_json as string) as SignedAgentEnvelope,
    publishAuditCopy: Boolean(row.publish_audit_copy),
    status: row.status as OutboxStatus,
    attempts: row.attempts as number,
    lastError: (row.last_error as string | null) ?? null,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
    sentAt: (row.sent_at as number | null) ?? null,
  };
}

/** Cola offline IAP — store-and-forward cuando cae el uplink MQTT. */
export class SqliteOutbox {
  private readonly db: DatabaseSync;

  constructor(dbPath: string) {
    mkdirSync(dirname(dbPath), { recursive: true });
    this.db = new DatabaseSync(dbPath);
    this.db.exec(SCHEMA);
  }

  enqueue(input: EnqueueOutboxInput): OutboxEntry {
    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO iap_outbox (
        message_id, shard, opaque_id, topic, recipient_did,
        envelope_json, publish_audit_copy, status, attempts,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)
    `);

    stmt.run(
      input.envelope.messageId,
      input.shard,
      input.opaqueId,
      input.topic,
      input.envelope.recipientDid,
      JSON.stringify(input.envelope),
      input.publishAuditCopy ? 1 : 0,
      now,
      now,
    );

    return this.getByMessageId(input.envelope.messageId)!;
  }

  getByMessageId(messageId: string): OutboxEntry | undefined {
    const row = this.db
      .prepare('SELECT * FROM iap_outbox WHERE message_id = ?')
      .get(messageId) as Record<string, unknown> | undefined;
    return row ? rowToEntry(row) : undefined;
  }

  fetchPending(limit = 50): OutboxEntry[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM iap_outbox
        WHERE status IN ('pending', 'failed')
        ORDER BY created_at ASC
        LIMIT ?
      `)
      .all(limit) as Record<string, unknown>[];
    return rows.map(rowToEntry);
  }

  markSending(messageId: string): void {
    this.touch(messageId, 'sending');
  }

  markSent(messageId: string): void {
    const now = Date.now();
    this.db
      .prepare(`
        UPDATE iap_outbox
        SET status = 'sent', sent_at = ?, updated_at = ?, last_error = NULL
        WHERE message_id = ?
      `)
      .run(now, now, messageId);
  }

  markFailed(messageId: string, error: string): void {
    const now = Date.now();
    this.db
      .prepare(`
        UPDATE iap_outbox
        SET status = 'failed', attempts = attempts + 1,
            last_error = ?, updated_at = ?
        WHERE message_id = ?
      `)
      .run(error, now, messageId);
  }

  resetFailedToPending(messageId: string): void {
    this.touch(messageId, 'pending');
  }

  countByStatus(): Record<OutboxStatus, number> {
    const rows = this.db
      .prepare(`
        SELECT status, COUNT(*) AS count
        FROM iap_outbox
        GROUP BY status
      `)
      .all() as Array<{ status: OutboxStatus; count: number }>;

    return rows.reduce(
      (acc, row) => {
        acc[row.status] = row.count;
        return acc;
      },
      { pending: 0, sending: 0, sent: 0, failed: 0 } as Record<
        OutboxStatus,
        number
      >,
    );
  }

  close(): void {
    this.db.close();
  }

  private touch(messageId: string, status: OutboxStatus): void {
    this.db
      .prepare(`
        UPDATE iap_outbox
        SET status = ?, updated_at = ?
        WHERE message_id = ?
      `)
      .run(status, Date.now(), messageId);
  }
}
