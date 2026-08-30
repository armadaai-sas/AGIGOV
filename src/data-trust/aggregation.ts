/**
 * Data Trust demo — pipeline de agregación k-anonymized sin PII.
 * P2 sandbox: publica datasets sectoriales derivados de telemetría demo.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { payloadHash } from '../db/sync/conflicts.js';

const DATA_DIR = join(process.cwd(), 'data');
const CATALOG_PATH = join(DATA_DIR, 'data-trust-catalog.json');

export interface AggregatedCell {
  sector: string;
  metric: string;
  value: number;
  sampleSize: number;
}

export interface AggregatedDataset {
  id: string;
  sector: string;
  title: string;
  kAnonymity: number;
  minCellSize: number;
  cells: AggregatedCell[];
  publishedAt: string;
  sourceHash: string;
  accessTier: 'enterprise-demo';
}

/** Fuente demo — agregados sintéticos alineados a telemetría gestión pública. */
const RAW_DEMO_CELLS: AggregatedCell[] = [
  { sector: 'salud', metric: 'avg_payment_days', value: 18, sampleSize: 42 },
  { sector: 'salud', metric: 'projects_on_track_pct', value: 76, sampleSize: 42 },
  { sector: 'vial', metric: 'avg_payment_days', value: 24, sampleSize: 35 },
  { sector: 'vial', metric: 'projects_on_track_pct', value: 68, sampleSize: 35 },
  { sector: 'educacion', metric: 'avg_payment_days', value: 31, sampleSize: 28 },
  { sector: 'educacion', metric: 'projects_on_track_pct', value: 71, sampleSize: 28 },
  { sector: 'micro', metric: 'avg_payment_days', value: 12, sampleSize: 4 },
];

export function enforceKAnonymity(cells: AggregatedCell[], k = 5): AggregatedCell[] {
  return cells.filter((c) => c.sampleSize >= k);
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
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

/** Pipeline ETL demo: filtra k-anonymity y publica catálogo versionado. */
export function runAggregationPipeline(kAnonymity = 5): AggregatedDataset[] {
  ensureDataDir();
  const safe = enforceKAnonymity(RAW_DEMO_CELLS, kAnonymity);
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
  return datasets;
}

export function getPublishedDatasets(): AggregatedDataset[] {
  ensureDataDir();
  if (!existsSync(CATALOG_PATH)) {
    return [];
  }
  const parsed = JSON.parse(readFileSync(CATALOG_PATH, 'utf8')) as {
    datasets: AggregatedDataset[];
  };
  return parsed.datasets;
}

export function getDatasetById(id: string): AggregatedDataset | undefined {
  return getPublishedDatasets().find((d) => d.id === id);
}
