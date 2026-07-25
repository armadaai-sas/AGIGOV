import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import { getCoreDb, type InstitutionSession, type InstitutionUser } from '../db/client.js';
import { sendActivationEmailOnly, sendRegistrationEmails } from './email/index.js';

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const MAGIC_LINK_TTL_MS = 1000 * 60 * 20;

export type InstitutionVerificationStatus =
  | 'unverified'
  | 'pending_verification'
  | 'verified'
  | 'rejected';

type PublicInstitutionUser = {
  id: string;
  email: string;
  institutionName: string;
  entityType: string;
  officialCode: string | null;
  contactName: string | null;
  contactRole: string | null;
  status: string;
  iso: string | null;
  regionCode: string | null;
  entityCatalogId: string | null;
  phone: string | null;
  phoneCountryCode: string | null;
  verificationStatus: InstitutionVerificationStatus;
};

type SessionBundle = {
  sessionToken: string;
  expiresAt: string;
  user: PublicInstitutionUser;
};

type RegisterInput = {
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
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function toPublicUser(user: InstitutionUser): PublicInstitutionUser {
  return {
    id: user.id,
    email: user.email,
    institutionName: user.institutionName,
    entityType: user.entityType,
    officialCode: user.officialCode,
    contactName: user.contactName,
    contactRole: user.contactRole,
    status: user.status,
    iso: user.iso ?? null,
    regionCode: user.regionCode ?? null,
    entityCatalogId: user.entityCatalogId ?? null,
    phone: user.phone ?? null,
    phoneCountryCode: user.phoneCountryCode ?? null,
    verificationStatus: (user.verificationStatus ??
      'pending_verification') as InstitutionVerificationStatus,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error('password_too_short');
  }
}

function hashPassword(password: string, salt: string): string {
  const key = scryptSync(password, salt, 64);
  return key.toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHex: string): boolean {
  const actual = Buffer.from(hashPassword(password, salt), 'hex');
  const expected = Buffer.from(expectedHex, 'hex');
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

async function createSessionForUser(user: InstitutionUser): Promise<SessionBundle> {
  const db = getCoreDb();
  const sessionToken = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.institutionSession.create({
    data: {
      userId: user.id,
      tokenHash: sha256(sessionToken),
      expiresAt,
    },
  });

  await db.institutionUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    sessionToken,
    expiresAt: expiresAt.toISOString(),
    user: toPublicUser(user),
  };
}

export async function registerInstitutionUser(input: RegisterInput): Promise<SessionBundle> {
  const email = normalizeEmail(input.email);
  validatePassword(input.password);
  if (!email || !input.institutionName.trim()) {
    throw new Error('invalid_registration_payload');
  }

  const db = getCoreDb();
  const existing = await db.institutionUser.findUnique({ where: { email } });
  if (existing) {
    throw new Error('email_already_registered');
  }

  const salt = randomBytes(16).toString('hex');
  const passwordHash = hashPassword(input.password, salt);

  const magicToken = randomBytes(24).toString('hex');
  const magicExpiry = new Date(Date.now() + MAGIC_LINK_TTL_MS);

  const catalogId = input.entityCatalogId?.trim() || null;
  const isOther = !catalogId || catalogId === '__other__';

  const user = await db.institutionUser.create({
    data: {
      email,
      institutionName: input.institutionName.trim(),
      entityType: input.entityType.trim() || 'other',
      officialCode: input.officialCode?.trim() || null,
      contactName: input.contactName?.trim() || null,
      contactRole: input.contactRole?.trim() || null,
      passwordSalt: salt,
      passwordHash,
      iso: input.iso?.trim().toUpperCase() || null,
      regionCode: input.regionCode?.trim() || null,
      entityCatalogId: catalogId,
      phone: input.phone?.trim() || null,
      phoneCountryCode: input.phoneCountryCode?.trim() || null,
      verificationStatus: 'pending_verification',
      verificationNotes: isOther
        ? 'Entity not in curated catalog — requires stricter public-channel review'
        : null,
      magicLinkHash: sha256(magicToken),
      magicLinkExpiry: magicExpiry,
    },
  });

  void sendRegistrationEmails({
    institutionName: user.institutionName,
    email: user.email,
    magicToken,
  }).catch((err) => {
    console.error('[auth] registration emails failed:', err);
  });

  return createSessionForUser(user);
}

export async function loginInstitutionUser(emailRaw: string, password: string): Promise<SessionBundle> {
  const email = normalizeEmail(emailRaw);
  validatePassword(password);

  const db = getCoreDb();
  const user = await db.institutionUser.findUnique({ where: { email } });
  if (!user || user.status !== 'active') {
    throw new Error('invalid_credentials');
  }
  if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    throw new Error('invalid_credentials');
  }

  return createSessionForUser(user);
}

