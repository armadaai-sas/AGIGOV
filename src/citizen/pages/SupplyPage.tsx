import { fetchSupply } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { NetworkBanner } from '../components/NetworkBanner.js';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  LOCKED: 'Comprometido',
  RELEASED: 'Liberado',
  FROZEN: 'Congelado',
};

export default function SupplyPage() {
  const { data, error, state, lastUpdated } = useCachedFetch(
    'supply',
    fetchSupply,
  );

  return (
    <>
      <NetworkBanner state={state} lastUpdated={lastUpdated} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-white">Suministros</h1>
          <p className="mt-2 text-sm text-white/50">
            Agregados del agente Logístico — agua, energía, granos (sin PII).
          </p>
        </header>

        {error && state === 'error' ? (
          <p className="rounded border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {data ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.inventory.length === 0 ? (
              <p className="text-sm text-white/40">Sin datos de inventario.</p>
            ) : (
              data.inventory.map((item) => (
                <div
                  key={item.status}
                  className="rounded border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-mono text-xs text-tactical-cyan">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {item.totalAmount} {item.currency}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-white/40">
                    {item.count} registros
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="animate-pulse text-sm text-white/40">Cargando…</p>
        )}
      </main>
    </>
  );
}
