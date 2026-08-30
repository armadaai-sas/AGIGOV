/**
 * DATA Trust — estado de conexión y pipeline en vivo (P2 demo honesto).
 *
 * Proceso real implementado hoy:
 *   conectar fuente → celdas demo → k-anonymity → agrupar sector → hash → catálogo JSON → API GET
 *
 * Roadmap (etapas blocked en respuesta): ingest institucional, auditoría centinela, licencia enterprise.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  enforceKAnonymity,
  getPublishedDatasets,
  type AggregatedCell,
  type AggregatedDataset,
} from './aggregation.js';
import { payloadHash } from '../db/sync/conflicts.js';

const DATA_DIR = join(process.cwd(), 'data');
const STATE_PATH = join(DATA_DIR, 'data-trust-pipeline-state.json');
const CATALOG_PATH = join(DATA_DIR, 'data-trust-catalog.json');

export type DataTrustConnectMode = 'demo_telemetry' | 'api_endpoint' | 'institutional';

export type DataTrustPipelineStageId =
  | 'select'
  | 'connect'
  | 'ingest'
  | 'k_anonymity'
  | 'aggregate'
  | 'audit'
  | 'publish'
  | 'serve';

export type DataTrustStageStatus = 'pending' | 'active' | 'complete' | 'skipped' | 'blocked';

export interface DataTrustConnection {
  mode: DataTrustConnectMode;
  label: string;
  connectedAt: string;
  /** Solo api_endpoint — URL declarada (no se valida red en demo). */
  endpoint?: string;
}

export interface DataTrustPipelineStage {
  id: DataTrustPipelineStageId;
  label: string;
  detail: string;
  status: DataTrustStageStatus;
}

export interface DataTrustPipelineRun {
  status: 'idle' | 'running' | 'complete' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  cellsIn?: number;
  cellsOut?: number;
  sectorsDropped?: string[];
  datasetCount?: number;
}

export interface DataTrustPipelineResponse {
  updatedAt: string;
  modelId: 'data-trust';
  currentStage: DataTrustPipelineStageId;
  liveLabel: string;
  connection: DataTrustConnection | null;
  run: DataTrustPipelineRun;
  kAnonymity: number;
  stages: DataTrustPipelineStage[];
  disclaimer: string;
}

/** Fuente demo — misma que aggregation.ts (telemetría gestión pública sintética). */
const RAW_DEMO_CELLS: AggregatedCell[] = [
  { sector: 'salud', metric: 'avg_payment_days', value: 18, sampleSize: 42 },
  { sector: 'salud', metric: 'projects_on_track_pct', value: 76, sampleSize: 42 },
  { sector: 'vial', metric: 'avg_payment_days', value: 24, sampleSize: 35 },
  { sector: 'vial', metric: 'projects_on_track_pct', value: 68, sampleSize: 35 },
  { sector: 'educacion', metric: 'avg_payment_days', value: 31, sampleSize: 28 },
  { sector: 'educacion', metric: 'projects_on_track_pct', value: 71, sampleSize: 28 },
  { sector: 'micro', metric: 'avg_payment_days', value: 12, sampleSize: 4 },
];

type PersistedState = {
  connection: DataTrustConnection | null;
  run: DataTrustPipelineRun;
};

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readState(): PersistedState {
  ensureDataDir();
  if (!existsSync(STATE_PATH)) {
    return { connection: null, run: { status: 'idle' } };
  }
  return JSON.parse(readFileSync(STATE_PATH, 'utf8')) as PersistedState;
}

