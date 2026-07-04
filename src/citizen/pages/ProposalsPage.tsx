import { Link } from 'react-router-dom';

import { fetchProposals } from '../api.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import {
  PageShell,
  SectionHeader,
  ErrorState,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { DictamenBadge, inferDictamen } from '../components/DictamenBadge.js';

export default function ProposalsPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'proposals',
    fetchProposals,
  );

  return (
    <PageShell banner={{ state, lastUpdated }} breadcrumbs={breadcrumbsForPath('/propuestas')}>
      <SectionHeader
        eyebrow="AGIGOV · Participación y Dictamen"
        title="Propuestas y dictámenes"
        lead="Resumen ciudadano del agente Soberano — lenguaje accesible con trazabilidad en ledger."
        helpTopic="propuestas"
      />

      {error && state === 'error' ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : null}

      {!data && state !== 'error' ? <LoadingState /> : null}

      {data ? (
        <ul className="space-y-4 agigov-stagger-list">
          {data.proposals.length === 0 ? (
            <li>
              <EmptyState
                title="No hay propuestas publicadas"
                description="Las propuestas validadas por el pipeline aparecerán aquí con resumen ciudadano y trazabilidad en ledger."
                action={
                  <Link to="/participar" className="ds-btn-secondary ds-btn-app-shape">
                    Enviar propuesta
                  </Link>
                }
              />
            </li>
          ) : (
            data.proposals.map((p) => {
              const dictamen = p.dictamen ?? inferDictamen(p.citizenSummary);
              return (
              <li key={p.id} className="agigov-card agigov-card-interactive">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={p.status} />
                  {dictamen ? <DictamenBadge dictamen={dictamen} /> : null}
                  <span className="agigov-mono-id">{p.id}</span>
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold text-agigov-text">
                  {p.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-agigov-text-muted">
                  {p.citizenSummary}
                </p>
                <p className="mt-3 text-xs text-agigov-text-muted/70">
                  {new Date(p.updatedAt).toLocaleString('es-VE')}
                </p>
              </li>
              );
            })
          )}
        </ul>
      ) : null}
    </PageShell>
  );
}
