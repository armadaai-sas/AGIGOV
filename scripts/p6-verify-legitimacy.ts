/**
 * P6 — legitimidad y seguridad continua.
 * Uso: npm run p6:verify
 */
import 'dotenv/config';

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { assessPqcReadiness } from '../src/security/pqc-guardian.js';

function assert(name: string, cond: boolean): void {
  if (!cond) throw new Error(`P6 FAIL: ${name}`);
  console.log(`  ✓ ${name}`);
}

async function main(): Promise<void> {
  console.log('[P6] Verify legitimacy & continuous security');

  assert(
    'PQC doc',
    existsSync(join(process.cwd(), 'docs/PQC-GUARDIAN-CUANTICO.md')),
  );
  assert(
    'POLITICA-2.0.md',
    existsSync(join(process.cwd(), 'docs/AGIGOV/POLITICA-2.0.md')),
  );
  assert(
    'P6 runbook',
    existsSync(join(process.cwd(), 'docs/P6-LEGITIMIDAD-SEGURIDAD.md')),
  );

  const pqc = assessPqcReadiness({ AGIGOV_PQC_MODE: 'inventory' });
  assert('PQC inventory mode ok', pqc.ok && pqc.surface.length >= 3);
  assert('no hybrid claim false', pqc.hybridClaimAllowed === false);

  const drill = spawnSync('npm', ['run', 'panic:drill'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, PANIC_MODE: 'false' },
  });
  assert('panic:drill exit 0', drill.status === 0);

  const quarterly = spawnSync('npm', ['run', 'panic:quarterly', '--', '--status-only'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  // status-only exits 2 if due — still OK for verify if log missing; we just ran drill via quarterly next
  console.log('  · quarterly status exit=', quarterly.status);

  const logRun = spawnSync('npm', ['run', 'panic:quarterly'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert('panic:quarterly logged', logRun.status === 0);
  assert(
    'panic-drill-log exists',
    existsSync(join(process.cwd(), 'data/panic-drill-log.jsonl')),
  );

  console.log('[P6] OK');
}

main().catch((e) => {
  console.error('[P6] FAIL:', e);
  process.exit(1);
});
