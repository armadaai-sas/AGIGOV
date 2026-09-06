import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { fetchCneConsultation, fetchPilotStatus } from '../api.js';
import { ModelConsoleHeader } from '../components/models/ModelConsoleHeader.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

/** Consola SET — recuento verificable y estado del despliegue electoral. */
export default function SetConsolePage() {
  const cne = useCachedFetch('set-cne', fetchCneConsultation, 15_000);
  const pilot = useCachedFetch('set-pilot', fetchPilotStatus, 60_000);

  const cneFatal = Boolean(cne.error && cne.state === 'error' && !cne.data);

  return (
    <PageShell shell banner={cneFatal ? undefined : { state: cne.state, lastUpdated: cne.lastUpdated }}>
      <div className="os-workspace">
        <ModelConsoleHeader
          modelId="set"
          title="Recuento y auditoría"
          subtitle="Consulta activa, commits en registro y verificación multifirma."
        >
          <Link to="/cne" className="ds-btn-app">
            Emitir voto
          </Link>
        </ModelConsoleHeader>

        {cneFatal ? (
          <DataConnectionState module="cne" error={cne.error!} onRetry={() => void cne.reload()} />
        ) : null}

        {!cne.data && cne.state !== 'error' ? <LoadingState label="Cargando consulta…" /> : null}

        {cne.data?.consultation ? (
          <>
            <section className="os-panel">
              <h2 className="text-[13px] font-semibold text-zinc-900">
                {cne.data.consultation.title}
              </h2>
              <p className="mt-2 text-[13px] text-zinc-600">{cne.data.consultation.description}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-zinc-500">Votos emitidos</dt>
                  <dd className="text-lg font-semibold text-zinc-900">
                    {cne.data.consultation.options.reduce((sum, o) => sum + o.votes, 0)}
                  </dd>
                </div>
                {cne.data.consultation.setLedger ? (
                  <>
                    <div>
                      <dt className="text-xs text-zinc-500">Commits registro</dt>
                      <dd className="text-lg font-semibold text-zinc-900">
                        {cne.data.consultation.setLedger.commitCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">Verificados</dt>
                      <dd className="text-lg font-semibold text-zinc-900">
                        {cne.data.consultation.setLedger.verifiedCount}
                      </dd>
                    </div>
                  </>
                ) : null}
              </dl>
            </section>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Resultados parciales</h2>
              <ul className="os-workspace-list">
                {cne.data.consultation.options.map((opt) => (
                  <li key={opt.id}>
                    <div className="os-workspace-row os-workspace-row--static">
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">{opt.label}</span>
                      </span>
                      <span className="os-workspace-row-status">{opt.votes} votos</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/cne" className="os-btn-text mt-2 inline-flex items-center gap-1 text-[13px]">
                Participar en consulta
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>
          </>
        ) : null}

        {pilot.data ? (
          <section className="os-workspace-section os-workspace-section--border">
            <h2 className="os-workspace-section-title">Despliegue multifirma</h2>
            <p className="text-[13px] text-zinc-600">
              Acta <code className="os-mono-id">{pilot.data.processId}</code> —{' '}
              {pilot.data.ok ? 'verificación OK' : 'pendiente de cierre'}
            </p>
            <ul className="mt-3 space-y-1.5">
              {Object.entries(pilot.data.checks).map(([name, ok]) => (
                <li key={name} className="flex items-center gap-2 text-[13px] text-zinc-600">
                  <span
                    className={`h-2 w-2 rounded-full ${ok ? 'bg-zinc-700' : 'bg-zinc-300'}`}
                    aria-hidden
                  />
                  {name}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
