import { getCoreDb } from '../db/client.js';
import { payloadHash } from '../db/sync/conflicts.js';
import {
  SBX_NODE,
  type PublicHealthPayload,
} from './network-health.js';

export const SBX_PROCESS_ID =
  process.env.SBX_ACTA_ID?.trim() ?? 'acta-adhesion-agigov-sbx-v01';

export const SBX_SIGNERS = (
  process.env.SBX_SIGNERS?.trim() ??
  'did:agigov:sbx:soberano,did:agigov:sbx:centinela,did:agigov:sbx:logistico'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const SBX_THRESHOLD = Number.parseInt(process.env.SBX_THRESHOLD ?? '3', 10);

export const SBX_PEER_JURISDICTION = 'AGIGOV-VEN';

export interface SandboxAdhesionDraft {
  processId: string;
  title: string;
  contentHash: string;
  body: string;
}

export function buildSandboxAdhesionDraft(): SandboxAdhesionDraft {
  const body =
    'Acta de adhesión AGIGOV-SBX v0.1 — nodo sandbox interop con AGIGOV-VEN, territorio SBX_WEST_01, red piloto AGIGOV.';
  const contentHash = payloadHash({ processId: SBX_PROCESS_ID, body, v: 1 });
  return {
    processId: SBX_PROCESS_ID,
    title: 'Adhesión AGIGOV-SBX v0.1 — Multi-sig sandbox interop',
    contentHash,
    body,
  };
}

export async function initSandboxAdhesion(
  originNodeId: string,
): Promise<SandboxAdhesionDraft> {
  const draft = buildSandboxAdhesionDraft();
  const db = getCoreDb();

  const existing = await db.acta.findUnique({ where: { processId: SBX_PROCESS_ID } });
  if (existing) return draft;

  await db.escrow.upsert({
    where: { processId: SBX_PROCESS_ID },
    create: {
      processId: SBX_PROCESS_ID,
      amount: 0,
      currency: 'USD',
      status: 'PENDING',
      threshold: SBX_THRESHOLD,
      signers: SBX_SIGNERS,
      originNodeId,
    },
    update: {
      threshold: SBX_THRESHOLD,
      signers: SBX_SIGNERS,
      status: 'PENDING',
    },
  });

  await db.acta.create({
    data: {
      processId: SBX_PROCESS_ID,
      title: draft.title,
      contentHash: draft.contentHash,
      sovereignDid: SBX_SIGNERS[0] ?? 'did:agigov:sbx:soberano',
      status: 'received',
      originNodeId,
    },
  });

  return draft;
}

export async function ratifySandboxAdhesionWithDemoKeys(
  originNodeId: string,
): Promise<{ ratified: boolean; signatures: Record<string, string> }> {
  const { ed25519 } = await import('@noble/curves/ed25519.js');
  const { utf8ToBytes } = await import('@noble/hashes/utils.js');
  const { bytesToBase64 } = await import('../protocol/encoding.js');

  const draft = buildSandboxAdhesionDraft();
  const db = getCoreDb();
  const signatures: Record<string, string> = {};

  for (const did of SBX_SIGNERS) {
    const keys = ed25519.keygen();
    const sig = ed25519.sign(utf8ToBytes(draft.contentHash), keys.secretKey);
    signatures[did] = bytesToBase64(sig);
  }

  const ratified = SBX_SIGNERS.length >= SBX_THRESHOLD;

  if (ratified) {
    await db.acta.update({
      where: { processId: SBX_PROCESS_ID },
      data: { status: 'committed' },
    });

    await db.escrow.update({
      where: { processId: SBX_PROCESS_ID },
      data: { status: 'LOCKED' },
    });

    await db.processCheckpoint.upsert({
      where: { processId: SBX_PROCESS_ID },
      create: {
        processId: SBX_PROCESS_ID,
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          sandboxAdhesion: true,
          adhesionVersion: '0.1',
          jurisdiction: SBX_NODE.jurisdiction,
          iso: SBX_NODE.iso,
          peerJurisdiction: SBX_PEER_JURISDICTION,
          documentRef: 'docs/AGIGOV/CARTA-AGIGOV-SBX.md',
          signatures,
          threshold: SBX_THRESHOLD,
          publicMetrics: {
            processId: SBX_PROCESS_ID,
            summary: 'Gobierno sandbox AGIGOV-SBX adherido a la red piloto',
            peerIso: 'VEN',
            sandboxIso: 'SBX',
          },
        },
        originNodeId,
      },
      update: {
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          sandboxAdhesion: true,
          adhesionVersion: '0.1',
          jurisdiction: SBX_NODE.jurisdiction,
          iso: SBX_NODE.iso,
          peerJurisdiction: SBX_PEER_JURISDICTION,
          documentRef: 'docs/AGIGOV/CARTA-AGIGOV-SBX.md',
          signatures,
          threshold: SBX_THRESHOLD,
          publicMetrics: {
            processId: SBX_PROCESS_ID,
            summary: 'Gobierno sandbox AGIGOV-SBX adherido a la red piloto',
            peerIso: 'VEN',
            sandboxIso: 'SBX',
          },
        },
      },
    });

    await db.ledgerEntry.createMany({
      data: [
        {
          entryType: 'ACTA',
          entityId: SBX_PROCESS_ID,
          entityHash: payloadHash({ sbx: SBX_PROCESS_ID, ratified: true }),
          processId: SBX_PROCESS_ID,
          agentId: 'soberano',
          evidenceRef: 'adhesion-agigov-sbx',
        },
      ],
      skipDuplicates: true,
    });
  }

  return { ratified, signatures };
}

