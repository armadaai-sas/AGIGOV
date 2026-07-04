#!/usr/bin/env tsx
/** Stress: introduce discrepancia centinela → QuarterClose FROZEN. */
import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { reconcileQuarterClose } from '../src/db/egs/reconcile-quarter-close.js';

async function main() {
  const db = getCoreDb();

  const release = await db.quarterCloseRelease.findFirst({
    include: { escrow: true, quarterClose: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!release) {
    console.error('Ejecuta primero: npm run db:seed:egs-pilot');
    process.exit(1);
  }

  console.log('Stress: forzando escrow LOCKED mientras release contabilizado existe…');
  await db.escrow.update({
    where: { id: release.escrowId },
    data: { status: 'LOCKED' },
  });

  const result = await reconcileQuarterClose(db, release.quarterCloseId);

  console.log('\n=== Resultado stress centinela ===');
  console.log('OK:', result.ok);
  console.log('Estado esperado: FROZEN + discrepancias');
  console.log('Discrepancias:', result.discrepancies);

  const qc = await db.quarterClose.findUnique({ where: { id: release.quarterCloseId } });
  console.log('QuarterClose.status:', qc?.status);

  console.log('\nRestaurando escrow RELEASED para happy path…');
  await db.escrow.update({
    where: { id: release.escrowId },
    data: { status: 'RELEASED' },
  });
  await db.quarterClose.update({
    where: { id: release.quarterCloseId },
    data: { status: 'COLLECTING' },
  });

  const restored = await reconcileQuarterClose(db, release.quarterCloseId);
  console.log('Restaurado OK:', restored.ok, '· Δ:', restored.calculoAhorroFinal);

  await disconnectCoreDb();
}

main().catch(async (e) => {
  console.error(e);
  await disconnectCoreDb();
  process.exit(1);
});
