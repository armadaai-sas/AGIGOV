import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { fetchLandingTelemetry } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

/** 2–3 métricas en hero; detalle en #telemetria (Fase F4). */
export function HeroMiniTelemetry() {
  const { data, state } = useCachedFetch('landing-telemetry', fetchLandingTelemetry, 20_000);

  const metrics = [
    { label: 'Registro', value: data ? String(data.ledgerEntries) : '—' },
    { label: 'Reportes', value: data ? String(data.reportCount) : '—' },
    { label: 'Propuestas', value: data ? String(data.proposalCount) : '—' },
  ];

  const live = state === 'synced' || state === 'offline';

  return (
    <div className="landing-hero-metrics" aria-label="Telemetría resumida">
      <div className="landing-hero-metrics-head">
        <span className={`landing-live-dot ${live ? 'landing-live-dot--on' : ''}`} aria-hidden />
        <span className="landing-hero-metrics-status">
          {state === 'synced'
            ? 'Gestión publicada'
            : state === 'offline'
              ? 'Datos en caché'
              : 'Actualizando…'}
        </span>
        <Link to="/#telemetria" className="landing-hero-metrics-link">
          Ver todo
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <div className="landing-hero-metrics-grid">
        {metrics.map(({ label, value }) => (
          <div key={label} className="landing-hero-metric">
            <p className="landing-hero-metric-label">{label}</p>
            <p className="landing-hero-metric-value">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
