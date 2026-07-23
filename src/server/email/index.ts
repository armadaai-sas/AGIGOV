import { randomBytes } from 'node:crypto';

import type { EmailLocale } from './types.js';
import { dispatchEmail } from './dispatch.js';
import {
  renderAckEmail,
  renderActivationEmail,
  renderBaselineReadyEmail,
} from './templates.js';

const MAGIC_TTL_MIN = 20;

export function newTicketId(): string {
  return `tkt_${randomBytes(6).toString('hex')}`;
}

function localeFromEnv(): EmailLocale {
  const loc = (process.env.AGIGOV_LOCALE ?? 'es').toLowerCase();
  return loc.startsWith('en') ? 'en' : 'es';
}

function appBaseUrl(): string {
  return (
    process.env.AGIGOV_APP_URL?.replace(/\/$/, '') ||
    process.env.APP_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  );
}

/** Tras registro: ACK + activación (magic link URL ya emitida). */
export async function sendRegistrationEmails(input: {
  institutionName: string;
  email: string;
  magicToken: string;
  ticketId?: string;
  locale?: EmailLocale;
}): Promise<{ ticketId: string }> {
  const ticketId = input.ticketId ?? newTicketId();
  const locale = input.locale ?? localeFromEnv();
  const magicLinkUrl = `${appBaseUrl()}/institucional/acceso?magic=${encodeURIComponent(input.magicToken)}&ref=${encodeURIComponent(ticketId)}`;

  await dispatchEmail(
    renderAckEmail({
      institutionName: input.institutionName,
      email: input.email,
      ticketId,
      locale,
    }),
  );

  await dispatchEmail(
    renderActivationEmail({
      institutionName: input.institutionName,
      email: input.email,
      ticketId,
      magicLinkUrl,
      ttlMinutes: MAGIC_TTL_MIN,
      locale,
    }),
  );

  return { ticketId };
}

/** Reenvío solo de activación (desde magic-link/request). */
export async function sendActivationEmailOnly(input: {
  institutionName: string;
  email: string;
  magicToken: string;
  ticketId?: string;
  locale?: EmailLocale;
}): Promise<{ ticketId: string }> {
  const ticketId = input.ticketId ?? newTicketId();
  const locale = input.locale ?? localeFromEnv();
  const magicLinkUrl = `${appBaseUrl()}/institucional/acceso?magic=${encodeURIComponent(input.magicToken)}&ref=${encodeURIComponent(ticketId)}`;

  await dispatchEmail(
    renderActivationEmail({
      institutionName: input.institutionName,
      email: input.email,
      ticketId,
      magicLinkUrl,
      ttlMinutes: MAGIC_TTL_MIN,
      locale,
    }),
  );

  return { ticketId };
}

/** Tras baseline ratificada → ingest_ready. Sin token ingest en el cuerpo. */
export async function sendBaselineReadyEmail(input: {
  institutionName: string;
  email: string;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  ticketId?: string;
  locale?: EmailLocale;
}): Promise<{ ticketId: string }> {
  const ticketId = input.ticketId ?? newTicketId();
  const locale = input.locale ?? localeFromEnv();

  await dispatchEmail(
    renderBaselineReadyEmail({
      institutionName: input.institutionName,
      email: input.email,
      ticketId,
      slug: input.slug,
      ministryCode: input.ministryCode,
      budgetCode: input.budgetCode,
      locale,
    }),
  );

  return { ticketId };
}
