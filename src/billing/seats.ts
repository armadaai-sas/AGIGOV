/**
 * SaaS seats P1 — cupo de operadores por PilotTenant.
 */
import type { CoreDb } from '../db/client.js';
import { type AgigovPlan } from './plan.js';

export type SeatSnapshot = {
  slug: string;
  saasPlan: string;
  seatLimit: number;
  activeSeats: number;
  emails: string[];
  seatsAvailable: number;
};

function asEmails(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === 'string')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getTenantSeats(db: CoreDb, slug: string): Promise<SeatSnapshot | null> {
  const tenant = await db.pilotTenant.findUnique({ where: { slug } });
  if (!tenant) return null;
  const emails = asEmails(tenant.activeSeatEmails);
  return {
    slug: tenant.slug,
    saasPlan: tenant.saasPlan,
    seatLimit: tenant.seatLimit,
    activeSeats: emails.length,
    emails,
    seatsAvailable: Math.max(0, tenant.seatLimit - emails.length),
  };
}

export async function claimTenantSeat(
  db: CoreDb,
  slug: string,
  email: string,
): Promise<SeatSnapshot> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes('@')) throw new Error('email inválido');

  const tenant = await db.pilotTenant.findUnique({ where: { slug } });
  if (!tenant) throw new Error(`Tenant no encontrado: ${slug}`);

  const emails = asEmails(tenant.activeSeatEmails);
  if (emails.includes(normalized)) {
    return {
      slug,
      saasPlan: tenant.saasPlan,
      seatLimit: tenant.seatLimit,
      activeSeats: emails.length,
      emails,
      seatsAvailable: Math.max(0, tenant.seatLimit - emails.length),
    };
  }

  const isFree = (tenant.saasPlan || 'free') === 'free';
  const limit = isFree ? 1 : tenant.seatLimit;
  if (emails.length >= limit) {
    throw new Error(`seatLimit alcanzado (${limit}) — upgrade saas`);
  }

  const next = [...emails, normalized];
  const updated = await db.pilotTenant.update({
    where: { id: tenant.id },
    data: {
      activeSeatEmails: next,
      ...(isFree && tenant.seatLimit !== 1 ? { seatLimit: 1 } : {}),
    },
  });

  return {
    slug,
    saasPlan: updated.saasPlan,
    seatLimit: updated.seatLimit,
    activeSeats: next.length,
    emails: next,
    seatsAvailable: Math.max(0, updated.seatLimit - next.length),
  };
}

export async function setTenantSaasPlan(
  db: CoreDb,
  slug: string,
  plan: AgigovPlan,
  seatLimit?: number,
): Promise<SeatSnapshot> {
  const defaults = plan === 'free' ? 1 : plan === 'saas' ? 10 : 50;
  const updated = await db.pilotTenant.update({
    where: { slug },
    data: {
      saasPlan: plan,
      seatLimit: seatLimit ?? defaults,
    },
  });
  const emails = asEmails(updated.activeSeatEmails);
  return {
    slug,
    saasPlan: updated.saasPlan,
    seatLimit: updated.seatLimit,
    activeSeats: emails.length,
    emails,
    seatsAvailable: Math.max(0, updated.seatLimit - emails.length),
  };
}
