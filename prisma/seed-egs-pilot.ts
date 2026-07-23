import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { loadNodeSovereignEnv } from '../src/config/sovereign/node-config.js';
import { seedEgsPilotVial } from '../src/db/egs/seed-pilot-vial.js';
import { reconcileQuarterClose } from '../src/db/egs/reconcile-quarter-close.js';

async function main() {
  const node = loadNodeSovereignEnv();
  const db = getCoreDb();
  const seeded = await seedEgsPilotVial(db, { iso: node.iso });
  const reconciled = await reconcileQuarterClose(db, seeded.quarterCloseId);

  console.log(`EGS Piloto seed OK (${node.iso} · ${seeded.currency}):`, seeded);
  console.log('Reconcile centinela:', reconciled);

  await disconnectCoreDb();
}

main().catch(async (error) => {
  console.error(error);
  await disconnectCoreDb();
  process.exit(1);
});
