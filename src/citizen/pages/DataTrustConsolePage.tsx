import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import {
  fetchDataTrustCatalog,
  fetchDataTrustDataset,
  fetchDataTrustPipeline,
  refreshDataTrustPipeline,
  type DataTrustPipelineResponse,
} from '../api.js';
import { DataTrustConnectWizard } from '../components/models/DataTrustConnectWizard.js';
import { ModelConsoleLayout, ModelConsoleZone } from '../components/models/ModelConsoleLayout.js';
import { ModelProcessTracker } from '../components/models/ModelProcessTracker.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState, DsSpinner } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { getAgigovModel } from '../platform/agigovModels.js';
import { processStepFromDataTrustPipeline } from '../platform/dataTrustPipeline.js';
import { humanizeDataTrustMetric } from '../platform/dataTrustMetrics.js';
import { dataTrustPipelineDemo, demoRequested, markDemoKey } from '../demo/publicDemo.js';

export default function DataTrustConsolePage() {
  const model = getAgigovModel('data-trust');
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
    if (demoRequested()) {
      setPipeline(dataTrustPipelineDemo());
      markDemoKey('data-trust-pipeline', true);
      setPipelineLoading(false);
      return;
    }
    try {
      setPipeline(await fetchDataTrustPipeline());
      markDemoKey('data-trust-pipeline', false);
    } catch {
      setPipeline(null);
      markDemoKey('data-trust-pipeline', false);
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
  const published = Boolean(catalog.data && catalog.data.datasets.length > 0);
  const fatal = Boolean(catalog.error && catalog.state === 'error' && !catalog.data && connected);
  const processStep = pipeline ? processStepFromDataTrustPipeline(pipeline) : 'select';
  const sectorCount = catalog.data?.datasets.length ?? 0;

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

  return (
    <PageShell shell narrow banner={fatal ? undefined : { state: catalog.state, lastUpdated: catalog.lastUpdated }}>
      <ModelConsoleLayout
        eyebrow={model?.shortName ?? 'DATA Trust'}
        title="Tu informe agregado"
        result={
          published
            ? `${sectorCount} sectores publicados — consulta agregada, sin datos personales.`
            : connected
              ? 'Fuente conectada. Genera el informe para ver los sectores.'
              : 'Conecta tu fuente de datos para generar agregados verificables y sin datos personales.'
        }
        dataHint={
          pipeline?.connection
            ? `Fuente activa: ${pipeline.connection.label}`
            : 'Sin datos personales · grupos con muestra mínima garantizada'
        }
        action={
          connected ? (
            <button
              type="button"
              disabled={refreshing || pipeline?.run.status === 'running'}
              className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
              onClick={() => void handleRefresh()}
            >
              {refreshing ? <DsSpinner /> : <RefreshCw {...agigovIconProps('md')} />}
              Regenerar
            </button>
          ) : undefined
        }
      >
        {!connected && !pipelineLoading ? (
          <ModelConsoleZone label="Paso 1 — Conectar">
            <DataTrustConnectWizard onConnected={() => void loadPipeline().then(() => catalog.reload())} />
          </ModelConsoleZone>
        ) : null}

        {pipelineLoading && !pipeline ? <LoadingState label="Cargando estado…" /> : null}

        {pipeline && connected ? (
          <ModelConsoleZone label="Proceso en vivo">
            <ModelProcessTracker currentStep={processStep} liveLabel={pipeline.liveLabel} />
          </ModelConsoleZone>
        ) : null}

        {fatal ? (
          <DataConnectionState module="generic" error={catalog.error!} onRetry={() => void catalog.reload()} />
        ) : null}

        {connected && published ? (
          <>
            <ModelConsoleZone label="Qué obtienes">
              <dl className="desk-page-metrics desk-console-metrics">
                <div className="desk-page-metric">
                  <dt>Sectores listos</dt>
                  <dd>{sectorCount}</dd>
                </div>
                <div className="desk-page-metric">
                  <dt>Privacidad (grupo mínimo)</dt>
                  <dd>≥{catalog.data!.kAnonymity}</dd>
                </div>
              </dl>
              <p className="desk-console-outcome-note">
                Los grupos con muestra demasiado pequeña no se publican, para proteger la privacidad.
              </p>
            </ModelConsoleZone>

            <ModelConsoleZone label="Explorar por sector">
              <ul className="desk-page-list">
                {catalog.data!.datasets.map((ds) => (
                  <li key={ds.id}>
                    <button
                      type="button"
                      className={`desk-page-row w-full text-left${selectedId === ds.id ? ' desk-page-row--active' : ''}`}
                      onClick={() => setSelectedId(ds.id === selectedId ? null : ds.id)}
                    >
                      <span className="desk-page-row-body">
                        <span className="desk-page-row-title">{ds.title.replace('Índices agregados sector ', 'Sector ')}</span>
                        <span className="desk-page-row-summary">
                          {ds.metricCount} indicadores · publicado{' '}
                          {new Date(ds.publishedAt).toLocaleDateString('es-VE')}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </ModelConsoleZone>

            {selectedId && detail.data ? (
              <ModelConsoleZone label="Detalle del sector">
                <div className="desk-console-detail">
                  <table className="desk-console-table">
                    <thead>
                      <tr>
                        <th>Indicador</th>
                        <th>Valor</th>
                        <th>Muestra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.data.dataset.cells.map((cell) => (
                        <tr key={`${cell.metric}-${cell.sector}`}>
                          <td>{humanizeDataTrustMetric(cell.metric)}</td>
                          <td>{cell.value}</td>
                          <td>n={cell.sampleSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <details className="desk-console-tech">
                    <summary>Verificación técnica</summary>
                    <p className="desk-console-tech-line">
                      Hash fuente:{' '}
                      <code className="os-mono-id">{detail.data.dataset.sourceHash.slice(0, 32)}…</code>
                    </p>
                  </details>
                </div>
              </ModelConsoleZone>
            ) : selectedId && detail.state === 'syncing' ? (
              <LoadingState label="Cargando sector…" />
            ) : null}
          </>
        ) : null}

        {connected && !published && catalog.state === 'synced' && !catalog.data?.datasets.length ? (
          <p className="desk-console-outcome-note">Todo listo — pulsa Regenerar para publicar los sectores.</p>
        ) : null}

        <footer className="desk-console-foot">
          {model ? (
            <>
              <Link to={model.productPath} className="desk-console-foot-link">
                Ficha del modelo
              </Link>
              <span className="desk-console-foot-sep">·</span>
              <Link to="/desarrolladores" className="desk-console-foot-link">
                API
              </Link>
            </>
          ) : null}
        </footer>

        {pipeline?.stages ? (
          <details className="dt-pipeline-detail">
            <summary>Detalle técnico (operador)</summary>
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
      </ModelConsoleLayout>
    </PageShell>
  );
}
