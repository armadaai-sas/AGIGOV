import { ed25519 } from '@noble/curves/ed25519.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { getCoreDb } from '../db/client.js';
import { registerActa } from '../db/ledger/index.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { base64ToBytes, bytesToBase64 } from '../protocol/encoding.js';
import { isoFromMinistryCode, getPilotProfileForIso } from './pilot-jurisdiction-profiles.js';
import {
  buildInstitutionSigners,
  loadDidRegistry,
  loadInstitutionKeys,
  type InstitutionKeysFile,
} from './tenant-institution.js';
import { getPilotTenantBySlug } from './tenant-provision.js';

export function tenantBaselineProcessId(slug: string): string {
  return `acta-baseline-${slug}`;
}

export type TenantBaselineDraft = {
  processId: string;
  title: string;
  contentHash: string;
  body: Record<string, unknown>;
};

export function buildTenantBaselineDraft(input: {
  slug: string;
  ministryCode: string;
  budgetCode: string;
  displayName: string;
  fiscalYear: number;
  annualAmountBaseline: number;
  baselineContentHash: string;
}): TenantBaselineDraft {
  const processId = tenantBaselineProcessId(input.slug);
  const body = {
    type: 'egs-baseline-acta',
    slug: input.slug,
    ministryCode: input.ministryCode,
    budgetCode: input.budgetCode,
    displayName: input.displayName,
    fiscalYear: input.fiscalYear,
    annualAmountBaseline: input.annualAmountBaseline,
    baselineContentHash: input.baselineContentHash,
    v: 1,
  };
  const contentHash = payloadHash({ processId, body });
  return {
    processId,
    title: `Acta baseline EGS — ${input.displayName}`,
    contentHash,
    body,
  };
}

export function signBaselineContent(contentHash: string, secretKeyB64: string): string {
  const sig = ed25519.sign(utf8ToBytes(contentHash), base64ToBytes(secretKeyB64));
  return bytesToBase64(sig);
}

export function verifyBaselineSignature(
  contentHash: string,
  signatureB64: string,
  publicKey: Uint8Array,
): boolean {
  try {
    return ed25519.verify(
      base64ToBytes(signatureB64),
      utf8ToBytes(contentHash),
      publicKey,
    );
  } catch {
    return false;
  }
}

/** Crea borrador acta + escrow multi-sig institucional (Fase B). */
export async function initTenantBaselineMultisig(slug: string): Promise<TenantBaselineDraft> {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant?.budgetLinePilotId) {
    throw new Error(`Tenant ${slug} sin budgetLinePilotId`);
  }

  const db = getCoreDb();
  const baselineAct = await db.baselineAct.findFirst({
    where: { budgetLinePilotId: tenant.budgetLinePilotId, fiscalYear: tenant.fiscalYear },
  });
  if (!baselineAct) {
    throw new Error(`Sin BaselineAct para ${slug}`);
  }

  const iso = isoFromMinistryCode(tenant.ministryCode);
  const currency = getPilotProfileForIso(iso).currency;
  const signers = buildInstitutionSigners(tenant.ministryCode, iso);
  const draft = buildTenantBaselineDraft({
    slug,
    ministryCode: tenant.ministryCode,
    budgetCode: tenant.budgetCode,
    displayName: tenant.displayName,
    fiscalYear: tenant.fiscalYear,
    annualAmountBaseline: Number(baselineAct.annualAmountBaseline),
    baselineContentHash: baselineAct.contentHash,
  });

  await db.escrow.upsert({
    where: { processId: draft.processId },
    create: {
      processId: draft.processId,
      amount: 0,
      currency,
      status: 'PENDING',
      threshold: tenant.multisigThreshold,
      signers,
      originNodeId: tenant.originNodeId,
      budgetLinePilotId: tenant.budgetLinePilotId,
    },
    update: {
      threshold: tenant.multisigThreshold,
      signers,
      status: 'PENDING',
    },
  });

  const existingActa = await db.acta.findUnique({ where: { processId: draft.processId } });
  if (!existingActa) {
    await registerActa({
      processId: draft.processId,
      title: draft.title,
      contentHash: draft.contentHash,
      sovereignDid: signers[0]!,
      status: 'received',
      originNodeId: tenant.originNodeId,
      agentId: 'soberano',
    });
  }

  await db.pilotTenant.update({
    where: { id: tenant.id },
    data: {
      baselineActaProcessId: draft.processId,
      institutionSigners: signers,
      onboardingStatus: 'baseline_pending',
    },
  });

  return draft;
}

export type BaselineRatificationResult = {
  ratified: boolean;
  signatures: Record<string, string>;
  threshold: number;
  validCount: number;
};

