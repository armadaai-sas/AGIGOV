import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

import type { AgigovModel } from '../../platform/agigovModels.js';
import { getAgigovModel, MODEL_AUDIENCE_LABEL } from '../../platform/agigovModels.js';
import { getModelValidation } from '../../platform/modelValidationState.js';
import { formatStatusCompare, getModelStatusSync } from '../../platform/modelStatusSync.js';
import { ModelStatusBadge, audienceBadgeClass } from './ModelStatusBadge.js';

type Props = {
  left: AgigovModel;
  right: AgigovModel;
  onClear: () => void;
};

type CompareRow = {
  label: string;
  left: string;
  right: string;
  highlight?: boolean;
};

export function ModelComparePanel({ left, right, onClear }: Props) {
  const rows = buildCompareRows(left, right);

  return (
    <section
      className="mb-10 rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-4 md:p-6"
      id="comparar"
      aria-label="Comparación de modelos"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-sky-300/90">
            Comparador
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-agigov-text">
            {left.shortName} vs {right.shortName}
          </h2>
        </div>
        <button
          type="button"
          className="ds-btn-secondary ds-btn-app-shape min-h-11 w-full sm:w-auto"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
          Cerrar comparación
        </button>
      </div>

      <div className="mt-6 md:hidden">
        <CompareMobileStack left={left} right={right} rows={rows} />
      </div>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="pb-3 pr-4 text-left text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
                Criterio
              </th>
              <CompareHeader model={left} />
              <CompareHeader model={right} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.05]">
                <th className="py-3 pr-4 align-top text-left text-xs font-medium text-agigov-text-muted">
                  {row.label}
                </th>
                <CompareCell value={row.left} highlight={row.highlight} />
                <CompareCell value={row.right} highlight={row.highlight} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          to={left.productPath}
          className="ds-btn-secondary ds-btn-app-shape min-h-11 w-full justify-center sm:w-auto"
        >
          Ficha {left.shortName}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to={right.productPath}
          className="ds-btn-secondary ds-btn-app-shape min-h-11 w-full justify-center sm:w-auto"
        >
          Ficha {right.shortName}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function CompareHeader({ model }: { model: AgigovModel }) {
  const Icon = model.icon;
  return (
    <th className="pb-3 px-2 text-left align-top">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
        <span className="font-display font-semibold text-agigov-text">{model.shortName}</span>
      </div>
      <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
    </th>
  );
}

function CompareCell({ value, highlight }: { value: string; highlight?: boolean }) {
  return (
    <td
      className={`py-3 px-2 align-top text-agigov-text ${highlight ? 'font-medium text-sky-200' : ''}`}
    >
      {value}
    </td>
  );
}

function CompareMobileStack({
  left,
  right,
  rows,
}: {
  left: AgigovModel;
  right: AgigovModel;
  rows: CompareRow[];
}) {
  return (
    <div className="space-y-4">
      {[left, right].map((model) => {
        const Icon = model.icon;
        return (
          <article
            key={model.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
              <span className="font-display font-semibold text-agigov-text">{model.shortName}</span>
              <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
            </div>
            <dl className="mt-4 space-y-3">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
                    {row.label}
                  </dt>
                  <dd
                    className={`mt-1 text-sm text-agigov-text ${row.highlight ? 'font-medium text-sky-600 dark:text-sky-200' : ''}`}
                  >
                    {model.id === left.id ? row.left : row.right}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        );
      })}
    </div>
  );
}

function buildCompareRows(a: AgigovModel, b: AgigovModel): CompareRow[] {
  const valA = getModelValidation(a.id);
  const valB = getModelValidation(b.id);

  return [
    {
      label: 'Audiencia',
      left: MODEL_AUDIENCE_LABEL[a.audience],
      right: MODEL_AUDIENCE_LABEL[b.audience],
    },
    {
      label: 'Estado catálogo',
      left: formatStatusCompare(getModelStatusSync(a.id, a.status)),
      right: formatStatusCompare(getModelStatusSync(b.id, b.status)),
    },
    {
      label: 'Validación audit',
      left: valA?.approved ? 'Aprobado' : 'Parcial',
      right: valB?.approved ? 'Aprobado' : 'Parcial',
    },
    {
      label: 'Tagline',
      left: a.tagline,
      right: b.tagline,
      highlight: true,
    },
    {
      label: 'Problema',
      left: truncate(a.problem, 200),
      right: truncate(b.problem, 200),
    },
    {
      label: 'Pagador',
      left: a.businessModel.payer,
      right: b.businessModel.payer,
    },
    {
      label: 'Mecanismo',
      left: a.businessModel.mechanism,
      right: b.businessModel.mechanism,
      highlight: true,
    },
    {
      label: 'Métrica de verdad',
      left: a.businessModel.metric,
      right: b.businessModel.metric,
    },
    {
      label: 'Agentes',
      left: a.operationalModel.agents,
      right: b.operationalModel.agents,
    },
    {
      label: 'Flujo',
      left: a.operationalModel.flow,
      right: b.operationalModel.flow,
    },
    {
      label: 'Consola demo',
      left: a.consolePath ? 'Sí' : 'No',
      right: b.consolePath ? 'Sí' : 'No',
    },
    {
      label: 'Beneficios clave',
      left: a.benefits.slice(0, 3).join(' · '),
      right: b.benefits.slice(0, 3).join(' · '),
    },
  ];
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function parseCompareIds(value: string | null): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .filter((id) => getAgigovModel(id));
}

/** Parse `?compare=egs,escrow-institucional` → hasta 2 ids válidos. */
export function parseCompareParam(value: string | null): [AgigovModel, AgigovModel] | null {
  if (!value?.trim()) return null;
  const ids = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);
  if (ids.length !== 2) return null;

  const left = getAgigovModel(ids[0]!);
  const right = getAgigovModel(ids[1]!);
  if (!left || !right || left.id === right.id) return null;
  return [left, right];
}

export function compareParamFromIds(ids: readonly string[]): string {
  return ids.filter(Boolean).slice(0, 2).join(',');
}
