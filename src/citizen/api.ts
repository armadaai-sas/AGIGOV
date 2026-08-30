export type NetworkSyncState = 'offline' | 'syncing' | 'synced' | 'error';

export interface DashboardReport {
  processId: string;
  status: string;
  updatedAt: string;
  summary: string;
  metrics: Record<string, unknown>;
}

export interface DashboardResponse {
  updatedAt: string;
  ledgerEntries: number;
  reports: DashboardReport[];
}

export interface ProposalItem {
  id: string;
  title: string;
  status: string;
  citizenSummary: string;
  dictamen?: 'CONFORME' | 'REVISAR';
  updatedAt: string;
}

export interface ProposalsResponse {
  updatedAt: string;
  proposals: ProposalItem[];
}

export interface SupplyItem {
  status: string;
  count: number;
  totalAmount: string;
  currency: string;
}

export interface SupplyResponse {
  updatedAt: string;
  inventory: SupplyItem[];
}

export interface ProjectMilestone {
  label: string;
  done: boolean;
}

export interface ProjectEscrow {
  processId: string;
  status: string;
  amount: string;
  threshold: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  sector: string;
  territoryCode: string;
  targetAmount: string;
  raisedAmount: string;
  currency: string;
  contributions: number;
  daoApproved: boolean;
  funded?: boolean;
  milestones: ProjectMilestone[];
  escrow: ProjectEscrow | null;
  updatedAt: string;
}

export interface ProjectsResponse {
  updatedAt: string;
  summary: {
    projectCount: number;
    totalRaised: string;
    totalContributions: number;
    currency: string;
  };
  projects: ProjectItem[];
}

const API_BASE = import.meta.env.VITE_PUBLIC_API_URL ?? '';
const INSTITUTION_SESSION_TOKEN_KEY = 'agigov-institution-session-token-v1';

async function fetchPublic<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function postPublicJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getOpsAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `API ${path} → ${res.status}`);
  return json;
}

function getOpsAuthHeaders(extra?: HeadersInit): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(INSTITUTION_SESSION_TOKEN_KEY) : null;
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchOps<T>(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: getOpsAuthHeaders(init?.headers),
  });
}

export type PublicConfigResponse = {
  updatedAt: string;
  iso: string;
  jurisdictionCode: string;
  label: string;
  currency: string;
  locale: string;
  timezone: string;
  territoryCode: string;
  supportedJurisdictions: Array<{
    iso: string;
    jurisdictionCode: string;
    label: string;
    currency: string;
    locale: string;
    status: string;
  }>;
  supportedLocales: string[];
  supportedCurrencies: string[];
  note: string;
};

export function fetchPublicConfig() {
  return fetchPublic<PublicConfigResponse>('/api/public/config');
}

export function fetchDashboard() {
  return fetchPublic<DashboardResponse>('/api/public/dashboard');
}

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

export function fetchComunicadorReport() {
  return fetchPublic<ComunicadorReport>('/api/public/comunicador/report');
}

export function fetchProposals() {
  return fetchPublic<ProposalsResponse>('/api/public/proposals');
}

export function fetchSupply() {
  return fetchPublic<SupplyResponse>('/api/public/supply');
}

export function fetchProjects() {
  return fetchPublic<ProjectsResponse>('/api/public/projects');
}

export interface ProjectDetailResponse {
  updatedAt: string;
  project: ProjectItem & {
    recentContributions: ContributionReceipt[];
  };
}

export function fetchProjectDetail(id: string) {
  return fetchPublic<ProjectDetailResponse>(`/api/public/projects/${encodeURIComponent(id)}`);
}

export interface CartaStatus {
  updatedAt: string;
  processId: string;
  version: string;
  documentRef: string;
  ratified: boolean;
  actaStatus: string;
  checkpointStatus: string;
  threshold: number;
  signatureCount: number;
}

export interface ContributionReceipt {
  receiptId: string;
  projectId: string;
  amount: number;
  currency: string;
  territoryCode: string;
  committedAt: string;
  ledgerHash: string;
}

export function fetchCartaStatus() {
  return fetchPublic<CartaStatus>('/api/public/carta');
}

export interface PublicHealthPayload {
  ok: boolean;
  service: string;
  postgres?: boolean;
  panicMode?: boolean;
  crossHealthOk: boolean;
  checkedAt: string;
  peer?: {
    ok: boolean;
    jurisdiction?: string;
    latencyMs?: number;
  };
}

export function fetchHealth() {
  return fetchPublic<PublicHealthPayload>('/api/public/health?peer=0');
}

