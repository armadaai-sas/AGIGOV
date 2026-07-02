import 'dotenv/config';

import { disconnectCoreDb } from '../src/db/client.js';
import {
  initPilotActa,
  ratifyPilotWithDemoKeys,
  verifyPilotClosure,
  PILOT_PROCESS_ID,
  PILOT_SIGNERS,
  PILOT_THRESHOLD,
} from '../src/pilot/multisig-acta.js';

const ORIGIN = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-core-prod-01';

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? 'verify';

  if (cmd === 'init') {
    const draft = await initPilotActa(ORIGIN);
    console.log('[Pilot] Borrador creado:', draft.processId);
    console.log('[Pilot] Signers:', PILOT_SIGNERS.join(', '));
    console.log('[Pilot] Threshold:', PILOT_THRESHOLD);
    return;
  }

  if (cmd === 'ratify') {
    const result = await ratifyPilotWithDemoKeys(ORIGIN);
    console.log('[Pilot] Ratificación:', result.ratified ? 'OK' : 'PENDIENTE');
    console.log('[Pilot] Firmas:', Object.keys(result.signatures).length);
    return;
  }

  const verification = await verifyPilotClosure();
  console.log('[Pilot] Verificación cierre:', verification.ok ? 'OK' : 'FAIL');
  console.log(JSON.stringify(verification, null, 2));

  if (!verification.ok) process.exitCode = 1;
}

main().catch(async (error) => {
  console.error('[Pilot] Error:', error);
  process.exitCode = 1;
}).finally(async () => {
  await disconnectCoreDb();
});
