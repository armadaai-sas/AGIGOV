import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { fetchProposals } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { DictamenBadge, inferDictamen } from '../components/DictamenBadge.js';
import { getDeskPageMeta, humanizeDeskTitle } from '../platform/deskPageMeta.js';

const meta = getDeskPageMeta('/propuestas')!;

export default function ProposalsPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'proposals',
    fetchProposals,
  );

  return (
    <PageShell shell banner={{ state, lastUpdated }}>
      <div className="desk-page">
        <DeskPageHeader
          title="Dictámenes"
          result={meta.result}
          dataHint={meta.dataHint}
          action={
            <Link to="/participar" className="desk-page-primary-btn">
              Enviar propuesta
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />

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
              title="No hay dictámenes publicados"
              description="Las propuestas validadas aparecerán aquí con resumen ciudadano."
              action={
                <Link to="/participar" className="desk-page-primary-btn">
                  Enviar propuesta
                </Link>
              }
            />
          ) : (
            <ul className="desk-page-list">
              {data.proposals.map((p) => {
                const dictamen = p.dictamen ?? inferDictamen(p.citizenSummary);
                return (
                  <li key={p.id}>
                    <article className="desk-page-row">
                      <div className="desk-page-row-body">
                        <h2 className="desk-page-row-title">{humanizeDeskTitle(p.title)}</h2>
                        <p className="desk-page-row-summary">{p.citizenSummary}</p>
                      </div>
                      <div className="desk-page-row-meta">
                        {dictamen ? <DictamenBadge dictamen={dictamen} /> : null}
                        <StatusBadge status={p.status} />
                        <time dateTime={p.updatedAt}>
                          {new Date(p.updatedAt).toLocaleDateString('es-VE')}
                        </time>
                      </div>
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
