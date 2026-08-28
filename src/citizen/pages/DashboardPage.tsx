import { Link } from 'react-router-dom';

import { fetchDashboard } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { CentinelaReportForm } from '../components/CentinelaReportForm.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

export default function DashboardPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'dashboard',
    fetchDashboard,
  );

  const fatalError = Boolean(error && state === 'error' && !data);

  return (
    <PageShell
      shell
      banner={fatalError ? undefined : { state, lastUpdated }}
    >
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Gestión pública</h1>
            <p className="os-workspace-sub">
              Registro publicado — verificable, sin datos personales.
            </p>
          </div>
          <div className="os-workspace-cta">
            <Link to={modelWorkspacePath('gestion-verificable')} className="ds-btn-secondary ds-btn-app-shape">
              Espacio gestión
            </Link>
          </div>
        </header>

        {fatalError ? (
          <DataConnectionState
            module="gestion"
            error={error!}
            onRetry={() => void reload()}
          />
        ) : null}

        {!data && state !== 'error' ? <LoadingState /> : null}

        {data ? (
          <>
            <dl className="os-metrics-row">
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Entradas registro</dt>
                <dd className="os-metrics-value">{data.ledgerEntries}</dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Reportes publicados</dt>
                <dd className="os-metrics-value">{data.reports.length}</dd>
              </div>
            </dl>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Publicaciones recientes</h2>
              {data.reports.length === 0 ? (
                <EmptyState
                  title="Sin reportes publicados"
                  description="Cuando la gestión pase validación, aparecerá aquí."
                />
              ) : (
                <ul className="os-workspace-list">
                  {data.reports.map((report) => (
                    <li key={report.processId}>
                      <article
                        id={`report-${report.processId}`}
                        className="os-workspace-row os-workspace-row--static scroll-mt-20"
                      >
                        <span className="os-workspace-row-body">
                          <span className="os-workspace-row-name">{report.summary}</span>
                          <span className="os-workspace-row-meta os-mono-id">
                            {report.processId}
                          </span>
                        </span>
                        <StatusBadge status={report.status} />
                        <time
                          className="os-workspace-row-status"
                          dateTime={report.updatedAt}
                        >
                          {new Date(report.updatedAt).toLocaleDateString('es-VE')}
                        </time>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section id="reportar" className="os-workspace-section os-workspace-section--border scroll-mt-20">
              <h2 className="os-workspace-section-title">Reportar irregularidad</h2>
              <CentinelaReportForm />
            </section>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
