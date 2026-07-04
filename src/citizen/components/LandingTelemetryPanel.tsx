import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';

import { fetchLandingTelemetry, type LandingTelemetry } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { MicroLesson } from './MicroLesson.js';

const METRIC_LESSONS: Record<string, string> = {
  Registro: 'Ledger inmutable: cada decisión publicada queda firmada y trazable.',
  Reportes: 'Resúmenes de gestión ya validados por centinela — sin datos personales.',
  Propuestas: 'Iniciativas ciudadanas con hechos verificables en el pipeline.',
  Proyectos: 'Economía DAO con fondos en escrow programático.',
  Carta: 'Marco institucional ratificado o en curso de adopción.',
  Plataforma: 'Estado técnico del nodo y servicios públicos.',
};

function formatTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LandingTelemetryPanel() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'landing-telemetry',
    fetchLandingTelemetry,
    20_000,
  );

  return (
    <section id="telemetria" className="landing-section landing-section--telemetry scroll-mt-24">
      <div className="landing-section-head landing-section-head--left">
        <p className="landing-section-kicker">Gestión publicada</p>
        <h2 className="landing-section-title">Telemetría en vivo</h2>
        <p className="landing-section-lead mx-0 max-w-none text-left">
          Decisiones registradas de forma inmutable — sin datos personales. Solo evidencia ya
          validada y publicada.{' '}
          <Link to="/aprender/glosario" className="text-sky-400/90 underline-offset-2 hover:underline">
            Glosario
          </Link>
        </p>
      </div>

      <div className="landing-console">
        <div className="landing-console-head">
          <div className="landing-console-status">
            <span
              className={`landing-live-dot ${state === 'synced' ? 'landing-live-dot--on' : ''}`}
              aria-hidden
            />
            <span>
              {state === 'synced'
                ? 'Conectado a la plataforma'
                : state === 'syncing'
                  ? 'Actualizando…'
                  : state === 'offline'
                    ? 'Modo sin conexión (caché)'
                    : 'Plataforma no disponible'}
            </span>
          </div>
          <button
            type="button"
            className="landing-console-refresh"
            onClick={() => void reload()}
            aria-label="Actualizar telemetría"
          >
            <RefreshCw className={`h-4 w-4 ${state === 'syncing' ? 'animate-spin' : ''}`} />
            {formatTime(lastUpdated)}
          </button>
        </div>

        {error && state === 'error' ? (
          <div className="landing-console-offline">
            <p>Inicia la API pública para ver datos reales:</p>
            <code className="landing-console-code">npm run api:public</code>
          </div>
        ) : null}

        <TelemetryMetrics data={data} />

        {data && data.recentReports.length > 0 ? (
          <div className="landing-feed">
            <p className="landing-feed-label">Últimas publicaciones</p>
            <ul>
              {data.recentReports.map((r) => (
                <li key={r.processId}>
                  <Link
                    to={`/gestion#report-${r.processId}`}
                    className="landing-feed-link"
                  >
                    <span className="landing-feed-summary">{r.summary}</span>
                    <time dateTime={r.updatedAt}>
                      {new Date(r.updatedAt).toLocaleDateString('es-VE')}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="landing-console-foot">
          <Link to="/gestion" className="landing-link">
            Abrir gestión completa
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to="/#acceso" className="ds-btn-secondary ds-btn-sm">
            Elegir cómo entrar
          </Link>
        </div>
      </div>
    </section>
  );
}

function TelemetryMetrics({ data }: { data: LandingTelemetry | null }) {
  const metrics = [
    {
      label: 'Registro',
      value: data ? String(data.ledgerEntries) : '—',
      hint: 'Decisiones inmutables',
    },
    {
      label: 'Reportes',
      value: data ? String(data.reportCount) : '—',
      hint: 'Gestión publicada',
    },
    {
      label: 'Propuestas',
      value: data ? String(data.proposalCount) : '—',
      hint: 'Ciudadanas',
    },
    {
      label: 'Proyectos',
      value: data ? String(data.projectCount) : '—',
      hint: 'Economía DAO',
    },
    {
      label: 'Carta',
      value: data ? (data.cartaRatified ? 'Ratificada' : 'En curso') : '—',
      hint: 'Marco institucional',
    },
    {
      label: 'Plataforma',
      value: data ? (data.platformOk ? 'Operativa' : 'Revisar') : '—',
      hint: 'Estado técnico',
    },
  ];

  return (
    <div className="landing-metric-grid" role="list" aria-label="Métricas publicadas">
      {metrics.map(({ label, value, hint }) => (
        <div key={label} className="landing-metric" role="listitem">
          <p className="landing-metric-label">
            {label}
            {METRIC_LESSONS[label] ? (
              <MicroLesson term={label}>{METRIC_LESSONS[label]}</MicroLesson>
            ) : null}
          </p>
          <p className="landing-metric-value">{value}</p>
          <p className="landing-metric-hint">{hint}</p>
        </div>
      ))}
    </div>
  );
}
