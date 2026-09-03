import 'dotenv/config';

export type TerritorialTier = 'core' | 'peripheral';

export interface EdgeConfig {
  originNodeId: string;
  territoryCode: string;
  tier: TerritorialTier;
  syncIntervalMs: number;
  syncBatchSize: number;
  maxSyncAttempts: number;
  coreDatabaseUrl: string;
  coreHealthUrl: string;
  mqttUrl: string;
  edgeDatabaseUrl: string;
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function loadEdgeConfig(): EdgeConfig {
  const originNodeId =
    process.env.ORIGIN_NODE_ID?.trim() || 'node-territorial-01';
  const territoryCode =
    process.env.TERRITORY_CODE?.trim() || 'BOG_CENTER_01';
  const tier =
    process.env.NODE_TIER?.trim() === 'core' ? 'core' : 'peripheral';

  return {
    originNodeId,
    territoryCode,
    tier,
    syncIntervalMs: envInt('EDGE_SYNC_INTERVAL_MS', 30_000),
    syncBatchSize: envInt('EDGE_SYNC_BATCH_SIZE', 50),
    maxSyncAttempts: envInt('EDGE_MAX_SYNC_ATTEMPTS', 12),
    coreDatabaseUrl:
      process.env.DATABASE_URL?.trim() ||
      'postgresql://agigov:agigov@127.0.0.1:5432/agigov_core?schema=public',
    coreHealthUrl:
      process.env.CORE_HEALTH_URL?.trim() || 'http://127.0.0.1:3001/api/public/health',
    mqttUrl: process.env.MQTT_URL?.trim() || 'mqtt://127.0.0.1:1883',
    edgeDatabaseUrl:
      process.env.EDGE_DATABASE_URL?.trim() || 'file:../data/edge.db',
  };
}
