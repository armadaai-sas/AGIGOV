import { AGIGOV_MODELS, type ModelStatus } from './agigovModels.js';
import {
  getModelValidation,
  MODEL_VALIDATION_GENERATED_AT,
} from './modelValidationState.js';

export type ModelStatusSync = {
  catalogStatus: ModelStatus;
  auditStatus: ModelStatus | null;
  displayStatus: ModelStatus;
  inSync: boolean;
  approved: boolean | null;
  hasAudit: boolean;
};

export const MODEL_STATUS_LABEL: Record<ModelStatus, string> = {
  disponible: 'Disponible',
  beta: 'Beta',
  roadmap: 'En roadmap',
};

/** Clases badge — oscuro / void. Skin trust override en CSS. */
export const MODEL_STATUS_BADGE_CLASS: Record<ModelStatus, string> = {
  disponible: 'model-status-badge model-status-badge--disponible',
  beta: 'model-status-badge model-status-badge--beta',
  roadmap: 'model-status-badge model-status-badge--roadmap',
};

export function getModelStatusSync(modelId: string, catalogStatus: ModelStatus): ModelStatusSync {
  const validation = getModelValidation(modelId);
  if (!validation) {
    return {
      catalogStatus,
      auditStatus: null,
      displayStatus: catalogStatus,
      inSync: true,
      approved: null,
      hasAudit: false,
    };
  }

  const inSync = validation.recommendedStatus === catalogStatus;

  return {
    catalogStatus,
    auditStatus: validation.recommendedStatus,
    displayStatus: validation.recommendedStatus,
    inSync,
    approved: validation.approved,
    hasAudit: true,
  };
}

export function getEffectiveModelStatus(modelId: string, catalogStatus: ModelStatus): ModelStatus {
  return getModelStatusSync(modelId, catalogStatus).displayStatus;
}

export function formatStatusCompare(sync: ModelStatusSync): string {
  if (sync.inSync || !sync.auditStatus) {
    return MODEL_STATUS_LABEL[sync.displayStatus];
  }
  return `${MODEL_STATUS_LABEL[sync.catalogStatus]} → ${MODEL_STATUS_LABEL[sync.auditStatus]}`;
}

export type CatalogSyncStats = {
  total: number;
  audited: number;
  inSync: number;
  outOfSync: number;
  approved: number;
  lastAuditAt: string;
  driftIds: string[];
};

export function getCatalogSyncStats(): CatalogSyncStats {
  let audited = 0;
  let inSync = 0;
  let approved = 0;
  const driftIds: string[] = [];

  for (const model of AGIGOV_MODELS) {
    const sync = getModelStatusSync(model.id, model.status);
    if (sync.hasAudit) audited += 1;
    if (sync.approved) approved += 1;
    if (sync.inSync) inSync += 1;
    else driftIds.push(model.id);
  }

  return {
    total: AGIGOV_MODELS.length,
    audited,
    inSync,
    outOfSync: driftIds.length,
    approved,
    lastAuditAt: MODEL_VALIDATION_GENERATED_AT,
    driftIds,
  };
}