export async function verifySandboxClosure(
  venApiBase = 'http://127.0.0.1:3001',
  sbxApiBase = 'http://127.0.0.1:3002',
): Promise<{ ok: boolean; checks: Record<string, boolean> }> {
  const db = getCoreDb();
  const acta = await db.acta.findUnique({ where: { processId: SBX_PROCESS_ID } });
  const checkpoint = await db.processCheckpoint.findUnique({
    where: { processId: SBX_PROCESS_ID },
  });

  let venHealthOk = false;
  let sbxHealthOk = false;
  let venCrossOk = false;
  let sbxCrossOk = false;

  try {
    const venRes = await fetch(`${venApiBase}/api/public/health`);
    if (venRes.ok) {
      const json = (await venRes.json()) as { ok?: boolean; crossHealthOk?: boolean };
      venHealthOk = json.ok === true;
      venCrossOk = json.crossHealthOk === true;
    }
  } catch {
    venHealthOk = false;
  }

  try {
    const sbxRes = await fetch(`${sbxApiBase}/api/public/health`);
    if (sbxRes.ok) {
      const json = (await sbxRes.json()) as { ok?: boolean; crossHealthOk?: boolean };
      sbxHealthOk = json.ok === true;
      sbxCrossOk = json.crossHealthOk === true;
    }
  } catch {
    sbxHealthOk = false;
  }

  const bundle = (checkpoint?.evidenceBundle ?? {}) as Record<string, unknown>;
  const checks = {
    actaCommitted: acta?.status === 'committed' || acta?.status === 'published',
    checkpointPublished: checkpoint?.status === 'published',
    sandboxAdhesion: bundle.sandboxAdhesion === true,
    venHealthOk,
    sbxHealthOk,
    venCrossHealth: venCrossOk,
    sbxCrossHealth: sbxCrossOk,
  };

  return { ok: Object.values(checks).every(Boolean), checks };
}

export async function runCrossHandshake(
  venHealthUrl = 'http://127.0.0.1:3001/api/public/health',
  sbxHealthUrl = 'http://127.0.0.1:3002/api/public/health',
): Promise<{
  ok: boolean;
  ven: PublicHealthPayload | null;
  sbx: PublicHealthPayload | null;
}> {
  let ven: PublicHealthPayload | null = null;
  let sbx: PublicHealthPayload | null = null;

  try {
    const res = await fetch(venHealthUrl, { signal: AbortSignal.timeout(5_000) });
    if (res.ok) ven = (await res.json()) as PublicHealthPayload;
  } catch {
    ven = null;
  }

  try {
    const res = await fetch(sbxHealthUrl, { signal: AbortSignal.timeout(5_000) });
    if (res.ok) sbx = (await res.json()) as PublicHealthPayload;
  } catch {
    sbx = null;
  }

  const ok =
    ven?.ok === true &&
    sbx?.ok === true &&
    ven.crossHealthOk === true &&
    sbx.crossHealthOk === true &&
    ven.node.iso === 'VEN' &&
    sbx.node.iso === 'SBX' &&
    ven.peer?.iso === 'SBX' &&
    sbx.peer?.iso === 'VEN';

  return { ok, ven, sbx };
}
