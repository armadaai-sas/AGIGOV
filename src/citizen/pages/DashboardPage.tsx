import { fetchDashboard } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { NetworkBanner } from '../components/NetworkBanner.js';

export default function DashboardPage() {
  const { data, error, state, lastUpdated } = useCachedFetch(
    'dashboard',
    fetchDashboard,
  );

  return (
    <>
      <NetworkBanner state={state} lastUpdated={lastUpdated} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Reporte de gestión
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Telemetría pública del ledger — sin datos personales.
          </p>
        </header>

        {error && state === 'error' ? (
          <p className="rounded border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {data ? (
          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3">
              <Stat label="Entradas ledger" value={String(data.ledgerEntries)} />
              <Stat label="Reportes" value={String(data.reports.length)} />
            </section>

            <section className="space-y-3">
              <h2 className="font-mono text-xs uppercase tracking-widest text-white/40">
                Publicaciones recientes
              </h2>
              {data.reports.length === 0 ? (
                <p className="text-sm text-white/40">
                  Sin reportes publicados. Ejecuta{' '}
                  <code className="text-tactical-cyan">npm run agents:flow</code>.
                </p>
              ) : (
                data.reports.map((report) => (
                  <article
                    key={report.processId}
                    className="rounded border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-mono text-[10px] text-tactical-cyan">
                      {report.processId}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {report.summary}
                    </p>
                    <p className="mt-2 font-mono text-[10px] text-white/30">
                      {new Date(report.updatedAt).toLocaleString('es-VE')}
                    </p>
                  </article>
                ))
              )}
            </section>
          </div>
        ) : (
          <p className="animate-pulse text-sm text-white/40">Cargando…</p>
        )}
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-white/5 p-4">
      <p className="font-mono text-[10px] uppercase text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
