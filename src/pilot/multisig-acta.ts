import { ed25519 } from '@noble/curves/ed25519.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { getCoreDb } from '../db/client.js';
import { registerActa } from '../db/ledger/index.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { bytesToBase64, base64ToBytes } from '../protocol/encoding.js';

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
}

/** Registra firmas demo y ratifica acta cuando se alcanza threshold. */
export async function ratifyPilotWithDemoKeys(
  originNodeId: string,
): Promise<PilotRatificationResult> {
  const draft = buildPilotDraft();
  const db = getCoreDb();
  const signatures: Record<string, string> = {};

  for (const did of PILOT_SIGNERS) {
    const keys = ed25519.keygen();
    signatures[did] = signPilotContent(draft.contentHash, keys.secretKey);
  }

  const validCount = PILOT_SIGNERS.length;
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
          signatures,
          threshold: PILOT_THRESHOLD,
          publicMetrics: {
            processId: PILOT_PROCESS_ID,
            factCount: PILOT_THRESHOLD,
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
          signatures,
          threshold: PILOT_THRESHOLD,
          publicMetrics: {
            processId: PILOT_PROCESS_ID,
            factCount: PILOT_THRESHOLD,
            hashCount: 1,
            publishedAt: new Date().toISOString(),
          },
        },
      },
    });
  }

  return { ratified, signatures, threshold: PILOT_THRESHOLD };
}

export interface PilotVerification {
  ok: boolean;
  checks: Record<string, boolean>;
  detail: Record<string, unknown>;
}

/** Verifica cierre: acta committed + checkpoint published + API alineada. */
export async function verifyPilotClosure(
  apiBase = process.env.CORE_HEALTH_URL?.replace('/api/public/health', '') ??
    'http://127.0.0.1:3001',
): Promise<PilotVerification> {
  const db = getCoreDb();
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

  const checks = {
    actaCommitted: acta?.status === 'committed' || acta?.status === 'published',
    checkpointPublished: checkpoint?.status === 'published',
    dashboardReachable: apiLedgerCount >= 0,
    ledgerAligned: apiLedgerCount === ledgerCount,
  };

  return {
    ok: Object.values(checks).every(Boolean),
    checks,
    detail: {
      actaStatus: acta?.status ?? 'missing',
      checkpointStatus: checkpoint?.status ?? 'missing',
      ledgerCount,
      apiLedgerCount,
    },
  };
}
