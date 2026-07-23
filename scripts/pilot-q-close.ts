#!/usr/bin/env tsx
/** Fase C — centinela reconcilia Q-close y opcionalmente publica. */
import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { runTenantQuarterClosePipeline } from '../src/pilot/tenant-q-close.js';
import { resolveDefaultPilotSlug } from '../src/pilot/resolve-pilot-defaults.js';

const slug = process.argv[2] ?? resolveDefaultPilotSlug();
const publish = process.argv.includes('--publish');

async function main(): Promise<void> {
  const db = getCoreDb();
  const result = await runTenantQuarterClosePipeline(db, slug, { publish });
  console.log('[Q-close]', JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
}).finally(async () => {
  await disconnectCoreDb();
});
