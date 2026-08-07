/**
 * P8 — Ops / CI readiness + live VEN↔SBX handshake (spawns APIs if needed).
 * Uso: npm run p8:verify
 */
import 'dotenv/config';

import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { runCrossHandshake } from '../src/pilot/sandbox-adhesion.js';

function assert(name: string, cond: boolean): void {
  if (!cond) throw new Error(`P8 FAIL: ${name}`);
  console.log(`  ✓ ${name}`);
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

async function waitFor(url: string, attempts = 40, delayMs = 400): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    if (await probe(url)) return true;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

function startApi(script: string, env: Record<string, string>): ChildProcess {
  return spawn('npx', ['tsx', script], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function killTree(child: ChildProcess | null): void {
  if (!child?.pid) return;
  try {
    process.kill(child.pid, 'SIGTERM');
  } catch {
    /* already gone */
  }
}

async function main(): Promise<void> {
  console.log('[P8] Verify ops CI + live handshake');

  const ciPath = join(process.cwd(), '.github/workflows/ci.yml');
  assert('CI workflow exists', existsSync(ciPath));
  const ci = readFileSync(ciPath, 'utf8');
  assert('CI runs lint', ci.includes('npm run lint'));
  assert('CI runs build', ci.includes('npm run build'));
  assert('CI runs smoke', ci.includes('test:smoke') || ci.includes('npm run test:smoke'));
  assert('CI runs billing', ci.includes('test:billing'));
  assert('CI runs webhook', ci.includes('test:webhook'));
  assert('CI runs pqc inventory', ci.includes('pqc:inventory'));
  assert('CI runs p5 verify', ci.includes('p5:verify-network'));
  assert('CI runs p6 verify', ci.includes('p6:verify'));
  assert('CI runs doctor', ci.includes('npm run doctor'));
  assert('CI runs p4 finance E2E', ci.includes('p4:finance-e2e'));
  assert('CI has Postgres service', ci.includes('postgres:'));
  assert('P8 runbook exists', existsSync(join(process.cwd(), 'docs/P8-OPS-CI.md')));
  assert('audit:run script exists', existsSync(join(process.cwd(), 'scripts/audit-run.sh')));

  const venHealth =
    process.env.CORE_HEALTH_URL?.trim() || 'http://127.0.0.1:3001/api/public/health';
  const sbxHealth =
    process.env.SBX_HEALTH_URL?.trim() || 'http://127.0.0.1:3002/api/public/health';
  const venPeer0 = `${venHealth}${venHealth.includes('?') ? '&' : '?'}peer=0`;
  const sbxPeer0 = `${sbxHealth}${sbxHealth.includes('?') ? '&' : '?'}peer=0`;

  let spawnedVen: ChildProcess | null = null;
  let spawnedSbx: ChildProcess | null = null;
  let weSpawned = false;

  try {
    const alreadyUp = (await probe(venPeer0)) && (await probe(sbxPeer0));
    if (!alreadyUp) {
      console.log('  · spawning api:public + api:sandbox for live handshake…');
      weSpawned = true;
      spawnedVen = startApi('src/server/public-api.ts', {
        PUBLIC_API_PORT: '3001',
        AGIGOV_PEER_HEALTH_URL: sbxHealth,
      });
      spawnedSbx = startApi('src/server/sandbox-api.ts', {
        SANDBOX_API_PORT: '3002',
        AGIGOV_PEER_HEALTH_URL: venHealth,
      });
      const venReady = await waitFor(venPeer0);
      const sbxReady = await waitFor(sbxPeer0);
      assert('api:public listening', venReady);
      assert('api:sandbox listening', sbxReady);
    } else {
      console.log('  · APIs already up — reusing');
      assert('api:public listening', true);
      assert('api:sandbox listening', true);
    }

    const hs = await runCrossHandshake(venHealth, sbxHealth);
    assert('handshake VEN↔SBX', hs.ok);
    assert('VEN iso', hs.ven?.node.iso === 'VEN');
    assert('SBX iso', hs.sbx?.node.iso === 'SBX');

    console.log(
      JSON.stringify(
        {
          weSpawned,
          handshakeOk: hs.ok,
          venPostgres: hs.ven?.postgres ?? null,
          sbxPostgres: hs.sbx?.postgres ?? null,
          crossVen: hs.ven?.crossHealthOk,
          crossSbx: hs.sbx?.crossHealthOk,
        },
        null,
        2,
      ),
    );
    console.log('[P8] OK');
  } finally {
    if (weSpawned) {
      killTree(spawnedVen);
      killTree(spawnedSbx);
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
