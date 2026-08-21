import { Link } from 'react-router-dom';

import { fetchDashboard } from '../api.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { MicroLesson } from '../components/MicroLesson.js';
import { CentinelaReportForm } from '../components/CentinelaReportForm.js';

export default function DashboardPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'dashboard',
    fetchDashboard,
  );

  const fatalError = Boolean(error && state === 'error' && !data);

  return (
    <PageShell
      banner={fatalError ? undefined : { state, lastUpdated }}
      breadcrumbs={breadcrumbsForPath('/gestion')}
    >
      <SectionHeader
        eyebrow="AGIGOV · Ciudadano"
        title="Gestión pública"
        lead="Ledger público: lo que ya está publicado y se puede verificar — sin datos personales."
        helpTopic="gestion"
      />

      {fatalError ? (
        <DataConnectionState
          module="gestion"
          error={error!}
          onRetry={() => void reload()}
        />
      ) : null}

      {!data && state !== 'error' ? <LoadingState /> : null}

      {data ? (
        <div className="space-y-8">
          <section className="grid grid-cols-2 gap-4 agigov-stagger-list">
            <Stat
              label="Entradas ledger"
              value={String(data.ledgerEntries)}
              hint="Inmutable"
              lesson="Registro público de decisiones ya validadas — no se edita en silencio."
            />
            <Stat
              label="Reportes"
              value={String(data.reports.length)}
              hint="Publicados"
              lesson="Resúmenes de gestión visibles para la ciudadanía, sin datos personales."
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-agigov-text-muted">
              Publicaciones recientes
            </h2>
            {data.reports.length === 0 ? (
              <EmptyState
                title="Sin reportes publicados"
                description="Cuando la gestión pase validación y se publique, aparecerá aquí."
              />
            ) : (
              <div className="space-y-4 agigov-stagger-list">
                {data.reports.map((report) => (
                  <article
                    key={report.processId}
                    id={`report-${report.processId}`}
                    className="agigov-card agigov-card-interactive scroll-mt-28"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={report.status} />
                      <span className="agigov-mono-id">{report.processId}</span>
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-agigov-text/90">
                      {report.summary}
                    </p>
                    <p className="mt-3 text-xs text-agigov-text-muted">
                      {new Date(report.updatedAt).toLocaleString('es-VE')}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="agigov-enter-up border-t border-agigov-border pt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-agigov-text-muted">
              Reportar irregularidad
            </h2>
            <CentinelaReportForm />
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

function Stat({
  label,
  value,
  hint,
  lesson,
}: {
  label: string;
  value: string;
  hint: string;
  lesson?: string;
}) {
  return (
    <div className="agigov-stat">
      <p className="text-[11px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {label}
        {lesson ? <MicroLesson term={label}>{lesson}</MicroLesson> : null}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-agigov-text">{value}</p>
      <p className="mt-1 text-xs text-agigov-text-muted">{hint}</p>
    </div>
  );
}
