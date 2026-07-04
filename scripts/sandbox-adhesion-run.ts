import 'dotenv/config';

import { disconnectCoreDb } from '../src/db/client.js';
import {
  initSandboxAdhesion,
  ratifySandboxAdhesionWithDemoKeys,
  verifySandboxClosure,
  SBX_PROCESS_ID,
  SBX_SIGNERS,
  SBX_THRESHOLD,
} from '../src/pilot/sandbox-adhesion.js';

const ORIGIN = process.env.SBX_ORIGIN_NODE_ID?.trim() ?? 'node-sbx-west-01';

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? 'verify';

  if (cmd === 'init') {
    const draft = await initSandboxAdhesion(ORIGIN);
    console.log('[SBX] Borrador adhesión:', draft.processId);
    console.log('[SBX] Signers:', SBX_SIGNERS.join(', '));
    console.log('[SBX] Threshold:', SBX_THRESHOLD);
    return;
  }

  if (cmd === 'ratify') {
    const result = await ratifySandboxAdhesionWithDemoKeys(ORIGIN);
    console.log('[SBX] Adhesión:', result.ratified ? 'OK' : 'PENDIENTE');
    console.log('[SBX] Firmas:', Object.keys(result.signatures).length);
    return;
  }

  const verification = await verifySandboxClosure();
  console.log('[SBX] Verificación:', verification.ok ? 'OK' : 'FAIL');
  console.log(JSON.stringify(verification, null, 2));
  if (!verification.ok) process.exitCode = 1;
}

main()
  .catch(async (error) => {
    console.error('[SBX] Error:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectCoreDb();
  });