function parseBearerToken(authorization?: string): string | null {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token.trim();
}

export async function resolveInstitutionSession(
  authorization?: string,
): Promise<(InstitutionSession & { user: InstitutionUser }) | null> {
  const token = parseBearerToken(authorization);
  if (!token) return null;

  const db = getCoreDb();
  const session = await db.institutionSession.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true },
  });
  if (!session || session.revokedAt) return null;
  if (session.expiresAt.getTime() <= Date.now()) return null;
  if (session.user.status !== 'active') return null;

  await db.institutionSession.update({
    where: { id: session.id },
    data: { lastSeenAt: new Date() },
  });
  return session;
}

export async function revokeInstitutionSession(authorization?: string): Promise<void> {
  const token = parseBearerToken(authorization);
  if (!token) return;
  const db = getCoreDb();
  await db.institutionSession.updateMany({
    where: { tokenHash: sha256(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function requestInstitutionMagicLink(emailRaw: string): Promise<{ ok: true; debugToken?: string }> {
  const email = normalizeEmail(emailRaw);
  if (!email) throw new Error('email_required');

  const db = getCoreDb();
  const user = await db.institutionUser.findUnique({ where: { email } });
  if (!user || user.status !== 'active') {
    return { ok: true };
  }

  const token = randomBytes(24).toString('hex');
  const expiry = new Date(Date.now() + MAGIC_LINK_TTL_MS);
  await db.institutionUser.update({
    where: { id: user.id },
    data: {
      magicLinkHash: sha256(token),
      magicLinkExpiry: expiry,
    },
  });

  void sendActivationEmailOnly({
    institutionName: user.institutionName,
    email: user.email,
    magicToken: token,
  }).catch((err) => {
    console.error('[auth] activation email failed:', err);
  });

  if (process.env.AGIGOV_MAGIC_LINK_DEBUG === '1') {
    return { ok: true, debugToken: token };
  }

  return { ok: true };
}

export async function verifyInstitutionMagicLink(token: string): Promise<SessionBundle> {
  if (!token.trim()) throw new Error('invalid_magic_link');
  const db = getCoreDb();
  const hash = sha256(token.trim());
  const user = await db.institutionUser.findFirst({
    where: {
      magicLinkHash: hash,
      magicLinkExpiry: { gt: new Date() },
      status: 'active',
    },
  });

  if (!user) throw new Error('invalid_magic_link');
  await db.institutionUser.update({
    where: { id: user.id },
    data: {
      magicLinkHash: null,
      magicLinkExpiry: null,
    },
  });

  return createSessionForUser(user);
}

export function toSessionResponse(session: InstitutionSession & { user: InstitutionUser }): {
  sessionExpiresAt: string;
  user: PublicInstitutionUser;
} {
  return {
    sessionExpiresAt: session.expiresAt.toISOString(),
    user: toPublicUser(session.user),
  };
}

/** Ops: actualizar verificación institucional tras revisión humana. */
export async function setInstitutionVerificationStatus(input: {
  email: string;
  status: InstitutionVerificationStatus;
  notes?: string;
}): Promise<PublicInstitutionUser> {
  const email = normalizeEmail(input.email);
  const allowed: InstitutionVerificationStatus[] = [
    'unverified',
    'pending_verification',
    'verified',
    'rejected',
  ];
  if (!allowed.includes(input.status)) {
    throw new Error('invalid_verification_status');
  }

  const db = getCoreDb();
  const user = await db.institutionUser.update({
    where: { email },
    data: {
      verificationStatus: input.status,
      verificationNotes: input.notes?.trim() || null,
    },
  });
  return toPublicUser(user);
}
