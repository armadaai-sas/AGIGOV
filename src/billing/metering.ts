/**
 * IaaU metering demo — eventos por unidad verificada, conciliación vs ledger stub.
 */
import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import { payloadHash } from '../db/sync/conflicts.js';

const DATA_DIR = join(process.cwd(), 'data');
const EVENTS_PATH = join(DATA_DIR, 'metering-events.jsonl');

export type MeterUnit =
  | 'iap-envelope'
  | 'ledger-commit'
  | 'api-call'
  | 'sync-node'
  | 'milestone-validated';

export type MeterTier = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8' | 'M9';

export interface MeterEvent {
  id: string;
  unit: MeterUnit;
  quantity: number;
  jurisdictionId: string;
  tier: MeterTier;
  recordedAt: string;
  ledgerHash: string;
  processId?: string;
}

export interface UsageSummary {
  jurisdictionId: string;
  period: string;
  byUnit: Record<MeterUnit, number>;
  totalUnits: number;
  estimatedUsdDemo: number;
}

const UNIT_DEMO_RATE_USD: Record<MeterUnit, number> = {
  'iap-envelope': 0.002,
  'ledger-commit': 0.005,
  'api-call': 0.001,
  'sync-node': 0.05,
  'milestone-validated': 0.02,
};

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readEvents(): MeterEvent[] {
  if (!existsSync(EVENTS_PATH)) return [];
  return readFileSync(EVENTS_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as MeterEvent);
}

export function recordMeterEvent(input: {
  unit: MeterUnit;
  quantity?: number;
  jurisdictionId?: string;
  tier?: MeterTier;
  processId?: string;
}): MeterEvent {
  ensureDataDir();
  const quantity = input.quantity ?? 1;
  const jurisdictionId = input.jurisdictionId ?? 'demo-jurisdiction';
  const tier = input.tier ?? 'M6';
  const recordedAt = new Date().toISOString();
  const body = {
    unit: input.unit,
    quantity,
    jurisdictionId,
    tier,
    recordedAt,
    processId: input.processId,
  };
  const ledgerHash = payloadHash(body);
  const event: MeterEvent = {
    id: payloadHash({ ledgerHash, nonce: recordedAt }),
    ...body,
    ledgerHash,
  };
  appendFileSync(EVENTS_PATH, `${JSON.stringify(event)}\n`);
  return event;
}

export function getUsageSummary(
  jurisdictionId = 'demo-jurisdiction',
  period?: string,
): UsageSummary {
  const month = period ?? new Date().toISOString().slice(0, 7);
  const events = readEvents().filter(
    (e) => e.jurisdictionId === jurisdictionId && e.recordedAt.startsWith(month),
  );

  const byUnit: Record<MeterUnit, number> = {
    'iap-envelope': 0,
    'ledger-commit': 0,
    'api-call': 0,
    'sync-node': 0,
    'milestone-validated': 0,
  };

  let estimatedUsdDemo = 0;
  for (const e of events) {
    byUnit[e.unit] += e.quantity;
    estimatedUsdDemo += e.quantity * UNIT_DEMO_RATE_USD[e.unit];
  }

  const totalUnits = Object.values(byUnit).reduce((s, n) => s + n, 0);

  return {
    jurisdictionId,
    period: month,
    byUnit,
    totalUnits,
    estimatedUsdDemo: Math.round(estimatedUsdDemo * 100) / 100,
  };
}

/** Conciliación demo: cada evento debe tener ledgerHash único. */
export function reconcileMeteringWithLedger(): {
  ok: boolean;
  eventCount: number;
  duplicateHashes: string[];
} {
  const events = readEvents();
  const seen = new Set<string>();
  const duplicateHashes: string[] = [];
  for (const e of events) {
    if (seen.has(e.ledgerHash)) duplicateHashes.push(e.ledgerHash);
    seen.add(e.ledgerHash);
  }
  return {
    ok: duplicateHashes.length === 0,
    eventCount: events.length,
    duplicateHashes,
  };
}

export function seedDemoMeteringIfEmpty() {
  if (readEvents().length > 0) return;
  recordMeterEvent({ unit: 'iap-envelope', quantity: 12, tier: 'M6' });
  recordMeterEvent({ unit: 'ledger-commit', quantity: 8, tier: 'M6' });
  recordMeterEvent({ unit: 'api-call', quantity: 240, tier: 'M6' });
  recordMeterEvent({ unit: 'sync-node', quantity: 2, tier: 'M6' });
}
