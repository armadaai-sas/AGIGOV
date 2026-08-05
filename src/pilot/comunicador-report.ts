/**
 * Comunicador — informe ciudadano agregado (sin PII).
 */
import { getCoreDb } from '../db/client.js';
import { isPanicMode } from '../security/panic.js';
import { getBillingFreeze } from '../billing/freeze.js';
import { listPublicProjects } from './projects-public.js';
import { readFederationInbox } from './federation-inbox.js';
import { assessPqcReadiness } from '../security/pqc-guardian.js';

export type ComunicadorReport = {
  updatedAt: string;
  headline: string;
  citizenSummary: string;
  metrics: {
    publishedReports: number;
    ledgerEntries: number;
    publicProjects: number;
    totalContributions: number;
    federationMirrors: number;
    panicMode: boolean;
    billingFrozen: boolean;
    pqcMode: string;
  };
  recent: Array<{ processId: string; summary: string; updatedAt: string }>;
  policy20: Array<{ label: string; traditional: string; agigov: string }>;
};

export async function buildComunicadorReport(): Promise<ComunicadorReport> {
  const db = getCoreDb();
  const published = await db.processCheckpoint.findMany({
    where: { status: 'published' },
    orderBy: { updatedAt: 'desc' },
    take: 12,
  });
  const ledgerEntries = await db.ledgerEntry.count();
  const projects = await listPublicProjects();
  const contributions = projects.reduce((s, p) => s + p.contributions, 0);
  const panicMode = isPanicMode();
  const billing = getBillingFreeze();
  const pqc = assessPqcReadiness();

  const recent = published.map((row) => {
    const bundle = row.evidenceBundle as Record<string, unknown>;
    const metrics = (bundle.publicMetrics ?? {}) as Record<string, unknown>;
    let summary = 'Gestión publicada';
    if (typeof metrics.summary === 'string') summary = metrics.summary;
    else if (bundle.cartaRatification) summary = 'Carta / adhesión ratificada';
    else if (bundle.pilotRatification) summary = 'Piloto nacional ratificado';
    else if (bundle.sandboxAdhesion) summary = 'Adhesión sandbox en red';
    else if (bundle.publicProject) summary = `Proyecto: ${String((bundle.publicProject as { title?: string }).title ?? row.processId)}`;
    return {
      processId: row.processId,
      summary,
      updatedAt: row.updatedAt.toISOString(),
    };
  });

  const headline = panicMode
    ? 'Sistema en FREEZE — centinela protege el ledger'
    : published.length > 0
      ? 'Gestión verificable publicada para la ciudadanía'
      : 'Telemetría lista — esperando primeras publicaciones';

  const citizenSummary = panicMode
    ? 'Hay una alerta de integridad activa. No se publican nuevas cifras oficiales hasta revisión humana.'
    : `Hay ${published.length} reportes publicados y ${ledgerEntries} entradas en el ledger. Los aportes y proyectos visibles no incluyen datos personales.`;

  return {
    updatedAt: new Date().toISOString(),
    headline,
    citizenSummary,
    metrics: {
      publishedReports: published.length,
      ledgerEntries,
      publicProjects: projects.length,
      totalContributions: contributions,
      federationMirrors: readFederationInbox().length,
      panicMode,
      billingFrozen: billing.frozen,
      pqcMode: pqc.mode,
    },
    recent,
    policy20: [
      {
        label: 'Evidencia de gestión',
        traditional: 'Informes tardíos / opacos',
        agigov: `${published.length} publicaciones en ledger`,
      },
      {
        label: 'Trazabilidad',
        traditional: 'Fragmentada',
        agigov: `${ledgerEntries} entradas verificables`,
      },
      {
        label: 'Participación económica',
        traditional: 'Sin recibo público',
        agigov: `${contributions} aportes agregados`,
      },
      {
        label: 'Anomalías',
        traditional: 'Respuesta manual lenta',
        agigov: panicMode ? 'FREEZE activo' : 'Centinela operativo',
      },
      {
        label: 'Post-cuántica',
        traditional: 'No planificada',
        agigov: pqc.hybridClaimAllowed
          ? 'Híbrido activo'
          : `Inventario listo (${pqc.mode}) — sin claim productivo falso`,
      },
    ],
  };
}