export interface GlobalNetworkMetrics {
  activeNodes: number;
  integrityLabel: string;
  ok: boolean;
}

/** Métricas globales IAP para el panel superior del hero (inglés). */
export async function fetchGlobalNetworkMetrics(): Promise<GlobalNetworkMetrics> {
  const health = await fetchHealth();
  if (!health.ok) {
    throw new Error('Platform health unavailable');
  }

  const activeNodes = 1 + (health.peer?.ok ? 1 : 0);
  let integrity = 99.0;
  if (health.postgres) integrity += 0.9;
  if (health.crossHealthOk) integrity += 0.0999;

  return {
    activeNodes,
    integrityLabel: `${integrity.toFixed(4)}%`,
    ok: true,
  };
}


export interface ProposalReceipt {
  processId: string;
  status: string;
  citizenSummary: string;
  dictamen: 'CONFORME' | 'REVISAR';
  committedAt: string;
}

export async function submitProposal(input: {
  title: string;
  sector: string;
  territoryCode?: string;
  facts: Array<{ text: string; source?: string; date?: string }>;
}): Promise<{ ok: boolean; receipt: ProposalReceipt }> {
  const res = await fetch(`${API_BASE}/api/public/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...input,
      territoryCode: input.territoryCode ?? 'MAR_NORTH_01',
    }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `API proposals → ${res.status}`);
  }
  return res.json() as Promise<{ ok: boolean; receipt: ProposalReceipt }>;
}

export async function submitContribution(input: {
  projectId: string;
  amount: number;
  territoryCode?: string;
}): Promise<{ ok: boolean; receipt: ContributionReceipt }> {
  const res = await fetch(`${API_BASE}/api/public/contributions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...input,
      currency: 'VES',
      territoryCode: input.territoryCode ?? 'MAR_NORTH_01',
    }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `API contributions → ${res.status}`);
  }
  return res.json() as Promise<{ ok: boolean; receipt: ContributionReceipt }>;
}

export interface IrregularityReceipt {
  processId: string;
  status: string;
  category: string;
  committedAt: string;
  message: string;
}

export async function submitIrregularityReport(input: {
  category: string;
  description: string;
  evidenceRef?: string;
}): Promise<{ ok: boolean; receipt: IrregularityReceipt }> {
  const res = await fetch(`${API_BASE}/api/public/reports/irregularity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...input, territoryCode: 'MAR_NORTH_01' }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `API irregularity → ${res.status}`);
  }
  return res.json() as Promise<{ ok: boolean; receipt: IrregularityReceipt }>;
}

export interface CneOption {
  id: string;
  label: string;
  votes: number;
}

export interface CneConsultation {
  id: string;
  title: string;
  description: string;
  territoryCode: string;
  phase: string;
  binding: false;
  status: 'open' | 'closed';
  options: CneOption[];
  updatedAt: string;
  setLedger?: {
    commitCount: number;
    verifiedCount: number;
    lastCommittedAt: string | null;
  };
}

export function fetchCneConsultation() {
  return fetchPublic<{ updatedAt: string; consultation: CneConsultation }>(
    '/api/public/cne/consultation',
  );
}

export async function castCneVote(optionId: string, voterToken?: string) {
  const token =
    voterToken ??
    (typeof localStorage !== 'undefined'
      ? (localStorage.getItem('agigov-voter-token') ??
          (() => {
            const t = crypto.randomUUID();
            localStorage.setItem('agigov-voter-token', t);
            return t;
          })())
      : crypto.randomUUID());

  const res = await fetch(`${API_BASE}/api/public/cne/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ optionId, voterToken: token }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `API cne vote → ${res.status}`);
  }
  return res.json() as Promise<{
    ok: boolean;
    receipt: { receiptHash: string; optionId: string; votedAt: string };
    consultation: CneConsultation;
  }>;
}

export interface PilotStatus {
  updatedAt: string;
  processId: string;
  ok: boolean;
  checks: Record<string, boolean>;
  detail: Record<string, unknown>;
}

export function fetchPilotStatus() {
  return fetchPublic<PilotStatus>('/api/public/pilot');
}

export interface BillingUsageResponse {
  updatedAt: string;
  plan: string;
  summary: {
    jurisdictionId: string;
    period: string;
    byUnit: Record<string, number>;
    totalUnits: number;
    estimatedUsdDemo: number;
  };
  reconciliation: {
    ok: boolean;
    eventCount: number;
    billingFrozen: boolean;
    billable: boolean;
    plan: string;
  };
  invoice: {
    billable: boolean;
    amountUsd: number;
    reason: string;
  };
  billingFreeze: { frozen: boolean; reason?: string };
  disclaimer: string;
}

