import 'dotenv/config';

import { disconnectCoreDb } from '../src/db/client.js';
import {
  initCartaActa,
  ratifyCartaWithDemoKeys,
  verifyCartaClosure,
  CARTA_PROCESS_ID,
  CARTA_SIGNERS,
  CARTA_THRESHOLD,
} from '../src/pilot/carta-ratification.js';

const ORIGIN = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-mar-north-01';

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? 'verify';

  if (cmd === 'init') {
    const draft = await initCartaActa(ORIGIN);
    console.log('[Carta] Borrador:', draft.processId);
    console.log('[Carta] Signers:', CARTA_SIGNERS.join(', '));
    console.log('[Carta] Threshold:', CARTA_THRESHOLD);
    return;
  }

  if (cmd === 'ratify') {
    const result = await ratifyCartaWithDemoKeys(ORIGIN);
    console.log('[Carta] Ratificación:', result.ratified ? 'OK' : 'PENDIENTE');
    console.log('[Carta] Firmas:', Object.keys(result.signatures).length);
    return;
  }

  const verification = await verifyCartaClosure();
  console.log('[Carta] Verificación:', verification.ok ? 'OK' : 'FAIL');
  console.log(JSON.stringify(verification, null, 2));
  if (!verification.ok) process.exitCode = 1;
}

main().catch(async (error) => {
  console.error('[Carta] Error:', error);
  process.exitCode = 1;
}).finally(async () => {
  await disconnectCoreDb();
});
