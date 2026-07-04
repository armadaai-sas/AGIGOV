import { Link } from 'react-router-dom';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { ModelCatalogCard } from '../components/models/ModelCatalogCard.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import {
  AGIGOV_MODELS,
  MODEL_AUDIENCE_LABEL,
  MODEL_AUDIENCE_ORDER,
  modelsByAudience,
  type ModelAudience,
} from '../platform/agigovModels.js';
import { getModelValidation } from '../platform/modelValidationState.js';

export default function ModelsCatalogPage() {
  const stats = countByStatus();

  return (
    <PageShell banner={undefined} breadcrumbs={breadcrumbsForPath('/modelos')}>
      <SectionHeader
        eyebrow="AGIGOV · Catálogo"
        title="Modelos del sistema"
        lead="Servicios modulares para gobierno, empresa y ciudadanía. Cada ficha muestra el problema, la audiencia, el estado honesto y el modelo ganar-ganar."
      />

      <div className="mb-8 flex flex-wrap gap-3 text-xs">
        <StatPill label="Total" value={AGIGOV_MODELS.length} />
        <StatPill label="Disponible" value={stats.disponible} tone="emerald" />
        <StatPill label="Beta" value={stats.beta} tone="amber" />
        <StatPill label="Roadmap" value={stats.roadmap} tone="muted" />
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {MODEL_AUDIENCE_ORDER.map((audience) => (
          <AudienceCard key={audience} audience={audience} count={modelsByAudience(audience).length} />
        ))}
      </div>

      {MODEL_AUDIENCE_ORDER.map((audience) => (
        <section key={audience} id={audience} className="mb-14 scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-agigov-text">
              {MODEL_AUDIENCE_LABEL[audience]}
            </h2>
            <Link to={`#${audience}`} className="text-xs text-agigov-text-muted no-underline hover:text-sky-400">
              {modelsByAudience(audience).length} modelos
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modelsByAudience(audience).map((model) => (
              <ModelCatalogCard key={model.id} model={model} />
            ))}
          </div>
        </section>
      ))}

      <p className="text-center text-sm text-agigov-text-muted">
        {AGIGOV_MODELS.length} modelos · badges sincronizados con{' '}
        <code className="text-sky-400">npm run models:audit</code>
      </p>
    </PageShell>
  );
}

function countByStatus() {
  const counts = { disponible: 0, beta: 0, roadmap: 0 };
  for (const m of AGIGOV_MODELS) {
    const v = getModelValidation(m.id);
    const status = v?.recommendedStatus ?? m.status;
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
    <a
      href={`#${audience}`}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 no-underline transition hover:border-sky-500/20 hover:bg-white/[0.04]"
    >
      <p className="text-2xl font-semibold tabular-nums text-agigov-text">{count}</p>
      <p className="mt-1 font-medium text-agigov-text">{title}</p>
      <p className="mt-1 text-xs text-agigov-text-muted">{desc}</p>
    </a>
  );
}
