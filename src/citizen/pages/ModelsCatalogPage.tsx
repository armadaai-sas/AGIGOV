import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import {
  ModelCatalogFilters,
  type CatalogAudienceFilter,
  type CatalogStatusFilter,
} from '../components/models/ModelCatalogFilters.js';
import { ModelCatalogCard } from '../components/models/ModelCatalogCard.js';
import { CatalogSyncStrip } from '../components/models/CatalogSyncStrip.js';
import {
  ModelComparePanel,
  compareParamFromIds,
  parseCompareParam,
  parseCompareIds,
} from '../components/models/ModelComparePanel.js';
import { EmptyState, PageShell, SectionHeader } from '../components/PageShell.js';
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
  const audienceFilter = parseAudience(searchParams.get('audiencia'));
  const statusFilter = parseStatus(searchParams.get('status'));
  const compareIds = parseCompareIds(searchParams.get('compare'));
  const comparePair = parseCompareParam(searchParams.get('compare'));

  const filteredModels = useMemo(
    () =>
      AGIGOV_MODELS.filter((model) => {
        if (audienceFilter !== 'all' && model.audience !== audienceFilter) return false;
        if (statusFilter !== 'all' && getEffectiveModelStatus(model.id, model.status) !== statusFilter) return false;
        return true;
      }),
    [audienceFilter, statusFilter],
  );

  const hasFilters = audienceFilter !== 'all' || statusFilter !== 'all';

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
    setSearchParams({}, { replace: true });
  }

  function setCompareIds(nextIds: string[]) {
    const params = new URLSearchParams(searchParams);
    const value = compareParamFromIds(nextIds);
    if (value) params.set('compare', value);
    else params.delete('compare');
    setSearchParams(params, { replace: true });
  }

  function toggleCompare(modelId: string) {
    if (compareIds.includes(modelId)) {
      setCompareIds(compareIds.filter((id) => id !== modelId));
      return;
    }
    if (compareIds.length >= 2) return;
    setCompareIds([...compareIds, modelId]);
  }

  function clearCompare() {
    setCompareIds([]);
  }

  const cardCompareProps = {
    onToggleCompare: toggleCompare,
    compareSelected: (id: string) => compareIds.includes(id),
    compareDisabled: (id: string) => compareIds.length >= 2 && !compareIds.includes(id),
  };

  return (
    <PageShell banner={undefined} breadcrumbs={breadcrumbsForPath('/modelos')}>
      <SectionHeader
        eyebrow="AGIGOV · Apps"
        title="Modelos"
        lead="Elige una app del OS. Filtra por audiencia y estado."
      />

      <ModelCatalogFilters
        audience={audienceFilter}
        status={statusFilter}
        counts={{ total: AGIGOV_MODELS.length, filtered: filteredModels.length }}
        onAudienceChange={setAudience}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      <div className="mb-6">
        <CatalogSyncStrip />
      </div>

      {comparePair ? (
        <ModelComparePanel left={comparePair[0]} right={comparePair[1]} onClear={clearCompare} />
      ) : compareIds.length === 1 ? (
        <p className="mb-6 text-sm text-agigov-text-muted">
          Comparador: elija un segundo modelo o{' '}
          <button type="button" className="agigov-link" onClick={clearCompare}>
            cancelar
          </button>
          .
        </p>
      ) : null}

      {filteredModels.length === 0 ? (
        <EmptyState
          kicker="Sin coincidencias"
          title="Ningún modelo coincide"
          description="Prueba otra audiencia o estado, o limpia los filtros."
          action={
            <button type="button" className="ds-btn-secondary ds-btn-app-shape" onClick={resetFilters}>
              Ver todos los modelos
            </button>
          }
        />
      ) : hasFilters ? (
        <div className="mb-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredModels.map((model) => (
            <ModelCatalogCard
              key={model.id}
              model={model}
              compareSelected={cardCompareProps.compareSelected(model.id)}
              compareDisabled={cardCompareProps.compareDisabled(model.id)}
              onToggleCompare={cardCompareProps.onToggleCompare}
            />
          ))}
        </div>
      ) : (
        MODEL_AUDIENCE_ORDER.map((audience) => {
          const models = modelsForAudience(audience);
          if (models.length === 0) return null;
          return (
            <section key={audience} id={audience} className="mb-14 scroll-mt-24">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-agigov-text">
                  {MODEL_AUDIENCE_LABEL[audience]}
                </h2>
                <Link
                  to={`?audiencia=${audience}`}
                  className="inline-flex min-h-11 items-center text-xs text-agigov-text-muted no-underline hover:text-sky-400"
                >
                  Filtrar solo esta audiencia
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {models.map((model) => (
                  <ModelCatalogCard
                    key={model.id}
                    model={model}
                    compareSelected={cardCompareProps.compareSelected(model.id)}
                    compareDisabled={cardCompareProps.compareDisabled(model.id)}
                    onToggleCompare={cardCompareProps.onToggleCompare}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      <p className="text-center text-sm text-agigov-text-muted">
        {AGIGOV_MODELS.length} modelos · gobierno · empresa · ciudadano
      </p>
    </PageShell>
  );
}

function modelsForAudience(audience: ModelAudience) {
  return AGIGOV_MODELS.filter((m) => m.audience === audience);
}
