import { Link } from 'react-router-dom';

import { fetchDashboard } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { CentinelaReportForm } from '../components/CentinelaReportForm.js';
import { getDeskPageMeta } from '../platform/deskPageMeta.js';

const meta = getDeskPageMeta('/gestion')!;

export default function DashboardPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'dashboard',
    fetchDashboard,
  );

  const fatalError = Boolean(error && state === 'error' && !data);

  return (
    <PageShell shell banner={fatalError ? undefined : { state, lastUpdated }}>
      <div className="desk-page">
        <DeskPageHeader title="Gestión pública" result={meta.result} dataHint={meta.dataHint} />

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
            <dl className="desk-page-metrics">
              <div className="desk-page-metric">
                <dt>Entradas en registro</dt>
                <dd>{data.ledgerEntries}</dd>
              </div>
              <div className="desk-page-metric">
                <dt>Reportes publicados</dt>
                <dd>{data.reports.length}</dd>
              </div>
            </dl>

            <section className="desk-page-section">
              <h2 className="desk-page-section-title">Publicaciones recientes</h2>
              {data.reports.length === 0 ? (
                <EmptyState
                  title="Sin reportes publicados"
                  description="Cuando la gestión pase validación, aparecerá aquí."
                />
              ) : (
                <ul className="desk-page-list">
                  {data.reports.map((report) => (
                    <li key={report.processId}>
                      <article
                        id={`report-${report.processId}`}
                        className="desk-page-row scroll-mt-20"
                      >
                        <div className="desk-page-row-body">
                          <h3 className="desk-page-row-title">{report.summary}</h3>
                        </div>
                        <div className="desk-page-row-meta">
                          <StatusBadge status={report.status} />
                          <time dateTime={report.updatedAt}>
                            {new Date(report.updatedAt).toLocaleDateString('es-VE')}
                          </time>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section id="reportar" className="desk-page-section desk-page-section--border scroll-mt-20">
              <h2 className="desk-page-section-title">Reportar irregularidad</h2>
              <p className="desk-page-data-hint mb-4">
                Describe el hecho con su fuente — se valida antes de publicar.
              </p>
              <CentinelaReportForm />
            </section>
          </>
        ) : null}

        <p className="desk-page-secondary-link">
          <Link to="/participar">Enviar propuesta ciudadana →</Link>
        </p>
      </div>
    </PageShell>
  );
}
