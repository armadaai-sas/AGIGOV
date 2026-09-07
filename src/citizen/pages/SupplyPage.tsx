import { fetchSupply } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { getDeskPageMeta } from '../platform/deskPageMeta.js';

const meta = getDeskPageMeta('/suministros')!;

export default function SupplyPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'supply',
    fetchSupply,
  );

  const fatalError = Boolean(error && state === 'error' && !data);

  return (
    <PageShell shell banner={fatalError ? undefined : { state, lastUpdated }}>
      <div className="desk-page">
        <DeskPageHeader title="Suministros" result={meta.result} dataHint={meta.dataHint} />

        {fatalError ? (
          <DataConnectionState module="supply" error={error!} onRetry={() => void reload()} />
        ) : null}

        {!data && state !== 'error' ? <LoadingState /> : null}

        {data ? (
          data.inventory.length === 0 ? (
            <EmptyState
              title="Aún no hay suministros publicados"
              description="Cuando se publiquen totales agregados, aparecerán aquí."
            />
          ) : (
            <ul className="desk-page-list">
              {data.inventory.map((item) => (
                <li key={item.status}>
                  <article className="desk-page-row">
                    <div className="desk-page-row-body">
                      <h2 className="desk-page-row-title">
                        {item.totalAmount} {item.currency}
                      </h2>
                      <p className="desk-page-row-summary">{item.count} registros agregados</p>
                    </div>
                    <div className="desk-page-row-meta">
                      <StatusBadge status={item.status} />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>
    </PageShell>
  );
}
