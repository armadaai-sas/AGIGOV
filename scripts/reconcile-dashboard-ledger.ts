/**
 * P2 — Dashboard público vs ledger: published checkpoints sin PII leak + hashes alineados.
 * Uso: npm run reconcile:dashboard-ledger
 */
import 'dotenv/config';

import { getCoreDb, disconnectCoreDb } from '../src/db/client.js';
import { listPublicProjects } from '../src/pilot/projects-public.js';

const PII_KEYS = ['email', 'password', 'phone', 'passwordHash', 'token', 'privateKey', 'ingestToken'];

function scanPii(value: unknown, path = ''): string[] {
  if (value == null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => scanPii(v, `${path}[${i}]`));
  }
  if (typeof value === 'object') {
    const hits: string[] = [];
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (PII_KEYS.some((p) => k.toLowerCase().includes(p.toLowerCase()))) {
        hits.push(`${path}.${k}`);
        continue;
      }
      hits.push(...scanPii(v, path ? `${path}.${k}` : k));
    }
    return hits;
  }
  return [];
}

async function main(): Promise<void> {
  console.log('[Reconcile] Dashboard vs ledger');
  const db = getCoreDb();

  const published = await db.processCheckpoint.findMany({
    where: { status: 'published' },
    select: { processId: true, evidenceBundle: true, updatedAt: true },
  });

  const ledgerProcessIds = await db.ledgerEntry.findMany({
    where: {
      processId: { not: null },
      entryType: { in: ['PROCESS', 'ACTA', 'ESCROW', 'VOTE'] },
    },
    select: { processId: true },
    distinct: ['processId'],
  });
  const ledgerSet = new Set(
    ledgerProcessIds.map((r) => r.processId).filter((id): id is string => Boolean(id)),
  );

  const missingLedger: string[] = [];
  const piiHits: string[] = [];
  for (const row of published) {
    if (!ledgerSet.has(row.processId)) missingLedger.push(row.processId);
    piiHits.push(...scanPii(row.evidenceBundle, row.processId).slice(0, 5));
  }

  const projects = await listPublicProjects();
  const projectIds = new Set(projects.map((p) => p.id));
  const orphanPublishedProjects = published.filter((p) => {
    const bundle = p.evidenceBundle as Record<string, unknown>;
    return Boolean(bundle.publicProject) && !projectIds.has(p.processId);
  });

  console.log(`  published checkpoints: ${published.length}`);
  console.log(`  public projects mapped: ${projects.length}`);
  console.log(`  missing PROCESS ledger: ${missingLedger.length}`);
  console.log(`  PII heuristic hits: ${piiHits.length}`);
  console.log(`  orphan publicProject rows: ${orphanPublishedProjects.length}`);

  const ok =
    missingLedger.length === 0 &&
    piiHits.length === 0 &&
    orphanPublishedProjects.length === 0;

  if (!ok) {
    if (missingLedger.length) console.error('  missingLedger:', missingLedger.slice(0, 10));
    if (piiHits.length) console.error('  piiHits:', piiHits.slice(0, 10));
    if (orphanPublishedProjects.length) {
      console.error(
        '  orphans:',
        orphanPublishedProjects.map((r) => r.processId).slice(0, 10),
      );
    }
    console.error('[Reconcile] FAIL');
    process.exitCode = 1;
  } else {
    console.log('[Reconcile] OK — published ↔ ledger + sin PII heurística');
  }

  await disconnectCoreDb();
}

main().catch(async (e) => {
  console.error('[Reconcile] Error:', e);
  await disconnectCoreDb();
  process.exit(1);
});
