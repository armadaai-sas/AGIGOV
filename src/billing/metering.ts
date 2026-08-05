/**
 * IaaU metering — eventos por unidad verificada + conciliación.
 * Facturación IaaU bloqueada si BILLING_FROZEN o plan free.
 */
import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import { payloadHash } from '../db/sync/conflicts.js';
import { IAAU_RATES_USD } from './catalog.js';
import { freezeBilling, getBillingFreeze } from './freeze.js';
import { resolvePlan } from './plan.js';

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

const UNIT_DEMO_RATE_USD = IAAU_RATES_USD;

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

export type MeterReconcileResult = {
  ok: boolean;
  eventCount: number;
  duplicateHashes: string[];
  missingCheckpoints: string[];
  checkpointLinked: number;
  billingFrozen: boolean;
  billable: boolean;
  plan: string;
};

/**
 * Conciliación P0: hashes únicos + freeze si falla.
 */
export function reconcileMeteringWithLedger(options?: {
  freezeOnFail?: boolean;
}): MeterReconcileResult {
  const events = readEvents();
  const seen = new Set<string>();
  const duplicateHashes: string[] = [];
  for (const e of events) {
    if (seen.has(e.ledgerHash)) duplicateHashes.push(e.ledgerHash);
    seen.add(e.ledgerHash);
  }
  const ok = duplicateHashes.length === 0;
  if (!ok && options?.freezeOnFail !== false) {
    freezeBilling(`metering_duplicate_hashes:${duplicateHashes.slice(0, 3).join(',')}`);
  }
  const plan = resolvePlan();
  const freeze = getBillingFreeze();
  return {
    ok,
    eventCount: events.length,
    duplicateHashes,
    missingCheckpoints: [],
    checkpointLinked: 0,
    billingFrozen: freeze.frozen,
    billable: ok && !freeze.frozen && plan !== 'free',
    plan,
  };
}

/**
 * Conciliación P1: hashes únicos + ProcessCheckpoint para unidades billables con processId.
 */
export async function reconcileMeteringWithCheckpoints(
  db: {
    processCheckpoint: {
      findMany: (args: {
        where: { processId: { in: string[] } };
        select: { processId: true };
      }) => Promise<{ processId: string }[]>;
    };
  },
  options?: { freezeOnFail?: boolean },
): Promise<MeterReconcileResult> {
  const base = reconcileMeteringWithLedger({ freezeOnFail: false });
  const events = readEvents();
  const linkedUnits: MeterUnit[] = ['ledger-commit', 'milestone-validated'];
  const processIds = [
    ...new Set(
      events
        .filter((e) => linkedUnits.includes(e.unit) && typeof e.processId === 'string' && e.processId.length > 0)
        .map((e) => e.processId as string),
    ),
  ];
  let missingCheckpoints: string[] = [];
  let checkpointLinked = 0;
  if (processIds.length > 0) {
    const found = await db.processCheckpoint.findMany({
      where: { processId: { in: processIds } },
      select: { processId: true },
    });
    const foundSet = new Set(found.map((r) => r.processId));
    missingCheckpoints = processIds.filter((id) => !foundSet.has(id));
    checkpointLinked = foundSet.size;
  }
  const ok = base.duplicateHashes.length === 0 && missingCheckpoints.length === 0;
  if (!ok && options?.freezeOnFail !== false) {
    const reason =
      base.duplicateHashes.length > 0
        ? `metering_duplicate_hashes:${base.duplicateHashes.slice(0, 3).join(',')}`
        : `metering_missing_checkpoint:${missingCheckpoints.slice(0, 3).join(',')}`;
    freezeBilling(reason);
  }
  const freeze = getBillingFreeze();
  const plan = resolvePlan();
  return {
    ...base,
    ok,
    missingCheckpoints,
    checkpointLinked,
    billingFrozen: freeze.frozen,
    billable: ok && !freeze.frozen && plan !== 'free',
    plan,
  };
}

/** Estimación factura IaaU del periodo (0 si free o frozen). */
export function estimateIaauInvoiceUsd(
  jurisdictionId = 'demo-jurisdiction',
  period?: string,
): { billable: boolean; amountUsd: number; reason: string } {
  const plan = resolvePlan();
  if (plan === 'free') {
    return { billable: false, amountUsd: 0, reason: 'plan=free (IaaU off)' };
  }
  const freeze = getBillingFreeze();
  if (freeze.frozen) {
    return { billable: false, amountUsd: 0, reason: `BILLING_FROZEN:${freeze.reason}` };
  }
  const summary = getUsageSummary(jurisdictionId, period);
  return {
    billable: summary.estimatedUsdDemo > 0,
    amountUsd: summary.estimatedUsdDemo,
    reason: 'iaau_usage',
  };
}

export function seedDemoMeteringIfEmpty() {
  if (readEvents().length > 0) return;
  recordMeterEvent({ unit: 'iap-envelope', quantity: 12, tier: 'M6' });
  recordMeterEvent({ unit: 'ledger-commit', quantity: 8, tier: 'M6' });
  recordMeterEvent({ unit: 'api-call', quantity: 240, tier: 'M6' });
  recordMeterEvent({ unit: 'sync-node', quantity: 2, tier: 'M6' });
}
