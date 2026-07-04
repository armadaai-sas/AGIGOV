import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, RefreshCw, Server, Database, Shield } from 'lucide-react';

import {
  checkEgsVialService,
  EGS_CONSOLE_PATH,
  type EgsServiceStatus,
} from '../../services/egs-vial-service.js';

const DEV_MODE = import.meta.env.DEV;

export function ServiceConnectionPanel({
  onReadyChange,
  showConsoleLink = true,
}: {
  onReadyChange?: (ready: boolean) => void;
  showConsoleLink?: boolean;
}) {
  const [status, setStatus] = useState<EgsServiceStatus | null>(null);
  const [checking, setChecking] = useState(true);

  const verify = useCallback(async () => {
    setChecking(true);
    try {
      const next = await checkEgsVialService();
      setStatus(next);
      onReadyChange?.(next.ready);
    } catch {
      setStatus({
        apiOk: false,
        postgresOk: false,
        egsDataOk: false,
        ready: false,
        checkedAt: new Date().toISOString(),
      });
      onReadyChange?.(false);
    } finally {
      setChecking(false);
    }
  }, [onReadyChange]);

  useEffect(() => {
    void verify();
  }, [verify]);

  return (
    <div className="agigov-card service-connection-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
            Estado del servicio
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-agigov-text">
            Efficiency Gain Share (EGS)
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void verify()}
          disabled={checking}
          className="ui-btn-secondary shrink-0"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Verificar conexión
        </button>
      </div>

      <ul className="mt-6 space-y-3">
        <StatusRow
          icon={Server}
          label="Nodo API público"
          ok={status?.apiOk}
          pending={checking && !status}
          detail={status?.apiOk ? 'Conectado' : 'No disponible'}
        />
        <StatusRow
          icon={Database}
          label="Ledger / Postgres"
          ok={status?.postgresOk}
          pending={checking && !status}
          detail={
            status?.postgresOk ? 'Activo' : status?.apiOk ? 'Sin verificar' : '—'
          }
        />
        <StatusRow
          icon={Shield}
          label="Datos EGS en ledger"
          ok={status?.egsDataOk}
          pending={checking && !status}
          detail={status?.egsDataOk ? 'Operativo' : 'Requiere activación del nodo'}
        />
      </ul>

      {status?.ready ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {showConsoleLink ? (
            <Link to={EGS_CONSOLE_PATH} className="ui-btn-primary">
              Abrir consola operativa
            </Link>
          ) : null}
          <p className="flex items-center gap-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Servicio listo para uso
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium">Servicio no conectado</p>
          <p className="mt-1 text-amber-200/90">
            El nodo de demostración no responde o aún no está activado en este entorno. Contacte al
            administrador del despliegue o reintente la verificación.
          </p>
          {DEV_MODE ? (
            <p className="mt-3 text-xs text-amber-200/70">
              Modo desarrollo:{' '}
              <code className="agigov-mono-id">npm run api:public</code>
              {' · '}
              <code className="agigov-mono-id">npm run db:seed:egs-pilot</code>
            </p>
          ) : null}
        </div>
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
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-sky-400" />
      ) : ok ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-white/25" />
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
      <div className="agigov-empty-state" role="status">
        <p className="agigov-empty-state-kicker">Servicio no disponible</p>
        <p className="font-display text-lg font-semibold text-agigov-text">
          Consola EGS temporalmente inaccesible
        </p>
        <p className="agigov-lead mx-auto mt-2 max-w-md">
          Verifique la conexión con el nodo de demostración antes de continuar.
        </p>
      </div>
    );
  }

  return <ServiceConnectionPanel />;
}
