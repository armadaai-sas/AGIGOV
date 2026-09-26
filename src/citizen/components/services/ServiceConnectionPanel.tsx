import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, RefreshCw, Server, Database, Shield } from 'lucide-react';

import { fetchHealth } from '../../api.js';
import {
  checkEgsVialService,
  EGS_CONSOLE_PATH,
  type EgsServiceStatus,
} from '../../services/egs-vial-service.js';
import { PlatformAlert } from '../PlatformAlert.js';

const DEV_MODE = import.meta.env.DEV;

type ConnectionPanelProps = {
  title: string;
  onReadyChange?: (ready: boolean) => void;
  showConsoleLink?: boolean;
  autoVerify?: boolean;
};

/** Verifica nodo API público genérico (gestión, propuestas, DAO…). */
export function PublicApiConnectionPanel({
  title,
  onReadyChange,
  autoVerify = true,
}: Omit<ConnectionPanelProps, 'showConsoleLink'>) {
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(autoVerify);
  const onReadyRef = useRef(onReadyChange);
  onReadyRef.current = onReadyChange;

  const verify = useCallback(async () => {
    setChecking(true);
    try {
      const health = await fetchHealth();
      setApiOk(health.ok);
      onReadyRef.current?.(health.ok);
    } catch {
      setApiOk(false);
      onReadyRef.current?.(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (autoVerify) void verify();
  }, [autoVerify, verify]);

  return (
    <ConnectionPanelShell
      title={title}
      checking={checking}
      onVerify={() => void verify()}
      ready={apiOk === true}
      devHint="npm run api:public · npm run db:seed"
      rows={[
        {
          icon: Server,
          label: 'Nodo API público',
          ok: apiOk ?? undefined,
          pending: checking && apiOk === null,
          detail: apiOk ? 'Responde en este entorno' : apiOk === false ? 'No responde' : '—',
        },
      ]}
    />
  );
}

/** Verifica API + Postgres + datos EGS (custodia, consola EGS). */
export function EgsConnectionPanel({
  title,
  onReadyChange,
  showConsoleLink = true,
  autoVerify = true,
}: ConnectionPanelProps) {
  const [status, setStatus] = useState<EgsServiceStatus | null>(null);
  const [checking, setChecking] = useState(autoVerify);
  const onReadyRef = useRef(onReadyChange);
  onReadyRef.current = onReadyChange;

  const verify = useCallback(async () => {
    setChecking(true);
    try {
      const next = await checkEgsVialService();
      setStatus(next);
      onReadyRef.current?.(next.ready);
    } catch {
      const failed = {
        apiOk: false,
        postgresOk: false,
        egsDataOk: false,
        ready: false,
        checkedAt: new Date().toISOString(),
      };
      setStatus(failed);
      onReadyRef.current?.(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (autoVerify) void verify();
  }, [autoVerify, verify]);

  return (
    <ConnectionPanelShell
      title={title}
      checking={checking}
      onVerify={() => void verify()}
      ready={status?.ready ?? false}
      devHint="npm run api:public · npm run db:seed:egs-pilot"
      consoleLink={showConsoleLink ? EGS_CONSOLE_PATH : undefined}
      rows={[
        {
          icon: Server,
          label: 'Nodo API público',
          ok: status?.apiOk,
          pending: checking && !status,
          detail: status?.apiOk ? 'Responde en este entorno' : 'No responde',
        },
        {
          icon: Database,
          label: 'Registro / Postgres',
          ok: status?.postgresOk,
          pending: checking && !status,
          detail: status?.postgresOk ? 'Activo' : status?.apiOk ? 'Sin verificar' : '—',
        },
        {
          icon: Shield,
          label: 'Datos de ahorro en el registro',
          ok: status?.egsDataOk,
          pending: checking && !status,
          detail: status?.egsDataOk ? 'Contratos disponibles' : 'Sin datos publicados',
        },
      ]}
    />
  );
}

/** @deprecated Usar EgsConnectionPanel */
export function ServiceConnectionPanel(props: {
  onReadyChange?: (ready: boolean) => void;
  showConsoleLink?: boolean;
}) {
  return (
    <EgsConnectionPanel
      title="Reparto del ahorro por eficiencia"
      onReadyChange={props.onReadyChange}
      showConsoleLink={props.showConsoleLink ?? true}
    />
  );
}

function ConnectionPanelShell({
  title,
  checking,
  onVerify,
  ready,
  devHint,
  consoleLink,
  rows,
}: {
  title: string;
  checking: boolean;
  onVerify: () => void;
  ready: boolean;
  devHint: string;
  consoleLink?: string;
  rows: Array<{
    icon: typeof Server;
    label: string;
    ok?: boolean;
    pending?: boolean;
    detail: string;
  }>;
}) {
  return (
    <div className="os-panel service-connection-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
            Verificación del nodo
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-agigov-text">{title}</h2>
          <p className="mt-2 text-sm text-agigov-text-muted">
            Comprueba que el nodo responde en este entorno. Para subir documentos o conectar su
            sistema, use el espacio de trabajo del modelo.
          </p>
        </div>
        <button
          type="button"
          onClick={onVerify}
          disabled={checking}
          className="ui-btn-secondary shrink-0 min-h-11"
        >
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Verificar servicio
        </button>
      </div>

      <ul className="mt-6 space-y-3">
        {rows.map((row) => (
          <StatusRow key={row.label} {...row} />
        ))}
      </ul>

      {ready ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {consoleLink ? (
            <Link to={consoleLink} className="ui-btn-primary min-h-11">
              Abrir consola operativa
            </Link>
          ) : null}
          <p className="flex items-center gap-2 text-sm text-zinc-600">
            <CheckCircle2 className="h-4 w-4" />
            Servicio listo — recargando datos…
          </p>
        </div>
      ) : (
        <PlatformAlert
          variant="info"
          title="Servicio pendiente"
          className="mt-6"
          hint={
            DEV_MODE ? (
              <>
                Administrador del entorno:{' '}
                <code className="agigov-mono-id">{devHint}</code>
              </>
            ) : (
              'Contacte al administrador del despliegue si el servicio debería estar activo.'
            )
          }
        >
          Active el nodo API en este entorno y pulse «Verificar servicio». Los datos aparecerán
          automáticamente cuando la verificación sea exitosa.
        </PlatformAlert>
      )}
    </div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  ok,
  pending,
  detail,
}: {
  icon: typeof Server;
  label: string;
  ok?: boolean;
  pending?: boolean;
  detail: string;
}) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {pending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-zinc-400" />
      ) : ok ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-600" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-zinc-300" />
      )}
      <Icon className="h-4 w-4 shrink-0 text-agigov-text-muted" />
      <span className="min-w-[9rem] font-medium text-agigov-text">{label}</span>
      <span className="text-agigov-text-muted">{detail}</span>
    </li>
  );
}

export function EgsServiceUnavailable({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <PlatformAlert variant="info" title="El ahorro no está disponible">
        Verifique el nodo API público antes de continuar.
      </PlatformAlert>
    );
  }

  return <EgsConnectionPanel title="Reparto del ahorro por eficiencia" />;
}
