/**
 * Pasarela VES — webhook off-chain → ledger con verificación HMAC-SHA256.
 *
 * Header: `X-Agigov-Signature: sha256=<hex>`
 * Body canónico: JSON.stringify(payload) UTF-8 (mismo orden que envió el proveedor).
 *
 * Si `AGIGOV_PAYMENT_WEBHOOK_SECRET` está vacío:
 * - modo `development` / free demo: acepta con `signatureMode: 'unsigned-dev'`
 * - `NODE_ENV=production`: rechaza 401 (no stub abierto en prod)
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { registerContribution, type ContributionReceipt } from './carta-ratification.js';

export interface VesWebhookPayload {
  externalRef: string;
  projectId: string;
  amount: number;
  status: 'paid' | 'failed' | 'pending';
  territoryCode?: string;
  currency?: string;
}

export interface VesWebhookResult {
  ok: boolean;
  message: string;
  receipt?: ContributionReceipt;
  signatureMode?: 'verified' | 'unsigned-dev';
}

export class WebhookAuthError extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = 'WebhookAuthError';
  }
}

function webhookSecret(env: NodeJS.ProcessEnv = process.env): string {
  return (env.AGIGOV_PAYMENT_WEBHOOK_SECRET ?? '').trim();
}

function isProd(env: NodeJS.ProcessEnv = process.env): boolean {
  return (env.NODE_ENV ?? '').trim().toLowerCase() === 'production';
}

/** Firma HMAC-SHA256 hex del raw body (o del JSON canónico). */
export function signVesWebhookBody(rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
}

export function parseSignatureHeader(header: string | undefined): string | null {
  if (!header?.trim()) return null;
  const v = header.trim();
  if (v.toLowerCase().startsWith('sha256=')) return v.slice(7).trim().toLowerCase();
  return v.toLowerCase();
}

export function verifyVesWebhookSignature(input: {
  rawBody: string;
  signatureHeader?: string;
  env?: NodeJS.ProcessEnv;
}): { ok: true; mode: 'verified' | 'unsigned-dev' } | { ok: false; reason: string } {
  const env = input.env ?? process.env;
  const secret = webhookSecret(env);
  if (!secret) {
    if (isProd(env)) {
      return { ok: false, reason: 'webhook_secret_required_in_production' };
    }
    return { ok: true, mode: 'unsigned-dev' };
  }

  const provided = parseSignatureHeader(input.signatureHeader);
  if (!provided) return { ok: false, reason: 'missing_signature' };

  const expected = signVesWebhookBody(input.rawBody, secret);
  try {
    const a = Buffer.from(provided, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: 'invalid_signature' };
    }
  } catch {
    return { ok: false, reason: 'invalid_signature' };
  }
  return { ok: true, mode: 'verified' };
}

export async function processVesPaymentWebhook(
  payload: VesWebhookPayload,
  originNodeId: string,
  options?: {
    rawBody?: string;
    signatureHeader?: string;
    env?: NodeJS.ProcessEnv;
  },
): Promise<VesWebhookResult> {
  const rawBody =
    options?.rawBody ??
    JSON.stringify({
      externalRef: payload.externalRef,
      projectId: payload.projectId,
      amount: payload.amount,
      status: payload.status,
      territoryCode: payload.territoryCode,
      currency: payload.currency,
    });

  const auth = verifyVesWebhookSignature({
    rawBody,
    signatureHeader: options?.signatureHeader,
    env: options?.env,
  });
  if (auth.ok === false) {
    throw new WebhookAuthError(auth.reason);
  }
  const signatureMode = auth.mode;

  if (!payload.externalRef?.trim()) {
    throw new Error('externalRef requerido');
  }
  if (!payload.projectId?.trim()) {
    throw new Error('projectId requerido');
  }
  if (typeof payload.amount !== 'number' || payload.amount <= 0) {
    throw new Error('amount inválido');
  }

  if (payload.status === 'pending') {
    return {
      ok: true,
      message: 'Pago pendiente — sin registro en ledger',
      signatureMode,
    };
  }

  if (payload.status === 'failed') {
    return {
      ok: false,
      message: 'Pago fallido — sin registro en ledger',
      signatureMode,
    };
  }

  const receipt = await registerContribution(
    {
      projectId: payload.projectId,
      amount: payload.amount,
      territoryCode: payload.territoryCode,
      currency: payload.currency ?? 'VES',
    },
    originNodeId,
  );

  return {
    ok: true,
    message: `Aporte registrado desde pasarela (${payload.externalRef})`,
    receipt,
    signatureMode,
  };
}
