import 'dotenv/config';

import { runCrossHandshake } from '../src/pilot/sandbox-adhesion.js';

const VEN = process.env.CORE_HEALTH_URL?.trim() || 'http://127.0.0.1:3001/api/public/health';
const SBX =
  process.env.SBX_HEALTH_URL?.trim() || 'http://127.0.0.1:3002/api/public/health';

async function main(): Promise<void> {
  console.log('[Handshake] VEN ←→ SBX');
  console.log('[Handshake] VEN:', VEN);
  console.log('[Handshake] SBX:', SBX);

  const result = await runCrossHandshake(VEN, SBX);

  console.log('[Handshake] crossHealthOk:', result.ok ? 'OK' : 'FAIL');
  console.log(
    JSON.stringify(
      {
        ven: result.ven
          ? {
              iso: result.ven.node.iso,
              crossHealthOk: result.ven.crossHealthOk,
              peerIso: result.ven.peer?.iso,
            }
          : null,
        sbx: result.sbx
          ? {
              iso: result.sbx.node.iso,
              crossHealthOk: result.sbx.crossHealthOk,
              peerIso: result.sbx.peer?.iso,
            }
          : null,
      },
      null,
      2,
    ),
  );

  if (!result.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error('[Handshake] Error:', error);
  process.exitCode = 1;
});
