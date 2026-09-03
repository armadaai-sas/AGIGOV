import { randomUUID } from 'node:crypto';

import { registerActa } from '../db/ledger/index.js';
import { payloadHash } from '../db/sync/conflicts.js';
import { advanceProcess } from '../agents/state-machine.js';

const PILOT_TERRITORY = 'MAR_NORTH_01';
const MAX_DESC = 800;

const CATEGORIES = [
  'escrow',
  'ledger',
  'propuesta',
  'suministro',
  'otro',
] as const;

export type IrregularityCategory = (typeof CATEGORIES)[number];

export interface IrregularityInput {
  category: string;
  description: string;
  evidenceRef?: string;
  territoryCode?: string;
}

export interface IrregularityReceipt {
  processId: string;
  status: string;
  category: string;
  committedAt: string;
  message: string;
}

export function validateIrregularityReport(input: IrregularityInput): string | null {
  const category = input.category?.trim().toLowerCase();
  if (!CATEGORIES.includes(category as IrregularityCategory)) {
    return `Categoría inválida (${CATEGORIES.join(', ')})`;
  }

  const description = input.description?.trim();
  if (!description || description.length < 20) {
    return 'Describe la irregularidad con al menos 20 caracteres';
  }
  if (description.length > MAX_DESC) {
    return `Descripción máxima ${MAX_DESC} caracteres`;
  }
  if (/@|\b\d{3}-\d{2}-\d{4}\b/i.test(description)) {
    return 'No incluyas datos personales en el reporte';
  }

  const territory = (input.territoryCode?.trim() || PILOT_TERRITORY).toUpperCase();
  if (territory !== PILOT_TERRITORY) {
    return `Solo piloto ${PILOT_TERRITORY} en esta fase`;
  }

  return null;
}

/** Reporte ciudadano → proceso conciliador (Paso 13). Sin PII en campos públicos. */
export async function registerIrregularityReport(
  input: IrregularityInput,
  originNodeId: string,
): Promise<IrregularityReceipt> {
  const error = validateIrregularityReport(input);
  if (error) throw new Error(error);

  const processId = `irreg-${randomUUID()}`;
  const category = input.category.trim().toLowerCase() as IrregularityCategory;
  const description = input.description.trim();
  const evidenceRef = input.evidenceRef?.trim() || undefined;
  const territoryCode = input.territoryCode?.trim() || PILOT_TERRITORY;

  const evidenceBundle = {
    status: 'received',
    category,
    description,
    evidenceRef,
    territoryCode,
    reporterType: 'citizen',
    rulesTriggered: ['citizen-irregularity-received'],
  };

  const contentHash = payloadHash({ processId, category, description, evidenceRef });

  await registerActa({
    processId,
    title: `Irregularidad reportada — ${category}`,
    contentHash,
    sovereignDid: 'did:agigov:core:conciliador',
    status: 'received',
    originNodeId,
    agentId: 'centinela',
  });

  await advanceProcess({
    processId,
    from: 'received',
    to: 'validated',
    agentId: 'centinela',
    evidenceBundle: { ...evidenceBundle, status: 'validated' },
    originNodeId,
  });

  await advanceProcess({
    processId,
    from: 'validated',
    to: 'decided',
    agentId: 'conciliador',
    evidenceBundle: {
      ...evidenceBundle,
      status: 'decided',
      citizenSummary: `Reporte ciudadano recibido (${category}). Conciliador en revisión.`,
    },
    originNodeId,
  });

  return {
    processId,
    status: 'decided',
    category,
    committedAt: new Date().toISOString(),
    message:
      'Reporte registrado. Centinela y conciliador revisarán la evidencia — sin publicar datos personales.',
  };
}
