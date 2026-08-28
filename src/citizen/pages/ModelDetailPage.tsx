import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronRight, Rocket } from 'lucide-react';

import { ModelStatusBadge, audienceBadgeClass } from '../components/models/ModelStatusBadge.js';
import { PageShell } from '../components/PageShell.js';
import {
  getAgigovModel,
  MODEL_AUDIENCE_LABEL,
  type AgigovModel,
  type ModelStatus,
} from '../platform/agigovModels.js';
import {
  getModelDeployExplanation,
  modelWorkspacePath,
} from '../platform/modelWorkspace.js';
import { getEffectiveModelStatus } from '../platform/modelStatusSync.js';

/** Ficha del modelo: descripción, qué incluye, desplegar → espacio de trabajo. */
export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const model = modelId ? getAgigovModel(modelId) : undefined;

  if (!model) {
    return <Navigate to="/modelos" replace />;
  }

  const Icon = model.icon;
  const effectiveStatus = getEffectiveModelStatus(model.id, model.status);
  const deploy = resolveDeployAction(model, effectiveStatus);
  const highlights = model.benefits.slice(0, 3);

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <Link to="/modelos" className="os-workspace-foot-link inline-flex items-center gap-1">
          ← Modelos
        </Link>

        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">{model.name}</h1>
            <p className="os-workspace-sub">{model.tagline}</p>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${audienceBadgeClass(model.audience)}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {MODEL_AUDIENCE_LABEL[model.audience]}
          </span>
          <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
        </div>

        <section className="os-panel">
          <h2 className="text-[13px] font-semibold text-zinc-900">Descripción</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{model.purpose}</p>
        </section>

        {highlights.length > 0 ? (
          <section className="os-workspace-section">
            <h2 className="os-workspace-section-title">Incluye</h2>
            <ul className="space-y-1.5 text-[13px] text-zinc-600">
              {highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-zinc-400" aria-hidden>
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {deploy ? (
          <>
            <p className="text-[13px] text-zinc-500">{getModelDeployExplanation(model)}</p>
            <ul className="os-workspace-list">
              <li>
                <Link to={deploy.to} className="os-workspace-row">
                  <span className="os-workspace-row-icon" aria-hidden>
                    <Rocket className="h-4 w-4" />
                  </span>
                  <span className="os-workspace-row-body">
                    <span className="os-workspace-row-name">{deploy.label}</span>
                    <span className="os-workspace-row-meta">{deploy.hint}</span>
                  </span>
                  <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <p className="text-[13px] text-zinc-500">
            Este modelo está en roadmap — aún no hay despliegue disponible.
          </p>
        )}
      </div>
    </PageShell>
  );
}

function resolveDeployAction(
  model: AgigovModel,
  status: ModelStatus,
): { to: string; label: string; hint: string } | null {
  if (status === 'roadmap') return null;

  return {
    to: modelWorkspacePath(model.id),
    label: status === 'beta' ? 'Desplegar (beta)' : 'Desplegar',
    hint: 'Funciones del modelo',
  };
}
