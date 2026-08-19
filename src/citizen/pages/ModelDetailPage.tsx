import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { EgsDeltaSimulator } from '../components/models/EgsDeltaSimulator.js';
import { ModelPricingStrip } from '../components/models/ModelPricingStrip.js';
import { ModelStatusBadge, audienceBadgeClass } from '../components/models/ModelStatusBadge.js';
import { ModelValidationPanel } from '../components/models/ModelValidationPanel.js';
import { ServiceConnectionPanel } from '../components/services/ServiceConnectionPanel.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import { getAgigovModel, MODEL_AUDIENCE_LABEL } from '../platform/agigovModels.js';
import { getEffectiveModelStatus } from '../platform/modelStatusSync.js';

const SECTION_NAV = [
  { id: 'problema', label: 'Problema' },
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'operacion', label: 'Operación' },
] as const;

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const model = modelId ? getAgigovModel(modelId) : undefined;

  if (!model) {
    return <Navigate to="/modelos" replace />;
  }

  const Icon = model.icon;
  const effectiveStatus = getEffectiveModelStatus(model.id, model.status);
  const showConnection =
    model.id === 'egs' && (effectiveStatus === 'disponible' || effectiveStatus === 'beta');

  return (
    <PageShell banner={undefined} breadcrumbs={breadcrumbsForPath(model.productPath)}>
      <Link to="/modelos" className="agigov-help-back">
        <ArrowLeft className="h-4 w-4" />
        Catálogo de modelos
      </Link>

      <header className="mt-4">
        <SectionHeader
          eyebrow={`AGIGOV · ${model.shortName}`}
          title={model.name}
          lead={model.tagline}
        />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${audienceBadgeClass(model.audience)}`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {MODEL_AUDIENCE_LABEL[model.audience]}
          </span>
          <ModelStatusBadge modelId={model.id} status={model.status} size="md" />
        </div>
      </header>

      <nav
        className="mt-8 hidden flex-wrap gap-2 lg:flex"
        aria-label="Secciones de la ficha"
      >
        {SECTION_NAV.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-agigov-border px-3 py-1 text-xs text-agigov-text-muted no-underline transition hover:border-agigov-primary/30 hover:text-agigov-primary"
          >
            {s.label}
          </a>
        ))}
        {model.id === 'egs' ? (
          <a
            href="#simulador-delta"
            className="rounded-full border border-agigov-border px-3 py-1 text-xs text-agigov-text-muted no-underline transition hover:border-agigov-primary/30 hover:text-agigov-primary"
          >
            Simulador
          </a>
        ) : null}
      </nav>

      <section id="problema" className="mt-8 scroll-mt-24 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ModelBlock title="Problema que resolvemos" body={model.problem} />
          <ModelBlock title="Para qué sirve" body={model.purpose} />
        </div>
        <ModelBlock title="Por qué es vital" body={model.whyVital} accent />
      </section>

      <section id="beneficios" className="agigov-card mt-8 scroll-mt-24">
        <h2 className="font-display text-lg font-semibold">Beneficios clave</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {model.benefits.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-agigov-text-muted">
              <span className="text-emerald-400" aria-hidden>
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section id="operacion" className="agigov-card mt-6 scroll-mt-24">
        <h2 className="font-display text-lg font-semibold">Modelo operacional</h2>
        <ol className="mt-4 space-y-3">
          {model.howItWorks.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-agigov-text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 font-mono text-xs text-sky-300">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <dl className="mt-6 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-agigov-text-muted">Agentes</dt>
            <dd className="mt-1 text-sm text-agigov-text">{model.operationalModel.agents}</dd>
          </div>
          <div>
            <dt className="text-xs text-agigov-text-muted">Flujo</dt>
            <dd className="mt-1 text-sm text-agigov-text">{model.operationalModel.flow}</dd>
          </div>
          <div>
            <dt className="text-xs text-agigov-text-muted">Evidencia</dt>
            <dd className="mt-1 text-sm text-agigov-text">{model.operationalModel.evidence}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-6">
        <ModelPricingStrip model={model} />
      </div>

      {model.id === 'egs' ? (
        <div className="mt-6">
          <EgsDeltaSimulator />
        </div>
      ) : null}

      <div className="mt-6">
        <ModelValidationPanel modelId={model.id} catalogStatus={model.status} />
      </div>

      {showConnection ? (
        <section className="mt-8">
          <SectionHeader
            eyebrow="Activación"
            title="Estado del servicio"
            lead="Verifique nodo API y datos antes de abrir la consola operativa."
          />
          <ServiceConnectionPanel />
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        {model.consolePath ? (
          <Link to={model.consolePath} className="ds-btn-app">
            Abrir consola
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to="/institucional#desplegar" className="ds-btn-app">
            Solicitar despliegue
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link to="/modelos" className="ds-btn-secondary ds-btn-app-shape">
          Volver al catálogo
        </Link>
      </div>
    </PageShell>
  );
}

function ModelBlock({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <section
      className={`agigov-card ${accent ? 'border-emerald-500/20 bg-emerald-500/[0.04]' : ''}`}
    >
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-agigov-text-muted">{body}</p>
    </section>
  );
}
