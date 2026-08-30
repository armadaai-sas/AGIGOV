/**
 * Cuenta demo pública + Q1 2026 MPPI con telemetría EGS real (Postgres).
 * Ejecutar en el nodo servidor: npm run db:seed:demo-public
 */
import 'dotenv/config';

import { createHash, randomBytes, scryptSync } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { reconcileQuarterClose } from '../src/db/egs/reconcile-quarter-close.js';
import {
  onboardPilotTenant,
  ratifyPilotTenantBaseline,
} from '../src/pilot/tenant-onboarding.js';
import { provisionPilotTenant } from '../src/pilot/tenant-provision.js';
import { getMinistryHealth } from '../src/pilot/egs-public.js';

export const DEMO_PUBLIC_EGS = {
  email: 'demo@agigov.public',
  password: 'DemoPublicoEGS2026!',
  institutionName: 'MPPI — Demo público AGIGOV',
  entityType: 'ministerio',
  iso: 'VEN' as const,
  slug: 'demo-publico-q1',
  ministryCode: 'MPPI',
  budgetCode: '4.01.02.01.99',
  displayName: 'MPPI — Piloto fiscal demo Q1 2026',
  programName: 'Mantenimiento vial Q1 2026 — demo público',
  fiscalYear: 2026,
  quarter: 1,
};

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString('hex');
}

async function upsertDemoInstitutionUser(): Promise<void> {
  const db = getCoreDb();
  const email = DEMO_PUBLIC_EGS.email.trim().toLowerCase();
  const salt = randomBytes(16).toString('hex');
  const passwordHash = hashPassword(DEMO_PUBLIC_EGS.password, salt);

  const existing = await db.institutionUser.findUnique({ where: { email } });
  if (existing) {
    await db.institutionSession.deleteMany({ where: { userId: existing.id } });
    await db.institutionUser.update({
      where: { id: existing.id },
      data: {
        institutionName: DEMO_PUBLIC_EGS.institutionName,
        entityType: DEMO_PUBLIC_EGS.entityType,
        passwordSalt: salt,
        passwordHash,
        iso: DEMO_PUBLIC_EGS.iso,
        verificationStatus: 'verified',
        verificationNotes: 'Cuenta demo pública — Q1 EGS',
        status: 'active',
      },
    });
    return;
  }

  await db.institutionUser.create({
    data: {
      email,
      institutionName: DEMO_PUBLIC_EGS.institutionName,
      entityType: DEMO_PUBLIC_EGS.entityType,
      passwordSalt: salt,
      passwordHash,
      iso: DEMO_PUBLIC_EGS.iso,
      verificationStatus: 'verified',
      verificationNotes: 'Cuenta demo pública — Q1 EGS',
      officialCode: 'MPPI-DEMO-Q1',
      contactName: 'Operador demo',
      contactRole: 'Contraloría piloto',
    },
  });
}

async function deactivateOtherMppiBudgetLines(): Promise<void> {
  const db = getCoreDb();
  await db.budgetLinePilot.updateMany({
    where: { ministryCode: DEMO_PUBLIC_EGS.ministryCode, pilotStatus: 'active' },
    data: { pilotStatus: 'closed' },
  });
}

async function main(): Promise<void> {
  await upsertDemoInstitutionUser();
  await deactivateOtherMppiBudgetLines();

  const provision = await provisionPilotTenant({
    slug: DEMO_PUBLIC_EGS.slug,
    iso: DEMO_PUBLIC_EGS.iso,
    ministryCode: DEMO_PUBLIC_EGS.ministryCode,
    budgetCode: DEMO_PUBLIC_EGS.budgetCode,
    displayName: DEMO_PUBLIC_EGS.displayName,
    programName: DEMO_PUBLIC_EGS.programName,
    fiscalYear: DEMO_PUBLIC_EGS.fiscalYear,
    quarter: DEMO_PUBLIC_EGS.quarter,
    skipMultisigInit: true,
  });

  await onboardPilotTenant(DEMO_PUBLIC_EGS.slug);
  await ratifyPilotTenantBaseline(DEMO_PUBLIC_EGS.slug);

  const reconcile = await reconcileQuarterClose(getCoreDb(), provision.quarterCloseId);
  const health = await getMinistryHealth(DEMO_PUBLIC_EGS.ministryCode);

  const outDir = join(process.cwd(), 'data');
  mkdirSync(outDir, { recursive: true });
  const manifest = {
    cuenta: {
      email: DEMO_PUBLIC_EGS.email,
      password: DEMO_PUBLIC_EGS.password,
      login: '/institucional/acceso',
    },
    piloto: {
      slug: DEMO_PUBLIC_EGS.slug,
      ministryCode: DEMO_PUBLIC_EGS.ministryCode,
      fiscalYear: DEMO_PUBLIC_EGS.fiscalYear,
      quarter: DEMO_PUBLIC_EGS.quarter,
      firstEscrowRef: provision.firstEscrowRef,
    },
    consola: '/modelos/egs/consola',
    reconcileOk: reconcile.ok,
    discrepancies: reconcile.discrepancies,
    health: health
      ? {
          quarterCloseStatus: health.quarterCloseStatus,
          calculoAhorroFinal: health.calculoAhorroFinal,
          published: health.published,
          releaseCount: health.releaseCount,
        }
      : null,
    seededAt: new Date().toISOString(),
  };

  const outPath = join(outDir, 'demo-publico-egs.json');
  writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log('\n=== Demo público EGS Q1 ===');
  console.log(`Email:    ${DEMO_PUBLIC_EGS.email}`);
  console.log(`Password: ${DEMO_PUBLIC_EGS.password}`);
  console.log(`Login:    /institucional/acceso`);
  console.log(`Consola:  /modelos/egs/consola`);
  console.log(`Slug:     ${DEMO_PUBLIC_EGS.slug}`);
  console.log(`Q${DEMO_PUBLIC_EGS.quarter} ${DEMO_PUBLIC_EGS.fiscalYear} · Δ ${health?.calculoAhorroFinal ?? '—'}`);
  console.log(`Publicado: ${health?.published ? 'sí' : 'no — listo para publicar manualmente'}`);
  console.log(`Manifest: ${outPath}\n`);
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectCoreDb();
  });
