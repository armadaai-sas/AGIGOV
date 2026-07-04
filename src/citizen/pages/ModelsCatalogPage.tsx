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
import { EmptyState, PageShell, SectionHeader, StateHint } from '../components/PageShell.js';
import {
  AGIGOV_MODELS,
  MODEL_AUDIENCE_LABEL,
  MODEL_AUDIENCE_ORDER,
  type AgigovModel,
  type ModelAudience,
  type ModelStatus,
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

  const stats = countByStatus();
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
        eyebrow="AGIGOV · Catálogo"
        title="Modelos del sistema"
        lead="Servicios modulares para gobierno, empresa y ciudadanía. Filtra por audiencia y estado honesto del catálogo."
      />

      <div className="mb-6 -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 text-xs sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        <StatPill label="Total" value={AGIGOV_MODELS.length} />
        <StatPill label="Disponible" value={stats.disponible} tone="emerald" />
        <StatPill label="Beta" value={stats.beta} tone="amber" />
        <StatPill label="Roadmap" value={stats.roadmap} tone="muted" />
      </div>

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
        <div className="mb-6">
          <StateHint>
            <p className="agigov-page-state-kicker">Comparador · 1 de 2</p>
            <p className="text-sm text-agigov-text">
              Elige otro modelo con <span className="text-agigov-text-muted">Comparar</span> o{' '}
              <button
                type="button"
                className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                onClick={clearCompare}
              >
                cancelar
              </button>
              .
            </p>
          </StateHint>
        </div>
      ) : null}

      {!hasFilters ? (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MODEL_AUDIENCE_ORDER.map((audience) => (
            <AudienceCard
              key={audience}
              audience={audience}
              count={modelsForAudience(audience).length}
            />
          ))}
        </div>
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
        {AGIGOV_MODELS.length} modelos · badges sincronizados con{' '}
        <code className="text-sky-400">npm run models:audit</code>
      </p>
    </PageShell>
  );
}

function modelsForAudience(audience: ModelAudience) {
  return AGIGOV_MODELS.filter((m) => m.audience === audience);
}

function countByStatus() {
  const counts = { disponible: 0, beta: 0, roadmap: 0 };
  for (const m of AGIGOV_MODELS) {
    const status = getEffectiveModelStatus(m.id, m.status);
    counts[status] += 1;
  }
  return counts;
}

function StatPill({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'emerald' | 'amber' | 'muted';
}) {
  const tones = {
    default: 'border-white/10 text-agigov-text',
    emerald: 'border-emerald-500/25 text-emerald-200',
    amber: 'border-amber-500/25 text-amber-200',
    muted: 'border-white/10 text-agigov-text-muted',
  };
  return (
    <span className={`rounded-full border px-3 py-1 tabular-nums ${tones[tone]}`}>
      <span className="text-agigov-text-muted">{label}</span> · <strong>{value}</strong>
    </span>
  );
}

function AudienceCard({ audience, count }: { audience: ModelAudience; count: number }) {
  const labels: Record<ModelAudience, { title: string; desc: string }> = {
    gubernamental: {
      title: 'Gubernamental',
      desc: 'Presupuesto, elecciones, escrow y transparencia institucional.',
    },
    empresarial: {
      title: 'Empresarial',
      desc: 'Infra utility, data trust e integración de evidencia B2G.',
    },
    ciudadano: {
      title: 'Ciudadano',
      desc: 'DAO, propuestas y consultas con cierre publicado.',
    },
  };
  const { title, desc } = labels[audience];
  return (
    <Link
      to={`?audiencia=${audience}`}
      className="block min-h-11 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 no-underline transition hover:border-sky-500/20 hover:bg-white/[0.04]"
    >
      <p className="text-2xl font-semibold tabular-nums text-agigov-text">{count}</p>
      <p className="mt-1 font-medium text-agigov-text">{title}</p>
      <p className="mt-1 text-xs text-agigov-text-muted">{desc}</p>
    </Link>
  );
}
