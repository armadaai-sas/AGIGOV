import { ed25519 } from '@noble/curves/ed25519.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { getCoreDb } from '../db/client.js';
import { registerActa } from '../db/ledger/index.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { bytesToBase64, base64ToBytes } from '../protocol/encoding.js';
import {
  ensurePilotCoreKeys,
  loadPilotDidRegistry,
} from './pilot-core-keys.js';

export const PILOT_PROCESS_ID =
  process.env.PILOT_ACTA_ID?.trim() ?? 'acta-piloto-nacional-2026';

export const PILOT_SIGNERS = (
  process.env.PILOT_SIGNERS?.trim() ??
  'did:armada:core:soberano,did:armada:core:centinela,did:armada:core:comunicador'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const PILOT_THRESHOLD = Number.parseInt(
  process.env.PILOT_THRESHOLD ?? '3',
  10,
);

export interface PilotActaDraft {
  processId: string;
  title: string;
  contentHash: string;
  body: string;
}

export function buildPilotDraft(): PilotActaDraft {
  const body =
    'Acta de ratificación del piloto nacional A.R.M.A.D.A. — territorio MAR_NORTH_01, 30 días, multi-sig institucional.';
  const contentHash = payloadHash({ processId: PILOT_PROCESS_ID, body, v: 1 });
  return {
    processId: PILOT_PROCESS_ID,
    title: 'Acta piloto nacional MAR_NORTH_01',
    contentHash,
    body,
  };
}

export function signPilotContent(
  contentHash: string,
  secretKey: Uint8Array,
): string {
  const sig = ed25519.sign(utf8ToBytes(contentHash), secretKey);
  return bytesToBase64(sig);
}

export function verifyPilotSignature(
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

/** Crea borrador + escrow multi-sig (threshold) para el piloto. */
export async function initPilotActa(originNodeId: string): Promise<PilotActaDraft> {
  const draft = buildPilotDraft();
  const db = getCoreDb();

  const existing = await db.acta.findUnique({
    where: { processId: PILOT_PROCESS_ID },
  });
  if (existing) {
    return draft;
  }

  await db.escrow.upsert({
    where: { processId: PILOT_PROCESS_ID },
    create: {
      processId: PILOT_PROCESS_ID,
      amount: 0,
      currency: 'VES',
      status: 'PENDING',
      threshold: PILOT_THRESHOLD,
      signers: PILOT_SIGNERS,
      originNodeId,
    },
    update: {
      threshold: PILOT_THRESHOLD,
      signers: PILOT_SIGNERS,
      status: 'PENDING',
    },
  });

  await registerActa({
    processId: PILOT_PROCESS_ID,
    title: draft.title,
    contentHash: draft.contentHash,
    sovereignDid: PILOT_SIGNERS[0] ?? 'did:armada:core:soberano',
    status: 'received',
    originNodeId,
    agentId: 'soberano',
  });

  return draft;
}

export interface PilotRatificationResult {
  ratified: boolean;
  signatures: Record<string, string>;
  threshold: number;
  validCount: number;
}

/**
 * Firma con claves durables (archivo gitignored o env por rol) y verifica
 * cada firma contra DidRegistry antes de LOCKED / committed.
 */
export async function ratifyPilotWithRegistryKeys(
  originNodeId: string,
): Promise<PilotRatificationResult> {
  const draft = buildPilotDraft();
  const db = getCoreDb();
  const keysFile = ensurePilotCoreKeys(PILOT_PROCESS_ID, PILOT_SIGNERS);
  const registry = loadPilotDidRegistry();
  const signatures: Record<string, string> = {};
  let validCount = 0;

  for (const signer of keysFile.signers) {
    if (!PILOT_SIGNERS.includes(signer.did)) continue;
    const pubFromRegistry = registry.resolveEd25519PublicKey(signer.did);
    const pubKey =
      pubFromRegistry ?? base64ToBytes(signer.ed25519PublicKeyB64);
    const sig = signPilotContent(
      draft.contentHash,
      base64ToBytes(signer.ed25519SecretKeyB64),
    );
    if (verifyPilotSignature(draft.contentHash, sig, pubKey)) {
      signatures[signer.did] = sig;
      validCount++;
    }
  }

  const ratified = validCount >= PILOT_THRESHOLD;

  if (ratified) {
    await db.acta.update({
      where: { processId: PILOT_PROCESS_ID },
      data: { status: 'committed' },
    });

    await db.escrow.update({
      where: { processId: PILOT_PROCESS_ID },
      data: { status: 'LOCKED' },
    });

    await db.processCheckpoint.upsert({
      where: { processId: PILOT_PROCESS_ID },
      create: {
        processId: PILOT_PROCESS_ID,
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          pilotRatification: true,
          signaturesVerified: true,
          signatures,
          threshold: PILOT_THRESHOLD,
          validCount,
          publicMetrics: {
            processId: PILOT_PROCESS_ID,
            factCount: validCount,
            hashCount: 1,
            publishedAt: new Date().toISOString(),
          },
        },
        originNodeId,
      },
      update: {
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          pilotRatification: true,
          signaturesVerified: true,
          signatures,
          threshold: PILOT_THRESHOLD,
          validCount,
          publicMetrics: {
            processId: PILOT_PROCESS_ID,
            factCount: validCount,
            hashCount: 1,
            publishedAt: new Date().toISOString(),
          },
        },
      },
    });
  }

  return { ratified, signatures, threshold: PILOT_THRESHOLD, validCount };
}

