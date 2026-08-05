import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { getCoreDb } from '../db/client.js';
import { payloadHash } from '../db/sync/conflicts.js';

export const CARTA_PROCESS_ID =
  process.env.CARTA_ACTA_ID?.trim() ?? 'acta-carta-agigov-ven-v01';

export const CARTA_SIGNERS = (
  process.env.CARTA_SIGNERS?.trim() ??
  'did:armada:core:soberano,did:armada:core:centinela,did:armada:core:logistico'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const CARTA_THRESHOLD = Number.parseInt(
  process.env.CARTA_THRESHOLD ?? '3',
  10,
);

const CONTRIBUTIONS_LOG = join(process.cwd(), 'data/pilot-contributions.jsonl');

export interface CartaDraft {
  processId: string;
  title: string;
  contentHash: string;
  body: string;
}

export function buildCartaDraft(): CartaDraft {
  const body =
    'Ratificación institucional Carta AGIGOV-VEN v0.1 — Governanza de Inteligencia General Autónoma, territorio MAR_NORTH_01 piloto.';
  const contentHash = payloadHash({ processId: CARTA_PROCESS_ID, body, v: 1 });
  return {
    processId: CARTA_PROCESS_ID,
    title: 'Carta AGIGOV-VEN v0.1 — Ratificación multi-sig',
    contentHash,
    body,
  };
}

export async function initCartaActa(originNodeId: string): Promise<CartaDraft> {
  const draft = buildCartaDraft();
  const db = getCoreDb();

  const existing = await db.acta.findUnique({
    where: { processId: CARTA_PROCESS_ID },
  });
  if (existing) return draft;

  await db.escrow.upsert({
    where: { processId: CARTA_PROCESS_ID },
    create: {
      processId: CARTA_PROCESS_ID,
      amount: 0,
      currency: 'VES',
      status: 'PENDING',
      threshold: CARTA_THRESHOLD,
      signers: CARTA_SIGNERS,
      originNodeId,
    },
    update: {
      threshold: CARTA_THRESHOLD,
      signers: CARTA_SIGNERS,
      status: 'PENDING',
    },
  });

  await db.acta.create({
    data: {
      processId: CARTA_PROCESS_ID,
      title: draft.title,
      contentHash: draft.contentHash,
      sovereignDid: CARTA_SIGNERS[0] ?? 'did:armada:core:soberano',
      status: 'received',
      originNodeId,
    },
  });

  return draft;
}

export async function ratifyCartaWithDemoKeys(
  originNodeId: string,
): Promise<{ ratified: boolean; signatures: Record<string, string> }> {
  const { ed25519 } = await import('@noble/curves/ed25519.js');
  const { utf8ToBytes } = await import('@noble/hashes/utils.js');
  const { bytesToBase64 } = await import('../protocol/encoding.js');

  const draft = buildCartaDraft();
  const db = getCoreDb();
  const signatures: Record<string, string> = {};

  for (const did of CARTA_SIGNERS) {
    const keys = ed25519.keygen();
    const sig = ed25519.sign(utf8ToBytes(draft.contentHash), keys.secretKey);
    signatures[did] = bytesToBase64(sig);
  }

  const ratified = CARTA_SIGNERS.length >= CARTA_THRESHOLD;

  if (ratified) {
    await db.acta.update({
      where: { processId: CARTA_PROCESS_ID },
      data: { status: 'committed' },
    });

    await db.escrow.update({
      where: { processId: CARTA_PROCESS_ID },
      data: { status: 'LOCKED' },
    });

    await db.processCheckpoint.upsert({
      where: { processId: CARTA_PROCESS_ID },
      create: {
        processId: CARTA_PROCESS_ID,
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          cartaRatification: true,
          cartaVersion: '0.1',
          documentRef: 'docs/AGIGOV/CARTA-AGIGOV-VEN.md',
          signatures,
          threshold: CARTA_THRESHOLD,
          publicMetrics: {
            processId: CARTA_PROCESS_ID,
            factCount: CARTA_THRESHOLD,
            hashCount: 1,
            publishedAt: new Date().toISOString(),
            summary: 'Carta AGIGOV-VEN v0.1 ratificada — multi-sig institucional',
          },
        },
        originNodeId,
      },
      update: {
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          cartaRatification: true,
          cartaVersion: '0.1',
          documentRef: 'docs/AGIGOV/CARTA-AGIGOV-VEN.md',
          signatures,
          threshold: CARTA_THRESHOLD,
          publicMetrics: {
            processId: CARTA_PROCESS_ID,
            factCount: CARTA_THRESHOLD,
            hashCount: 1,
            publishedAt: new Date().toISOString(),
            summary: 'Carta AGIGOV-VEN v0.1 ratificada — multi-sig institucional',
          },
        },
      },
    });

    await db.ledgerEntry.createMany({
      data: [
        {
          entryType: 'ACTA',
          entityId: CARTA_PROCESS_ID,
          entityHash: payloadHash({ carta: CARTA_PROCESS_ID, ratified: true }),
          processId: CARTA_PROCESS_ID,
          agentId: 'soberano',
          evidenceRef: 'carta-agigov-ven-ratification',
        },
      ],
      skipDuplicates: true,
    });
  }

  return { ratified, signatures };
}

