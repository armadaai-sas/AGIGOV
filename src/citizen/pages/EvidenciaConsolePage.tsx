import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { fetchDashboard, fetchMinistryHealth, fetchProposals } from '../api.js';
import { ModelConsoleHeader } from '../components/models/ModelConsoleHeader.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { useSovereignConfig } from '../context/PlatformContext.js';

/** Registro de evidencia publicada — hitos, propuestas y actas en ledger. */
export default function EvidenciaConsolePage() {
  const { sovereign } = useSovereignConfig();
  const dashboard = useCachedFetch('evidencia-dashboard', fetchDashboard, 30_000);
  const health = useCachedFetch(
    `evidencia-contracts-${sovereign.iso}`,
    () => fetchMinistryHealth(sovereign.ministryCode),
    30_000,
  );
  const proposals = useCachedFetch('evidencia-proposals', fetchProposals, 30_000);

  const loading = !dashboard.data && dashboard.state !== 'error';

  return (
    <PageShell shell>
      <div className="os-workspace">
        <ModelConsoleHeader
          modelId="evidencia-certificada"
          title="Registro de evidencia"
          subtitle="Publicaciones verificadas — hashes anclados al ledger."
        />

        {loading ? <LoadingState label="Cargando registro…" /> : null}

        {dashboard.data ? (
          <section className="os-workspace-section">
            <h2 className="os-workspace-section-title">Actas publicadas</h2>
            {dashboard.data.reports.length === 0 ? (
              <p className="text-[13px] text-zinc-600">Sin actas publicadas en este entorno.</p>
            ) : (
              <ul className="os-workspace-list">
                {dashboard.data.reports.map((report) => (
                  <li key={report.processId}>
                    <article className="os-workspace-row os-workspace-row--static flex-col items-stretch gap-2 py-3 sm:flex-row sm:items-center">
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">{report.summary}</span>
                        <span className="os-mono-id mt-1 block text-xs">{report.processId}</span>
                      </span>
                      <StatusBadge status={report.status} />
                    </article>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-zinc-500">
              {dashboard.data.ledgerEntries} entradas en registro
            </p>
          </section>
        ) : dashboard.error && !dashboard.data ? (
          <DataConnectionState
            module="gestion"
            error={dashboard.error}
            onRetry={() => void dashboard.reload()}
          />
        ) : null}

        {health.data && health.data.contracts.length > 0 ? (
          <section className="os-workspace-section">
            <h2 className="os-workspace-section-title">Evidencia en contratos</h2>
            <ul className="os-workspace-list">
              {health.data.contracts.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/proyectos/contrato/${encodeURIComponent(c.id)}`}
                    className="os-workspace-row"
                  >
                    <span className="os-workspace-row-body">
                      <span className="os-workspace-row-name">{c.title}</span>
                      <span className="os-workspace-row-meta">
                        {c.milestonesReleased}/{c.milestonesTotal} hitos verificados
                      </span>
                    </span>
                    <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {proposals.data && proposals.data.proposals.length > 0 ? (
          <section className="os-workspace-section">
            <h2 className="os-workspace-section-title">Propuestas con dictamen</h2>
            <ul className="os-workspace-list">
              {proposals.data.proposals.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <div className="os-workspace-row os-workspace-row--static">
                    <span className="os-workspace-row-body">
                      <span className="os-workspace-row-name">{p.title}</span>
                      <span className="os-mono-id text-xs">{p.id}</span>
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/propuestas" className="os-btn-text mt-2 inline-flex items-center gap-1 text-[13px]">
              Ver todas
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        ) : null}

        <section className="os-workspace-section os-workspace-section--border">
          <h2 className="os-workspace-section-title">Enviar evidencia</h2>
          <p className="text-[13px] text-zinc-600">
            Integradores certificados envían envelopes IAP firmados vía API o suben documentos en el
            piloto institucional.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/desarrolladores" className="ds-btn-app">
              Conectar API
            </Link>
            <Link to="/institucional/piloto" className="ds-btn-secondary ds-btn-app-shape">
              Subir documentos
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
