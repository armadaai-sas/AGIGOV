import { useCallback, useEffect, useState } from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';

import {
  fetchDataTrustCatalog,
  fetchDataTrustDataset,
  fetchDataTrustPipeline,
  refreshDataTrustPipeline,
  type DataTrustPipelineResponse,
} from '../api.js';
import { DataTrustConnectWizard } from '../components/models/DataTrustConnectWizard.js';
import { ModelConsoleHeader } from '../components/models/ModelConsoleHeader.js';
import { ModelProcessTracker } from '../components/models/ModelProcessTracker.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState, DsSpinner } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { processStepFromDataTrustPipeline } from '../platform/dataTrustPipeline.js';

export default function DataTrustConsolePage() {
  const catalog = useCachedFetch('data-trust-catalog', fetchDataTrustCatalog, 60_000);
  const [pipeline, setPipeline] = useState<DataTrustPipelineResponse | null>(null);
  const [pipelineLoading, setPipelineLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const detailKey = selectedId ? `data-trust-${selectedId}` : 'data-trust-idle';
  const detail = useCachedFetch(
    detailKey,
    () => {
      if (!selectedId) return Promise.reject(new Error('idle'));
      return fetchDataTrustDataset(selectedId);
    },
    60_000,
  );

  const loadPipeline = useCallback(async () => {
    try {
      const status = await fetchDataTrustPipeline();
      setPipeline(status);
    } catch {
      setPipeline(null);
    } finally {
      setPipelineLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPipeline();
    const id = setInterval(() => void loadPipeline(), 4_000);
    return () => clearInterval(id);
  }, [loadPipeline]);

  const connected = Boolean(pipeline?.connection);
  const fatal = Boolean(catalog.error && catalog.state === 'error' && !catalog.data && connected);

  const processStep = pipeline
    ? processStepFromDataTrustPipeline(pipeline)
    : 'select';

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refreshDataTrustPipeline();
      await loadPipeline();
      await catalog.reload();
      if (selectedId) await detail.reload();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleConnected() {
    await loadPipeline();
    await catalog.reload();
  }

  return (
    <PageShell shell banner={fatal ? undefined : { state: catalog.state, lastUpdated: catalog.lastUpdated }}>
      <div className="os-workspace desk-page">
        <ModelConsoleHeader
          modelId="data-trust"
          title="Catálogo de agregados"
          subtitle="Datasets k-anonymizados — sin datos personales."
        >
          {connected ? (
            <button
              type="button"
              disabled={refreshing || pipeline?.run.status === 'running'}
              className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
              onClick={() => void handleRefresh()}
            >
              {refreshing ? <DsSpinner /> : <RefreshCw {...agigovIconProps('md')} />}
              Regenerar pipeline
            </button>
          ) : null}
        </ModelConsoleHeader>

        {pipelineLoading && !pipeline ? <LoadingState label="Cargando pipeline…" /> : null}

        {pipeline ? (
          <ModelProcessTracker currentStep={processStep} liveLabel={pipeline.liveLabel} />
        ) : null}

        {!connected && !pipelineLoading ? (
          <DataTrustConnectWizard onConnected={() => void handleConnected()} />
        ) : null}

        {connected && pipeline ? (
          <p className="dt-connect-status">
            Fuente: <strong>{pipeline.connection!.label}</strong>
            {pipeline.connection!.endpoint ? (
              <>
                {' '}
                · <code className="os-mono-id">{pipeline.connection!.endpoint}</code>
              </>
            ) : null}
          </p>
        ) : null}

        {fatal ? (
          <DataConnectionState
            module="generic"
            error={catalog.error!}
            onRetry={() => void catalog.reload()}
          />
        ) : null}

        {connected && !catalog.data && catalog.state !== 'error' ? (
          <LoadingState label="Cargando catálogo…" />
        ) : null}

        {connected && catalog.data && catalog.data.datasets.length === 0 && catalog.state === 'synced' ? (
          <p className="dt-connect-empty">Pipeline conectado — ejecuta regenerar para publicar sectores.</p>
        ) : null}

        {connected && catalog.data && catalog.data.datasets.length > 0 ? (
          <>
            <dl className="os-metrics-row">
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Datasets</dt>
                <dd className="os-metrics-value">{catalog.data.datasets.length}</dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">k-anonymity mín.</dt>
                <dd className="os-metrics-value">{catalog.data.kAnonymity}</dd>
              </div>
            </dl>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Sectores publicados</h2>
              <ul className="os-workspace-list">
                {catalog.data.datasets.map((ds) => (
                  <li key={ds.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(ds.id === selectedId ? null : ds.id)}
                      className={`os-workspace-row w-full text-left${selectedId === ds.id ? ' os-workspace-row--active' : ''}`}
                    >
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">{ds.title}</span>
                        <span className="os-workspace-row-meta">
                          {ds.metricCount} métricas · k≥{ds.kAnonymity} ·{' '}
                          {new Date(ds.publishedAt).toLocaleDateString('es-VE')}
                        </span>
                      </span>
                      <ChevronRight {...agigovIconProps('sm', 'os-workspace-row-chevron opacity-40')} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {selectedId && detail.data ? (
              <section className="os-panel">
                <h2 className="text-[13px] font-semibold text-zinc-900">{detail.data.dataset.title}</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Hash fuente:{' '}
                  <code className="os-mono-id">{detail.data.dataset.sourceHash.slice(0, 24)}…</code>
                </p>
                <table className="mt-4 w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="pb-2 font-medium">Métrica</th>
                      <th className="pb-2 font-medium">Valor</th>
                      <th className="pb-2 font-medium">Muestra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.data.dataset.cells.map((cell) => (
                      <tr key={`${cell.metric}-${cell.sector}`} className="border-b border-zinc-100">
                        <td className="py-2 text-zinc-900">{cell.metric}</td>
                        <td className="py-2 font-medium text-zinc-900">{cell.value}</td>
                        <td className="py-2 text-zinc-600">n={cell.sampleSize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : selectedId && detail.state === 'syncing' ? (
              <LoadingState label="Cargando dataset…" />
            ) : null}
          </>
        ) : null}

        {pipeline?.stages ? (
          <details className="dt-pipeline-detail">
            <summary>Etapas del pipeline (detalle técnico)</summary>
            <ol className="dt-pipeline-stages">
              {pipeline.stages.map((stage) => (
                <li key={stage.id} data-status={stage.status}>
                  <span className="dt-pipeline-stage-label">{stage.label}</span>
                  <span className="dt-pipeline-stage-detail">{stage.detail}</span>
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </div>
    </PageShell>
  );
}
