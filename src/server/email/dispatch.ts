import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { RenderedEmail } from './types.js';

export type DispatchChannel = 'outbox' | 'resend' | 'resend_failed' | 'log';

export type DispatchResult = {
  ok: boolean;
  channel: DispatchChannel;
  path?: string;
  providerId?: string;
  error?: string;
};

function outboxPath(): string {
  return (
    process.env.AGIGOV_EMAIL_OUTBOX_PATH?.trim() ||
    join(process.cwd(), 'data', 'email-outbox.jsonl')
  );
}

function emailMode(): string {
  return (process.env.AGIGOV_EMAIL_MODE ?? 'outbox').trim().toLowerCase();
}

function fromAddress(): string {
  return (
    process.env.AGIGOV_EMAIL_FROM?.trim() ||
    'AGIGOV <noreply@bold-street.com>'
  );
}

function replyToAddress(): string | undefined {
  const v = process.env.AGIGOV_EMAIL_REPLY_TO?.trim();
  return v || undefined;
}

function appendOutbox(
  email: RenderedEmail,
  extra?: Record<string, unknown>,
): string {
  const path = outboxPath();
  mkdirSync(dirname(path), { recursive: true });
  const record = {
    at: new Date().toISOString(),
    kind: email.kind,
    locale: email.locale,
    to: email.to,
    subject: email.subject,
    ticketId: email.ticketId,
    text: email.text,
    html: email.html,
    ...extra,
  };
  appendFileSync(path, `${JSON.stringify(record)}\n`, 'utf8');
  return path;
}

async function sendViaResend(email: RenderedEmail): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  const apiKey = process.env.AGIGOV_RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: 'AGIGOV_RESEND_API_KEY missing' };
  }

  const body: Record<string, unknown> = {
    from: fromAddress(),
    to: [email.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  const replyTo = replyToAddress();
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    name?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      error: json.message ?? json.name ?? `resend_http_${res.status}`,
    };
  }

  return { ok: true, id: json.id };
}

/**
 * Outbox siempre (auditoría). Si AGIGOV_EMAIL_MODE=resend → envío real.
 * Nunca incluye password ni tokens de ingest (plantillas ya lo evitan).
 */
export async function dispatchEmail(email: RenderedEmail): Promise<DispatchResult> {
  try {
    if (process.env.AGIGOV_EMAIL_LOG === '1') {
      console.log(`[email:${email.kind}] → ${email.to} · ${email.subject}`);
    }

    const mode = emailMode();
    if (mode === 'resend') {
      const sent = await sendViaResend(email);
      const path = appendOutbox(email, {
        channel: sent.ok ? 'resend' : 'resend_failed',
        providerId: sent.id,
        error: sent.error,
      });

      if (!sent.ok) {
        console.error('[email] Resend failed:', sent.error);
        return { ok: false, channel: 'resend_failed', path, error: sent.error };
      }

      return { ok: true, channel: 'resend', path, providerId: sent.id };
    }

    const path = appendOutbox(email, { channel: 'outbox' });
    return { ok: true, channel: 'outbox', path };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'email_dispatch_failed';
    console.error('[email] dispatch failed:', msg);
    try {
      const path = appendOutbox(email, { channel: 'outbox', error: msg });
      return { ok: false, channel: 'outbox', path, error: msg };
    } catch {
      return { ok: false, channel: 'outbox', error: msg };
    }
  }
}
