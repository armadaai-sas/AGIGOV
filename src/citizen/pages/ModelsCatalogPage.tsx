import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { EmptyState, PageShell } from '../components/PageShell.js';
import {
  ModelCatalogFilters,
  type CatalogAudienceFilter,
  type CatalogStatusFilter,
} from '../components/models/ModelCatalogFilters.js';
import { ModelCatalogRow } from '../components/models/ModelCatalogRow.js';
import {
  AGIGOV_MODELS,
  MODEL_AUDIENCE_LABEL,
  MODEL_AUDIENCE_ORDER,
  type ModelAudience,
} from '../platform/agigovModels.js';
import { getEffectiveModelStatus } from '../platform/modelStatusSync.js';

function parseAudience(value: string | null): CatalogAudienceFilter {
  if (value === 'gubernamental' || value === 'empresarial' || value === 'ciudadano') {
    return value;
  }
  return 'all';
}

function parseStatus(value: string | null): CatalogStatusFilter {
  if (value === 'disponible' || value === 'beta' || value === 'roadmap') {
    return value;
  }
  return 'all';
}

export default function ModelsCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const audienceFilter = parseAudience(searchParams.get('audiencia'));
  const statusFilter = parseStatus(searchParams.get('status'));

  const filteredModels = useMemo(
    () =>
      AGIGOV_MODELS.filter((model) => {
        if (audienceFilter !== 'all' && model.audience !== audienceFilter) return false;
        if (statusFilter !== 'all' && getEffectiveModelStatus(model.id, model.status) !== statusFilter) {
          return false;
        }
        if (query.trim()) {
          const q = query.toLowerCase();
          const hay = `${model.name} ${model.tagline} ${model.keywords}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [audienceFilter, statusFilter, query],
  );

  function setAudience(next: CatalogAudienceFilter) {
    const params = new URLSearchParams(searchParams);
    if (next === 'all') params.delete('audiencia');
    else params.set('audiencia', next);
    setSearchParams(params, { replace: true });
  }

  function setStatus(next: CatalogStatusFilter) {
    const params = new URLSearchParams(searchParams);
    if (next === 'all') params.delete('status');
    else params.set('status', next);
    setSearchParams(params, { replace: true });
  }

  function resetFilters() {
    setQuery('');
    setSearchParams({}, { replace: true });
  }

  const grouped = audienceFilter === 'all' && !query.trim() && statusFilter === 'all';

  return (
    <PageShell shell narrow={false} banner={undefined}>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Modelos</h1>
            <p className="os-workspace-sub">Modelos operativos del OS — elige uno para operar.</p>
          </div>
        </header>

        <ModelCatalogFilters
          audience={audienceFilter}
          status={statusFilter}
          query={query}
          onAudienceChange={setAudience}
          onStatusChange={setStatus}
          onQueryChange={setQuery}
          onReset={resetFilters}
        />

        {filteredModels.length === 0 ? (
          <EmptyState
            kicker="Sin coincidencias"
            title="Ningún modelo coincide"
            description="Prueba otra búsqueda o limpia los filtros."
            action={
              <button type="button" className="app-btn app-btn--secondary" onClick={resetFilters}>
                Ver todos
              </button>
            }
          />
        ) : grouped ? (
          MODEL_AUDIENCE_ORDER.map((audience) => {
            const models = modelsForAudience(audience);
            if (models.length === 0) return null;
            return (
              <section key={audience} id={audience} className="os-workspace-section scroll-mt-20">
                <h2 className="os-workspace-section-title">{MODEL_AUDIENCE_LABEL[audience]}</h2>
                <ul className="os-workspace-list">
                  {models.map((model) => (
                    <ModelCatalogRow key={model.id} model={model} />
                  ))}
                </ul>
              </section>
            );
          })
        ) : (
          <ul className="os-workspace-list">
            {filteredModels.map((model) => (
              <ModelCatalogRow key={model.id} model={model} />
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function modelsForAudience(audience: ModelAudience) {
  return AGIGOV_MODELS.filter((m) => m.audience === audience);
}
