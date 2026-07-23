#!/usr/bin/env tsx
/** Demo ingest — envía 1 hito de prueba al tenant piloto (contrato según jurisdicción). */
import 'dotenv/config';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { disconnectCoreDb } from '../src/db/client.js';
import { resolveDefaultPilotSlug } from '../src/pilot/resolve-pilot-defaults.js';

const slug = process.argv[2] ?? resolveDefaultPilotSlug();
const credPath = join(process.cwd(), 'data', 'pilot-tenants', `${slug}.credentials.json`);

async function main(): Promise<void> {
  if (!existsSync(credPath)) {
    console.error(`[Ingest] Falta ${credPath} — ejecuta npm run pilot:provision`);
    process.exitCode = 1;
    return;
  }

  const cred = JSON.parse(readFileSync(credPath, 'utf8')) as {
    ingestUrl: string;
    ingestAuthorization: string;
    firstEscrowRef?: string;
    currency?: string;
  };

  const contractRef = cred.firstEscrowRef ?? 'escrow-vial-pilot-c01';

  const body = {
    rows: [
      {
        contractRef,
        milestoneIndex: 1000 + Math.floor(Date.now() % 9000),
        amount: cred.currency === 'COP' ? '16400000' : cred.currency === 'USD' ? '4100' : '1200',
        evidenceRef: `demo-ingest-${Date.now()}`,
      },
    ],
  };

  const res = await fetch(cred.ingestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cred.ingestAuthorization,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  console.log('[Ingest]', res.status, JSON.stringify(json, null, 2));

  if (!res.ok) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
}).finally(async () => {
  await disconnectCoreDb();
});
