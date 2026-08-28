import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { fetchMinistryHealth } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

export default function ContratosPage() {
  const { sovereign, formatMoney } = useSovereignConfig();
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    `ministry-health-contratos-${sovereign.iso}`,
    () => fetchMinistryHealth(sovereign.ministryCode),
    15_000,
  );

  const fatalError = Boolean(error && state === 'error' && !data);

  return (
    <PageShell shell banner={fatalError ? undefined : { state, lastUpdated }}>
      <div className="os-workspace">
        <header className="os-workspace-head">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Contratos</h1>
            <p className="os-workspace-sub">
              Custodia por hitos — pago solo con evidencia verificada.
            </p>
          </div>
          <div className="os-workspace-cta">
            <Link to={modelWorkspacePath('egs')} className="ds-btn-secondary ds-btn-app-shape">
              Espacio EGS
            </Link>
          </div>
        </header>

        {fatalError ? (
          <DataConnectionState module="escrow" error={error!} onRetry={() => void reload()} />
        ) : null}

        {!data && state !== 'error' ? <LoadingState label="Cargando contratos…" /> : null}

        {data ? (
          <>
            <dl className="os-metrics-row">
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Periodo</dt>
                <dd className="os-metrics-value text-base">
                  {data.fiscalYear} Q{data.quarter}
                </dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Contratos</dt>
                <dd className="os-metrics-value">{data.contracts.length}</dd>
              </div>
            </dl>

            {data.contracts.length === 0 ? (
              <EmptyState
                title="No hay contratos activos"
                description="Cuando el ministerio publique contratos con hitos verificables, aparecerán aquí."
              />
            ) : (
              <ul className="os-workspace-list">
                {data.contracts.map((contract) => (
                  <li key={contract.id}>
                    <Link
                      to={`/proyectos/contrato/${encodeURIComponent(contract.id)}`}
                      className="os-workspace-row"
                    >
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">{contract.title}</span>
                        <span className="os-workspace-row-meta">
                          {contract.territoryCode} · {contract.milestonesReleased}/
                          {contract.milestonesTotal} hitos · {formatMoney(contract.spentAmount)}
                        </span>
                      </span>
                      <span className="os-workspace-row-status capitalize">{contract.status}</span>
                      <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
