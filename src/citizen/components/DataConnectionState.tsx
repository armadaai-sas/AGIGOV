import { useEffect, useRef } from 'react';

import { fetchHealth } from '../api.js';
import { checkEgsVialService } from '../services/egs-vial-service.js';
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
      'Cuando el ministerio publique contratos con hitos verificables, aparecerán aquí.',
    serviceTitle: 'Contratos',
    devHint: 'npm run api:public · npm run db:seed:egs-pilot',
  },
  egs: {
    emptyTitle: 'Consola no disponible',
    emptyDescription:
      'No pudimos cargar la salud presupuestaria. Reintenta o vuelve más tarde.',
    serviceTitle: 'Consola EGS',
    devHint: 'npm run api:public · npm run db:seed:egs-pilot',
  },
  gestion: {
    emptyTitle: 'Aún no hay información publicada',
    emptyDescription:
      'Cuando la institución publique actos verificables, aparecerán aquí automáticamente.',
    serviceTitle: 'Gestión pública',
    devHint: 'npm run api:public · npm run db:seed · npm run agents:flow',
  },
  proposals: {
    emptyTitle: 'Propuestas no disponibles',
    emptyDescription: 'No hay listado de propuestas en este momento. Reintenta en unos minutos.',
    serviceTitle: 'Propuestas',
    devHint: 'npm run api:public · npm run db:seed',
  },
  supply: {
    emptyTitle: 'Inventario no disponible',
    emptyDescription: 'Los suministros aparecerán cuando el nodo publique datos agregados.',
    serviceTitle: 'Suministros',
    devHint: 'npm run api:public · npm run db:seed',
  },
  projects: {
    emptyTitle: 'Proyectos no disponibles',
    emptyDescription: 'Los proyectos aparecerán cuando estén publicados en este entorno.',
    serviceTitle: 'Proyectos',
    devHint: 'npm run api:public · npm run db:seed',
  },
  cne: {
    emptyTitle: 'Consulta no disponible',
    emptyDescription: 'La consulta ciudadana no está activa en este momento.',
    serviceTitle: 'Consulta ciudadana',
    devHint: 'npm run api:public · npm run db:seed',
  },
  generic: {
    emptyTitle: 'Datos no disponibles',
    emptyDescription: 'Este módulo no responde ahora. Reintenta o contacta soporte.',
    serviceTitle: 'AGIGOV',
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
    <div className="space-y-8">
      <div className="max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-agigov-text-subtle">
          {offline ? 'Sin conexión al nodo' : 'Sin datos publicados aún'}
        </p>
        <h2 className="mt-1.5 text-lg font-semibold text-agigov-text">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-agigov-text-muted">
          {copy.emptyDescription}
        </p>
        {DEV_MODE ? (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-agigov-text-muted">
              Instrucciones para administrador (desarrollo)
            </summary>
            <p className="mt-2 font-mono text-[11px] text-agigov-text-muted">{copy.devHint}</p>
          </details>
        ) : null}
      </div>

      {DEV_MODE ? (
        usesEgsCheck(module) ? (
          <EgsConnectionPanel
            title={copy.serviceTitle}
            showConsoleLink={false}
            onReadyChange={handleReady}
          />
        ) : (
          <PublicApiConnectionPanel title={copy.serviceTitle} onReadyChange={handleReady} />
        )
      ) : (
        <AutoRetryOnMount onRetry={onRetryRef.current} />
      )}
    </div>
  );
}

/**
 * En producción el ciudadano no ve el panel de diagnóstico del operador.
 * Reintentamos silenciosamente la carga en segundo plano para que, si el
 * servicio vuelve, los datos aparezcan sin acción del usuario.
 */
function AutoRetryOnMount({ onRetry }: { onRetry?: () => void }) {
  useEffect(() => {
    if (!onRetry) return;
    const id = window.setInterval(onRetry, 20000);
    return () => window.clearInterval(id);
  }, [onRetry]);
  return null;
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
