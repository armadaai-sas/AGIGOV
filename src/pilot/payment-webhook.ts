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
}

/**
 * Pasarela VES piloto (Paso 7) — stub off-chain → on-ledger.
 * 👤 Producción: reemplazar validación HMAC del proveedor real.
 */
export async function processVesPaymentWebhook(
  payload: VesWebhookPayload,
  originNodeId: string,
): Promise<VesWebhookResult> {
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
    return { ok: true, message: 'Pago pendiente — sin registro en ledger' };
  }

  if (payload.status === 'failed') {
    return { ok: false, message: 'Pago fallido — sin registro en ledger' };
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
  };
}
