import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { seedEgsPilotVial } from '../src/db/egs/seed-pilot-vial.js';
import { reconcileQuarterClose } from '../src/db/egs/reconcile-quarter-close.js';

async function main() {
  const db = getCoreDb();
  const seeded = await seedEgsPilotVial(db);
  const reconciled = await reconcileQuarterClose(db, seeded.quarterCloseId);

  console.log('EGS Piloto Vial seed OK:', seeded);
  console.log('Reconcile centinela:', reconciled);

  await disconnectCoreDb();
}

main().catch(async (error) => {
  console.error(error);
  await disconnectCoreDb();
  process.exit(1);
});
