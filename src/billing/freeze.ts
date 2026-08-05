/**
 * Estado de facturación — FREEZE si metering ≠ ledger o panic.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const FREEZE_PATH = join(DATA_DIR, 'billing-freeze.json');

export type BillingFreezeState = {
  frozen: boolean;
  reason: string | null;
  frozenAt: string | null;
};

export function getBillingFreeze(): BillingFreezeState {
  if (!existsSync(FREEZE_PATH)) {
    return { frozen: false, reason: null, frozenAt: null };
  }
  try {
    return JSON.parse(readFileSync(FREEZE_PATH, 'utf8')) as BillingFreezeState;
  } catch {
    return { frozen: true, reason: 'corrupt-freeze-file', frozenAt: new Date().toISOString() };
  }
}

export function freezeBilling(reason: string): BillingFreezeState {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  const state: BillingFreezeState = {
    frozen: true,
    reason,
    frozenAt: new Date().toISOString(),
  };
  writeFileSync(FREEZE_PATH, `${JSON.stringify(state, null, 2)}\n`);
  return state;
}

export function clearBillingFreeze(): BillingFreezeState {
  if (existsSync(FREEZE_PATH)) unlinkSync(FREEZE_PATH);
  return { frozen: false, reason: null, frozenAt: null };
}

export function assertBillingNotFrozen(): void {
  const s = getBillingFreeze();
  if (s.frozen) {
    throw new Error(`BILLING_FROZEN: ${s.reason ?? 'unknown'} (centinela)`);
  }
}
