import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import {
  fetchEgsPipeline,
  fetchMinistryHealth,
  type EgsPipelineResponse,
  type MinistryHealthResponse,
} from '../api.js';
import { EgsAgentProcessTracker, EgsAgentSwarmBar } from '../components/egs/EgsAgentPipeline.js';
import { EgsConnectWizard } from '../components/egs/EgsConnectWizard.js';
import { MinistryHealthPanel, MinistryHealthUnavailable } from '../components/egs/MinistryHealthPanel.js';
import { ModelConsoleLayout, ModelConsoleZone } from '../components/models/ModelConsoleLayout.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { getAgigovModel, EGS_MODEL_PATH } from '../platform/agigovModels.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

/** EGS — consola multiagente (Postgres + checkpoints, no UI inferida). */
export default function EgsVialConsolePage() {
  const model = getAgigovModel('egs');
  const { sovereign } = useSovereignConfig();
  const [pipeline, setPipeline] = useState<EgsPipelineResponse | null>(null);
  const [pipelineLoading, setPipelineLoading] = useState(true);

  const health = useCachedFetch(
    `ministry-health-${sovereign.iso}`,
    () => fetchMinistryHealth(sovereign.ministryCode),
    15_000,
  );

  const loadPipeline = useCallback(async () => {
    try {
      setPipeline(await fetchEgsPipeline());
    } catch {
      setPipeline(null);
    } finally {
      setPipelineLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPipeline();
    const id = setInterval(() => void loadPipeline(), 5_000);
    return () => clearInterval(id);
  }, [loadPipeline]);

  const connected = Boolean(pipeline?.connection);
  const published = Boolean(pipeline?.published && health.data);
  const fatal = Boolean(health.error && health.state === 'error' && connected && !health.data);

  const resultLine = published
    ? `Q${health.data!.quarter} ${health.data!.fiscalYear}: Δ ${health.data!.calculoAhorroFinal} ${health.data!.currency} — reparto verificable.`
    : connected
      ? (pipeline?.liveLabel ?? 'Pipeline EGS conectado — esperando cierre publicado.')
      : 'Conecta lectura piloto o ingest institucional para ver el enjambre en acción.';

  return (
    <PageShell
      shell
      narrow
      banner={
        connected && health.data
          ? { state: health.state, lastUpdated: health.lastUpdated }
          : undefined
      }
    >
      <ModelConsoleLayout
        eyebrow={model?.shortName ?? 'EGS'}
        title="Reparto del ahorro por eficiencia"
        result={resultLine}
        dataHint={
          pipeline?.ledgerProcessId
            ? `Ledger: ${pipeline.ledgerProcessId}`
            : 'Centinela · Logístico · Soberano · Comunicador'
        }
        action={
          connected ? (
            <button
              type="button"
              className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
              onClick={() => {
                void loadPipeline();
                void health.reload();
              }}
            >
              <RefreshCw {...agigovIconProps('md')} />
              Actualizar
            </button>
          ) : (
            <Link to={modelWorkspacePath('egs')} className="app-btn app-btn--ghost text-[13px]">
              Espacio EGS
            </Link>
          )
        }
      >
        {!connected && !pipelineLoading ? (
          <ModelConsoleZone label="Paso 1 — Conectar">
            <EgsConnectWizard
              onConnected={() => {
                void loadPipeline();
                void health.reload();
              }}
            />
          </ModelConsoleZone>
        ) : null}

        {pipelineLoading && !pipeline ? <LoadingState label="Leyendo pipeline…" /> : null}

        {pipeline && connected ? (
          <>
            <ModelConsoleZone label="Enjambre">
              <EgsAgentSwarmBar swarm={pipeline.swarm} lastAgentId={pipeline.swarm.lastAgentId} />
            </ModelConsoleZone>

            <ModelConsoleZone label="Pipeline multiagente">
              <EgsAgentProcessTracker pipeline={pipeline} />
            </ModelConsoleZone>
          </>
        ) : null}

        {fatal ? (
          <DataConnectionState
            module="egs"
            error={health.error!}
            onRetry={() => {
              void health.reload();
              void loadPipeline();
            }}
          />
        ) : null}

        {connected && health.state === 'syncing' && !health.data ? (
          <LoadingState label="Cargando telemetría fiscal…" />
        ) : null}

        {connected && health.data ? (
          <ModelConsoleZone label="Tu resultado — telemetría fiscal">
            <MinistryHealthPanel data={health.data as MinistryHealthResponse} />
          </ModelConsoleZone>
        ) : connected && !health.data && !health.error ? (
          <ModelConsoleZone label="Telemetría">
            <MinistryHealthUnavailable />
          </ModelConsoleZone>
        ) : null}

        <p className="model-console-foot">
          <Link to={EGS_MODEL_PATH} className="os-btn-text text-[13px]">
            Ficha del modelo EGS
          </Link>
        </p>
      </ModelConsoleLayout>
    </PageShell>
  );
}
