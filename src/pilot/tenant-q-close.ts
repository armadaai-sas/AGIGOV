import type { CoreDb } from '../db/client.js';
import { reconcileQuarterClose } from '../db/egs/reconcile-quarter-close.js';
import {
  computeQuarterClose,
  toTreasuryPayload,
} from '../db/egs/quarter-close.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { getPilotTenantBySlug } from './tenant-provision.js';
import { recordMeterEvent } from '../billing/metering.js';
import { computeEgsFeeInvoice } from '../billing/egs-fee.js';

export type QuarterClosePipelineResult = {
  ok: boolean;
  quarterCloseId: string;
  status: string;
  reconcileOk: boolean;
  discrepancies: string[];
  calculoAhorroFinal: number;
  agigovFeeAmount: number;
  egsFeeBillable: boolean;
  egsFeeReason: string;
  published: boolean;
  ledgerProcessId: string | null;
  /** Model Manifest v1 — destino y reparto del fee del protocolo. */
  modelId: 'egs';
  publisherId: string | null;
  feeShare: {
    feeAmount: number;
    builderAmount: number;
    protocolAmount: number;
    reserveAmount: number;
  } | null;
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
      agigovFeeAmount: 0,
      egsFeeBillable: false,
      egsFeeReason: 'Q-close reconcile failed',
      published: false,
      ledgerProcessId: qc.ledgerProcessId,
      modelId: 'egs',
      publisherId: null,
      feeShare: null,
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

  const egsInvoice = computeEgsFeeInvoice({
    baselineTrimestral: baseline,
    gastosVerificados: reconcile.gastosVerificados,
    ajustesFuerzaMayor: ajustes,
    currency: refreshed.currency,
    egsAddonEnabled: (process.env.AGIGOV_EGS_ADDON ?? '1').trim() !== '0',
  });

  const feeSharePayload = {
    modelId: egsInvoice.modelId,
    publisherId: egsInvoice.publisherId,
    feeAmount: egsInvoice.feeShare.feeAmount,
    builderAmount: egsInvoice.feeShare.builderAmount,
    protocolAmount: egsInvoice.feeShare.protocolAmount,
    reserveAmount: egsInvoice.feeShare.reserveAmount,
    billable: Boolean(options.publish && egsInvoice.billable),
  };

  const evidenceBundle = {
    processId: ledgerProcessId,
    facts: [
      { slug, ministry: tenant.ministryCode, releases: reconcile.releaseCount },
      { gastosVerificados: computed.gastosVerificados },
      { calculoAhorroFinal: computed.calculoAhorroFinal },
      { egsFeeShare: feeSharePayload },
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
    recordMeterEvent({
      unit: 'milestone-validated',
      quantity: 1,
      jurisdictionId: slug,
      processId: ledgerProcessId,
      tier: 'M5',
    });
  }

  return {
    ok: true,
    quarterCloseId: refreshed.id,
    status: options.publish ? 'PUBLISHED' : 'PENDING_VALIDATION',
    reconcileOk: true,
    discrepancies: [],
    calculoAhorroFinal: computed.calculoAhorroFinal,
    agigovFeeAmount: egsInvoice.feeAmount,
    egsFeeBillable: Boolean(options.publish && egsInvoice.billable),
    egsFeeReason: egsInvoice.reason,
    published: Boolean(options.publish),
    ledgerProcessId,
    modelId: 'egs',
    publisherId: egsInvoice.publisherId,
    feeShare: {
      feeAmount: egsInvoice.feeShare.feeAmount,
      builderAmount: egsInvoice.feeShare.builderAmount,
      protocolAmount: egsInvoice.feeShare.protocolAmount,
      reserveAmount: egsInvoice.feeShare.reserveAmount,
    },
  };
}
