import { Link } from 'react-router-dom';

import { fetchProposals } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { DictamenBadge, inferDictamen } from '../components/DictamenBadge.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

export default function ProposalsPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'proposals',
    fetchProposals,
  );

  return (
    <PageShell shell banner={{ state, lastUpdated }}>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Propuestas</h1>
            <p className="os-workspace-sub">
              Dictámenes publicados con trazabilidad en el registro.
            </p>
          </div>
          <div className="os-workspace-cta flex flex-wrap gap-2">
            <Link to={modelWorkspacePath('participacion')} className="ds-btn-secondary ds-btn-app-shape">
              Espacio participación
            </Link>
            <Link to="/participar" className="ds-btn-app">
              Enviar propuesta
            </Link>
          </div>
        </header>

        {error && state === 'error' && !data ? (
          <DataConnectionState
            module="proposals"
            error={error}
            onRetry={() => void reload()}
          />
        ) : null}

        {!data && state !== 'error' ? <LoadingState /> : null}

        {data ? (
          data.proposals.length === 0 ? (
            <EmptyState
              title="No hay propuestas publicadas"
              description="Las propuestas validadas aparecerán aquí con resumen ciudadano."
              action={
                <Link to="/participar" className="ds-btn-secondary ds-btn-app-shape">
                  Enviar propuesta
                </Link>
              }
            />
          ) : (
            <ul className="os-workspace-list">
              {data.proposals.map((p) => {
                const dictamen = p.dictamen ?? inferDictamen(p.citizenSummary);
                return (
                  <li key={p.id}>
                    <article className="os-workspace-row os-workspace-row--static flex-col items-stretch gap-2 py-3 sm:flex-row sm:items-center">
                      <span className="os-workspace-row-body w-full">
                        <span className="os-workspace-row-name">{p.title}</span>
                        <span className="os-workspace-row-meta line-clamp-2">{p.citizenSummary}</span>
                        <span className="os-mono-id mt-1 block">{p.id}</span>
                      </span>
                      <span className="flex shrink-0 flex-wrap items-center gap-2">
                        <StatusBadge status={p.status} />
                        {dictamen ? <DictamenBadge dictamen={dictamen} /> : null}
                        <time className="os-workspace-row-status" dateTime={p.updatedAt}>
                          {new Date(p.updatedAt).toLocaleDateString('es-VE')}
                        </time>
                      </span>
                    </article>
                  </li>
                );
              })}
            </ul>
          )
        ) : null}
      </div>
    </PageShell>
  );
}
