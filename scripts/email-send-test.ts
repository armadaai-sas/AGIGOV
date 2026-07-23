#!/usr/bin/env tsx
/**
 * Prueba Resend — no imprime la API key.
 *
 * Uso:
 *   npx tsx scripts/email-send-test.ts tu@correo.com
 *
 * Requiere en .env:
 *   AGIGOV_EMAIL_MODE=resend
 *   AGIGOV_RESEND_API_KEY=re_...
 *   AGIGOV_EMAIL_FROM=AGIGOV <noreply@bold-street.com>
 */
import 'dotenv/config';

import { dispatchEmail } from '../src/server/email/dispatch.js';
import { renderAckEmail } from '../src/server/email/templates.js';
import { newTicketId } from '../src/server/email/index.js';

async function main(): Promise<void> {
  const to = process.argv[2]?.trim();
  if (!to || !to.includes('@')) {
    console.error('Uso: npx tsx scripts/email-send-test.ts destinatario@dominio.com');
    process.exit(1);
  }

  if ((process.env.AGIGOV_EMAIL_MODE ?? '').toLowerCase() !== 'resend') {
    console.error('Pon AGIGOV_EMAIL_MODE=resend en .env');
    process.exit(1);
  }
  if (!process.env.AGIGOV_RESEND_API_KEY?.trim()) {
    console.error('Falta AGIGOV_RESEND_API_KEY en .env');
    process.exit(1);
  }

  const ticketId = newTicketId();
  const email = renderAckEmail({
    institutionName: 'Prueba pre-prod',
    email: to,
    ticketId,
    locale: 'es',
  });

  const result = await dispatchEmail(email);
  console.log(JSON.stringify({ ticketId, ...result }, null, 2));
  if (!result.ok) process.exit(1);
  console.log('OK — revisa bandeja (y spam) del destinatario.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
