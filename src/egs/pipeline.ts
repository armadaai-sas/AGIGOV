/**
 * EGS — pipeline multiagente honesto (Postgres + checkpoints, no UI fake).
 *
 * Agentes en código hoy:
 *   centinela  → reconcileQuarterClose, FREEZE, evidenceBundle
 *   comunicador → publish checkpoint, ministry-health API
 *   soberano   → roadmap (dictamen Q-close, SPLIT_APPROVED)
 *   logistico  → roadmap (allocación Δ; hoy centinela calcula)
 *   conciliador → disputas ciudadanas (no Q-close)
 *
 * IAP bus: no enruta ingest/Q-close aún — stages marcados en swarm.iapWired.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { getCoreDb } from '../db/client.js';
import { getMinistryHealth } from '../pilot/egs-public.js';

const DATA_DIR = join(process.cwd(), 'data');
const CONTEXT_PATH = join(DATA_DIR, 'egs-pipeline-context.json');

export type EgsConnectMode = 'pilot_read' | 'institutional_ingest' | 'ops_api';

export type EgsAgentRole =
  | 'ops'
  | 'institution'
  | 'centinela'
  | 'logistico'
  | 'soberano'
  | 'comunicador'
  | 'conciliador'
  | 'human';

export type EgsPipelineStageId =
  | 'provision'
  | 'baseline'
  | 'ingest'
  | 'reconcile'
  | 'delta'
  | 'sovereign'
  | 'publish'
  | 'serve';

export type EgsStageStatus = 'pending' | 'active' | 'complete' | 'blocked' | 'failed';

export interface EgsPipelineStage {
  id: EgsPipelineStageId;
  label: string;
  detail: string;
  status: EgsStageStatus;
  agent: EgsAgentRole;
  agentLabel: string;
}

export interface EgsSwarmState {
  centinela: 'idle' | 'active' | 'complete' | 'freeze';
  logistico: 'idle' | 'active' | 'complete' | 'blocked';
  soberano: 'idle' | 'active' | 'complete' | 'blocked';
  comunicador: 'idle' | 'active' | 'complete';
  iapWired: boolean;
  lastAgentId: string | null;
}

export interface EgsPipelineConnection {
  mode: EgsConnectMode;
  ministryCode: string;
  label: string;
  connectedAt: string;
}

export interface EgsPipelineResponse {
  updatedAt: string;
  modelId: 'egs';
  currentStage: EgsPipelineStageId;
  liveLabel: string;
  connection: EgsPipelineConnection | null;
  ministryCode: string | null;
  tenantSlug: string | null;
  onboardingStatus: string | null;
  quarterCloseStatus: string | null;
  reconcileOk: boolean;
  discrepancies: string[];
  releaseCount: number;
  published: boolean;
  ledgerProcessId: string | null;
  swarm: EgsSwarmState;
  stages: EgsPipelineStage[];
  disclaimer: string;
}

type PersistedContext = { connection: EgsPipelineConnection | null };

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readContext(): PersistedContext {
  ensureDataDir();
  if (!existsSync(CONTEXT_PATH)) return { connection: null };
  return JSON.parse(readFileSync(CONTEXT_PATH, 'utf8')) as PersistedContext;
}

function writeContext(ctx: PersistedContext) {
  ensureDataDir();
  writeFileSync(CONTEXT_PATH, `${JSON.stringify(ctx, null, 2)}\n`);
}

const AGENT_LABELS: Record<EgsAgentRole, string> = {
  ops: 'Operaciones',
  institution: 'Institución',
  centinela: 'Centinela',
  logistico: 'Logístico',
  soberano: 'Soberano',
  comunicador: 'Comunicador',
  conciliador: 'Conciliador',
  human: 'Operador ministerio',
};

function stage(
  id: EgsPipelineStageId,
  label: string,
  detail: string,
  status: EgsStageStatus,
  agent: EgsAgentRole,
): EgsPipelineStage {
  return { id, label, detail, status, agent, agentLabel: AGENT_LABELS[agent] };
}

function resolveCurrentStage(stages: EgsPipelineStage[]): EgsPipelineStageId {
  const active = stages.find((s) => s.status === 'active' || s.status === 'failed');
  if (active) return active.id;
  const lastComplete = [...stages].reverse().find((s) => s.status === 'complete');
  return lastComplete?.id ?? 'provision';
}

function buildSwarmState(
  stages: EgsPipelineStage[],
  lastAgentId: string | null,
  reconcileOk: boolean,
): EgsSwarmState {
  const current = resolveCurrentStage(stages);
  const centinela: EgsSwarmState['centinela'] =
    !reconcileOk && (current === 'reconcile' || current === 'ingest')
      ? 'freeze'
      : ['reconcile', 'ingest', 'delta'].includes(current)
        ? current === 'delta'
          ? 'complete'
          : 'active'
        : ['publish', 'serve', 'sovereign'].includes(current)
          ? 'complete'
          : 'idle';

  return {
    centinela,
    logistico: current === 'delta' ? 'active' : current === 'publish' || current === 'serve' ? 'complete' : 'blocked',
    soberano: current === 'sovereign' ? 'blocked' : current === 'publish' || current === 'serve' ? 'complete' : 'blocked',
    comunicador:
      current === 'publish'
        ? 'active'
        : current === 'serve'
          ? 'complete'
          : current === 'baseline'
            ? 'complete'
            : 'idle',
    iapWired: false,
    lastAgentId,
  };
}

function liveLabelFor(
  current: EgsPipelineStageId,
  stages: EgsPipelineStage[],
  reconcileOk: boolean,
): string {
  const active = stages.find((s) => s.id === current);
  if (!reconcileOk && current === 'reconcile') {
    return 'Centinela: FREEZE — discrepancia en custodia escrow';
  }
  switch (current) {
    case 'provision':
      return 'Provisionar tenant piloto (ops) o conectar lectura MPPI';
    case 'baseline':
      return 'Institución: ratificar acta baseline (multi-sig)';
    case 'ingest':
      return 'Operador ministerio: ingestar hitos verificados';
    case 'reconcile':
      return 'Centinela: reconciliando escrow vs releases…';
    case 'delta':
      return 'Calculando Δ y reparto 70/20/10…';
    case 'sovereign':
      return 'Soberano: dictamen de reparto (roadmap)';
    case 'publish':
      return 'Comunicador: publicando cierre al ledger ciudadano…';
    case 'serve':
      return 'Telemetría fiscal publicada — consola en vivo';
    default:
      return active?.detail ?? 'Pipeline EGS';
  }
}

export async function connectEgsPipeline(
  mode: EgsConnectMode,
  ministryCode = 'MPPI',
): Promise<EgsPipelineResponse> {
  const labels: Record<EgsConnectMode, string> = {
    pilot_read: `Lectura piloto ${ministryCode}`,
    institutional_ingest: 'Ingesta institucional — token Bearer',
    ops_api: 'API ops — provision + q-close',
  };
  const connection: EgsPipelineConnection = {
    mode,
    ministryCode: ministryCode.toUpperCase(),
    label: labels[mode],
    connectedAt: new Date().toISOString(),
  };
  writeContext({ connection });
  return getEgsPipelineStatus(ministryCode);
}

export async function getEgsPipelineStatus(ministryCode = 'MPPI'): Promise<EgsPipelineResponse> {
  const ctx = readContext();
  const code = ctx.connection?.ministryCode ?? ministryCode.toUpperCase();
  const health = await getMinistryHealth(code);

  if (!health) {
    const stages: EgsPipelineStage[] = [
      stage('provision', 'Provisionar', 'Tenant + seed EGS (npm run db:seed:egs-pilot)', 'active', 'ops'),
      stage('baseline', 'Acta baseline', 'Multi-sig institucional', 'pending', 'institution'),
      stage('ingest', 'Ingesta hitos', 'POST /api/ops/ingest/:slug', 'pending', 'human'),
      stage('reconcile', 'Reconciliar', 'Centinela — escrow vs releases', 'pending', 'centinela'),
      stage('delta', 'Cálculo Δ', '70/20/10 + fee protocolo', 'pending', 'logistico'),
      stage('sovereign', 'Dictamen reparto', 'Soberano + tesorería', 'blocked', 'soberano'),
      stage('publish', 'Publicar', 'Comunicador → ledger', 'pending', 'comunicador'),
      stage('serve', 'Consola', 'GET ministry-health', 'pending', 'comunicador'),
    ];
    return {
      updatedAt: new Date().toISOString(),
      modelId: 'egs',
      currentStage: 'provision',
      liveLabel: 'Sin datos EGS — ejecute seed piloto vial',
      connection: ctx.connection,
      ministryCode: code,
      tenantSlug: null,
      onboardingStatus: null,
      quarterCloseStatus: null,
      reconcileOk: false,
      discrepancies: [],
      releaseCount: 0,
      published: false,
      ledgerProcessId: null,
      swarm: buildSwarmState(stages, null, true),
      stages,
      disclaimer:
        'Multiagente: centinela/comunicador en código; soberano/logístico IAP en roadmap. npm run db:seed:egs-pilot',
    };
  }

  const db = getCoreDb();
  const tenant = await db.pilotTenant.findFirst({
    where: { ministryCode: code, status: 'active' },
  });

  let lastAgentId: string | null = null;
  if (health.ledgerProcessId) {
    const cp = await db.processCheckpoint.findUnique({
      where: { processId: health.ledgerProcessId },
    });
    lastAgentId = cp?.agentId ?? null;
  }

  const qcStatus = health.quarterCloseStatus;
  const onboarding = tenant?.onboardingStatus ?? null;
  const releases = health.releaseCount;
  const published = health.published;
  const reconcileOk = health.reconcileOk;

  const baselineDone =
    onboarding === 'ingest_ready' ||
    ['BASELINE_LOCKED', 'COLLECTING', 'PENDING_VALIDATION', 'DELTA_CALCULATED', 'PUBLISHED', 'FROZEN'].includes(
      qcStatus,
    );
  const ingestDone = releases > 0 || ['PENDING_VALIDATION', 'DELTA_CALCULATED', 'PUBLISHED'].includes(qcStatus);
  const reconcileDone = ['PENDING_VALIDATION', 'DELTA_CALCULATED', 'PUBLISHED'].includes(qcStatus) && reconcileOk;
  const deltaDone = ['DELTA_CALCULATED', 'PUBLISHED'].includes(qcStatus) || Number(health.calculoAhorroFinal) > 0;
  const publishDone = published;

  const stages: EgsPipelineStage[] = [
    stage(
      'provision',
      'Provisionar',
      tenant ? `Tenant ${tenant.slug} activo` : 'Seed piloto vial',
      tenant ? 'complete' : 'complete',
      'ops',
    ),
    stage(
      'baseline',
      'Acta baseline',
      baselineDone ? 'Multi-sig ratificado — ingest_ready' : 'Pendiente ratificación',
      baselineDone ? 'complete' : onboarding === 'baseline_pending' ? 'active' : 'pending',
      'institution',
    ),
    stage(
      'ingest',
      'Ingesta hitos',
      `${releases} hitos verificados`,
      ingestDone ? 'complete' : baselineDone ? 'active' : 'pending',
      'human',
    ),
    stage(
      'reconcile',
      'Reconciliar',
      reconcileOk ? 'Custodia escrow coherente' : 'Discrepancias detectadas',
      !reconcileOk && ingestDone ? 'failed' : reconcileDone ? 'complete' : ingestDone ? 'active' : 'pending',
      'centinela',
    ),
    stage(
      'delta',
      'Cálculo Δ',
      health.calculoAhorroFinal !== '0.0000' ? `Δ = ${health.calculoAhorroFinal}` : 'Pendiente',
      deltaDone ? 'complete' : reconcileDone ? 'active' : 'pending',
      'logistico',
    ),
    stage(
      'sovereign',
      'Dictamen reparto',
      'SPLIT_APPROVED + tesorería webhook',
      'blocked',
      'soberano',
    ),
    stage(
      'publish',
      'Publicar',
      publishDone ? 'Checkpoint comunicador published' : 'POST q-close publish',
      publishDone ? 'complete' : deltaDone && reconcileOk ? 'active' : 'pending',
      'comunicador',
    ),
    stage(
      'serve',
      'Consola ciudadana',
      `${health.contracts.length} contratos · Q${health.quarter} ${health.fiscalYear}`,
      publishDone ? 'complete' : 'pending',
      'comunicador',
    ),
  ];

  const currentStage = resolveCurrentStage(stages);

  return {
    updatedAt: new Date().toISOString(),
    modelId: 'egs',
    currentStage,
    liveLabel: liveLabelFor(currentStage, stages, reconcileOk),
    connection: ctx.connection,
    ministryCode: code,
    tenantSlug: tenant?.slug ?? null,
    onboardingStatus: onboarding,
    quarterCloseStatus: qcStatus,
    reconcileOk,
    discrepancies: health.discrepancies,
    releaseCount: releases,
    published: publishDone,
    ledgerProcessId: health.ledgerProcessId,
    swarm: buildSwarmState(stages, lastAgentId, reconcileOk),
    stages,
    disclaimer:
      'Pipeline real Postgres. IAP MQTT no enruta Q-close aún; agentId en processCheckpoint es evidencia runtime.',
  };
}

export async function disconnectEgsPipeline(): Promise<EgsPipelineResponse> {
  writeContext({ connection: null });
  return getEgsPipelineStatus('MPPI');
}
