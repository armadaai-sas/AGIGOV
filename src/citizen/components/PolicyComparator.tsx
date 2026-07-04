import { useMemo } from 'react';

import {
  fetchDashboard,
  fetchHealth,
  fetchProjects,
  fetchProposals,
} from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

type Row = { label: string; v1: string; v2: string };

/** Comparador Política 1.0 vs 2.0 (Paso 11). */
export function PolicyComparator() {
  const { data: dashboard } = useCachedFetch('policy-dashboard', fetchDashboard, 30_000);
  const { data: projects } = useCachedFetch('policy-projects', fetchProjects, 30_000);
  const { data: proposals } = useCachedFetch('policy-proposals', fetchProposals, 30_000);
  const { data: health } = useCachedFetch('policy-health', fetchHealth, 30_000);

  const rows: Row[] = useMemo(() => {
    const ledger = dashboard?.ledgerEntries ?? 0;
    const reports = dashboard?.reports.length ?? 0;
    const contributions = projects?.summary.totalContributions ?? 0;
    const proposalsCount = proposals?.proposals.length ?? 0;
    const platformOk = health?.ok ?? false;

    return [
      {
        label: 'Presupuesto / gestión visible',
        v1: 'Parcial, opaco',
        v2: reports > 0 ? `${reports} reportes publicados` : 'Telemetría en curso',
      },
      {
        label: 'Trazabilidad ledger',
        v1: 'No unificada',
        v2: ledger > 0 ? `${ledger} entradas verificables` : 'Piloto iniciando',
      },
      {
        label: 'Aportes ciudadanos trazados',
        v1: 'Sin recibo público',
        v2: contributions > 0 ? `${contributions} aportes agregados` : '0 (demo listo)',
      },
      {
        label: 'Propuestas con dictamen',
        v1: 'Opaco / lento',
        v2: proposalsCount > 0 ? `${proposalsCount} en pipeline` : 'Envía desde Participar',
      },
      {
        label: 'Respuesta ante anomalías',
        v1: 'Manual, tardía',
        v2: health?.panicMode ? 'FREEZE activo (centinela)' : platformOk ? 'Centinela operativo' : 'Revisar API',
      },
      {
        label: 'Tiempo publicación → ciudadano',
        v1: 'Semanas–meses',
        v2: '< 5 min (pipeline demo)',
      },
    ];
  }, [dashboard, projects, proposals, health]);

  return (
    <section id="comparador" className="agigov-card mb-10 scroll-mt-28">
      <h2 className="font-display text-xl font-bold text-agigov-text">
        Política 1.0 vs Gobernanza 2.0
      </h2>
      <p className="agigov-lead mt-2">
        Métricas lado a lado — modelo tradicional vs AGIGOV verificable (datos vivos cuando la API está activa).
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.06]">
        <table className="agigov-dev-table">
          <thead>
            <tr>
              <th>Métrica</th>
              <th>Política 1.0</th>
              <th>Gobernanza 2.0 (AGIGOV)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, v1, v2 }) => (
              <tr key={label}>
                <td className="font-medium text-agigov-text">{label}</td>
                <td className="text-agigov-text-muted">{v1}</td>
                <td className="text-sky-200/90">{v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
