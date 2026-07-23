#!/usr/bin/env tsx
/**
 * Fase A — provisionar tenant piloto (ministerio + rubro + token ingest).
 * Por defecto usa `AGIGOV_ISO` del nodo (.env).
 *
 * Uso:
 *   npm run pilot:provision
 *   AGIGOV_ISO=COL npm run pilot:provision
 *   npm run pilot:provision -- --iso COL
 *   npm run pilot:provision -- --slug mintrans-trust-pilot --ministry MINTRANS
 *   npm run pilot:status
 */
import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { loadNodeSovereignEnv } from '../src/config/sovereign/node-config.js';
import type { JurisdictionIso } from '../src/config/sovereign/jurisdictions.js';
import { getPilotProfileForIso } from '../src/pilot/pilot-jurisdiction-profiles.js';
import { listPilotTenants, provisionPilotTenant } from '../src/pilot/tenant-provision.js';

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1 || !process.argv[idx + 1]) return undefined;
  return process.argv[idx + 1];
}

function resolveIso(): JurisdictionIso {
  const fromCli = arg('iso')?.toUpperCase();
  if (fromCli) return fromCli as JurisdictionIso;
  return loadNodeSovereignEnv().iso;
}

async function status(): Promise<void> {
  const tenants = await listPilotTenants();
  const node = loadNodeSovereignEnv();
  console.log(`[Pilot] Nodo: ${node.jurisdictionCode} (${node.iso} · ${node.currency})\n`);

  if (tenants.length === 0) {
    console.log('[Pilot] Sin tenants. Ejecuta: npm run pilot:provision');
    return;
  }
  console.log('[Pilot] Tenants registrados:\n');
  for (const t of tenants) {
    console.log(
      `  • ${t.slug}  ${t.ministryCode}  ${t.budgetCode}  [${t.status}/${t.onboardingStatus}]  Q${t.quarter} ${t.fiscalYear}`,
    );
    console.log(`    ${t.displayName}`);
  }
}

async function provision(): Promise<void> {
  const db = getCoreDb();
  await db.$queryRaw`SELECT 1`;

  const iso = resolveIso();
  const profile = getPilotProfileForIso(iso);

  const result = await provisionPilotTenant({
    iso,
    slug: arg('slug') ?? profile.slug,
    ministryCode: arg('ministry') ?? profile.ministryCode,
    budgetCode: arg('budget') ?? profile.budgetCode,
    displayName: arg('name') ?? profile.displayName,
    programName: arg('program') ?? profile.programName,
    territoryCode: arg('territory') ?? profile.territoryCode,
    fiscalYear: Number.parseInt(arg('year') ?? '2026', 10),
    quarter: Number.parseInt(arg('quarter') ?? '2', 10),
    originNodeId: arg('node') ?? profile.originNodeId,
  });

  console.log(`\n[Pilot] ✅ Tenant provisionado — ${profile.iso} / ${profile.currency} — Fase A\n`);
  console.log('  Jurisdicción:  ', profile.iso, '→', getPilotProfileForIso(iso).ministryCode);
  console.log('  Slug:          ', result.slug);
  console.log('  Ministerio:    ', result.ministryCode);
  console.log('  Rubro:         ', result.budgetCode);
  console.log('  Consola PWA:   ', result.consoleUrl);
  console.log('  Health API:    ', result.healthUrl);
  console.log('  Ingest API:    ', result.ingestUrl);
  console.log('\n  Credenciales (GUARDAR — solo se muestran una vez):');
  console.log('  Token:         ', result.ingestToken);
  console.log('  Archivo:       ', result.credentialsPath);
  console.log('\n  Siguiente:');
  console.log('    Terminal 1: npm run api:public');
  console.log('    Terminal 2: npm run dev');
  console.log('    Verificar:  curl -s', result.healthUrl, '| head');
  console.log('    Ingest demo: npm run pilot:ingest-demo --', result.slug);
  console.log('    Fase B:      npm run pilot:onboard --', result.slug);
}

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? 'provision';

  if (cmd === 'status') {
    await status();
    return;
  }

  if (cmd === 'provision') {
    await provision();
    return;
  }

  console.error('Uso: npm run pilot:provision [-- status] [--iso COL]');
  process.exitCode = 1;
}

main().catch(async (error) => {
  console.error('[Pilot] Error:', error instanceof Error ? error.message : error);
  console.error('\n¿Postgres activo?  npm run db:migrate && npm run pilot:provision');
  process.exitCode = 1;
}).finally(async () => {
  await disconnectCoreDb();
});
