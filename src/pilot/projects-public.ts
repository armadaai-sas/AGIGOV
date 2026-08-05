import { getCoreDb } from '../db/client.js';
import { listContributions, type ContributionReceipt } from './carta-ratification.js';

export interface PublicProjectEscrow {
  processId: string;
  status: string;
  amount: string;
  threshold: number;
}

export interface PublicProject {
  id: string;
  title: string;
  sector: string;
  territoryCode: string;
  targetAmount: string;
  raisedAmount: string;
  currency: string;
  contributions: number;
  daoApproved: boolean;
  /** Meta alcanzada (raised ≥ target) — trazable en ledger. */
  funded: boolean;
  milestones: Array<{ label: string; done: boolean }>;
  escrow: PublicProjectEscrow | null;
  updatedAt: string;
}

export interface PublicProjectDetail extends PublicProject {
  recentContributions: ContributionReceipt[];
}

async function mapCheckpoint(row: {
  processId: string;
  evidenceBundle: unknown;
  updatedAt: Date;
}): Promise<PublicProject | null> {
  const bundle = row.evidenceBundle as Record<string, unknown>;
  const meta = bundle.publicProject as Record<string, unknown> | undefined;
  if (!meta?.title) return null;

  const db = getCoreDb();
  const escrow = meta.escrowProcessId
    ? await db.escrow.findUnique({
        where: { processId: String(meta.escrowProcessId) },
      })
    : null;

  return {
    id: row.processId,
    title: String(meta.title),
    sector: String(meta.sector ?? 'general'),
    territoryCode: String(meta.territoryCode ?? ''),
    targetAmount: String(meta.targetAmount ?? '0'),
    raisedAmount: String(meta.raisedAmount ?? '0'),
    currency: String(meta.currency ?? 'VES'),
    contributions: Number(meta.contributions ?? 0),
    daoApproved: Boolean(meta.daoApproved),
    funded:
      Boolean(meta.fundedAt) ||
      (parseFloat(String(meta.targetAmount ?? '0')) > 0 &&
        parseFloat(String(meta.raisedAmount ?? '0')) >=
          parseFloat(String(meta.targetAmount ?? '0'))),
    milestones: (meta.milestones as Array<{ label: string; done: boolean }>) ?? [],
    escrow: escrow
      ? {
          processId: escrow.processId,
          status: escrow.status,
          amount: escrow.amount.toString(),
          threshold: escrow.threshold,
        }
      : null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listPublicProjects(): Promise<PublicProject[]> {
  const db = getCoreDb();
  const published = await db.processCheckpoint.findMany({
    where: { status: 'published' },
    orderBy: { updatedAt: 'desc' },
  });

  const projects: PublicProject[] = [];
  for (const row of published) {
    const mapped = await mapCheckpoint(row);
    if (mapped) projects.push(mapped);
  }
  return projects;
}

export async function getPublicProject(id: string): Promise<PublicProjectDetail | null> {
  const db = getCoreDb();
  const row = await db.processCheckpoint.findUnique({ where: { processId: id } });
  if (!row || row.status !== 'published') return null;

  const mapped = await mapCheckpoint(row);
  if (!mapped) return null;

  const recentContributions = listContributions(id).slice(-20).reverse();
  return { ...mapped, recentContributions };
}
