import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw } from 'lucide-react';

import { fetchBillingCatalog, fetchBillingUsage } from '../api.js';
import { ModelConsoleLayout, ModelConsoleZone } from '../components/models/ModelConsoleLayout.js';
import { ModelProcessTracker } from '../components/models/ModelProcessTracker.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { getAgigovModel } from '../platform/agigovModels.js';
import {
  humanizeIaauPlan,
  humanizeIaauUnit,
  iaauOutcomeLine,
} from '../platform/iaauMetrics.js';
import { deriveModelProcessStep } from '../platform/modelProcess.js';

export default function IaauConsolePage() {
  const model = getAgigovModel('iaau');
  const usage = useCachedFetch('iaau-usage', fetchBillingUsage, 30_000);
  const catalog = useCachedFetch('iaau-catalog', fetchBillingCatalog, 60_000);

  const fatal = Boolean(usage.error && usage.state === 'error' && !usage.data);
  const data = usage.data;
  const reconciled = Boolean(data?.reconciliation.ok);
  const processStep = deriveModelProcessStep({
    modelSelected: true,
    dataConnected: true,
    loading: usage.state === 'syncing' && !data,
    analyzing: usage.state === 'syncing',
    reporting: Boolean(data),
    published: Boolean(data && reconciled),
  });

  return (
    <PageShell shell narrow banner={fatal ? undefined : { state: usage.state, lastUpdated: usage.lastUpdated }}>
      <ModelConsoleLayout
        eyebrow={model?.shortName ?? 'IaaU'}
        title="Uso y facturación"
        result={
          data
            ? iaauOutcomeLine(data.summary.totalUnits, data.summary.period, reconciled)
            : 'Metering verificable — unidades consumidas vs registro institucional.'
        }
        dataHint={
          data
            ? `Plan ${humanizeIaauPlan(data.plan)} · estimado demo $${data.summary.estimatedUsdDemo.toFixed(2)} USD`
            : 'Conciliación centinela · freeze facturación si discrepancia'
        }
        action={
          <button
            type="button"
            className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
            onClick={() => void usage.reload()}
          >
            <RefreshCw {...agigovIconProps('md')} />
            Actualizar
          </button>
        }
      >
        {data ? (
          <ModelConsoleZone label="Estado">
            <ModelProcessTracker
              currentStep={processStep}
              liveLabel={
                reconciled
                  ? 'Consumo conciliado con el ledger — listo para facturación demo.'
                  : 'Centinela revisando eventos de metering…'
              }
              compact
            />
          </ModelConsoleZone>
        ) : null}

        {fatal ? (
          <DataConnectionState module="generic" error={usage.error!} onRetry={() => void usage.reload()} />
        ) : null}

        {!data && usage.state !== 'error' ? <LoadingState label="Cargando uso…" /> : null}

        {data ? (
          <>
            <ModelConsoleZone label="Qué obtienes">
              <dl className="desk-page-metrics desk-console-metrics">
                <div className="desk-page-metric">
                  <dt>Unidades consumidas</dt>
                  <dd>{data.summary.totalUnits}</dd>
                </div>
                <div className="desk-page-metric">
                  <dt>Estado conciliación</dt>
                  <dd>{reconciled ? 'Conciliado' : 'Discrepancia'}</dd>
                </div>
                <div className="desk-page-metric">
                  <dt>Factura estimada</dt>
                  <dd>${data.invoice.amountUsd.toFixed(2)}</dd>
                </div>
              </dl>
              <p className="desk-console-outcome-note">{data.invoice.reason}</p>
            </ModelConsoleZone>

            <ModelConsoleZone label="Desglose por unidad">
              <ul className="desk-page-list">
                {Object.entries(data.summary.byUnit).map(([unit, qty]) => (
                  <li key={unit}>
                    <div className="desk-page-row desk-page-row--static">
                      <span className="desk-page-row-body">
                        <span className="desk-page-row-title">{humanizeIaauUnit(unit)}</span>
                        <span className="desk-page-row-summary">{unit}</span>
                      </span>
                      <span className="desk-page-row-meta">{qty}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </ModelConsoleZone>

            <ModelConsoleZone label="Confianza">
              <dl className="desk-page-metrics desk-console-metrics">
                <div className="desk-page-metric">
                  <dt>Eventos registrados</dt>
                  <dd>{data.reconciliation.eventCount}</dd>
                </div>
                <div className="desk-page-metric">
                  <dt>Facturable</dt>
                  <dd>{data.reconciliation.billable ? 'Sí' : 'No'}</dd>
                </div>
                <div className="desk-page-metric">
                  <dt>Freeze facturación</dt>
                  <dd>{data.billingFreeze.frozen ? 'Activo' : 'Inactivo'}</dd>
                </div>
              </dl>
              <details className="desk-console-tech">
                <summary>Detalle técnico</summary>
                <p className="desk-console-tech-line">{data.disclaimer}</p>
              </details>
            </ModelConsoleZone>
          </>
        ) : null}

        {catalog.data?.lines ? (
          <ModelConsoleZone label="Catálogo de cobro">
            <ul className="desk-page-list">
              {catalog.data.lines
                .filter((line) => line.layer === 'iaau' || line.layer === 'saas')
                .map((line) => (
                  <li key={line.id}>
                    <div className="desk-page-row desk-page-row--static">
                      <span className="desk-page-row-body">
                        <span className="desk-page-row-title">{humanizeIaauUnit(line.unit)}</span>
                        <span className="desk-page-row-summary">{line.priceNote}</span>
                      </span>
                      <span className="desk-page-row-meta">
                        {typeof line.priceUsd === 'number' ? `$${line.priceUsd}` : String(line.priceUsd)}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            <p className="model-console-foot">
              <Link to="/desarrolladores" className="desk-console-foot-link inline-flex items-center gap-1">
                Integrar vía API
                <ChevronRight {...agigovIconProps('sm')} />
              </Link>
            </p>
          </ModelConsoleZone>
        ) : null}
      </ModelConsoleLayout>
    </PageShell>
  );
}
