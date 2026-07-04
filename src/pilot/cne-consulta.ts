import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { castSetVote, getSetLedgerStats, tallySetVotes, type SetVoteReceipt } from './set-vote.js';

const STORE = join(process.cwd(), 'data/cne-consulta-cne1.json');

export interface CneOption {
  id: string;
  label: string;
  votes: number;
}

export interface CneConsultation {
  id: string;
  title: string;
  description: string;
  territoryCode: string;
  phase: 'CNE-1' | 'SET-CNE-1-beta';
  binding: false;
  status: 'open' | 'closed';
  options: CneOption[];
  updatedAt: string;
  setLedger?: {
    commitCount: number;
    verifiedCount: number;
    lastCommittedAt: string | null;
  };
}

const DEFAULT: CneConsultation = {
  id: 'consulta-piloto-mar-north-01',
  title: 'Consulta ciudadana piloto (no vinculante)',
  description:
    'CNE-AGIGOV fase SET-CNE-1-beta: boleta cifrada, commit firmado Ed25519 y recuento reproducible. Sin identidad en ledger público.',
  territoryCode: 'MAR_NORTH_01',
  phase: 'SET-CNE-1-beta',
  binding: false,
  status: 'open',
  options: [
    { id: 'agua', label: 'Agua potable comunitaria', votes: 0 },
    { id: 'salud', label: 'Salud primaria', votes: 0 },
    { id: 'educacion', label: 'Educación digital', votes: 0 },
  ],
  updatedAt: new Date().toISOString(),
};

function loadMeta(): Omit<CneConsultation, 'options' | 'setLedger'> & { optionLabels: Record<string, string> } {
  if (!existsSync(join(process.cwd(), 'data'))) {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  }
  if (!existsSync(STORE)) {
    writeFileSync(STORE, JSON.stringify(DEFAULT, null, 2));
    return {
      ...DEFAULT,
      optionLabels: Object.fromEntries(DEFAULT.options.map((o) => [o.id, o.label])),
    };
  }
  const raw = JSON.parse(readFileSync(STORE, 'utf8')) as CneConsultation;
  return {
    ...raw,
    phase: 'SET-CNE-1-beta',
    optionLabels: Object.fromEntries(raw.options.map((o) => [o.id, o.label])),
  };
}

function buildConsultation(): CneConsultation {
  const meta = loadMeta();
  const tallies = tallySetVotes(meta.id);
  const options = Object.entries(meta.optionLabels).map(([id, label]) => ({
    id,
    label,
    votes: tallies[id] ?? 0,
  }));
  const stats = getSetLedgerStats(meta.id);
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    territoryCode: meta.territoryCode,
    phase: meta.phase,
    binding: false,
    status: meta.status,
    options,
    updatedAt: new Date().toISOString(),
    setLedger: {
      commitCount: stats.commitCount,
      verifiedCount: stats.verifiedCount,
      lastCommittedAt: stats.lastCommittedAt,
    },
  };
}

export function getCneConsultation(): CneConsultation {
  return buildConsultation();
}

export interface CneVoteReceipt extends SetVoteReceipt {
  optionId: string;
}

/** Voto SET demo — cifrado + ledger commit + recibo firmado. */
export function castCneVote(optionId: string, voterToken: string): CneVoteReceipt {
  const meta = loadMeta();
  if (meta.status !== 'open') {
    throw new Error('Consulta cerrada');
  }

  if (!meta.optionLabels[optionId]) {
    throw new Error('Opción inválida');
  }

  const receipt = castSetVote({
    consultationId: meta.id,
    optionId,
    voterToken,
  });

  return {
    ...receipt,
    optionId,
  };
}
