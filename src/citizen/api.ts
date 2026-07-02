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

const API_BASE = import.meta.env.VITE_PUBLIC_API_URL ?? '';

async function fetchPublic<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchDashboard() {
  return fetchPublic<DashboardResponse>('/api/public/dashboard');
}

export function fetchProposals() {
  return fetchPublic<ProposalsResponse>('/api/public/proposals');
}

export function fetchSupply() {
  return fetchPublic<SupplyResponse>('/api/public/supply');
}
