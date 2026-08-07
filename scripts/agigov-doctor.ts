/**
 * P7 — agigov doctor: diagnóstico rápido de salud local / config.
 * Uso: npm run doctor
 */
import 'dotenv/config';

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assertFreeCostZero, resolvePlan } from '../src/billing/plan.js';
import { assessPqcReadiness } from '../src/security/pqc-guardian.js';
import { isPanicMode } from '../src/security/panic.js';
import { JURISDICTIONS } from '../src/config/sovereign/index.js';

type Check = { id: string; ok: boolean; detail: string };

const checks: Check[] = [];

function add(id: string, ok: boolean, detail: string) {
  checks.push({ id, ok, detail });
  console.log(`  ${ok ? '✓' : '✗'} ${id}: ${detail}`);
}

async function probe(url: string, ms = 2500): Promise<boolean> {
  try {
    const r = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(ms),
    });
    return r.ok;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  console.log('[Doctor] AGIGOV diagnostic');

  add('package', existsSync(join(process.cwd(), 'package.json')), 'package.json');
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
    name?: string;
  };
  add('package.name', pkg.name === 'agigov-armada', `name=${pkg.name}`);

  const plan = resolvePlan();
  const free = assertFreeCostZero();
  add('plan', true, `AGIGOV_PLAN=${plan}`);
  const freeHard =
    process.env.DOCTOR_STRICT === '1' ||
    (process.env.NODE_ENV ?? '').toLowerCase() === 'production';
  if (freeHard) {
    add('freeGuard', free.ok, free.ok ? 'cost-zero ok' : free.violations.join('; '));
  } else {
    const warnNote =
      free.warnings.length > 0 ? ` · warn: ${free.warnings[0]}` : '';
    add(
      'freeGuard',
      free.ok,
      free.ok
        ? `cost-zero ok · emailEffective=${free.effectiveEmailMode}${warnNote}`
        : free.violations.join('; '),
    );
  }

  add('panicMode', !isPanicMode(), isPanicMode() ? 'PANIC_MODE=true' : 'panic off');

  const pqc = assessPqcReadiness();
  add('pqc', pqc.ok, `mode=${pqc.mode} hybridClaim=${pqc.hybridClaimAllowed}`);

  add('cartaBase', existsSync('docs/AGIGOV/CARTA-AGIGOV-BASE.md'), 'carta base');
  add('politica20', existsSync('docs/AGIGOV/POLITICA-2.0.md'), 'POLITICA-2.0');
  add('runbookP7', existsSync('docs/P7-AUDIT-GATE.md'), 'P7 runbook');
  add('runbookP8', existsSync('docs/P8-OPS-CI.md'), 'P8 runbook');
  add('runbookP9', existsSync('docs/P9-RELEASE-GO.md'), 'P9 runbook');

  add('jurisdictions', Object.keys(JURISDICTIONS).length >= 4, `${Object.keys(JURISDICTIONS).join(',')}`);

  const opsHealth =
    process.env.OPS_HEALTH_URL?.trim() || 'http://127.0.0.1:3001/api/ops/health';
  const publicHealth =
    process.env.PUBLIC_HEALTH_URL?.trim() || 'http://127.0.0.1:3001/api/public/health';
  const sbx = process.env.SBX_HEALTH_URL?.trim() || 'http://127.0.0.1:3002/api/public/health';

  const apiUp = await probe(opsHealth);
  const pubUp = await probe(`${publicHealth}${publicHealth.includes('?') ? '&' : '?'}peer=0`);
  const sbxUp = await probe(`${sbx}${sbx.includes('?') ? '&' : '?'}peer=0`);

  add('api.ops', apiUp, apiUp ? opsHealth : `${opsHealth} down — npm run api:public`);
  add('api.public', pubUp, pubUp ? 'public health' : 'public API down');
  add('api.sandbox', sbxUp, sbxUp ? 'SBX up' : 'SBX down — npm run api:sandbox (opcional)');

  const failed = checks.filter((c) => !c.ok);
  // API down is soft unless DOCTOR_STRICT=1
  const hard = failed.filter(
    (c) => !['api.ops', 'api.public', 'api.sandbox'].includes(c.id) || process.env.DOCTOR_STRICT === '1',
  );

  console.log(
    JSON.stringify(
      {
        ok: hard.length === 0,
        hardFails: hard.map((c) => c.id),
        softFails: failed.filter((c) => !hard.includes(c)).map((c) => c.id),
        plan,
        pqcMode: pqc.mode,
      },
      null,
      2,
    ),
  );

  if (hard.length > 0) {
    console.error('[Doctor] FAIL');
    process.exit(1);
  }
  console.log('[Doctor] OK');
}

main().catch((e) => {
  console.error('[Doctor] Error:', e);
  process.exit(1);
});
