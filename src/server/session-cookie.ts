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

/**
 * Secure solo si HTTPS real o AGIGOV_COOKIE_SECURE=1.
 * No atar a NODE_ENV=production: prod-light en http://IP descarta cookies Secure.
 */
function cookieSecureAttribute(): string {
  const forced = (process.env.AGIGOV_COOKIE_SECURE ?? '').trim();
  if (forced === '1' || forced.toLowerCase() === 'true') return '; Secure';
  if (forced === '0' || forced.toLowerCase() === 'false') return '';
  const publicUrl = (process.env.AGIGOV_PUBLIC_URL ?? process.env.AGIGOV_APP_URL ?? '').trim();
  return publicUrl.toLowerCase().startsWith('https://') ? '; Secure' : '';
}

export function buildInstitutionSessionCookie(token: string, expiresAt: Date): string {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  return `${INSTITUTION_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${cookieSecureAttribute()}`;
}

export function clearInstitutionSessionCookie(): string {
  return `${INSTITUTION_SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${cookieSecureAttribute()}`;
}

/** Orígenes permitidos para CORS con credentials (PWA + API en host distinto). */
export function resolveCorsAllowOrigin(requestOrigin?: string): string | null {
  if (!requestOrigin?.trim()) return null;
  const origin = requestOrigin.trim();
  const configured = (process.env.AGIGOV_APP_URL ?? 'http://localhost:3000').trim().replace(/\/$/, '');
  const publicUrl = (process.env.AGIGOV_PUBLIC_URL ?? process.env.AGIGOV_APP_URL ?? '').trim().replace(/\/$/, '');
  const allowed = new Set([
    configured,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);
  if (publicUrl) allowed.add(publicUrl);
  const dropletHost = (process.env.DROPLET_HOST ?? process.env.AGIGOV_DROPLET_HOST ?? '').trim();
  if (dropletHost) {
    allowed.add(`http://${dropletHost}`);
    allowed.add(`http://${dropletHost}:3000`);
  }
  const extra = (process.env.AGIGOV_CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  for (const o of extra) allowed.add(o);
  return allowed.has(origin.replace(/\/$/, '')) ? origin : null;
}
