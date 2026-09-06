import type {
  EgsMinistryStatusResponse,
  EgsPipelineResponse,
  MinistryHealthResponse,
} from '../api.js';

/**
 * Fixture de demostración de la consola EGS (ministerio MPPI, cierre publicado).
 *
 * Se activa con `?demo=1` en `/modelos/egs/consola` y permite ver la consola
 * poblada + la ejecución interactiva del pipeline en cualquier despliegue
 * (local o droplet) sin sembrar la base de datos. Es dato **demostrativo**,
 * claramente etiquetado en la UI; no representa telemetría publicada real.
 */

const nowIso = () => new Date().toISOString();

export function egsDemoHealth(): MinistryHealthResponse {
  return {
    updatedAt: nowIso(),
    available: true,
    ministryCode: 'MPPI',
    programName: 'Vialidad territorial',
    fiscalYear: 2026,
    quarter: 1,
    quarterCloseStatus: 'PUBLISHED',
    reconcileOk: true,
    discrepancies: [],
    baselineTrimestral: '1200000.0000',
    gastosVerificados: '900000.0000',
    calculoAhorroFinal: '300000.0000',
    currency: 'USD',
    executionPct: 75,
    escrowExecutionPct: 80,
    split: { reinversion: '210000.0000', meritPool: '60000.0000', agigovFee: '30000.0000' },
    feeShare: {
      modelId: 'egs',
      publisherId: 'agigov',
      feeAmount: '30000.0000',
      builderAmount: '21000.0000',
      protocolAmount: '9000.0000',
      reserveAmount: '0.0000',
    },
    releaseCount: 3,
    contracts: [
      {
        id: 'proc-escrow-mppi-troncal-01',
        title: 'Rehabilitación Troncal 01',
        territoryCode: 'VE-A',
        totalAmount: '500000.0000',
        spentAmount: '380000.0000',
        status: 'ok',
        milestonesTotal: 5,
        milestonesReleased: 4,
        escrowStatus: 'RELEASED',
      },
      {
        id: 'proc-escrow-mppi-puente-02',
        title: 'Puente vehicular Sector 02',
        territoryCode: 'VE-B',
        totalAmount: '400000.0000',
        spentAmount: '260000.0000',
        status: 'partial',
        milestonesTotal: 4,
        milestonesReleased: 2,
        escrowStatus: 'PARTIAL',
      },
    ],
    treasuryPayload: {
      baseline: '1200000.0000',
      gastos: '900000.0000',
      delta: '300000.0000',
      currency: 'USD',
      ledgerProcessId: 'proc-qclose-mppi-2026-q1',
    },
    ledgerProcessId: 'proc-qclose-mppi-2026-q1',
    published: true,
    pilotBanner: 'Piloto fiscal EGS — datos demostrativos',
  };
}

export function egsDemoStatus(): EgsMinistryStatusResponse {
  return {
    updatedAt: nowIso(),
    ministryCode: 'MPPI',
    estadoConsola: 'PUBLICADO',
    semaphore: 'green',
    blockReason: null,
    tenantSlug: 'mppi-vial',
    primaryAction: {
      id: 'view_citizen_telemetry',
      label: 'Ver telemetría ciudadana',
      enabled: true,
      href: '/gestion',
    },
    secondaryActions: [
      { id: 'share_public', label: 'Compartir enlace público', href: '/gestion' },
      { id: 'review_contracts', label: 'Revisar contratos', href: '#egs-contratos' },
    ],
    result: {
      delta: '300000.0000',
      reinversion70: '210000.0000',
      meritPool: '60000.0000',
      agigovFee: '30000.0000',
      currency: 'USD',
      quarter: 1,
      fiscalYear: 2026,
    },
  };
}

export function egsDemoPipeline(): EgsPipelineResponse {
  return {
    updatedAt: nowIso(),
    modelId: 'egs',
    currentStage: 'serve',
    liveLabel: 'Telemetría fiscal publicada — consola en vivo',
    connection: {
      mode: 'pilot_read',
      ministryCode: 'MPPI',
      label: 'Lectura piloto MPPI',
      connectedAt: nowIso(),
    },
    ministryCode: 'MPPI',
    tenantSlug: 'mppi-vial',
    onboardingStatus: 'ingest_ready',
    quarterCloseStatus: 'PUBLISHED',
    reconcileOk: true,
    discrepancies: [],
    releaseCount: 3,
    published: true,
    ledgerProcessId: 'proc-qclose-mppi-2026-q1',
    swarm: {
      centinela: 'complete',
      logistico: 'complete',
      soberano: 'complete',
      comunicador: 'complete',
      iapWired: false,
      lastAgentId: 'comunicador',
    },
    stages: [
      { id: 'provision', label: 'Provisionar', detail: 'Tenant mppi-vial activo', status: 'complete', agent: 'ops', agentLabel: 'Operaciones' },
      { id: 'baseline', label: 'Acta baseline', detail: 'Multi-sig ratificado — ingest_ready', status: 'complete', agent: 'institution', agentLabel: 'Institución' },
      { id: 'ingest', label: 'Ingesta hitos', detail: '3 hitos verificados', status: 'complete', agent: 'human', agentLabel: 'Operador ministerio' },
      { id: 'reconcile', label: 'Reconciliar', detail: 'Custodia escrow coherente', status: 'complete', agent: 'centinela', agentLabel: 'Centinela' },
      { id: 'delta', label: 'Cálculo Δ', detail: 'Δ = 300000.0000', status: 'complete', agent: 'logistico', agentLabel: 'Logístico' },
      { id: 'sovereign', label: 'Dictamen reparto', detail: 'SPLIT_APPROVED + tesorería webhook', status: 'blocked', agent: 'soberano', agentLabel: 'Soberano' },
      { id: 'publish', label: 'Publicar', detail: 'Checkpoint comunicador published', status: 'complete', agent: 'comunicador', agentLabel: 'Comunicador' },
      { id: 'serve', label: 'Consola ciudadana', detail: '2 contratos · Q1 2026', status: 'complete', agent: 'comunicador', agentLabel: 'Comunicador' },
    ],
    disclaimer:
      'Datos demostrativos (modo demo). El pipeline real corre sobre Postgres; el enrutado IAP MQTT de Q-close está en roadmap.',
  };
}
