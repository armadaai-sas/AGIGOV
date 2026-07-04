import type { ModelStatus } from '../../platform/agigovModels.js';
import { getModelValidation } from '../../platform/modelValidationState.js';

const STATUS_LABEL: Record<ModelStatus, string> = {
  disponible: 'Disponible',
  beta: 'Beta',
  roadmap: 'En roadmap',
};

const STATUS_STYLES: Record<ModelStatus, string> = {
  disponible: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
  beta: 'border-amber-500/35 bg-amber-500/10 text-amber-200',
  roadmap: 'border-white/15 bg-white/[0.04] text-agigov-text-muted',
};

type Props = {
  modelId: string;
  status: ModelStatus;
  size?: 'sm' | 'md';
};

export function ModelStatusBadge({ modelId, status, size = 'sm' }: Props) {
  const validation = getModelValidation(modelId);
  const displayStatus = validation?.recommendedStatus ?? status;
  const outOfSync = validation && validation.recommendedStatus !== status;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium uppercase tracking-wide ${STATUS_STYLES[displayStatus]} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
      title={outOfSync ? `Catálogo: ${status} · Auditoría: ${displayStatus}` : undefined}
    >
      {STATUS_LABEL[displayStatus]}
      {outOfSync ? <span className="normal-case opacity-70">· audit</span> : null}
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