export function fetchBillingUsage(jurisdictionId?: string, period?: string) {
  const params = new URLSearchParams();
  if (jurisdictionId) params.set('jurisdictionId', jurisdictionId);
  if (period) params.set('period', period);
  const q = params.toString();
  return fetchPublic<BillingUsageResponse>(`/api/public/billing/usage${q ? `?${q}` : ''}`);
}

export interface BillingCatalogResponse {
  updatedAt: string;
  plan: string;
  lines: Array<{
    id: string;
    layer: string;
    unit: string;
    priceUsd: number | string;
    priceNote: string;
    billable: boolean;
  }>;
}

export function fetchBillingCatalog() {
  return fetchPublic<BillingCatalogResponse>('/api/public/billing/catalog');
}

export interface DataTrustDatasetMeta {
  id: string;
  sector: string;
  title: string;
  kAnonymity: number;
  minCellSize: number;
  publishedAt: string;
  sourceHash: string;
  accessTier: string;
  metricCount: number;
}

export interface DataTrustCatalogResponse {
  updatedAt: string;
  kAnonymity: number;
  datasets: DataTrustDatasetMeta[];
}

export function fetchDataTrustCatalog() {
  return fetchPublic<DataTrustCatalogResponse>('/api/public/data-trust/datasets');
}

export interface DataTrustDatasetDetail {
  updatedAt: string;
  dataset: {
    id: string;
    sector: string;
    title: string;
    kAnonymity: number;
    minCellSize: number;
    cells: Array<{ sector: string; metric: string; value: number; sampleSize: number }>;
    publishedAt: string;
    sourceHash: string;
    accessTier: string;
  };
}

export function fetchDataTrustDataset(id: string) {
  return fetchPublic<DataTrustDatasetDetail>(
    `/api/public/data-trust/datasets/${encodeURIComponent(id)}`,
  );
}

export async function refreshDataTrustPipeline() {
  const res = await fetch(`${API_BASE}/api/public/data-trust/refresh`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `data-trust refresh → ${res.status}`);
  }
  return res.json() as Promise<{ ok: boolean; count: number }>;
}

export type DataTrustConnectMode = 'demo_telemetry' | 'api_endpoint' | 'institutional';

export interface DataTrustPipelineStage {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'complete' | 'skipped' | 'blocked';
}

export interface DataTrustPipelineResponse {
  updatedAt: string;
  modelId: 'data-trust';
  currentStage: string;
  liveLabel: string;
  connection: {
    mode: DataTrustConnectMode;
    label: string;
    connectedAt: string;
    endpoint?: string;
  } | null;
  run: {
    status: 'idle' | 'running' | 'complete' | 'failed';
    startedAt?: string;
    completedAt?: string;
    datasetCount?: number;
  };
  kAnonymity: number;
  stages: DataTrustPipelineStage[];
  disclaimer: string;
}

export function fetchDataTrustPipeline() {
  return fetchPublic<DataTrustPipelineResponse>('/api/public/models/data-trust/pipeline');
}

export async function connectDataTrustSource(
  mode: DataTrustConnectMode,
  options?: { endpoint?: string },
) {
  const res = await fetch(`${API_BASE}/api/public/models/data-trust/connect`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ mode, endpoint: options?.endpoint }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `connect → ${res.status}`);
  }
  return res.json() as Promise<DataTrustPipelineResponse>;
}

export async function runDataTrustPipeline() {
  const res = await fetch(`${API_BASE}/api/public/models/data-trust/run`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `run → ${res.status}`);
  }
  return res.json() as Promise<DataTrustPipelineResponse>;
}

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

export interface EgsPipelineResponse {
  updatedAt: string;
  modelId: 'egs';
  currentStage: EgsPipelineStageId;
  liveLabel: string;
  connection: {
    mode: EgsConnectMode;
    ministryCode: string;
    label: string;
    connectedAt: string;
  } | null;
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

export function fetchEgsPipeline() {
  return fetchPublic<EgsPipelineResponse>('/api/public/models/egs/pipeline');
}

export async function connectEgsConsole(
  mode: EgsConnectMode,
  options?: { ministryCode?: string },
) {
  const res = await fetch(`${API_BASE}/api/public/models/egs/connect`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ mode, ministryCode: options?.ministryCode }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `connect → ${res.status}`);
  }
  return res.json() as Promise<EgsPipelineResponse>;
}

export type SystemGraphNodeKind = 'model' | 'agent' | 'source' | 'checkpoint' | 'ledger';

