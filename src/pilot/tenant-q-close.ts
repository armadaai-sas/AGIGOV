import type { CoreDb } from '../db/client.js';
import { reconcileQuarterClose } from '../db/egs/reconcile-quarter-close.js';
import {
  computeQuarterClose,
  toTreasuryPayload,
} from '../db/egs/quarter-close.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { getPilotTenantBySlug } from './tenant-provision.js';

export type QuarterClosePipelineResult = {
  ok: boolean;
  quarterCloseId: string;
  status: string;
  reconcileOk: boolean;
  discrepancies: string[];
  calculoAhorroFinal: number;
  published: boolean;
  ledgerProcessId: string | null;
};

/** Fase C — centinela reconcilia ingest → Δ → checkpoint (opcional publish). */
export async function runTenantQuarterClosePipeline(
  db: CoreDb,
  slug: string,
  options: { publish?: boolean } = {},
): Promise<QuarterClosePipelineResult> {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant?.budgetLinePilotId) {
    throw new Error(`Tenant ${slug} sin budgetLinePilotId`);
  }

  const qc = await db.quarterClose.findFirst({
    where: {
      budgetLinePilotId: tenant.budgetLinePilotId,
      fiscalYear: tenant.fiscalYear,
      quarter: tenant.quarter,
    },
  });
  if (!qc) throw new Error(`Sin quarter close para ${slug}`);

  const reconcile = await reconcileQuarterClose(db, qc.id);
  if (!reconcile.ok) {
    return {
      ok: false,
      quarterCloseId: qc.id,
      status: 'FROZEN',
      reconcileOk: false,
      discrepancies: reconcile.discrepancies,
      calculoAhorroFinal: reconcile.calculoAhorroFinal,
      published: false,
      ledgerProcessId: qc.ledgerProcessId,
    };
  }

  const refreshed = await db.quarterClose.findUniqueOrThrow({ where: { id: qc.id } });
  const baseline = Number(refreshed.baselineTrimestral);
  const ajustes = Number(refreshed.ajustesFuerzaMayor);

  const computed = computeQuarterClose({
    baselineTrimestral: baseline,
    gastosVerificados: reconcile.gastosVerificados,
    ajustesFuerzaMayor: ajustes,
  });

  const ledgerProcessId =
    refreshed.ledgerProcessId ??
    `proc-qclose-${slug}-${refreshed.fiscalYear}-q${refreshed.quarter}`;

  const treasuryPayload = toTreasuryPayload(
    refreshed.id,
    refreshed.fiscalYear,
    refreshed.quarter,
    refreshed.currency,
    ledgerProcessId,
    computed,
  );

  const contentHash = payloadHash(treasuryPayload);

  await db.quarterClose.update({
    where: { id: refreshed.id },
    data: {
      gastosVerificados: computed.gastosVerificados,
      calculoAhorroFinal: computed.calculoAhorroFinal,
      reinversionAmount: computed.reinversionAmount,
      meritPoolAmount: computed.meritPoolAmount,
      agigovFeeAmount: computed.agigovFeeAmount,
      status: options.publish ? 'PUBLISHED' : 'PENDING_VALIDATION',
      ledgerProcessId,
      contentHash,
    },
  });

  const evidenceBundle = {
    processId: ledgerProcessId,
    facts: [
      { slug, ministry: tenant.ministryCode, releases: reconcile.releaseCount },
      { gastosVerificados: computed.gastosVerificados },
      { calculoAhorroFinal: computed.calculoAhorroFinal },
    ],
    hashes: [contentHash],
    rulesTriggered: reconcile.discrepancies.length ? ['reconcile-warn'] : [],
    status: 'validated' as const,
    treasuryPayload,
  };

  await db.processCheckpoint.upsert({
    where: { processId: ledgerProcessId },
    create: {
      processId: ledgerProcessId,
      status: options.publish ? 'published' : 'validated',
      agentId: options.publish ? 'comunicador' : 'centinela',
      evidenceBundle,
      originNodeId: tenant.originNodeId,
    },
    update: {
      status: options.publish ? 'published' : 'validated',
      agentId: options.publish ? 'comunicador' : 'centinela',
      evidenceBundle,
    },
  });

  if (options.publish) {
    await db.pilotTenant.update({
      where: { id: tenant.id },
      data: { onboardingStatus: 'ingest_ready' },
    });
  }

  return {
    ok: true,
    quarterCloseId: refreshed.id,
    status: options.publish ? 'PUBLISHED' : 'PENDING_VALIDATION',
    reconcileOk: true,
    discrepancies: [],
    calculoAhorroFinal: computed.calculoAhorroFinal,
    published: Boolean(options.publish),
    ledgerProcessId,
  };
}
