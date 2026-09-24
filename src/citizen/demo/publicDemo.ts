import type {
  BillingCatalogResponse,
  BillingUsageResponse,
  CneConsultation,
  DashboardResponse,
  DataTrustCatalogResponse,
  DataTrustDatasetDetail,
  DataTrustPipelineResponse,
  MinistryHealthResponse,
  PilotStatus,
  ProjectItem,
  ProjectsResponse,
  ProposalsResponse,
  SupplyResponse,
} from '../api.js';
import { egsDemoHealth } from '../pages/egsDemoFixture.js';

const now = () => new Date().toISOString();

/** Datos de demostración etiquetados. No sustituyen un cierre publicado. */
export function projectsDemo(): ProjectsResponse {
  const projects = [projectAgua(), projectAula()];
  return {
    updatedAt: now(),
    summary: {
      projectCount: projects.length,
      totalRaised: '186000.0000',
      totalContributions: 42,
      currency: 'USD',
    },
    projects,
  };
}

function projectAgua(): ProjectItem {
  return {
    id: 'demo-agua-ve-a',
    title: 'Agua potable en la parroquia norte',
    sector: 'infraestructura',
    territoryCode: 'VE-A',
    targetAmount: '120000.0000',
    raisedAmount: '86000.0000',
    currency: 'USD',
    contributions: 28,
    daoApproved: true,
    funded: false,
    milestones: [
      { label: 'Diseño publicado', done: true },
      { label: 'Obra en curso', done: true },
      { label: 'Entrega verificada', done: false },
    ],
    escrow: { processId: 'proc-demo-agua', status: 'PARTIAL', amount: '86000.0000', threshold: 3 },
    updatedAt: now(),
  };
}

function projectAula(): ProjectItem {
  return {
    id: 'demo-aula-ve-b',
    title: 'Aula rural con conectividad',
    sector: 'educacion',
    territoryCode: 'VE-B',
    targetAmount: '80000.0000',
    raisedAmount: '100000.0000',
    currency: 'USD',
    contributions: 14,
    daoApproved: true,
    funded: true,
    milestones: [
      { label: 'Materiales', done: true },
      { label: 'Obra', done: true },
      { label: 'Clases iniciadas', done: true },
    ],
    escrow: { processId: 'proc-demo-aula', status: 'RELEASED', amount: '80000.0000', threshold: 3 },
    updatedAt: now(),
  };
}

export function proposalsDemo(): ProposalsResponse {
  return {
    updatedAt: now(),
    proposals: [
      {
        id: 'demo-prop-01',
        title: 'Priorizar el mantenimiento de la troncal',
        status: 'published',
        citizenSummary: 'La propuesta pide publicar el ahorro del trimestre antes de abrir obra nueva.',
        dictamen: 'CONFORME',
        updatedAt: now(),
      },
    ],
  };
}

export function supplyDemo(): SupplyResponse {
  return {
    updatedAt: now(),
    inventory: [
      { status: 'disponible', count: 12, totalAmount: '48000.0000', currency: 'USD' },
      { status: 'en tránsito', count: 3, totalAmount: '9000.0000', currency: 'USD' },
    ],
  };
}

export function dashboardDemo(): DashboardResponse {
  return {
    updatedAt: now(),
    ledgerEntries: 18,
    reports: [
      {
        processId: 'proc-demo-acta-01',
        status: 'published',
        updatedAt: now(),
        summary: 'Acta de cierre Q1 publicada y verificable.',
        metrics: { quarter: 1 },
      },
    ],
  };
}

export function cneDemo(): { updatedAt: string; consultation: CneConsultation } {
  return {
    updatedAt: now(),
    consultation: {
      id: 'demo-consulta-01',
      title: '¿Qué obra sigue en el trimestre?',
      description: 'Consulta de demostración. El recuento es verificable y no vinculante.',
      territoryCode: 'VE-A',
      phase: 'abierta',
      binding: false,
      status: 'open',
      options: [
        { id: 'agua', label: 'Agua potable', votes: 128 },
        { id: 'via', label: 'Vialidad', votes: 96 },
        { id: 'aula', label: 'Aulas', votes: 74 },
      ],
      updatedAt: now(),
      setLedger: { commitCount: 298, verifiedCount: 298, lastCommittedAt: now() },
    },
  };
}

export function pilotDemo(): PilotStatus {
  return {
    updatedAt: now(),
    processId: 'proc-demo-firma',
    ok: true,
    checks: { quorum: true, firmas: true, acta: true },
    detail: {},
  };
}

