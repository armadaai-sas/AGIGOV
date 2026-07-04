import { useRef } from 'react';

import { fetchHealth } from '../api.js';
import { checkEgsVialService } from '../services/egs-vial-service.js';
import { EmptyState } from './PageShell.js';
import { PlatformAlert } from './PlatformAlert.js';
import {
  PublicApiConnectionPanel,
  EgsConnectionPanel,
} from './services/ServiceConnectionPanel.js';

const DEV_MODE = import.meta.env.DEV;

export type DataModule =
  | 'escrow'
  | 'egs'
  | 'gestion'
  | 'proposals'
  | 'supply'
  | 'projects'
  | 'cne'
  | 'generic';

export type FetchFailureKind = 'offline' | 'no-data' | 'server';

export function classifyFetchError(message: string): FetchFailureKind {
  const lower = message.toLowerCase();
  if (lower === 'error de red' || lower.includes('failed to fetch') || lower.includes('network')) {
    return 'offline';
  }
  if (lower.includes('404') || lower.includes('not found') || lower.includes('unavailable')) {
    return 'no-data';
  }
  if (message.startsWith('API ') || /\u2192\s*[45]\d{2}/.test(message)) {
    if (/\u2192\s*404/.test(message)) return 'no-data';
    if (/\u2192\s*5\d{2}/.test(message)) return 'server';
    return 'no-data';
  }
  return 'server';
}

const MODULE_COPY: Record<
  DataModule,
  { emptyTitle: string; emptyDescription: string; serviceTitle: string; devHint: string }
> = {
  escrow: {
    emptyTitle: 'Aún no hay contratos publicados',
    emptyDescription:
      'Este módulo lee contratos desde el nodo API público del despliegue. Si el nodo no está activo o no tiene datos demo, la lista aparece vacía.',
    serviceTitle: 'Escrow · Contratos',
    devHint: 'npm run api:public · npm run db:seed:egs-pilot',
  },
  egs: {
    emptyTitle: 'Telemetría EGS no disponible',
    emptyDescription:
      'La consola consulta el nodo API público y el ledger EGS del entorno. Verifique el estado del servicio abajo.',
    serviceTitle: 'Efficiency Gain Share (EGS)',
    devHint: 'npm run api:public · npm run db:seed:egs-pilot',
  },
  gestion: {
    emptyTitle: 'Aún no hay telemetría publicada',
    emptyDescription:
      'El dashboard de gestión muestra solo actos en estado publicado desde el nodo institucional conectado.',
    serviceTitle: 'Gestión verificable',
    devHint: 'npm run api:public · npm run db:seed · npm run agents:flow',
  },
  proposals: {
    emptyTitle: 'Propuestas no disponibles',
    emptyDescription:
      'Las propuestas se cargan desde el nodo API público. Sin nodo activo no hay listado ni dictámenes.',
    serviceTitle: 'Participación y dictamen',
    devHint: 'npm run api:public · npm run db:seed',
  },
  supply: {
    emptyTitle: 'Inventario no disponible',
    emptyDescription: 'Los suministros agregados se publican vía API pública del nodo territorial.',
    serviceTitle: 'Suministros',
    devHint: 'npm run api:public · npm run db:seed',
  },
  projects: {
    emptyTitle: 'Proyectos no disponibles',
    emptyDescription: 'Los proyectos DAO se leen del nodo conectado. Verifique el servicio antes de continuar.',
    serviceTitle: 'Prosperidad compartida (DAO)',
    devHint: 'npm run api:public · npm run db:seed',
  },
  cne: {
    emptyTitle: 'Consulta no disponible',
    emptyDescription: 'La consulta demo requiere nodo API activo con datos seed en este entorno.',
    serviceTitle: 'Consulta ciudadana',
    devHint: 'npm run api:public · npm run db:seed',
  },
  generic: {
    emptyTitle: 'Datos no disponibles',
    emptyDescription: 'Este módulo depende del nodo API público del despliegue.',
    serviceTitle: 'Nodo AGIGOV',
    devHint: 'npm run api:public · npm run dev',
  },
};

function usesEgsCheck(module: DataModule): boolean {
  return module === 'escrow' || module === 'egs';
}

export function DataConnectionState({
  module,
  error,
  onRetry,
}: {
  module: DataModule;
  error: string;
  onRetry?: () => void;
}) {
  const kind = classifyFetchError(error);
  const copy = MODULE_COPY[module];
  const offline = kind === 'offline';
  const title = offline ? 'Nodo no alcanzable' : copy.emptyTitle;
  const onRetryRef = useRef(onRetry);
  onRetryRef.current = onRetry;

  const handleReady = (ready: boolean) => {
    if (ready) onRetryRef.current?.();
  };

  if (kind === 'server') {
    return (
      <PlatformAlert
        variant="error"
        title="El servicio no respondió"
        hint={DEV_MODE ? copy.devHint : undefined}
        action={
          onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="ds-btn-secondary ds-btn-app-shape min-h-11"
            >
              Reintentar carga
            </button>
          ) : undefined
        }
      >
        {DEV_MODE ? error : 'Inténtalo más tarde o contacta al administrador del despliegue.'}
      </PlatformAlert>
    );
  }

  return (
    <div className="space-y-6">
      <EmptyState
        kicker={offline ? 'Sin conexión al nodo' : 'Sin datos publicados aún'}
        title={title}
        description={copy.emptyDescription}
        hint={
          DEV_MODE ? (
            <details className="text-left">
              <summary className="cursor-pointer text-xs text-agigov-text-muted">
                Instrucciones para administrador (desarrollo)
              </summary>
              <p className="mt-2 font-mono text-[11px] text-agigov-text-muted">{copy.devHint}</p>
            </details>
          ) : undefined
        }
      />

      {usesEgsCheck(module) ? (
        <EgsConnectionPanel
          title={copy.serviceTitle}
          showConsoleLink={false}
          onReadyChange={handleReady}
        />
      ) : (
        <PublicApiConnectionPanel title={copy.serviceTitle} onReadyChange={handleReady} />
      )}
    </div>
  );
}

export async function verifyModuleConnection(module: DataModule): Promise<boolean> {
  if (usesEgsCheck(module)) {
    const status = await checkEgsVialService();
    return status.ready;
  }
  try {
    const health = await fetchHealth();
    return health.ok;
  } catch {
    return false;
  }
}
