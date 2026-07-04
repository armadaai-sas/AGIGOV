import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import type { AgigovModel } from '../../platform/agigovModels.js';
import { MODEL_AUDIENCE_LABEL } from '../../platform/agigovModels.js';
import { getModelStatusSync } from '../../platform/modelStatusSync.js';
import { audienceBadgeClass, ModelStatusBadge } from './ModelStatusBadge.js';

type Props = {
  model: AgigovModel;
  compareSelected?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: (modelId: string) => void;
};

function truncateProblem(text: string, max = 120): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function ModelCatalogCard({
  model,
  compareSelected = false,
  compareDisabled = false,
  onToggleCompare,
}: Props) {
  const Icon = model.icon;
  const sync = getModelStatusSync(model.id, model.status);

  return (
    <article
      className={`model-catalog-card agigov-card flex h-full flex-col border-white/[0.06] transition hover:border-sky-500/25 hover:bg-white/[0.03] ${
        !sync.inSync ? 'model-catalog-card--status-drift' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <Icon className="h-5 w-5 text-sky-400" aria-hidden />
        </div>
        <ModelStatusBadge modelId={model.id} status={model.status} showDriftHint />
      </div>

      <p className="mt-4 text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {model.shortName}
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-agigov-text">
        {model.name}
      </h3>

      <span
        className={`mt-3 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${audienceBadgeClass(model.audience)}`}
      >
        {MODEL_AUDIENCE_LABEL[model.audience]}
      </span>

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-agigov-text-muted">
        {truncateProblem(model.problem)}
      </p>

      <p className="mt-3 text-xs text-sky-300/90">{model.tagline}</p>

      <div className="mt-6 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
        {onToggleCompare ? (
          <button
            type="button"
            className={`ds-btn-secondary ds-btn-app-shape w-full justify-center ${
              compareSelected ? 'border-sky-500/40 bg-sky-500/15 text-sky-200' : ''
            }`}
            disabled={compareDisabled && !compareSelected}
            onClick={() => onToggleCompare(model.id)}
            aria-pressed={compareSelected}
          >
            {compareSelected ? 'En comparación' : 'Comparar'}
          </button>
        ) : null}
        <Link to={model.productPath} className="ds-btn-secondary ds-btn-app-shape w-full justify-center">
          Ver ficha
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
