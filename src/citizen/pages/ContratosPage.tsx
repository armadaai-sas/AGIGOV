import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { fetchMinistryHealth } from '../api.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';

const TILE_STYLES: Record<string, string> = {
  ok: 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400/60',
  partial: 'border-amber-500/40 bg-amber-500/10 hover:border-amber-400/60',
  discrepancy: 'border-red-500/40 bg-red-500/10 hover:border-red-400/60',
};

export default function ContratosPage() {
  const { sovereign, formatMoney } = useSovereignConfig();
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    `ministry-health-contratos-${sovereign.iso}`,
    () => fetchMinistryHealth(sovereign.ministryCode),
    15_000,
  );

  const fatalError = Boolean(error && state === 'error' && !data);

  return (
    <PageShell
      banner={fatalError ? undefined : { state, lastUpdated }}
      breadcrumbs={breadcrumbsForPath('/contratos')}
    >
      <SectionHeader
        eyebrow="AGIGOV · Apps"
        title="Contratos"
        lead="Escrow por hitos: solo se libera pago con evidencia verificada."
        helpTopic="proyectos"
        action={
          <Link to={EGS_CONSOLE_PATH} className="ds-btn-secondary ds-btn-app-shape">
            Consola EGS
          </Link>
        }
      />

      {fatalError ? (
        <DataConnectionState
          module="escrow"
          error={error!}
          onRetry={() => void reload()}
        />
      ) : null}

      {!data && state !== 'error' ? <LoadingState label="Cargando contratos…" /> : null}

      {data ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 text-xs text-agigov-text-muted">
            <span>
              {data.fiscalYear} Q{data.quarter} · {data.ministryCode}
            </span>
            <span>{data.contracts.length} contratos</span>
            <span>{data.releaseCount} hitos</span>
          </div>

          {data.contracts.length === 0 ? (
            <EmptyState
              title="No hay contratos activos"
              description="Cuando el ministerio publique contratos con hitos verificables, aparecerán aquí."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.contracts.map((contract) => (
                <Link
                  key={contract.id}
                  to={`/proyectos/contrato/${encodeURIComponent(contract.id)}`}
                  className={`group block rounded-lg border p-5 transition ${TILE_STYLES[contract.status] ?? TILE_STYLES.partial}`}
                >
                  <p className="font-display text-lg font-semibold text-agigov-text">
                    {contract.title}
                  </p>
                  <p className="mt-1 text-xs text-agigov-text-muted">{contract.territoryCode}</p>
                  <p className="mt-4 text-sm text-agigov-text-muted">
                    {contract.milestonesReleased}/{contract.milestonesTotal} hitos ·{' '}
                    {formatMoney(contract.spentAmount)}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-xs text-sky-300">
                    Ver cadena de custodia
                    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </PageShell>
  );
}
