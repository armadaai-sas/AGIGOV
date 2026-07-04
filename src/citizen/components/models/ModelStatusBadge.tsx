import type { ModelStatus } from '../../platform/agigovModels.js';
import {
  getModelStatusSync,
  MODEL_STATUS_BADGE_CLASS,
  MODEL_STATUS_LABEL,
} from '../../platform/modelStatusSync.js';

type Props = {
  modelId: string;
  status: ModelStatus;
  size?: 'sm' | 'md';
  showDriftHint?: boolean;
};

export function ModelStatusBadge({
  modelId,
  status,
  size = 'sm',
  showDriftHint = false,
}: Props) {
  const sync = getModelStatusSync(modelId, status);
  const sizeClass = size === 'sm' ? 'model-status-badge--sm' : 'model-status-badge--md';

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <span
        className={`${MODEL_STATUS_BADGE_CLASS[sync.displayStatus]} ${sizeClass} ${
          !sync.inSync ? 'model-status-badge--drift' : ''
        }`}
        title={
          !sync.inSync
            ? `Catálogo: ${MODEL_STATUS_LABEL[sync.catalogStatus]} · Auditoría: ${MODEL_STATUS_LABEL[sync.displayStatus]}`
            : sync.approved
              ? 'Aprobado por auditoría'
              : undefined
        }
      >
        {MODEL_STATUS_LABEL[sync.displayStatus]}
        {!sync.inSync ? <span className="model-status-badge-drift-mark">↻</span> : null}
      </span>
      {showDriftHint && !sync.inSync ? (
        <span className="text-[10px] text-amber-600 dark:text-amber-200/90">
          Catálogo: {MODEL_STATUS_LABEL[sync.catalogStatus]}
        </span>
      ) : null}
    </span>
  );
}

export function audienceBadgeClass(audience: 'gubernamental' | 'empresarial' | 'ciudadano'): string {
  const map = {
    gubernamental: 'border-sky-500/25 bg-sky-500/10 text-sky-200',
    empresarial: 'border-violet-500/25 bg-violet-500/10 text-violet-200',
    ciudadano: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200',
  };
  return map[audience];
}

export { getModelStatusSync, getEffectiveModelStatus } from '../../platform/modelStatusSync.js';
