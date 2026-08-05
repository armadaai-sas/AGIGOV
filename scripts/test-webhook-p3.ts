/**
 * P3 — tests HMAC webhook (sin DB / sin HTTP server).
 * Uso: npm run test:webhook
 */
import assert from 'node:assert/strict';

import {
  parseSignatureHeader,
  signVesWebhookBody,
  verifyVesWebhookSignature,
} from '../src/pilot/payment-webhook.js';

const body = JSON.stringify({
  externalRef: 'pay-p3',
  projectId: 'proj-demo',
  amount: 100,
  status: 'paid',
});

{
  const secret = 'test-secret-p3';
  const sig = signVesWebhookBody(body, secret);
  const ok = verifyVesWebhookSignature({
    rawBody: body,
    signatureHeader: `sha256=${sig}`,
    env: { AGIGOV_PAYMENT_WEBHOOK_SECRET: secret, NODE_ENV: 'production' },
  });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.mode, 'verified');
  console.log('  ✓ HMAC verified in production');
}

{
  const bad = verifyVesWebhookSignature({
    rawBody: body,
    signatureHeader: 'sha256=deadbeef',
    env: { AGIGOV_PAYMENT_WEBHOOK_SECRET: 'test-secret-p3', NODE_ENV: 'production' },
  });
  assert.equal(bad.ok, false);
  console.log('  ✓ invalid signature rejected');
}

{
  const missing = verifyVesWebhookSignature({
    rawBody: body,
    env: { NODE_ENV: 'production' },
  });
  assert.equal(missing.ok, false);
  console.log('  ✓ production without secret rejected');
}

{
  const dev = verifyVesWebhookSignature({
    rawBody: body,
    env: { NODE_ENV: 'development' },
  });
  assert.equal(dev.ok, true);
  if (dev.ok) assert.equal(dev.mode, 'unsigned-dev');
  console.log('  ✓ unsigned-dev allowed outside production');
}

{
  assert.equal(parseSignatureHeader('sha256=abc'), 'abc');
  assert.equal(parseSignatureHeader('ABC'), 'abc');
  console.log('  ✓ signature header parse');
}

console.log('[test:webhook] OK');
