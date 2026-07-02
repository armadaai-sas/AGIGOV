import { fetchProposals } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { NetworkBanner } from '../components/NetworkBanner.js';

export default function ProposalsPage() {
  const { data, error, state, lastUpdated } = useCachedFetch(
    'proposals',
    fetchProposals,
  );

  return (
    <>
      <NetworkBanner state={state} lastUpdated={lastUpdated} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-white">Propuestas y leyes</h1>
          <p className="mt-2 text-sm text-white/50">
            Resumen ciudadano del agente Soberano — lenguaje accesible.
          </p>
        </header>

        {error && state === 'error' ? (
          <p className="rounded border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {data ? (
          <ul className="space-y-3">
            {data.proposals.length === 0 ? (
              <li className="text-sm text-white/40">No hay propuestas publicadas aún.</li>
            ) : (
              data.proposals.map((p) => (
                <li
                  key={p.id}
                  className="rounded border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-mono text-[10px] text-white/40">{p.id}</p>
                  <h2 className="mt-1 font-semibold text-white">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {p.citizenSummary}
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-tactical-amber">
                    Estado: {p.status}
                  </p>
                </li>
              ))
            )}
          </ul>
        ) : (
          <p className="animate-pulse text-sm text-white/40">Cargando…</p>
        )}
      </main>
    </>
  );
}