export function iaauUsageDemo(): BillingUsageResponse {
  return {
    updatedAt: now(),
    plan: 'institution',
    summary: {
      jurisdictionId: 'demo-mppi',
      period: '2026-Q1',
      byUnit: { consultas: 420, actas: 18, api: 90 },
      totalUnits: 528,
      estimatedUsdDemo: 42.5,
    },
    reconciliation: {
      ok: true,
      eventCount: 528,
      billingFrozen: false,
      billable: true,
      plan: 'institution',
    },
    invoice: {
      billable: true,
      amountUsd: 42.5,
      reason: 'Uso del trimestre, cuadrado con el registro.',
    },
    billingFreeze: { frozen: false },
    disclaimer: 'Cifra de demostración. No es una factura emitida.',
  };
}

export function iaauCatalogDemo(): BillingCatalogResponse {
  return {
    updatedAt: now(),
    plan: 'institution',
    lines: [
      { id: 'iaau-consulta', layer: 'iaau', unit: 'consultas', priceUsd: 0.04, priceNote: 'Por consulta publicada', billable: true },
      { id: 'iaau-acta', layer: 'iaau', unit: 'actas', priceUsd: 1.2, priceNote: 'Por acta verificada', billable: true },
    ],
  };
}

export function dataTrustCatalogDemo(): DataTrustCatalogResponse {
  return {
    updatedAt: now(),
    kAnonymity: 5,
    datasets: [
      {
        id: 'demo-salud',
        sector: 'salud',
        title: 'Índices agregados sector salud',
        kAnonymity: 5,
        minCellSize: 5,
        publishedAt: now(),
        sourceHash: 'demo',
        accessTier: 'public',
        metricCount: 3,
      },
    ],
  };
}

export function dataTrustDatasetDemo(id: string): DataTrustDatasetDetail {
  return {
    updatedAt: now(),
    dataset: {
      id,
      sector: 'salud',
      title: 'Índices agregados sector salud',
      kAnonymity: 5,
      minCellSize: 5,
      cells: [
        { sector: 'salud', metric: 'consultas por mil', value: 42, sampleSize: 1200 },
        { sector: 'salud', metric: 'cobertura', value: 0.81, sampleSize: 980 },
      ],
      publishedAt: now(),
      sourceHash: 'demo',
      accessTier: 'public',
    },
  };
}

export function dataTrustPipelineDemo(): DataTrustPipelineResponse {
  return {
    updatedAt: now(),
    modelId: 'data-trust',
    currentStage: 'serve',
    liveLabel: 'Informe agregado publicado',
    connection: { mode: 'demo_telemetry', label: 'Fuente de demostración', connectedAt: now() },
    run: { status: 'complete', completedAt: now(), datasetCount: 1 },
    kAnonymity: 5,
    stages: [
      { id: 'connect', label: 'Conexión', detail: 'Fuente de demostración', status: 'complete' },
      { id: 'aggregate', label: 'Agregados', detail: 'Sin datos personales', status: 'complete' },
      { id: 'publish', label: 'Publicación', detail: '1 sector listo', status: 'complete' },
    ],
    disclaimer: 'Demostración. No incluye datos personales.',
  };
}

export function ministryDemo(): MinistryHealthResponse {
  return egsDemoHealth();
}

export function publicDemoFixture(key: string): unknown | null {
  if (key === 'projects') return projectsDemo();
  if (key.startsWith('project-')) {
    const id = key.slice('project-'.length);
    const project = projectsDemo().projects.find((item) => item.id === id) ?? projectsDemo().projects[0];
    return { project: { ...project, id } };
  }
  if (key === 'proposals' || key === 'evidencia-proposals') return proposalsDemo();
  if (key === 'supply') return supplyDemo();
  if (key === 'dashboard' || key === 'evidencia-dashboard') return dashboardDemo();
  if (key === 'cne-consultation' || key === 'set-cne') return cneDemo();
  if (key === 'set-pilot') return pilotDemo();
  if (key === 'iaau-usage') return iaauUsageDemo();
  if (key === 'iaau-catalog') return iaauCatalogDemo();
  if (key === 'data-trust-catalog') return dataTrustCatalogDemo();
  if (key.startsWith('data-trust-') && key !== 'data-trust-idle') {
    return dataTrustDatasetDemo(key.slice('data-trust-'.length));
  }
  if (key === 'ministry-health' || key.startsWith('ministry-health-') || key.startsWith('evidencia-contracts-')) {
    return ministryDemo();
  }
  return null;
}

export function demoRequested(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('demo') === '1';
}

const demoKeys = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markDemoKey(key: string, on: boolean) {
  const had = demoKeys.has(key);
  if (on) demoKeys.add(key);
  else demoKeys.delete(key);
  if (had !== demoKeys.has(key)) emit();
}

export function subscribePublicDemo(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publicDemoActive() {
  return demoKeys.size > 0 || demoRequested();
}
