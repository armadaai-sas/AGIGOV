import type { ReactNode } from 'react';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import type { ModelAudience, ModelStatus } from '../../platform/agigovModels.js';
import { MODEL_AUDIENCE_LABEL, MODEL_AUDIENCE_ORDER } from '../../platform/agigovModels.js';

export type CatalogAudienceFilter = ModelAudience | 'all';
export type CatalogStatusFilter = ModelStatus | 'all';

type Props = {
  audience: CatalogAudienceFilter;
  status: CatalogStatusFilter;
  query: string;
  compareMode?: boolean;
  onAudienceChange: (value: CatalogAudienceFilter) => void;
  onStatusChange: (value: CatalogStatusFilter) => void;
  onQueryChange: (value: string) => void;
  onCompareModeChange?: (value: boolean) => void;
  onReset: () => void;
};

const STATUS_OPTIONS: { value: CatalogStatusFilter; label: string }[] = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'beta', label: 'Beta' },
  { value: 'roadmap', label: 'Roadmap' },
];

/** Filtros mínimos: audiencia + búsqueda; estado y comparar en overflow. */
export function ModelCatalogFilters({
  audience,
  status,
  query,
  compareMode = false,
  onAudienceChange,
  onStatusChange,
  onQueryChange,
  onCompareModeChange,
  onReset,
}: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const hasAdvanced = status !== 'all';

  return (
    <section className="model-catalog-filters-minimal mb-8" aria-label="Filtros del catálogo">
      <div className="model-catalog-filters-row">
        <div className="model-catalog-tabs" role="tablist" aria-label="Audiencia">
          <FilterTab active={audience === 'all'} onClick={() => onAudienceChange('all')}>
            Todas
          </FilterTab>
          {MODEL_AUDIENCE_ORDER.map((a) => (
            <FilterTab key={a} active={audience === a} onClick={() => onAudienceChange(a)}>
              {MODEL_AUDIENCE_LABEL[a]}
            </FilterTab>
          ))}
        </div>

        <input
          type="search"
          className="model-catalog-search"
          placeholder="Buscar modelo…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Buscar modelo"
        />

        <div className="model-catalog-more-wrap">
          <button
            type="button"
            className="os-btn-ghost os-btn-icon"
            aria-expanded={moreOpen}
            aria-label="Más filtros"
            onClick={() => setMoreOpen((v) => !v)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {moreOpen ? (
            <div className="model-catalog-more-panel">
              <p className="text-xs text-agigov-text-muted mb-2">Estado</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <FilterTab active={status === 'all'} onClick={() => onStatusChange('all')}>
                  Todos
                </FilterTab>
                {STATUS_OPTIONS.map((opt) => (
                  <FilterTab
                    key={opt.value}
                    active={status === opt.value}
                    onClick={() => onStatusChange(opt.value)}
                  >
                    {opt.label}
                  </FilterTab>
                ))}
              </div>
              {onCompareModeChange ? (
                <label className="flex items-center gap-2 text-sm text-agigov-text-muted">
                  <input
                    type="checkbox"
                    checked={compareMode}
                    onChange={(e) => onCompareModeChange(e.target.checked)}
                  />
                  Modo comparar (máx. 2)
                </label>
              ) : null}
              {hasAdvanced ? (
                <button type="button" className="os-btn-text mt-3" onClick={onReset}>
                  Limpiar
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={active ? 'model-catalog-tab model-catalog-tab--active' : 'model-catalog-tab'}
    >
      {children}
    </button>
  );
}
