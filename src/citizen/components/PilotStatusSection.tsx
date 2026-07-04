import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import { fetchPilotStatus } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

/** Estado multi-sig del despliegue demo (Paso 10). */
export function PilotStatusSection() {
  const { data, error, state } = useCachedFetch('pilot-status', fetchPilotStatus, 60_000);

  if (state === 'syncing' && !data) {
    return (
      <section className="agigov-card mb-10 border border-white/[0.06]">
        <p className="text-sm text-agigov-text-muted">Verificando acta multi-sig…</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section id="despliegue" className="agigov-card mb-10 scroll-mt-28 border border-amber-500/20">
        <h2 className="font-display text-xl font-bold text-agigov-text">Despliegue multi-sig</h2>
        <p className="agigov-lead mt-2">
          Acta multi-sig no verificada aún. Ejecuta{' '}
          <code className="text-sky-300">npm run pilot:init && pilot:ratify && pilot:verify</code>.
        </p>
      </section>
    );
  }

  const checks = Object.entries(data.checks);
  const passed = checks.filter(([, ok]) => ok).length;

  return (
    <section id="despliegue" className="agigov-card mb-10 scroll-mt-28 border border-emerald-500/15">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold text-agigov-text">Despliegue multi-sig verificado</h2>
          <p className="agigov-lead mt-2">
            Acta <span className="agigov-mono-id">{data.processId}</span> —{' '}
            {data.ok ? (
              <span className="text-emerald-300">verificación OK</span>
            ) : (
              <span className="text-amber-300">pendiente de cierre</span>
            )}{' '}
            ({passed}/{checks.length} checks).
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {checks.map(([name, ok]) => (
              <li key={name} className="flex items-center gap-2 text-sm text-agigov-text-muted">
                <span
                  className={`h-2 w-2 rounded-full ${ok ? 'bg-emerald-400' : 'bg-amber-400'}`}
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
