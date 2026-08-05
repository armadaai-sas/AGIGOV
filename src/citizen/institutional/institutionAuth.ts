import { syncRegistrationFromSession } from './institutionRegistration.js';

const SESSION_KEY = 'agigov-institution-session-v1';
const SESSION_TOKEN_KEY = 'agigov-institution-session-token-v1';
const API_BASE = import.meta.env.VITE_PUBLIC_API_URL ?? '';

export type InstitutionSession = {
  userId: string;
  email: string;
  institutionName: string;
  entityType: string;
  officialCode: string | null;
  contactName: string | null;
  contactRole: string | null;
  issuedAt: string;
  expiresAt: string;
  iso?: string | null;
  regionCode?: string | null;
  entityCatalogId?: string | null;
  phone?: string | null;
  phoneCountryCode?: string | null;
  verificationStatus?: string | null;
};

function persistSession(token: string, session: InstitutionSession): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  syncRegistrationFromSession(session);
}

function clearPersistedSession(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function loadInstitutionSession(): InstitutionSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as InstitutionSession;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveInstitutionSession(session: InstitutionSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearInstitutionSession(): void {
  clearPersistedSession();
}

export function getInstitutionSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

function buildSessionFromApi(payload: {
  id: string;
  email: string;
  institutionName: string;
  entityType: string;
  officialCode: string | null;
  contactName: string | null;
  contactRole: string | null;
  iso?: string | null;
  regionCode?: string | null;
  entityCatalogId?: string | null;
  phone?: string | null;
  phoneCountryCode?: string | null;
  verificationStatus?: string | null;
}, expiresAt: string): InstitutionSession {
  return {
    userId: payload.id,
    email: payload.email,
    institutionName: payload.institutionName,
    entityType: payload.entityType,
    officialCode: payload.officialCode,
    contactName: payload.contactName,
    contactRole: payload.contactRole,
    issuedAt: new Date().toISOString(),
    expiresAt,
    iso: payload.iso ?? null,
    regionCode: payload.regionCode ?? null,
    entityCatalogId: payload.entityCatalogId ?? null,
    phone: payload.phone ?? null,
    phoneCountryCode: payload.phoneCountryCode ?? null,
    verificationStatus: payload.verificationStatus ?? null,
  };
}

export function isInstitutionAuthenticated(): boolean {
  return loadInstitutionSession() !== null;
}

/** @deprecated No hashear passwords en cliente — el server usa scrypt. */
export async function hashInstitutionPassword(_password: string): Promise<string> {
  return 'server-managed';
}

export async function loginInstitution(
  email: string,
  password: string,
): Promise<{ ok: true; session: InstitutionSession } | { ok: false; error: 'invalid_credentials' | 'server_error' }> {
  const res = await fetch(`${API_BASE}/api/ops/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    sessionToken?: string;
    expiresAt?: string;
    user?: {
      id: string;
      email: string;
      institutionName: string;
      entityType: string;
      officialCode: string | null;
      contactName: string | null;
      contactRole: string | null;
    };
  };

  if (!res.ok || !json.sessionToken || !json.user || !json.expiresAt) {
    return { ok: false, error: json.error === 'invalid_credentials' ? 'invalid_credentials' : 'server_error' };
  }

  const session = buildSessionFromApi(json.user, json.expiresAt);
  persistSession(json.sessionToken, session);
  return { ok: true, session };
}

export async function registerInstitutionAuth(input: {
  email: string;
  password: string;
  institutionName: string;
  entityType: string;
  officialCode?: string;
  contactName?: string;
  contactRole?: string;
  iso?: string;
  regionCode?: string;
  entityCatalogId?: string;
  phone?: string;
  phoneCountryCode?: string;
}): Promise<{ ok: true; session: InstitutionSession } | { ok: false; error: 'email_already_registered' | 'invalid_registration_payload' | 'password_too_short' | 'server_error' }> {
  const res = await fetch(`${API_BASE}/api/ops/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(input),
  });

  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    sessionToken?: string;
    expiresAt?: string;
    user?: Parameters<typeof buildSessionFromApi>[0];
  };

  if (!res.ok || !json.sessionToken || !json.user || !json.expiresAt) {
    const err = json.error;
    if (
      err === 'email_already_registered' ||
      err === 'invalid_registration_payload' ||
      err === 'password_too_short'
    ) {
      return { ok: false, error: err };
    }
    return { ok: false, error: 'server_error' };
  }

  const session = buildSessionFromApi(json.user, json.expiresAt);
  persistSession(json.sessionToken, session);
  return { ok: true, session };
}

export async function refreshInstitutionSessionFromServer(): Promise<InstitutionSession | null> {
  const token = getInstitutionSessionToken();
  if (!token) {
    clearPersistedSession();
    return null;
  }

  const res = await fetch(`${API_BASE}/api/ops/auth/session`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    clearPersistedSession();
    return null;
  }

  const json = (await res.json()) as {
    sessionExpiresAt: string;
    user: {
      id: string;
      email: string;
      institutionName: string;
      entityType: string;
      officialCode: string | null;
      contactName: string | null;
      contactRole: string | null;
    };
  };

  const session = buildSessionFromApi(json.user, json.sessionExpiresAt);
  saveInstitutionSession(session);
  syncRegistrationFromSession(session);
  return session;
}

export async function bootstrapInstitutionSessionAfterRegister(
  _password: string,
): Promise<InstitutionSession | null> {
  return refreshInstitutionSessionFromServer();
}

export async function logoutInstitution(): Promise<void> {
  const token = getInstitutionSessionToken();
  if (token) {
    await fetch(`${API_BASE}/api/ops/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  clearPersistedSession();
}

/** Consume magic link from email (?magic=) → sesión server-side. */
export async function verifyInstitutionMagicLinkToken(
  magicToken: string,
): Promise<{ ok: true; session: InstitutionSession } | { ok: false; error: string }> {
  const res = await fetch(`${API_BASE}/api/ops/auth/magic-link/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ token: magicToken }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    sessionToken?: string;
    expiresAt?: string;
    user?: {
      id: string;
      email: string;
      institutionName: string;
      entityType: string;
      officialCode: string | null;
      contactName: string | null;
      contactRole: string | null;
    };
  };
  if (!res.ok || !json.sessionToken || !json.user || !json.expiresAt) {
    return { ok: false, error: json.error ?? 'invalid_magic_link' };
  }
  const session = buildSessionFromApi(json.user, json.expiresAt);
  persistSession(json.sessionToken, session);
  return { ok: true, session };
}
