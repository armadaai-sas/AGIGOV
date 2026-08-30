import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import {
  fetchEgsPipeline,
  fetchMinistryHealth,
  type EgsPipelineResponse,
} from '../api.js';
import { MinistryEgsConsole, MinistryEgsEmpty } from '../components/egs/MinistryEgsConsole.js';
import { ModelConsoleLayout } from '../components/models/ModelConsoleLayout.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { getAgigovModel, EGS_MODEL_PATH } from '../platform/agigovModels.js';
import {
  ministryEgsResultLine,
  ministryEgsStatusHint,
} from '../platform/egsMinistryCopy.js';

/** EGS — consola ministerio (Estado territorial §7.3). */
export default function EgsVialConsolePage() {
  const model = getAgigovModel('egs');
  const { sovereign } = useSovereignConfig();
  const [pipeline, setPipeline] = useState<EgsPipelineResponse | null>(null);

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
    }
  }, []);

  useEffect(() => {
    void loadPipeline();
  }, [loadPipeline]);

  const data = health.data;
  const noData = Boolean(health.error && !data);
  const loading = health.state === 'syncing' && !data;

  const title = data
    ? `${data.ministryCode} · ${data.programName}`
    : `${sovereign.ministryCode} · Programa piloto`;

  const quarterLabel = data ? `Q${data.quarter} ${data.fiscalYear}` : '';

  return (
    <PageShell
      shell
      narrow
      banner={data ? { state: health.state, lastUpdated: health.lastUpdated } : undefined}
    >
      <ModelConsoleLayout
        eyebrow={model?.shortName ?? 'EGS'}
        title={title}
        result={
          data
            ? ministryEgsResultLine(data)
            : 'Interconecta presupuesto, ejecución y ahorro verificable — de ministerio a territorio.'
        }
        dataHint={data ? ministryEgsStatusHint(data) : quarterLabel || sovereign.ministryCode}
        action={
          <button
            type="button"
            className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
            onClick={() => {
              void health.reload();
              void loadPipeline();
            }}
          >
            <RefreshCw {...agigovIconProps('md')} />
            Actualizar
          </button>
        }
      >
        {loading ? <LoadingState label="Cargando telemetría del ministerio…" /> : null}

        {noData && !loading ? (
          <>
            <MinistryEgsEmpty ministryCode={sovereign.ministryCode} />
            {health.error && health.state === 'error' ? (
              <DataConnectionState
                module="egs"
                error={health.error}
                onRetry={() => void health.reload()}
              />
            ) : null}
          </>
        ) : null}

        {data ? <MinistryEgsConsole data={data} pipeline={pipeline} /> : null}

        <p className="model-console-foot">
          <Link to={EGS_MODEL_PATH} className="desk-console-foot-link">
            Ficha del modelo EGS
          </Link>
        </p>
      </ModelConsoleLayout>
    </PageShell>
  );
}
