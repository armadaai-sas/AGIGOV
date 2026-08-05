/**
 * Federation thin P5 — outbox de hashes published (sin PII) para peer mirror.
 * No es sync ledger completo; es interoperabilidad verificable de evidencias.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getCoreDb } from '../db/client.js';
import { payloadHash } from '../db/sync/conflicts.js';

const DATA_DIR = join(process.cwd(), 'data');
const INBOX_PATH = join(DATA_DIR, 'federation-inbox.jsonl');

export type FederationOutboxItem = {
  processId: string;
  status: string;
  originNodeId: string;
  contentHash: string;
  updatedAt: string;
  jurisdictionHint?: string;
};

export type FederationInboxReceipt = {
  sourceJurisdiction: string;
  processId: string;
  contentHash: string;
  mirroredAt: string;
  mirrorHash: string;
};

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

/** Lista published checkpoints con hash canónico (sin evidenceBundle completo). */
export async function listFederationOutbox(limit = 50): Promise<FederationOutboxItem[]> {
  const db = getCoreDb();
  const rows = await db.processCheckpoint.findMany({
    where: { status: 'published' },
    orderBy: { updatedAt: 'desc' },
    take: Math.min(limit, 200),
    select: {
      processId: true,
      status: true,
      originNodeId: true,
      evidenceBundle: true,
      updatedAt: true,
      version: true,
    },
  });

  return rows.map((r) => {
    const contentHash = payloadHash({
      processId: r.processId,
      status: r.status,
      version: r.version,
      originNodeId: r.originNodeId,
      // Hash of JSON without dumping PII keys to outbox payload
      bundleDigest: payloadHash(r.evidenceBundle ?? {}),
    });
    return {
      processId: r.processId,
      status: r.status,
      originNodeId: r.originNodeId,
      contentHash,
      updatedAt: r.updatedAt.toISOString(),
    };
  });
}

export function readFederationInbox(): FederationInboxReceipt[] {
  if (!existsSync(INBOX_PATH)) return [];
  return readFileSync(INBOX_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as FederationInboxReceipt);
}

/** Espejo read-only: peer importa outbox del embajador. */
export function mirrorFederationOutbox(
  items: FederationOutboxItem[],
  sourceJurisdiction: string,
): FederationInboxReceipt[] {
  ensureDataDir();
  const existing = new Set(readFederationInbox().map((r) => `${r.processId}:${r.contentHash}`));
  const written: FederationInboxReceipt[] = [];
  for (const item of items) {
    const key = `${item.processId}:${item.contentHash}`;
    if (existing.has(key)) continue;
    const mirroredAt = new Date().toISOString();
    const receipt: FederationInboxReceipt = {
      sourceJurisdiction,
      processId: item.processId,
      contentHash: item.contentHash,
      mirroredAt,
      mirrorHash: payloadHash({
        sourceJurisdiction,
        processId: item.processId,
        contentHash: item.contentHash,
        mirroredAt,
      }),
    };
    appendFileSync(INBOX_PATH, `${JSON.stringify(receipt)}\n`);
    written.push(receipt);
  }
  return written;
}
