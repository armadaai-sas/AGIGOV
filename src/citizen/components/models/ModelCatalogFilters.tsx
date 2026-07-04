import type { ReactNode } from 'react';

import type { ModelAudience, ModelStatus } from '../../platform/agigovModels.js';
import { MODEL_AUDIENCE_LABEL, MODEL_AUDIENCE_ORDER } from '../../platform/agigovModels.js';
export type CatalogAudienceFilter = ModelAudience | 'all';
export type CatalogStatusFilter = ModelStatus | 'all';

type Props = {
  audience: CatalogAudienceFilter;
  status: CatalogStatusFilter;
  counts: { total: number; filtered: number };
  onAudienceChange: (value: CatalogAudienceFilter) => void;
  onStatusChange: (value: CatalogStatusFilter) => void;
  onReset: () => void;
};

const STATUS_OPTIONS: { value: CatalogStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'beta', label: 'Beta' },
  { value: 'roadmap', label: 'Roadmap' },
];

export function ModelCatalogFilters({
  audience,
  status,
  counts,
  onAudienceChange,
  onStatusChange,
  onReset,
}: Props) {
  const hasFilters = audience !== 'all' || status !== 'all';

  return (
    <section
      className="model-catalog-filters mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
      id="catalog-filters"
      aria-label="Filtros del catálogo"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-agigov-text">Filtrar modelos</p>
        <p className="text-xs text-agigov-text-muted tabular-nums">
          {counts.filtered} de {counts.total} modelos
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <FilterRow label="Audiencia">
          <FilterChip active={audience === 'all'} onClick={() => onAudienceChange('all')}>
            Todas
          </FilterChip>
          {MODEL_AUDIENCE_ORDER.map((a) => (
            <FilterChip key={a} active={audience === a} onClick={() => onAudienceChange(a)}>
              {MODEL_AUDIENCE_LABEL[a]}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Estado">
          {STATUS_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              active={status === opt.value}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      {hasFilters ? (
        <button
          type="button"
          className="ds-btn-secondary ds-btn-app-shape mt-4 min-h-11 w-full sm:w-auto"
          onClick={onReset}
        >
          Limpiar filtros
        </button>
      ) : null}
    </section>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted sm:w-20">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'model-catalog-filter-chip model-catalog-filter-chip--active'
          : 'model-catalog-filter-chip'
      }
    >
      {children}
    </button>
  );
}