function writeState(state: PersistedState) {
  ensureDataDir();
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function groupBySector(cells: AggregatedCell[]): Map<string, AggregatedCell[]> {
  const map = new Map<string, AggregatedCell[]>();
  for (const cell of cells) {
    const list = map.get(cell.sector) ?? [];
    list.push(cell);
    map.set(cell.sector, list);
  }
  return map;
}

function baseStages(connection: DataTrustConnection | null, run: DataTrustPipelineRun): DataTrustPipelineStage[] {
  const hasCatalog = existsSync(CATALOG_PATH);
  const connected = Boolean(connection);
  const running = run.status === 'running';
  const done = run.status === 'complete' || (connected && hasCatalog && run.status !== 'running');

  const stage = (
    id: DataTrustPipelineStageId,
    label: string,
    detail: string,
    status: DataTrustStageStatus,
  ): DataTrustPipelineStage => ({ id, label, detail, status });

  return [
    stage('select', 'Modelo', 'DATA Trust — agregados k-anonymized', 'complete'),
    stage(
      'connect',
      'Conectar',
      connection?.label ?? 'Sube data o conecta la API',
      connected ? 'complete' : running ? 'active' : 'pending',
    ),
    stage(
      'ingest',
      'Recibiendo',
      connected
        ? `Fuente: ${connection!.label}`
        : 'Ingesta verificada en cola',
      !connected ? 'pending' : running && !run.cellsIn ? 'active' : connected ? 'complete' : 'pending',
    ),
    stage(
      'k_anonymity',
      'Analizando',
      run.cellsOut != null
        ? `${run.cellsIn} celdas → ${run.cellsOut} tras k≥5`
        : 'Visualización: trabajando en tu informe…',
      running && run.cellsIn && !run.cellsOut ? 'active' : done ? 'complete' : 'pending',
    ),
    stage(
      'aggregate',
      'Tipo de data',
      run.sectorsDropped?.length
        ? `Sectores: ${run.sectorsDropped.length > 0 ? `excluido ${run.sectorsDropped.join(', ')} (k)` : 'todos publicables'}`
        : 'Clasificación por sector',
      running && run.cellsOut && !run.datasetCount ? 'active' : done ? 'complete' : 'pending',
    ),
    stage(
      'audit',
      'Dictamen',
      'Centinela re-ID + dictamen soberano',
      'blocked',
    ),
    stage(
      'publish',
      'Informe',
      run.datasetCount != null ? `${run.datasetCount} datasets en catálogo` : 'Generando salida verificable',
      running && run.datasetCount ? 'active' : done ? 'complete' : 'pending',
    ),
    stage(
      'serve',
      'Publicado',
      'GET /api/public/data-trust/datasets',
      done && hasCatalog ? 'complete' : 'pending',
    ),
  ];
}

function resolveCurrentStage(stages: DataTrustPipelineStage[]): DataTrustPipelineStageId {
  const active = stages.find((s) => s.status === 'active');
  if (active) return active.id;
  const lastComplete = [...stages].reverse().find((s) => s.status === 'complete');
  return lastComplete?.id ?? 'select';
}

function liveLabelFor(stage: DataTrustPipelineStageId, run: DataTrustPipelineRun): string {
  if (run.status === 'running') {
    switch (stage) {
      case 'ingest':
        return 'Recibiendo telemetría agregada…';
      case 'k_anonymity':
        return 'Visualización: trabajando en tu informe…';
      case 'aggregate':
        return 'Identificando tipo de data por sector…';
      case 'publish':
        return 'Generando informe verificable…';
      default:
        return 'Procesando pipeline DATA Trust…';
    }
  }
  if (run.status === 'complete') return 'Informe publicado — catálogo listo';
  if (stage === 'connect') return 'Conecta una fuente para iniciar el pipeline';
  if (stage === 'serve') return 'Catálogo disponible en consola';
  const labels: Record<DataTrustPipelineStageId, string> = {
    select: 'Modelo DATA Trust seleccionado',
    connect: 'Conecta telemetría o API',
    ingest: 'Esperando ingesta',
    k_anonymity: 'Análisis k-anonymity pendiente',
    aggregate: 'Clasificación sectorial pendiente',
    audit: 'Dictamen institucional (roadmap)',
    publish: 'Informe pendiente',
    serve: 'Publicación pendiente',
  };
  return labels[stage];
}

export function getDataTrustPipelineStatus(): DataTrustPipelineResponse {
  const { connection, run } = readState();
  const kAnonymity = 5;
  const stages = baseStages(connection, run);
  const currentStage = resolveCurrentStage(stages);

  return {
    updatedAt: new Date().toISOString(),
    modelId: 'data-trust',
    currentStage,
    liveLabel: liveLabelFor(currentStage, run),
    connection,
    run,
    kAnonymity,
    stages,
    disclaimer:
      'P2 demo — telemetría sintética; sin PII. Ingest institucional y dictamen centinela en roadmap.',
  };
}

export function connectDataTrustSource(
  mode: DataTrustConnectMode,
  options?: { endpoint?: string },
): DataTrustPipelineResponse {
  const labels: Record<DataTrustConnectMode, string> = {
    demo_telemetry: 'Telemetría demo — gestión pública',
    api_endpoint: options?.endpoint?.trim() || 'API enterprise (endpoint declarado)',
    institutional: 'Cuenta institucional — onboarding piloto',
  };

  const connection: DataTrustConnection = {
    mode,
    label: labels[mode],
    connectedAt: new Date().toISOString(),
    ...(mode === 'api_endpoint' && options?.endpoint ? { endpoint: options.endpoint.trim() } : {}),
  };

  writeState({ connection, run: { status: 'idle' } });
  return getDataTrustPipelineStatus();
}

/** Ejecuta ETL demo con estado persistido por etapa. */
export function runDataTrustPipelineTracked(kAnonymity = 5): DataTrustPipelineResponse {
  const state = readState();
  if (!state.connection) {
    throw new Error('Conecte una fuente antes de ejecutar el pipeline');
  }

  const startedAt = new Date().toISOString();
  writeState({
    connection: state.connection,
    run: { status: 'running', startedAt, cellsIn: RAW_DEMO_CELLS.length },
  });

  const dropped = RAW_DEMO_CELLS.filter((c) => c.sampleSize < kAnonymity).map((c) => c.sector);
  const safe = enforceKAnonymity(RAW_DEMO_CELLS, kAnonymity);

  writeState({
    connection: state.connection,
    run: {
      status: 'running',
      startedAt,
      cellsIn: RAW_DEMO_CELLS.length,
      cellsOut: safe.length,
      sectorsDropped: [...new Set(dropped)],
    },
  });

  const bySector = groupBySector(safe);
  const publishedAt = new Date().toISOString();
  const datasets: AggregatedDataset[] = [];

  for (const [sector, cells] of bySector) {
    const sourceHash = payloadHash({ sector, cells, publishedAt });
    datasets.push({
      id: `dsc-${sector}-${publishedAt.slice(0, 10)}`,
      sector,
      title: `Índices agregados sector ${sector}`,
      kAnonymity,
      minCellSize: Math.min(...cells.map((c) => c.sampleSize)),
      cells,
      publishedAt,
      sourceHash,
      accessTier: 'enterprise-demo',
    });
  }

  writeFileSync(
    CATALOG_PATH,
    `${JSON.stringify({ generatedAt: publishedAt, datasets }, null, 2)}\n`,
  );

  const completedAt = new Date().toISOString();
  writeState({
    connection: state.connection,
    run: {
      status: 'complete',
      startedAt,
      completedAt,
      cellsIn: RAW_DEMO_CELLS.length,
      cellsOut: safe.length,
      sectorsDropped: [...new Set(dropped)],
      datasetCount: datasets.length,
    },
  });

  return getDataTrustPipelineStatus();
}

/** Reset demo (solo desarrollo / operador). */
export function disconnectDataTrustSource(): DataTrustPipelineResponse {
  writeState({ connection: null, run: { status: 'idle' } });
  return getDataTrustPipelineStatus();
}

/** Sincroniza run completo si catálogo existe pero estado vacío. */
export function reconcileDataTrustPipelineState(): void {
  const state = readState();
  if (!state.connection || state.run.status === 'complete') return;
  const datasets = getPublishedDatasets();
  if (datasets.length === 0) return;
  writeState({
    connection: state.connection,
    run: {
      status: 'complete',
      completedAt: datasets[0]?.publishedAt,
      cellsIn: RAW_DEMO_CELLS.length,
      cellsOut: enforceKAnonymity(RAW_DEMO_CELLS, 5).length,
      sectorsDropped: ['micro'],
      datasetCount: datasets.length,
    },
  });
}