export async function verifyCartaClosure(
  apiBase = 'http://127.0.0.1:3001',
): Promise<{ ok: boolean; checks: Record<string, boolean> }> {
  const db = getCoreDb();
  const acta = await db.acta.findUnique({ where: { processId: CARTA_PROCESS_ID } });
  const checkpoint = await db.processCheckpoint.findUnique({
    where: { processId: CARTA_PROCESS_ID },
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

  const bundle = (checkpoint?.evidenceBundle ?? {}) as Record<string, unknown>;
  const checks = {
    actaCommitted: acta?.status === 'committed' || acta?.status === 'published',
    checkpointPublished: checkpoint?.status === 'published',
    cartaRatification: bundle.cartaRatification === true,
    dashboardReachable: apiLedgerCount >= 0,
    ledgerAligned: apiLedgerCount === ledgerCount,
  };

  return { ok: Object.values(checks).every(Boolean), checks };
}

export interface ContributionInput {
  projectId: string;
  amount: number;
  territoryCode?: string;
  currency?: string;
}

export interface ContributionReceipt {
  receiptId: string;
  projectId: string;
  amount: number;
  currency: string;
  territoryCode: string;
  committedAt: string;
  ledgerHash: string;
}

const PILOT_TERRITORY = 'MAR_NORTH_01';
const MAX_PILOT_AMOUNT = 10_000;

export async function registerContribution(
  input: ContributionInput,
  originNodeId: string,
): Promise<ContributionReceipt> {
  if (input.amount <= 0 || input.amount > MAX_PILOT_AMOUNT) {
    throw new Error(`Monto piloto inválido (1–${MAX_PILOT_AMOUNT} VES)`);
  }

  const territoryCode = input.territoryCode?.trim() || PILOT_TERRITORY;
  if (territoryCode !== PILOT_TERRITORY) {
    throw new Error(`Piloto solo activo en ${PILOT_TERRITORY}`);
  }

  const db = getCoreDb();
  const checkpoint = await db.processCheckpoint.findUnique({
    where: { processId: input.projectId },
  });

  if (!checkpoint || checkpoint.status !== 'published') {
    throw new Error('Proyecto no encontrado o no publicado');
  }

  const bundle = checkpoint.evidenceBundle as Record<string, unknown>;
  const meta = bundle.publicProject as Record<string, unknown> | undefined;
  if (!meta?.title) {
    throw new Error('Proyecto sin metadatos públicos');
  }

  const committedAt = new Date().toISOString();
  const receiptId = payloadHash({
    projectId: input.projectId,
    amount: input.amount,
    committedAt,
    nonce: Math.random().toString(36).slice(2),
  });

  const currency = input.currency ?? 'VES';
  const raised = parseFloat(String(meta.raisedAmount ?? '0')) + input.amount;
  const contributions = Number(meta.contributions ?? 0) + 1;
  const target = parseFloat(String(meta.targetAmount ?? '0')) || 0;
  const funded = target > 0 && raised >= target;

  const previousFundedAt =
    typeof meta.fundedAt === 'string' ? meta.fundedAt : undefined;
  const updatedProject = {
    ...meta,
    raisedAmount: raised.toFixed(4),
    contributions,
    lastContributionAt: committedAt,
    fundedAt: funded ? (previousFundedAt ?? committedAt) : previousFundedAt,
  };

  const escrowProcessId = String(meta.escrowProcessId ?? input.projectId);
  const existingEscrow = await db.escrow.findUnique({
    where: { processId: escrowProcessId },
  });

  await db.$transaction(async (tx) => {
    await tx.processCheckpoint.update({
      where: { processId: input.projectId },
      data: {
        evidenceBundle: {
          ...bundle,
          publicProject: updatedProject,
        },
      },
    });

    await tx.ledgerEntry.create({
      data: {
        entryType: 'ESCROW',
        entityId: receiptId,
        entityHash: payloadHash({ receiptId, projectId: input.projectId }),
        processId: input.projectId,
        agentId: 'logistico',
        evidenceRef: `contrib-pilot-${territoryCode}`,
      },
    });

    if (existingEscrow) {
      const nextAmount = Number(existingEscrow.amount) + input.amount;
      const nextStatus = funded
        ? 'RELEASED'
        : existingEscrow.status === 'PENDING'
          ? 'LOCKED'
          : existingEscrow.status;
      await tx.escrow.update({
        where: { processId: escrowProcessId },
        data: {
          amount: nextAmount,
          currency,
          status: nextStatus === 'FROZEN' ? 'FROZEN' : nextStatus,
        },
      });
    }
  });

  const receipt: ContributionReceipt = {
    receiptId,
    projectId: input.projectId,
    amount: input.amount,
    currency,
    territoryCode,
    committedAt,
    ledgerHash: receiptId,
  };

  if (!existsSync(join(process.cwd(), 'data'))) {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  }
  appendFileSync(CONTRIBUTIONS_LOG, `${JSON.stringify(receipt)}\n`);

  return receipt;
}

export function listContributions(projectId?: string): ContributionReceipt[] {
  if (!existsSync(CONTRIBUTIONS_LOG)) return [];
  const lines = readFileSync(CONTRIBUTIONS_LOG, 'utf8').trim().split('\n').filter(Boolean);
  const all = lines.map((line) => JSON.parse(line) as ContributionReceipt);
  return projectId ? all.filter((c) => c.projectId === projectId) : all;
}
