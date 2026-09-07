import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { fetchMinistryHealth } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { getDeskPageMeta } from '../platform/deskPageMeta.js';

const meta = getDeskPageMeta('/contratos')!;

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
      <div className="desk-page">
        <DeskPageHeader
          title="Contratos"
          result={meta.result}
          dataHint={meta.dataHint}
          action={
            <Link to={modelWorkspacePath('egs')} className="desk-page-primary-btn">
              Espacio EGS
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />

        {fatalError ? (
          <DataConnectionState module="escrow" error={error!} onRetry={() => void reload()} />
        ) : null}

        {!data && state !== 'error' ? <LoadingState label="Cargando contratos…" /> : null}

        {data ? (
          <>
            <dl className="desk-page-metrics">
              <div className="desk-page-metric">
                <dt>Periodo</dt>
                <dd>
                  {data.fiscalYear} Q{data.quarter}
                </dd>
              </div>
              <div className="desk-page-metric">
                <dt>Contratos</dt>
                <dd>{data.contracts.length}</dd>
              </div>
            </dl>

            {data.contracts.length === 0 ? (
              <EmptyState
                title="No hay contratos activos"
                description="Cuando el ministerio publique contratos con hitos verificables, aparecerán aquí."
              />
            ) : (
              <ul className="desk-page-list">
                {data.contracts.map((contract) => (
                  <li key={contract.id}>
                    <Link
                      to={`/proyectos/contrato/${encodeURIComponent(contract.id)}`}
                      className="desk-page-row"
                    >
                      <div className="desk-page-row-body">
                        <h2 className="desk-page-row-title">{contract.title}</h2>
                        <p className="desk-page-row-summary">
                          {contract.territoryCode} · {contract.milestonesReleased}/
                          {contract.milestonesTotal} hitos · {formatMoney(contract.spentAmount)}
                        </p>
                      </div>
                      <div className="desk-page-row-meta">
                        <StatusBadge status={contract.status} />
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </div>
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
