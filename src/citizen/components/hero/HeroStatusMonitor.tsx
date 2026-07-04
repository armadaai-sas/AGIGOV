import { fetchHealth, fetchLandingTelemetry } from '../../api.js';
import { useCachedFetch } from '../../hooks/useCitizenData.js';

/** Telemetría mínima — una línea, sin panel. */
export function HeroStatusMonitor() {
  const { data } = useCachedFetch('landing-telemetry', fetchLandingTelemetry, 60_000);
  const { data: health } = useCachedFetch('hero-health', fetchHealth, 60_000);

  const platformOk = health?.ok ?? data?.platformOk ?? false;
  const line = platformOk
    ? `${data?.ledgerEntries ?? '—'} entradas publicadas · ${data?.projectCount ?? '—'} proyectos`
    : 'Modo exploración';

  return (
    <p className="hero-status-ghost" aria-label="Estado de la plataforma">
      {line}
    </p>
  );
}
