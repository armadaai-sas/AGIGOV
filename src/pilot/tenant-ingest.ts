import type { CoreDb } from '../db/client.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { recordMeterEvent } from '../billing/metering.js';
import { verifyIngestToken } from './tenant-token.js';
import { getPilotTenantBySlug } from './tenant-provision.js';
import { runTenantQuarterClosePipeline } from './tenant-q-close.js';

export type IngestRow = {
  contractRef: string;
  milestoneIndex: number;
  amount: string;
  evidenceRef?: string;
  verifiedAt?: string;
};

export type IngestResult = {
  accepted: number;
  skipped: number;
  quarterCloseId: string;
  centinela?: {
    reconcileOk: boolean;
    status: string;
    calculoAhorroFinal: number;
    discrepancies: string[];
  };
};

function extractBearer(header: string | undefined): string | null {
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export async function authenticateTenantIngest(
  slug: string,
  authorizationHeader: string | undefined,
): Promise<{ ok: true; tenantId: string } | { ok: false; reason: string }> {
  const token = extractBearer(authorizationHeader);
  if (!token) return { ok: false, reason: 'missing_bearer' };

  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant) return { ok: false, reason: 'unknown_tenant' };
  if (tenant.status !== 'active') return { ok: false, reason: 'tenant_not_active' };
  if (tenant.onboardingStatus !== 'ingest_ready') {
    return { ok: false, reason: 'baseline_not_ratified' };
  }
  if (!verifyIngestToken(token, tenant.ingestTokenHash)) {
    return { ok: false, reason: 'invalid_token' };
  }

  return { ok: true, tenantId: tenant.id };
}

/** Ingesta hitos verificados — actualiza gasto del trimestre en curso. */
export async function ingestPilotMilestones(
  db: CoreDb,
  slug: string,
  rows: IngestRow[],
): Promise<IngestResult> {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant?.budgetLinePilotId) {
    throw new Error(`Tenant ${slug} sin budgetLinePilotId`);
  }

  const quarterClose = await db.quarterClose.findFirst({
    where: {
      budgetLinePilotId: tenant.budgetLinePilotId,
      fiscalYear: tenant.fiscalYear,
      quarter: tenant.quarter,
    },
    include: {
      verifiedReleases: true,
      budgetLinePilot: true,
    },
  });

  if (!quarterClose) {
    throw new Error(`Sin quarter close para ${slug}`);
  }

  let accepted = 0;
  let skipped = 0;
  let gastosDelta = 0;

  for (const row of rows) {
    const escrow = await db.escrow.findFirst({
      where: {
        budgetLinePilotId: tenant.budgetLinePilotId,
        processId: row.contractRef,
      },
    });

    if (!escrow) {
      skipped++;
      continue;
    }

    const amount = Number.parseFloat(row.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      skipped++;
      continue;
    }

    const evidenceRef =
      row.evidenceRef ??
      payloadHash({
        tenant: slug,
        contract: row.contractRef,
        milestone: row.milestoneIndex,
        amount: row.amount,
        at: new Date().toISOString(),
      });

    const existing = quarterClose.verifiedReleases.find(
      (r) => r.escrowId === escrow.id && r.milestoneIndex === row.milestoneIndex,
    );

    if (existing) {
      skipped++;
      continue;
    }

    await db.quarterCloseRelease.create({
      data: {
        quarterCloseId: quarterClose.id,
        escrowId: escrow.id,
        milestoneIndex: row.milestoneIndex,
        amount,
        evidenceRef,
        verifiedAt: row.verifiedAt ? new Date(row.verifiedAt) : new Date(),
        originNodeId: tenant.originNodeId,
      },
    });

    gastosDelta += amount;
    accepted++;
  }

  if (gastosDelta > 0) {
    const newGastos = Number(quarterClose.gastosVerificados) + gastosDelta;
    await db.quarterClose.update({
      where: { id: quarterClose.id },
      data: {
        gastosVerificados: newGastos,
        status: quarterClose.status === 'DRAFT' ? 'COLLECTING' : quarterClose.status,
      },
    });
  }

  recordMeterEvent({
    unit: 'milestone-validated',
    quantity: accepted,
    jurisdictionId: tenant.ministryCode,
    processId: quarterClose.ledgerProcessId ?? quarterClose.id,
  });

  let centinela: IngestResult['centinela'];
  if (accepted > 0) {
    const pipeline = await runTenantQuarterClosePipeline(db, slug, { publish: false });
    centinela = {
      reconcileOk: pipeline.reconcileOk,
      status: pipeline.status,
      calculoAhorroFinal: pipeline.calculoAhorroFinal,
      discrepancies: pipeline.discrepancies,
    };
  }

  return {
    accepted,
    skipped,
    quarterCloseId: quarterClose.id,
    centinela,
  };
}
