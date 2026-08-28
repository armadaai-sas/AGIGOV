import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import { fetchPilotStatus } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

/** Estado multifirma del despliegue. */
export function PilotStatusSection() {
  const { data, error, state } = useCachedFetch('pilot-status', fetchPilotStatus, 60_000);

  if (state === 'syncing' && !data) {
    return (
      <section className="agigov-card mb-10 border border-zinc-200">
        <p className="text-sm text-agigov-text-muted">Verificando acta multifirma…</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section id="despliegue" className="agigov-card mb-10 scroll-mt-28 border border-zinc-200">
        <h2 className="font-display text-xl font-bold text-agigov-text">Despliegue multifirma</h2>
        <p className="agigov-lead mt-2">
          Acta multifirma no verificada aún en este entorno. Contacte al operador del despliegue o
          abra el escritorio para continuar.
        </p>
        <Link to="/escritorio" className="ds-btn-secondary ds-btn-app-shape mt-4 inline-flex">
          Ir al escritorio
        </Link>
      </section>
    );
  }

  const checks = Object.entries(data.checks);
  const passed = checks.filter(([, ok]) => ok).length;

  return (
    <section id="despliegue" className="agigov-card mb-10 scroll-mt-28 border border-zinc-200">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-7 w-7 shrink-0 text-zinc-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold text-agigov-text">Despliegue multifirma verificado</h2>
          <p className="agigov-lead mt-2">
            Acta <span className="agigov-mono-id">{data.processId}</span> —{' '}
            {data.ok ? (
              <span className="text-zinc-700">verificación OK</span>
            ) : (
              <span className="text-zinc-600">pendiente de cierre</span>
            )}{' '}
            ({passed}/{checks.length} checks).
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {checks.map(([name, ok]) => (
              <li key={name} className="flex items-center gap-2 text-sm text-agigov-text-muted">
                <span
                  className={`h-2 w-2 rounded-full ${ok ? 'bg-zinc-700' : 'bg-zinc-300'}`}
                  aria-hidden
                />
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-agigov-text-muted">
            Actualizado {new Date(data.updatedAt).toLocaleString()}
          </p>
          <Link to="/desarrolladores" className="agigov-link mt-4 inline-flex text-sm">
            API <code>/api/public/pilot</code>
          </Link>
        </div>
      </div>
    </section>
  );
}
