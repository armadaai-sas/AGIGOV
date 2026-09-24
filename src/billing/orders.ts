/**
 * Pedido de plan. No cobra tarjeta ni mueve dinero.
 * El estado queda pendiente hasta que una pasarela esté conectada.
 */
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

import { SAAS_ANNUAL_USD } from './catalog.js';

export type BillingOrderPlan = 'free' | 'saas' | 'sovereign';

export type BillingOrder = {
  id: string;
  plan: BillingOrderPlan;
  institutionName: string;
  email: string;
  amountUsd: number;
  currency: 'USD';
  status: 'pending' | 'no_charge';
  charged: false;
  createdAt: string;
  message: string;
};

export type PublicBillingPlan = {
  id: BillingOrderPlan;
  name: string;
  amountUsd: number;
  period: 'year' | 'none';
  summary: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function listPublicBillingPlans(): PublicBillingPlan[] {
  return [
    {
      id: 'free',
      name: 'Libre',
      amountUsd: 0,
      period: 'none',
      summary: 'Prueba con infraestructura propia. No hay cobro de licencia ni de uso.',
    },
    {
      id: 'saas',
      name: 'Licencia',
      amountUsd: SAAS_ANNUAL_USD.saas,
      period: 'year',
      summary: 'Licencia anual para una institución. Pedir el plan no cobra ninguna tarjeta.',
    },
    {
      id: 'sovereign',
      name: 'Soberana',
      amountUsd: SAAS_ANNUAL_USD.sovereign,
      period: 'year',
      summary: 'Licencia anual con asientos incluidos. Pedir el plan no cobra ninguna tarjeta.',
    },
  ];
}

export function createBillingOrder(
  input: { plan?: string; institutionName?: string; email?: string },
  filePath: string,
): BillingOrder {
  const plan = input.plan?.trim().toLowerCase();
  if (plan !== 'free' && plan !== 'saas' && plan !== 'sovereign') {
    throw new Error('Elige un plan: libre, licencia o soberana.');
  }
  const institutionName = input.institutionName?.trim() ?? '';
  const email = input.email?.trim().toLowerCase() ?? '';
  if (institutionName.length < 2) {
    throw new Error('Escribe el nombre de la institución.');
  }
  if (!EMAIL_RE.test(email)) {
    throw new Error('Escribe un correo válido.');
  }

  const priced = listPublicBillingPlans().find((item) => item.id === plan);
  const amountUsd = priced?.amountUsd ?? 0;
  const order: BillingOrder = {
    id: randomUUID(),
    plan,
    institutionName,
    email,
    amountUsd,
    currency: 'USD',
    status: amountUsd === 0 ? 'no_charge' : 'pending',
    charged: false,
    createdAt: new Date().toISOString(),
    message:
      amountUsd === 0
        ? 'Plan libre. No se realizó ningún cobro.'
        : 'Pedido registrado. No se cobró ninguna tarjeta. El pago queda pendiente hasta conectar una pasarela.',
  };

  mkdirSync(dirname(filePath), { recursive: true });
  appendFileSync(filePath, `${JSON.stringify(order)}\n`, 'utf8');
  return order;
}

export function readBillingOrders(filePath: string): BillingOrder[] {
  try {
    const raw = readFileSync(filePath, 'utf8');
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as BillingOrder);
  } catch {
    return [];
  }
}