export type SystemGraphNodeStatus =
  | 'connected'
  | 'active'
  | 'complete'
  | 'idle'
  | 'blocked'
  | 'freeze'
  | 'pending'
  | 'failed';

export interface SystemGraphNode {
  id: string;
  kind: SystemGraphNodeKind;
  label: string;
  status: SystemGraphNodeStatus;
  detail?: string;
  href?: string;
}

export interface SystemGraphEdge {
  id: string;
  from: string;
  to: string;
  kind: 'connect' | 'handoff' | 'evidence' | 'serve';
  label?: string;
  stage?: string;
}

export interface SystemGraphResponse {
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
  nodes: SystemGraphNode[];
  edges: SystemGraphEdge[];
  pipelines: {
    dataTrust: { currentStage: string; connected: boolean };
    egs: { currentStage: string; connected: boolean; iapWired: boolean };
  };
  disclaimer: string;
}

export function fetchSystemGraph() {
  return fetchPublic<SystemGraphResponse>('/api/public/system/graph');
}

export interface MinistryHealthContract {
  id: string;
  title: string;
  territoryCode: string;
  totalAmount: string;
  spentAmount: string;
  status: 'ok' | 'discrepancy' | 'partial';
  milestonesTotal: number;
  milestonesReleased: number;
  escrowStatus: string;
}

export interface MinistryHealthResponse {
  updatedAt: string;
  available: true;
  ministryCode: string;
  programName: string;
  fiscalYear: number;
  quarter: number;
  quarterCloseStatus: string;
  reconcileOk: boolean;
  discrepancies: string[];
  baselineTrimestral: string;
  gastosVerificados: string;
  calculoAhorroFinal: string;
  currency: string;
  executionPct: number;
  escrowExecutionPct: number;
  split: {
    reinversion: string;
    meritPool: string;
    agigovFee: string;
  };
  feeShare?: {
    modelId: string;
    publisherId: string;
    feeAmount: string;
    builderAmount: string;
    protocolAmount: string;
    reserveAmount: string;
  } | null;
  releaseCount: number;
  contracts: MinistryHealthContract[];
  treasuryPayload: Record<string, string | number> | null;
  ledgerProcessId: string | null;
  published: boolean;
  pilotBanner: string;
}

export function fetchMinistryHealth(ministry = 'MPPI') {
  return fetchPublic<MinistryHealthResponse>(
    `/api/public/egs/ministry-health?ministry=${encodeURIComponent(ministry)}`,
  );
}

export type EgsConsoleState =
  | 'SIN_TENANT'
  | 'BASELINE_PEND'
  | 'INGEST_READY'
  | 'EN_EJECUCION'
  | 'DISCREPANCIA'
  | 'LISTO_CIERRE'
  | 'PUBLICADO';

export type EgsPrimaryAction = {
  id: string;
  label: string;
  enabled: boolean;
  href?: string;
  requiresAuth?: boolean;
};

export interface EgsMinistryStatusResponse {
  updatedAt: string;
  ministryCode: string;
  estadoConsola: EgsConsoleState;
  semaphore: 'green' | 'amber' | 'red';
  blockReason: string | null;
  tenantSlug: string | null;
  primaryAction: EgsPrimaryAction;
  secondaryActions: Array<{ id: string; label: string; href: string }>;
  result: {
    delta: string;
    reinversion70: string;
    meritPool: string;
    agigovFee: string;
    currency: string;
    quarter: number;
    fiscalYear: number;
  };
}

export function fetchEgsMinistryStatus(ministry: string) {
  return fetchPublic<EgsMinistryStatusResponse>(
    `/api/public/models/egs/status?ministry=${encodeURIComponent(ministry)}`,
  );
}

export interface EgsMilestoneCustody {
  index: number;
  label: string;
  amount: string;
  state: 'LOCKED' | 'VALIDATED' | 'RELEASED';
  verifiedAt: string | null;
  evidenceRef: string | null;
  validators: {
    centinela: string;
    iot: string;
    citizens: [string, string];
  } | null;
}

export interface EgsContractDetailResponse {
  updatedAt: string;
  contract: MinistryHealthContract & {
    currency: string;
    signers: string[];
    threshold: number;
  };
  quarter: {
    fiscalYear: number;
    quarter: number;
    status: string;
    reconcileOk: boolean;
    discrepancies: string[];
  };
  milestones: EgsMilestoneCustody[];
  ledgerProcessId: string | null;
}

export function fetchEgsContractDetail(escrowProcessId: string) {
  return fetchPublic<EgsContractDetailResponse>(
    `/api/public/egs/contracts/${encodeURIComponent(escrowProcessId)}`,
  );
}