/** @deprecated Use ratifyPilotWithRegistryKeys — alias kept for scripts. */
export async function ratifyPilotWithDemoKeys(
  originNodeId: string,
): Promise<PilotRatificationResult> {
  return ratifyPilotWithRegistryKeys(originNodeId);
}
export interface PilotVerification {
  ok: boolean;
  checks: Record<string, boolean>;
  detail: Record<string, unknown>;
}

/** Verifica cierre: acta + checkpoint + API + firmas vs DidRegistry. */
export async function verifyPilotClosure(
  apiBase = process.env.CORE_HEALTH_URL?.replace('/api/public/health', '') ??
    'http://127.0.0.1:3001',
): Promise<PilotVerification> {
  const db = getCoreDb();
  const draft = buildPilotDraft();
  const acta = await db.acta.findUnique({ where: { processId: PILOT_PROCESS_ID } });
  const checkpoint = await db.processCheckpoint.findUnique({
    where: { processId: PILOT_PROCESS_ID },
  });
  const ledgerCount = await db.ledgerEntry.count();

  let apiLedgerCount = -1;
  try {
    const res = await fetch(`${apiBase}/api/public/dashboard`);
    if (res.ok) {
      const json = (await res.json()) as { ledgerEntries?: number };
      apiLedgerCount = json.ledgerEntries ?? -1;
    }
  } catch {
    apiLedgerCount = -1;
  }

  const bundle = (checkpoint?.evidenceBundle ?? {}) as {
    signatures?: Record<string, string>;
  };
  const signatures = bundle.signatures ?? {};
  const registry = loadPilotDidRegistry();
  let verifiedSigs = 0;
  for (const did of PILOT_SIGNERS) {
    const sig = signatures[did];
    const pub = registry.resolveEd25519PublicKey(did);
    if (sig && pub && verifyPilotSignature(draft.contentHash, sig, pub)) {
      verifiedSigs++;
    }
  }

  const checks = {
    actaCommitted: acta?.status === 'committed' || acta?.status === 'published',
    checkpointPublished: checkpoint?.status === 'published',
    dashboardReachable: apiLedgerCount >= 0,
    ledgerAligned: apiLedgerCount === ledgerCount,
    multisigVerified: verifiedSigs >= PILOT_THRESHOLD,
  };

  return {
    ok: Object.values(checks).every(Boolean),
    checks,
    detail: {
      actaStatus: acta?.status ?? 'missing',
      checkpointStatus: checkpoint?.status ?? 'missing',
      ledgerCount,
      apiLedgerCount,
      verifiedSigs,
      threshold: PILOT_THRESHOLD,
    },
  };
}