import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { fetchDashboard, fetchMinistryHealth, fetchProposals } from '../api.js';
import { ModelConsoleLayout, ModelConsoleZone } from '../components/models/ModelConsoleLayout.js';
import { ModelProcessTracker } from '../components/models/ModelProcessTracker.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { getAgigovModel } from '../platform/agigovModels.js';
import { deriveModelProcessStep } from '../platform/modelProcess.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/** Registro de evidencia publicada — consola customer-centric (Fase 1B). */
export default function EvidenciaConsolePage() {
  const model = getAgigovModel('evidencia-certificada');
  const { sovereign } = useSovereignConfig();
  const dashboard = useCachedFetch('evidencia-dashboard', fetchDashboard, 30_000);
  const health = useCachedFetch(
    `evidencia-contracts-${sovereign.iso}`,
    () => fetchMinistryHealth(sovereign.ministryCode),
    30_000,
  );
  const proposals = useCachedFetch('evidencia-proposals', fetchProposals, 30_000);

  const reportCount = dashboard.data?.reports.length ?? 0;
  const ledgerEntries = dashboard.data?.ledgerEntries ?? 0;
  const contractCount = health.data?.contracts.length ?? 0;

  const processStep = deriveModelProcessStep({
    modelSelected: true,
    dataConnected: Boolean(dashboard.data),
    receiving: dashboard.state === 'syncing' && !dashboard.data,
    published: reportCount > 0,
    reporting: Boolean(dashboard.data),
  });

  const resultLine =
    reportCount > 0
      ? `${reportCount} actas publicadas · ${ledgerEntries} entradas en registro verificable.`
      : contractCount > 0
        ? `${contractCount} contratos con hitos — evidencia en custodia.`
        : 'Conecta la API o el piloto institucional para certificar y publicar evidencia.';

  return (
    <PageShell
      shell
      narrow
      banner={
        dashboard.data
          ? { state: dashboard.state, lastUpdated: dashboard.lastUpdated }
          : undefined
      }
    >
      <ModelConsoleLayout
        eyebrow={model?.shortName ?? 'Evidencia'}
        title="Registro de evidencia"
        result={resultLine}
        dataHint="Evidencia verificable y publicada de forma inalterable."
        action={
          <Link to="/desarrolladores" className="app-btn app-btn--ghost text-[13px]">
            API
          </Link>
        }
      >
        {dashboard.data ? (
          <ModelConsoleZone label="Estado">
            <ModelProcessTracker
              currentStep={processStep}
              liveLabel={
                reportCount > 0
                  ? 'Evidencia publicada y verificable.'
                  : 'Esperando actas o hitos verificados…'
              }
              compact
            />
          </ModelConsoleZone>
        ) : null}

        {dashboard.state === 'syncing' && !dashboard.data ? (
          <LoadingState label="Cargando registro…" />
        ) : null}

        {dashboard.error && !dashboard.data ? (
          <DataConnectionState
            module="gestion"
            error={dashboard.error}
            onRetry={() => void dashboard.reload()}
          />
        ) : null}

        {dashboard.data ? (
          <ModelConsoleZone label="Qué obtienes">
            <dl className="desk-page-metrics desk-console-metrics">
              <div className="desk-page-metric">
                <dt>Actas publicadas</dt>
                <dd>{reportCount}</dd>
              </div>
              <div className="desk-page-metric">
                <dt>Entradas en registro</dt>
                <dd>{ledgerEntries}</dd>
              </div>
              {contractCount > 0 ? (
                <div className="desk-page-metric">
                  <dt>Contratos con hitos</dt>
                  <dd>{contractCount}</dd>
                </div>
              ) : null}
            </dl>
          </ModelConsoleZone>
        ) : null}

        {dashboard.data ? (
          <ModelConsoleZone label="Actas publicadas">
            {dashboard.data.reports.length === 0 ? (
              <p className="desk-console-outcome-note">Sin actas publicadas en este entorno.</p>
            ) : (
              <ul className="desk-page-list">
                {dashboard.data.reports.map((report) => (
                  <li key={report.processId}>
                    <article className="desk-page-row desk-page-row--static flex-col items-stretch gap-2 py-3 sm:flex-row sm:items-center">
                      <span className="desk-page-row-body">
                        <span className="desk-page-row-title">{report.summary}</span>
                        <span className="os-mono-id desk-page-row-summary">{report.processId}</span>
                      </span>
                      <StatusBadge status={report.status} />
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </ModelConsoleZone>
        ) : null}

        {health.data && health.data.contracts.length > 0 ? (
          <ModelConsoleZone label="Evidencia en contratos">
            <ul className="desk-page-list">
              {health.data.contracts.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/proyectos/contrato/${encodeURIComponent(c.id)}`}
                    className="desk-page-row"
                  >
                    <span className="desk-page-row-body">
                      <span className="desk-page-row-title">{c.title}</span>
                      <span className="desk-page-row-summary">
                        {c.milestonesReleased}/{c.milestonesTotal} hitos verificados
                      </span>
                    </span>
                    <ChevronRight {...agigovIconProps('md')} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </ModelConsoleZone>
        ) : null}

        {proposals.data && proposals.data.proposals.length > 0 ? (
          <ModelConsoleZone label="Propuestas con dictamen">
            <ul className="desk-page-list">
              {proposals.data.proposals.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <div className="desk-page-row desk-page-row--static">
                    <span className="desk-page-row-body">
                      <span className="desk-page-row-title">{p.title}</span>
                      <span className="os-mono-id desk-page-row-summary">{p.id}</span>
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="model-console-foot">
              <Link to="/propuestas" className="desk-console-foot-link inline-flex items-center gap-1">
                Ver todas las propuestas
                <ChevronRight {...agigovIconProps('sm')} />
              </Link>
            </p>
          </ModelConsoleZone>
        ) : null}

        <ModelConsoleZone label="Conectar">
          <p className="desk-console-outcome-note">
            Los integradores certificados envían evidencia firmada vía API, o suben documentos en el
            piloto institucional.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/desarrolladores" className="desk-page-primary-btn">
              Conectar API
            </Link>
            <Link to={INSTITUTION_ROUTES.pilot} className="app-btn app-btn--secondary">
              Subir documentos
            </Link>
          </div>
        </ModelConsoleZone>
      </ModelConsoleLayout>
    </PageShell>
  );
}