export type PilotDefaultsResponse = {
  iso: string;
  jurisdictionCode: string;
  currency: string;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  displayName: string;
  programName: string;
  territoryCode: string;
  fiscalYear: number;
  quarter: number;
};

export function fetchPilotDefaults(iso: string) {
  return fetchPublic<PilotDefaultsResponse>(`/api/public/pilot/defaults?iso=${encodeURIComponent(iso)}`);
}

export type PilotTenantSummary = {
  slug: string;
  ministry: string;
  budgetCode: string;
  displayName: string;
  status: string;
  fiscalYear: number;
  quarter: number;
  onboardingStatus: string;
  provisionedAt: string;
};

export function fetchPilotTenants() {
  return fetchOps('/api/ops/tenants', {
    headers: { Accept: 'application/json' },
  }).then(async (res) => {
    const json = (await res.json()) as { tenants: PilotTenantSummary[]; count: number; error?: string };
    if (!res.ok) throw new Error(json.error ?? `ops tenants → ${res.status}`);
    return json;
  });
}

export type ProvisionPilotResponse = {
  slug: string;
  ministryCode: string;
  budgetCode: string;
  currency: string;
  firstEscrowRef: string;
  consoleUrl: string;
  ingestUrl: string;
  healthUrl: string;
  ingestToken: string;
  credentialsPath: string;
};

export async function provisionPilotFromProfile(body: {
  iso: string;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  displayName: string;
  programName: string;
  territoryCode: string;
  fiscalYear: number;
  quarter: number;
  annualBaseline?: number;
}): Promise<ProvisionPilotResponse> {
  const res = await fetchOps('/api/ops/tenants/provision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as ProvisionPilotResponse & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `provision → ${res.status}`);
  return json;
}

export type TenantOnboardingStatus = {
  slug: string;
  ministryCode: string;
  onboardingStatus: string;
  baselineActaProcessId: string | null;
  institutionSigners: string[] | null;
  multisigThreshold: number;
};

export function fetchTenantOnboarding(slug: string) {
  return fetchOps(`/api/ops/tenants/${encodeURIComponent(slug)}/onboarding`, {
    headers: { Accept: 'application/json' },
  }).then(async (res) => {
    const json = (await res.json()) as TenantOnboardingStatus & { error?: string };
    if (!res.ok) throw new Error(json.error ?? `ops onboarding → ${res.status}`);
    return json;
  });
}

async function postOpsJson<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetchOps(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `${path} → ${res.status}`);
  return json;
}

export type OnboardPilotResponse = {
  slug: string;
  ministryCode: string;
  institutionSigners: string[];
  onboardingStatus: string;
};

export function onboardPilotTenant(slug: string) {
  return postOpsJson<OnboardPilotResponse>(`/api/ops/tenants/${encodeURIComponent(slug)}/onboard`);
}

export type RatifyBaselineResponse = {
  ratified: boolean;
  onboardingStatus: string;
};

export function ratifyPilotBaseline(slug: string) {
  return postOpsJson<RatifyBaselineResponse>(
    `/api/ops/tenants/${encodeURIComponent(slug)}/baseline/ratify`,
  );
}

export type IngestPilotResponse = {
  accepted: number;
  skipped: number;
  centinela?: {
    reconcileOk: boolean;
    status: string;
    calculoAhorroFinal: number;
    discrepancies: string[];
  };
};

export async function ingestPilotMilestones(
  slug: string,
  ingestToken: string,
  rows: Array<{
    contractRef: string;
    milestoneIndex: number;
    amount: string;
    evidenceRef?: string;
  }>,
): Promise<IngestPilotResponse> {
  const res = await fetch(`${API_BASE}/api/ops/ingest/${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${ingestToken}`,
    },
    body: JSON.stringify({ rows }),
  });
  const json = (await res.json()) as IngestPilotResponse & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `ingest → ${res.status}`);
  return json;
}

export type QClosePilotResponse = {
  ok: boolean;
  status: string;
  reconcileOk: boolean;
  discrepancies: string[];
  calculoAhorroFinal: number;
  published: boolean;
};

export type EgsPublishQuarterResponse = QClosePilotResponse & {
  ministryCode: string;
};

export function publishEgsQuarterClose(ministryCode: string) {
  return postPublicJson<EgsPublishQuarterResponse>('/api/public/models/egs/publish', {
    ministryCode,
  });
}

export function runPilotQClose(slug: string, publish: boolean) {
  return postOpsJson<QClosePilotResponse>(`/api/ops/tenants/${encodeURIComponent(slug)}/q-close`, {
    publish,
  });
}
