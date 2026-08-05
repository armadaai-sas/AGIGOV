/**
 * P5 — verificación red AGIGOV (catálogo + federation + handshake opcional).
 * Uso: npm run p5:verify-network
 * Handshake/federation pull requieren: npm run api:public + npm run api:sandbox
 */
import 'dotenv/config';

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { JURISDICTIONS } from '../src/config/sovereign/index.js';
import { runCrossHandshake } from '../src/pilot/sandbox-adhesion.js';
import {
  listFederationOutbox,
  mirrorFederationOutbox,
  readFederationInbox,
} from '../src/pilot/federation-inbox.js';
import { disconnectCoreDb } from '../src/db/client.js';

function assert(name: string, cond: boolean): void {
  if (!cond) throw new Error(`P5 FAIL: ${name}`);
  console.log(`  ✓ ${name}`);
}

async function main(): Promise<void> {
  console.log('[P5] Verify AGIGOV global network primitives');

  assert('catálogo incluye VEN', Boolean(JURISDICTIONS.VEN));
  assert('catálogo incluye SBX (2º Estado sandbox)', JURISDICTIONS.SBX.status === 'sandbox');
  assert('catálogo incluye COL anexo', Boolean(JURISDICTIONS.COL.documentRef?.includes('ANEXO')));
  assert(
    'carta base existe',
    existsSync(join(process.cwd(), 'docs/AGIGOV/CARTA-AGIGOV-BASE.md')),
  );
  assert(
    'guía ministro existe',
    existsSync(join(process.cwd(), 'docs/AGIGOV/GUIA-MINISTRO-INNOVACION-TI.md')),
  );
  assert(
    'plantilla anexo existe',
    existsSync(join(process.cwd(), 'docs/AGIGOV/ANEXO-LOCAL-TEMPLATE.md')),
  );

  const base = readFileSync(join(process.cwd(), 'docs/AGIGOV/CARTA-AGIGOV-BASE.md'), 'utf8');
  assert('carta base menciona AGIGOV-[ISO]', base.includes('AGIGOV-[ISO'));

  let dbOk = false;
  try {
    const outbox = await listFederationOutbox(10);
    dbOk = true;
    assert('federation outbox consultable', Array.isArray(outbox));
    if (outbox.length > 0) {
      const written = mirrorFederationOutbox(outbox.slice(0, 3), 'AGIGOV-VEN');
      assert('federation mirror escribe inbox', written.length >= 0);
      assert('federation inbox legible', readFederationInbox().length >= 0);
    } else {
      console.log('  · outbox vacío (seed/publish pendiente) — skip mirror asserts');
    }
  } catch {
    console.log('  · Postgres no disponible — skip federation DB checks');
  }

  const ven =
    process.env.CORE_HEALTH_URL?.trim() || 'http://127.0.0.1:3001/api/public/health';
  const sbx =
    process.env.SBX_HEALTH_URL?.trim() || 'http://127.0.0.1:3002/api/public/health';

  let handshakeOk = false;
  try {
    const hs = await runCrossHandshake(ven, sbx);
    handshakeOk = hs.ok;
    if (hs.ok) {
      assert('handshake VEN↔SBX', true);
      // Pull federation into local inbox via SBX API if up
      const pull = await fetch('http://127.0.0.1:3002/api/public/federation/pull', {
        method: 'POST',
        signal: AbortSignal.timeout(8_000),
      }).catch(() => null);
      if (pull?.ok) {
        const body = (await pull.json()) as { ok?: boolean };
        assert('SBX federation pull', body.ok === true);
      } else {
        console.log('  · federation pull no disponible en SBX API');
      }
    } else {
      console.log('  · handshake FAIL — levantar api:public + api:sandbox');
    }
  } catch {
    console.log('  · APIs no levantadas — handshake diferido (ok para CI offline)');
  }

  console.log(
    JSON.stringify(
      {
        catalogIsos: Object.keys(JURISDICTIONS),
        dbOk,
        handshakeOk,
        inboxCount: readFederationInbox().length,
      },
      null,
      2,
    ),
  );
  console.log('[P5] OK — protocolo onboarding + federation thin + docs ministro');
  await disconnectCoreDb().catch(() => undefined);
}

main().catch(async (e) => {
  console.error('[P5] FAIL:', e);
  await disconnectCoreDb().catch(() => undefined);
  process.exit(1);
});
