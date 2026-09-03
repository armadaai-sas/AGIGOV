import { randomUUID } from 'node:crypto';

import { registerActa, upsertProcessCheckpoint } from '../db/ledger/index.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { advanceProcess } from '../agents/state-machine.js';
import {
  assessConformity,
  getWhitepaperIndex,
} from '../agents/whitepaper/index.js';

const PILOT_TERRITORY = 'MAR_NORTH_01';
const MAX_TITLE = 120;
const MIN_FACTS = 2;

export interface CitizenProposalFact {
  text: string;
  source?: string;
  date?: string;
}

export interface CitizenProposalInput {
  title: string;
  sector: string;
  territoryCode?: string;
  facts: CitizenProposalFact[];
}

export interface CitizenProposalReceipt {
  processId: string;
  status: string;
  citizenSummary: string;
  dictamen: 'CONFORME' | 'REVISAR';
  committedAt: string;
}

function buildCitizenSummary(title: string, dictamen: 'CONFORME' | 'REVISAR'): string {
  const prefix =
    dictamen === 'CONFORME'
      ? 'Propuesta ciudadana recibida y evaluada favorablemente'
      : 'Propuesta ciudadana en revisión institucional';
  return `${prefix}: ${title}`;
}

export function validateCitizenProposal(input: CitizenProposalInput): string | null {
  const title = input.title?.trim();
  if (!title || title.length > MAX_TITLE) {
    return `Título requerido (máx. ${MAX_TITLE} caracteres)`;
  }

  const sector = input.sector?.trim();
  if (!sector) return 'Sector requerido';

  const territory = (input.territoryCode?.trim() || PILOT_TERRITORY).toUpperCase();
  if (territory !== PILOT_TERRITORY) {
    return `Solo piloto ${PILOT_TERRITORY} en esta fase`;
  }

  const facts = input.facts?.filter((f) => f.text?.trim()) ?? [];
  if (facts.length < MIN_FACTS) {
    return `Incluye al menos ${MIN_FACTS} hechos verificables`;
  }

  for (const fact of facts) {
    if (fact.text.length > 500) return 'Cada hecho debe tener máximo 500 caracteres';
    if (/@|\b\d{3}-\d{2}-\d{4}\b/i.test(fact.text)) {
      return 'No incluyas datos personales en los hechos';
    }
  }

  return null;
}

/** Registra propuesta ciudadana y ejecuta pipeline demo centinela → soberano. */
export async function registerCitizenProposal(
  input: CitizenProposalInput,
  originNodeId: string,
): Promise<CitizenProposalReceipt> {
  const error = validateCitizenProposal(input);
  if (error) throw new Error(error);

  const title = input.title.trim();
  const sector = input.sector.trim();
  const territoryCode = (input.territoryCode?.trim() || PILOT_TERRITORY).toUpperCase();
  const facts = input.facts.filter((f) => f.text?.trim()).map((f) => ({
    text: f.text.trim(),
    source: f.source?.trim() || undefined,
    date: f.date?.trim() || undefined,
  }));

  const processId = `prop-ciudadana-${randomUUID().slice(0, 8)}`;
  const proposalText = [title, sector, ...facts.map((f) => f.text)].join(' · ');
  const contentHash = payloadHash({ processId, title, sector, facts, v: 1 });

  const evidenceBundle = {
    processId,
    status: 'received' as const,
    citizenProposal: true,
    level: 'A' as const,
    title,
    sector,
    territoryCode,
    facts: [
      { proposal: proposalText },
      ...facts.map((f) => ({ fact: f.text, source: f.source, date: f.date })),
    ],
    hashes: [contentHash],
    rulesTriggered: ['citizen-proposal-received'],
  };

  await upsertProcessCheckpoint({
    processId,
    status: 'received',
    agentId: 'centinela',
    evidenceBundle,
    originNodeId,
  });

  await advanceProcess({
    processId,
    from: 'received',
    to: 'validated',
    agentId: 'centinela',
    evidenceBundle: { ...evidenceBundle, status: 'validated', rulesTriggered: ['citizen-evidence-ok'] },
    originNodeId,
  });

  const whitepaper = getWhitepaperIndex();
  const assessment = assessConformity(proposalText, whitepaper);
  const dictamen: 'CONFORME' | 'REVISAR' = assessment.conforme ? 'CONFORME' : 'REVISAR';
  const citizenSummary = buildCitizenSummary(title, dictamen);

  const opinionHash = payloadHash({
    processId,
    title,
    conforme: assessment.conforme,
    score: assessment.score,
  });

  await registerActa({
    processId,
    title,
    contentHash: opinionHash,
    sovereignDid: 'did:agigov:core:soberano',
    status: assessment.conforme ? 'committed' : 'received',
    originNodeId,
    agentId: 'soberano',
  });

  if (assessment.conforme) {
    await advanceProcess({
      processId,
      from: 'validated',
      to: 'decided',
      agentId: 'soberano',
      evidenceBundle: {
        ...evidenceBundle,
        status: 'decided',
        citizenSummary,
        dictamen,
        matchedSections: assessment.matchedSections,
      },
      originNodeId,
    });
  }

  return {
    processId,
    status: assessment.conforme ? 'committed' : 'received',
    citizenSummary,
    dictamen,
    committedAt: new Date().toISOString(),
  };
}
