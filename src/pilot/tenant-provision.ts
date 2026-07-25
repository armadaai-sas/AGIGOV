import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { JurisdictionIso } from '../config/sovereign/jurisdictions.js';
import { jurisdictionByIso } from '../config/sovereign/jurisdictions.js';
import { loadNodeSovereignEnv } from '../config/sovereign/node-config.js';
import { getCoreDb } from '../db/client.js';
import { seedEgsPilotVial, type SeedEgsPilotOptions } from '../db/egs/seed-pilot-vial.js';
import { reconcileQuarterClose } from '../db/egs/reconcile-quarter-close.js';
import { initPilotActa } from './multisig-acta.js';
import { getPilotProfileForIso } from './pilot-jurisdiction-profiles.js';
import { generateIngestToken, hashIngestToken } from './tenant-token.js';

const TENANTS_DIR = join(process.cwd(), 'data', 'pilot-tenants');

export type ProvisionPilotInput = {
  slug?: string;
  iso?: JurisdictionIso;
  ministryCode?: string;
  budgetCode?: string;
  displayName?: string;
  programName?: string;
  territoryCode?: string;
  fiscalYear?: number;
  quarter?: number;
  originNodeId?: string;
  skipMultisigInit?: boolean;
  /** Override de partida anual (baseline) para seed. */
  annualBaseline?: number;
};

export type ProvisionPilotResult = {
  tenantId: string;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  currency: string;
  firstEscrowRef: string;
  ingestToken: string;
  credentialsPath: string;
  manifestPath: string;
  budgetLineId: string;
  quarterCloseId: string;
  consoleUrl: string;
  ingestUrl: string;
  healthUrl: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export async function provisionPilotTenant(
  input: ProvisionPilotInput = {},
): Promise<ProvisionPilotResult> {
  const db = getCoreDb();
  const nodeIso = input.iso ?? loadNodeSovereignEnv().iso;
  const profile = getPilotProfileForIso(nodeIso);
  const iso = nodeIso;

  const slug = slugify(input.slug ?? profile.slug);
  const ministryCode = (input.ministryCode ?? profile.ministryCode).toUpperCase();
  const budgetCode = input.budgetCode ?? profile.budgetCode;
  const displayName = input.displayName ?? profile.displayName;
  const originNodeId = input.originNodeId?.trim() || profile.originNodeId;
  const ingestToken = generateIngestToken();
  const ingestTokenHash = hashIngestToken(ingestToken);

  const seedOpts: SeedEgsPilotOptions = {
    iso,
    ministryCode,
    budgetCode,
    programName: input.programName ?? profile.programName,
    territoryCode: input.territoryCode ?? profile.territoryCode,
    fiscalYear: input.fiscalYear ?? 2026,
    quarter: input.quarter ?? 2,
    originNodeId,
    egsScale:
      typeof input.annualBaseline === 'number' && input.annualBaseline > 0
        ? { ...profile.egsScale, annualBaseline: input.annualBaseline }
        : undefined,
  };

  const tenant = await db.pilotTenant.upsert({
    where: { slug },
    create: {
      slug,
      ministryCode,
      budgetCode,
      displayName,
      programName: seedOpts.programName!,
      territoryCode: seedOpts.territoryCode!,
      fiscalYear: seedOpts.fiscalYear!,
      quarter: seedOpts.quarter!,
      status: 'provisioning',
      ingestTokenHash,
      originNodeId,
    },
    update: {
      displayName,
      programName: seedOpts.programName!,
      ingestTokenHash,
      status: 'provisioning',
      originNodeId,
    },
  });

  const seeded = await seedEgsPilotVial(db, seedOpts);
  await reconcileQuarterClose(db, seeded.quarterCloseId);

  if (!input.skipMultisigInit) {
    await initPilotActa(originNodeId);
  }

  await db.pilotTenant.update({
    where: { id: tenant.id },
    data: {
      budgetLinePilotId: seeded.budgetLineId,
      status: 'active',
    },
  });

  if (!existsSync(TENANTS_DIR)) mkdirSync(TENANTS_DIR, { recursive: true });

  const port = process.env.PUBLIC_API_PORT ?? '3001';
  const base = process.env.PILOT_API_BASE?.trim() || `http://127.0.0.1:${port}`;

  const manifest = {
    slug,
    tenantId: tenant.id,
    iso,
    jurisdictionCode: jurisdictionByIso(iso)?.jurisdictionCode ?? 'AGIGOV',
    ministryCode,
    budgetCode,
    displayName,
    programName: seedOpts.programName,
    currency: seeded.currency,
    escrowPrefix: seeded.escrowPrefix,
    firstEscrowRef: seeded.firstEscrowRef,
    status: 'active',
    budgetLineId: seeded.budgetLineId,
    quarterCloseId: seeded.quarterCloseId,
    consolePath: `/modelos/egs/consola`,
    healthPath: `/api/public/egs/ministry-health/${ministryCode}`,
    ingestPath: `/api/ops/ingest/${slug}`,
    provisionedAt: new Date().toISOString(),
  };

  const credentials = {
    ...manifest,
    ingestToken,
    ingestAuthorization: `Bearer ${ingestToken}`,
    apiBase: base,
    ingestUrl: `${base}/api/ops/ingest/${slug}`,
    healthUrl: `${base}/api/public/egs/ministry-health/${ministryCode}`,
  };

  const manifestPath = join(TENANTS_DIR, `${slug}.manifest.json`);
  const credentialsPath = join(TENANTS_DIR, `${slug}.credentials.json`);

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  writeFileSync(credentialsPath, `${JSON.stringify(credentials, null, 2)}\n`, 'utf8');

  return {
    tenantId: tenant.id,
    slug,
    ministryCode,
    budgetCode,
    currency: seeded.currency,
    firstEscrowRef: seeded.firstEscrowRef,
    ingestToken,
    credentialsPath,
    manifestPath,
    budgetLineId: seeded.budgetLineId,
    quarterCloseId: seeded.quarterCloseId,
    consoleUrl: `http://localhost:3000/modelos/egs/consola`,
    ingestUrl: credentials.ingestUrl,
    healthUrl: credentials.healthUrl,
  };
}

export async function listPilotTenants() {
  const db = getCoreDb();
  return db.pilotTenant.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      ministryCode: true,
      budgetCode: true,
      displayName: true,
      status: true,
      fiscalYear: true,
      quarter: true,
      onboardingStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getPilotTenantBySlug(slug: string) {
  const db = getCoreDb();
  return db.pilotTenant.findUnique({ where: { slug } });
}
