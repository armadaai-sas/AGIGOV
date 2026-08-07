import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { resolveEffectiveEmailMode } from '../../billing/plan.js';
import type { RenderedEmail } from './types.js';

export type DispatchChannel = 'outbox' | 'resend' | 'resend_failed' | 'blocked' | 'log';

export type DispatchResult = {
  ok: boolean;
  channel: DispatchChannel;
  path?: string;
  providerId?: string;
  error?: string;
  attempts?: number;
};

function outboxPath(): string {
  return (
    process.env.AGIGOV_EMAIL_OUTBOX_PATH?.trim() ||
    join(process.cwd(), 'data', 'email-outbox.jsonl')
  );
}

function emailMode(): string {
  return resolveEffectiveEmailMode();
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

/** off | warn | enforce — default warn in non-prod, enforce if AGIGOV_EMAIL_ALLOWLIST_MODE set */
function allowlistMode(): 'off' | 'warn' | 'enforce' {
  const raw = (process.env.AGIGOV_EMAIL_ALLOWLIST_MODE ?? '').trim().toLowerCase();
  if (raw === 'off' || raw === 'warn' || raw === 'enforce') return raw;
  return 'warn';
}

function allowlistDomains(): string[] {
  const raw = process.env.AGIGOV_EMAIL_ALLOWLIST?.trim();
  if (!raw) {
    // Defaults for pre-prod / gov-style tests
    return [
      'bold-street.com',
      'armadaai.co',
      'gob.ve',
      'gob.co',
      'gov.co',
      'gov.ve',
      'edu.ve',
      'edu.co',
    ];
  }
  return raw
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

function emailDomain(email: string): string {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1).toLowerCase() : '';
}

/** Domain matches exact entry or is a subdomain of an allowed suffix (e.g. alcaldia.gob.ve). */
export function isEmailDomainAllowed(email: string): boolean {
  const domain = emailDomain(email);
  if (!domain) return false;
  const allowed = allowlistDomains();
  return allowed.some((entry) => domain === entry || domain.endsWith(`.${entry}`));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
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
  if (!apiKey || apiKey === 're_xxx') {
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
 * Outbox siempre (auditoría).
 * Allowlist + reintentos Resend (1m / 5m backoff corto en proceso: 0.5s / 1.5s / 3s).
 */
export async function dispatchEmail(email: RenderedEmail): Promise<DispatchResult> {
  try {
    if (process.env.AGIGOV_EMAIL_LOG === '1') {
      console.log(`[email:${email.kind}] → ${email.to} · ${email.subject}`);
    }

    const modeAllow = allowlistMode();
    const allowed = isEmailDomainAllowed(email.to);
    if (!allowed) {
      if (modeAllow === 'enforce') {
        const path = appendOutbox(email, {
          channel: 'blocked',
          error: 'domain_not_allowlisted',
        });
        console.warn(`[email] blocked (allowlist): ${emailDomain(email.to)}`);
        return { ok: false, channel: 'blocked', path, error: 'domain_not_allowlisted' };
      }
      if (modeAllow === 'warn') {
        console.warn(`[email] allowlist warn: ${emailDomain(email.to)} not in list`);
      }
    }

    const mode = emailMode();
    if (mode === 'resend') {
      const delaysMs = [0, 500, 1500, 3000];
      let lastError = 'resend_unknown';
      for (let i = 0; i < delaysMs.length; i++) {
        if (delaysMs[i]! > 0) await sleep(delaysMs[i]!);
        const sent = await sendViaResend(email);
        if (sent.ok) {
          const path = appendOutbox(email, {
            channel: 'resend',
            providerId: sent.id,
            attempts: i + 1,
          });
          return {
            ok: true,
            channel: 'resend',
            path,
            providerId: sent.id,
            attempts: i + 1,
          };
        }
        lastError = sent.error ?? 'resend_failed';
        console.error(`[email] Resend attempt ${i + 1} failed:`, lastError);
      }

      const path = appendOutbox(email, {
        channel: 'resend_failed',
        error: lastError,
        attempts: delaysMs.length,
      });
      return {
        ok: false,
        channel: 'resend_failed',
        path,
        error: lastError,
        attempts: delaysMs.length,
      };
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
