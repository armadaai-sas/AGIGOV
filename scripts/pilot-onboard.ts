#!/usr/bin/env tsx
/**
 * Fase B — onboarding institucional por tenant.
 *
 * Uso:
 *   npm run pilot:onboard
 *   npm run pilot:onboard -- mppi-trust-pilot
 *   npm run pilot:baseline-ratify -- mppi-trust-pilot
 *   npm run pilot:onboard -- status mppi-trust-pilot
 *   npm run pilot:onboard -- --reset mppi-trust-pilot  # re-demo Fase B
 */
import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import {
  getTenantBaselineStatus,
  onboardPilotTenant,
  ratifyPilotTenantBaseline,
} from '../src/pilot/tenant-onboarding.js';
import { resolveDefaultPilotSlug } from '../src/pilot/resolve-pilot-defaults.js';

function slugFromArgs(): string {
  const skip = new Set(['status', 'ratify', 'onboard']);
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const slug = args.find((a) => !skip.has(a));
  return slug ?? resolveDefaultPilotSlug();
}

async function resetOnboarding(slug: string): Promise<void> {
  const db = getCoreDb();
  await db.pilotTenant.updateMany({
    where: { slug },
    data: {
      onboardingStatus: 'pending',
      baselineActaProcessId: null,
      institutionSigners: null,
      baselineSignatures: null,
    },
  });
  console.log(`[Onboard] Reset onboarding → pending (${slug})`);
}

async function status(slug: string): Promise<void> {
  const s = await getTenantBaselineStatus(slug);
  if (!s) {
    console.error(`[Onboard] Tenant no encontrado: ${slug}`);
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify(s, null, 2));
}

async function onboard(slug: string): Promise<void> {
  const result = await onboardPilotTenant(slug);
  console.log('\n[Onboard] ✅ Fase B — institución registrada\n');
  console.log('  Slug:              ', result.slug);
  console.log('  Ministerio:        ', result.ministryCode);
  console.log('  Signers:           ', result.institutionSigners.join(', '));
  console.log('  Baseline acta:     ', result.baselineActaProcessId);
  console.log('  Claves (gitignore):', result.institutionKeysPath || '(ya ingest_ready)');
  console.log('  Estado:            ', result.onboardingStatus);
  console.log('\n  Siguiente: npm run pilot:baseline-ratify --', slug);
}

async function ratify(slug: string): Promise<void> {
  const result = await ratifyPilotTenantBaseline(slug);
  console.log('\n[Onboard] Ratificación baseline\n');
  console.log('  Ratified:   ', result.ratified);
  console.log('  Firmas:     ', result.validCount, '/', result.threshold);
  console.log('  Ingest OK:  ', result.ratified ? 'sí → ingest_ready' : 'no');
  if (!result.ratified) process.exitCode = 1;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const cmd = argv.find((a) => a === 'status' || a === 'ratify' || a === 'onboard') ?? 'onboard';
  const reset = argv.includes('--reset');
  const slug = slugFromArgs();

  if (reset && cmd === 'onboard') {
    await resetOnboarding(slug);
  }

  if (cmd === 'status') {
    await status(slug);
    return;
  }

  if (cmd === 'ratify') {
    await ratify(slug);
    return;
  }

  await onboard(slug);
}

main().catch((e) => {
  console.error('[Onboard] Error:', e instanceof Error ? e.message : e);
  process.exitCode = 1;
}).finally(async () => {
  await disconnectCoreDb();
});
