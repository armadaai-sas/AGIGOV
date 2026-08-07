/** Cookie httpOnly para sesión institucional (Path=/). */
export const INSTITUTION_SESSION_COOKIE = 'agigov_institution_session';

export function parseCookieHeader(header?: string): Record<string, string> {
  if (!header?.trim()) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  }
  return out;
}

export function readInstitutionSessionTokenFromCookie(cookieHeader?: string): string | null {
  const token = parseCookieHeader(cookieHeader)[INSTITUTION_SESSION_COOKIE]?.trim();
  return token || null;
}

export function buildInstitutionSessionCookie(token: string, expiresAt: Date): string {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  const secure =
    (process.env.NODE_ENV ?? '').toLowerCase() === 'production' ||
    (process.env.AGIGOV_COOKIE_SECURE ?? '0') === '1'
      ? '; Secure'
      : '';
  return `${INSTITUTION_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function clearInstitutionSessionCookie(): string {
  const secure =
    (process.env.NODE_ENV ?? '').toLowerCase() === 'production' ||
    (process.env.AGIGOV_COOKIE_SECURE ?? '0') === '1'
      ? '; Secure'
      : '';
  return `${INSTITUTION_SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${secure}`;
}

/** Orígenes permitidos para CORS con credentials (PWA + API en host distinto). */
export function resolveCorsAllowOrigin(requestOrigin?: string): string | null {
  if (!requestOrigin?.trim()) return null;
  const origin = requestOrigin.trim();
  const configured = (process.env.AGIGOV_APP_URL ?? 'http://localhost:3000').trim().replace(/\/$/, '');
  const allowed = new Set([
    configured,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);
  const extra = (process.env.AGIGOV_CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  for (const o of extra) allowed.add(o);
  return allowed.has(origin.replace(/\/$/, '')) ? origin : null;
}