/** Firma baseline con claves institucionales del tenant (Ed25519 verificado vía DidRegistry). */
export async function ratifyTenantBaselineWithInstitutionKeys(
  slug: string,
): Promise<BaselineRatificationResult> {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant?.budgetLinePilotId || !tenant.baselineActaProcessId) {
    throw new Error(`Tenant ${slug} sin baseline acta — ejecuta onboard primero`);
  }

  const keysFile = loadInstitutionKeys(slug);
  if (!keysFile) {
    throw new Error(`Faltan claves institucionales en data/pilot-tenants/${slug}.institution-keys.json`);
  }

  const registry = loadDidRegistry();
  const db = getCoreDb();

  const baselineAct = await db.baselineAct.findFirst({
    where: { budgetLinePilotId: tenant.budgetLinePilotId, fiscalYear: tenant.fiscalYear },
  });
  if (!baselineAct) throw new Error('BaselineAct no encontrada');

  const draft = buildTenantBaselineDraft({
    slug,
    ministryCode: tenant.ministryCode,
    budgetCode: tenant.budgetCode,
    displayName: tenant.displayName,
    fiscalYear: tenant.fiscalYear,
    annualAmountBaseline: Number(baselineAct.annualAmountBaseline),
    baselineContentHash: baselineAct.contentHash,
  });

  const signatures: Record<string, string> = {};
  let validCount = 0;

  for (const signer of keysFile.signers) {
    const pubFromRegistry = registry.resolveEd25519PublicKey(signer.did);
    const pubKey = pubFromRegistry ?? base64ToBytes(signer.ed25519PublicKeyB64);
    const sig = signBaselineContent(draft.contentHash, signer.ed25519SecretKeyB64);
    if (verifyBaselineSignature(draft.contentHash, sig, pubKey)) {
      signatures[signer.did] = sig;
      validCount++;
    }
  }

  const threshold = tenant.multisigThreshold;
  const ratified = validCount >= threshold;

  if (ratified) {
    await completeTenantBaselineRatification(slug, draft, signatures, keysFile);
  } else {
    await db.pilotTenant.update({
      where: { id: tenant.id },
      data: { baselineSignatures: signatures },
    });
  }

  return { ratified, signatures, threshold, validCount };
}

async function completeTenantBaselineRatification(
  slug: string,
  draft: TenantBaselineDraft,
  signatures: Record<string, string>,
  keysFile: InstitutionKeysFile,
): Promise<void> {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant?.budgetLinePilotId) return;

  const db = getCoreDb();
  const signerDids = keysFile.signers.map((s) => s.did);

  await db.acta.update({
    where: { processId: draft.processId },
    data: { status: 'committed' },
  });

  await db.escrow.update({
    where: { processId: draft.processId },
    data: { status: 'LOCKED' },
  });

  await db.baselineAct.updateMany({
    where: { budgetLinePilotId: tenant.budgetLinePilotId, fiscalYear: tenant.fiscalYear },
    data: {
      signedAt: new Date(),
      signers: signerDids,
    },
  });

  await db.quarterClose.updateMany({
    where: {
      budgetLinePilotId: tenant.budgetLinePilotId,
      fiscalYear: tenant.fiscalYear,
      quarter: tenant.quarter,
    },
    data: { status: 'BASELINE_LOCKED' },
  });

  await db.processCheckpoint.upsert({
    where: { processId: draft.processId },
    create: {
      processId: draft.processId,
      status: 'published',
      agentId: 'comunicador',
      evidenceBundle: {
        tenantBaselineRatification: true,
        slug,
        signatures,
        threshold: tenant.multisigThreshold,
        signers: signerDids,
        publishedAt: new Date().toISOString(),
      },
      originNodeId: tenant.originNodeId,
    },
    update: {
      status: 'published',
      agentId: 'comunicador',
      evidenceBundle: {
        tenantBaselineRatification: true,
        slug,
        signatures,
        threshold: tenant.multisigThreshold,
        signers: signerDids,
        publishedAt: new Date().toISOString(),
      },
    },
  });

  await db.pilotTenant.update({
    where: { id: tenant.id },
    data: {
      baselineSignatures: signatures,
      onboardingStatus: 'ingest_ready',
    },
  });
}

export async function getTenantBaselineStatus(slug: string) {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant) return null;

  const db = getCoreDb();
  const acta = tenant.baselineActaProcessId
    ? await db.acta.findUnique({ where: { processId: tenant.baselineActaProcessId } })
    : null;
  const escrow = tenant.baselineActaProcessId
    ? await db.escrow.findUnique({ where: { processId: tenant.baselineActaProcessId } })
    : null;

  const sigs =
    tenant.baselineSignatures && typeof tenant.baselineSignatures === 'object'
      ? (tenant.baselineSignatures as Record<string, string>)
      : {};

  return {
    slug: tenant.slug,
    ministryCode: tenant.ministryCode,
    onboardingStatus: tenant.onboardingStatus,
    baselineActaProcessId: tenant.baselineActaProcessId,
    institutionSigners: tenant.institutionSigners,
    multisigThreshold: tenant.multisigThreshold,
    signaturesCollected: Object.keys(sigs).length,
    actaStatus: acta?.status ?? null,
    escrowStatus: escrow?.status ?? null,
    ingestReady: tenant.onboardingStatus === 'ingest_ready',
  };
}
