import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw } from 'lucide-react';

import { fetchBillingCatalog, fetchBillingUsage } from '../api.js';
import { ModelConsoleHeader } from '../components/models/ModelConsoleHeader.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

const UNIT_LABELS: Record<string, string> = {
  'iap-envelope': 'Envelope IAP',
  'ledger-commit': 'Commit registro',
  'api-call': 'Llamada API',
  'sync-node': 'Sync nodo',
  'milestone-validated': 'Hito validado',
};

export default function IaauConsolePage() {
  const usage = useCachedFetch('iaau-usage', fetchBillingUsage, 30_000);
  const catalog = useCachedFetch('iaau-catalog', fetchBillingCatalog, 60_000);

  const fatal = Boolean(usage.error && usage.state === 'error' && !usage.data);

  return (
    <PageShell shell banner={fatal ? undefined : { state: usage.state, lastUpdated: usage.lastUpdated }}>
      <div className="os-workspace">
        <ModelConsoleHeader
          modelId="iaau"
          title="Uso y facturación"
          subtitle="Metering verificable — unidades consumidas vs registro."
        >
          <button
            type="button"
            className="ds-btn-secondary ds-btn-app-shape inline-flex items-center gap-1"
            onClick={() => void usage.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </ModelConsoleHeader>

        {fatal ? (
          <DataConnectionState module="generic" error={usage.error!} onRetry={() => void usage.reload()} />
        ) : null}

        {!usage.data && usage.state !== 'error' ? <LoadingState label="Cargando uso…" /> : null}

        {usage.data ? (
          <>
            <dl className="os-metrics-row">
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Periodo</dt>
                <dd className="os-metrics-value text-base">{usage.data.summary.period}</dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Unidades totales</dt>
                <dd className="os-metrics-value">{usage.data.summary.totalUnits}</dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Estimado USD</dt>
                <dd className="os-metrics-value text-base">
                  ${usage.data.summary.estimatedUsdDemo.toFixed(2)}
                </dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Plan</dt>
                <dd className="os-metrics-value text-base capitalize">{usage.data.plan}</dd>
              </div>
            </dl>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Desglose por unidad</h2>
              <ul className="os-workspace-list">
                {Object.entries(usage.data.summary.byUnit).map(([unit, qty]) => (
                  <li key={unit}>
                    <div className="os-workspace-row os-workspace-row--static">
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">{UNIT_LABELS[unit] ?? unit}</span>
                        <span className="os-workspace-row-meta">{unit}</span>
                      </span>
                      <span className="os-workspace-row-status">{qty}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="os-panel">
              <h2 className="text-[13px] font-semibold text-zinc-900">Conciliación centinela</h2>
              <dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Eventos registrados</dt>
                  <dd className="font-medium text-zinc-900">{usage.data.reconciliation.eventCount}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Estado</dt>
                  <dd className="font-medium text-zinc-900">
                    {usage.data.reconciliation.ok ? 'Conciliado' : 'Discrepancia'}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Facturable</dt>
                  <dd className="font-medium text-zinc-900">
                    {usage.data.reconciliation.billable ? 'Sí' : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Freeze facturación</dt>
                  <dd className="font-medium text-zinc-900">
                    {usage.data.billingFreeze.frozen ? 'Activo' : 'Inactivo'}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-zinc-500">{usage.data.disclaimer}</p>
            </section>

            <section className="os-panel">
              <h2 className="text-[13px] font-semibold text-zinc-900">Factura estimada</h2>
              <p className="mt-2 text-lg font-semibold text-zinc-900">
                ${usage.data.invoice.amountUsd.toFixed(2)} USD
              </p>
              <p className="mt-1 text-xs text-zinc-500">{usage.data.invoice.reason}</p>
            </section>
          </>
        ) : null}

        {catalog.data?.lines ? (
          <section className="os-workspace-section os-workspace-section--border">
            <h2 className="os-workspace-section-title">Catálogo de cobro</h2>
            <ul className="os-workspace-list">
              {catalog.data.lines
                .filter((line) => line.layer === 'iaau' || line.layer === 'saas')
                .map((line) => (
                  <li key={line.id}>
                    <div className="os-workspace-row os-workspace-row--static">
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">{line.unit}</span>
                        <span className="os-workspace-row-meta">{line.priceNote}</span>
                      </span>
                      <span className="os-workspace-row-status">
                        {typeof line.priceUsd === 'number' ? `$${line.priceUsd}` : String(line.priceUsd)}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            <Link to="/desarrolladores" className="os-btn-text mt-3 inline-flex items-center gap-1 text-[13px]">
              Integrar vía API
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
