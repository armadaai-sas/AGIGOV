/**
 * P4 — financiar un proyecto E2E: aporte → ledger ESCROW → raised público → escrow LOCKED/RELEASED.
 * Uso: npm run p4:finance-e2e
 * Requiere: Postgres seed (`npm run db:seed`) con proj-dao-* publicados.
 */
import 'dotenv/config';

import { getCoreDb, disconnectCoreDb } from '../src/db/client.js';
import { listPublicProjects } from '../src/pilot/projects-public.js';
import { registerContribution } from '../src/pilot/carta-ratification.js';
import {
  processVesPaymentWebhook,
  signVesWebhookBody,
} from '../src/pilot/payment-webhook.js';

function assert(name: string, cond: boolean): void {
  if (!cond) throw new Error(`P4 FAIL: ${name}`);
  console.log(`  ✓ ${name}`);
}

async function main(): Promise<void> {
  console.log('[P4] Finance project E2E');
  const origin = process.env.ORIGIN_NODE_ID?.trim() || 'node-mar-north-01';
  const projects = await listPublicProjects();
  assert('hay proyectos publicados', projects.length > 0);

  const project =
    projects.find((p) => p.territoryCode === 'MAR_NORTH_01' && !p.funded) ?? projects[0];
  assert(`proyecto seleccionado (${project.id})`, Boolean(project?.id));

  const beforeRaised = parseFloat(project.raisedAmount) || 0;
  const amount = 25;

  const receipt = await registerContribution(
    {
      projectId: project.id,
      amount,
      territoryCode: project.territoryCode || 'MAR_NORTH_01',
      currency: project.currency || 'VES',
    },
    origin,
  );
  assert('receipt con ledgerHash', Boolean(receipt.ledgerHash));

  const db = getCoreDb();
  const ledger = await db.ledgerEntry.findFirst({
    where: { entityId: receipt.receiptId, entryType: 'ESCROW' },
  });
  assert('ledger ESCROW entry', Boolean(ledger));

  const after = (await listPublicProjects()).find((p) => p.id === project.id);
  assert('proyecto visible tras aporte', Boolean(after));
  const afterRaised = parseFloat(after!.raisedAmount) || 0;
  assert('raisedAmount incrementó', afterRaised >= beforeRaised + amount - 0.0001);

  if (after!.escrow) {
    assert(
      'escrow no PENDING tras aporte (LOCKED|RELEASED|FROZEN)',
      after!.escrow.status !== 'PENDING',
    );
  }

  // Camino webhook HMAC (sin segundo aporte si secret vacío en prod — usar unsigned-dev)
  const payload = {
    externalRef: `p4-e2e-${Date.now()}`,
    projectId: project.id,
    amount: 10,
    status: 'paid' as const,
    territoryCode: project.territoryCode || 'MAR_NORTH_01',
    currency: project.currency || 'VES',
  };
  const rawBody = JSON.stringify(payload);
  const secret = 'p4-e2e-secret';
  const sig = signVesWebhookBody(rawBody, secret);
  const wh = await processVesPaymentWebhook(payload, origin, {
    rawBody,
    signatureHeader: `sha256=${sig}`,
    env: { ...process.env, AGIGOV_PAYMENT_WEBHOOK_SECRET: secret, NODE_ENV: 'test' },
  });
  assert('webhook HMAC → aporte ok', wh.ok === true && wh.signatureMode === 'verified');

  console.log('[P4] OK — proyecto financiable con trazabilidad pública');
  console.log(
    JSON.stringify(
      {
        projectId: project.id,
        raisedBefore: beforeRaised,
        raisedAfter: parseFloat(
          (await listPublicProjects()).find((p) => p.id === project.id)?.raisedAmount ?? '0',
        ),
        funded: (await listPublicProjects()).find((p) => p.id === project.id)?.funded ?? false,
        receiptId: receipt.receiptId,
        webhookReceiptId: wh.receipt?.receiptId,
      },
      null,
      2,
    ),
  );

  await disconnectCoreDb();
}

main().catch(async (e) => {
  console.error('[P4] FAIL:', e);
  await disconnectCoreDb();
  process.exit(1);
});
