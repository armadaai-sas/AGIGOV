/**
 * P2 — tests unitarios billing (plan free-zero + seats limits + metering hash).
 * Sin DB. Uso: npm run test:billing
 */
import assert from 'node:assert/strict';

import { assertFreeCostZero, resolvePlan } from '../src/billing/plan.js';
import { buildChargeCatalog } from '../src/billing/catalog.js';
import {
  reconcileMeteringWithLedger,
  recordMeterEvent,
  getUsageSummary,
} from '../src/billing/metering.js';
import { computeEgsFeeInvoice } from '../src/billing/egs-fee.js';

function section(name: string) {
  console.log(`  ✓ ${name}`);
}

// plan free
{
  const r = assertFreeCostZero({
    AGIGOV_PLAN: 'free',
    AGIGOV_HOSTING: 'byo',
    AGIGOV_EMAIL_MODE: 'outbox',
    AGIGOV_AI_ENABLED: '0',
  });
  assert.equal(r.ok, true);
  assert.equal(resolvePlan({ AGIGOV_PLAN: 'saas' }), 'saas');
  section('free cost-zero ok');
}

{
  const bad = assertFreeCostZero({
    AGIGOV_PLAN: 'free',
    AGIGOV_HOSTING: 'agigov',
  });
  assert.equal(bad.ok, false);
  assert.ok(bad.violations.length >= 1);
  section('free + agigov hosting violates');
}

// catalog seats line
{
  const cat = buildChargeCatalog('saas');
  assert.ok(cat.lines.some((l) => l.id === 'saas-seat'));
  assert.equal(cat.iaauPrimary, 'milestone-validated');
  section('catalog includes saas-seat + IaaU primary');
}

// EGS fee only if Δ>0
{
  const pos = computeEgsFeeInvoice({
    baselineTrimestral: 1000,
    gastosVerificados: 800,
    ajustesFuerzaMayor: 0,
    egsAddonEnabled: true,
  });
  assert.equal(pos.billable, true);
  assert.ok(pos.feeAmount > 0);

  const neg = computeEgsFeeInvoice({
    baselineTrimestral: 1000,
    gastosVerificados: 1200,
    ajustesFuerzaMayor: 0,
    egsAddonEnabled: true,
  });
  assert.equal(neg.billable, false);
  assert.equal(neg.feeAmount, 0);
  section('EGS 10% only when Δ>0');
}

// metering reconcile (hash uniqueness; no freeze side-effect required)
{
  process.env.AGIGOV_PLAN = 'free';
  const before = reconcileMeteringWithLedger({ freezeOnFail: false });
  assert.equal(typeof before.ok, 'boolean');
  assert.ok(Array.isArray(before.duplicateHashes));
  assert.ok(Array.isArray(before.missingCheckpoints));
  recordMeterEvent({
    unit: 'api-call',
    quantity: 1,
    jurisdictionId: 'test-billing-p2',
    processId: undefined,
  });
  const summary = getUsageSummary('test-billing-p2');
  assert.ok(summary.totalUnits >= 1);
  section('metering record + reconcile shape');
}

console.log('[test:billing] OK');
