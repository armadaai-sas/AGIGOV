import type { InstitutionSession } from './institutionAuth.js';

export type InstitutionEntityType =
  | 'municipality'
  | 'ministry'
  | 'governorship'
  | 'agency'
  | 'other';

export type InstitutionRegistration = {
  entityType: InstitutionEntityType;
  legalName: string;
  officialCode: string;
  officialEmail: string;
  contactName: string;
  contactRole: string;
  passwordHash: string;
  acceptedTerms: boolean;
  registeredAt: string;
  /** ISO jurisdiction selected at register (VEN|COL|USA|…). */
  iso?: string;
  regionCode?: string;
  entityCatalogId?: string;
  phone?: string;
  phoneCountryCode?: string;
  verificationStatus?: string;
};

const STORAGE_KEY = 'agigov-institution-registration-v1';

export const EMPTY_REGISTRATION: InstitutionRegistration = {
  entityType: 'municipality',
  legalName: '',
  officialCode: '',
  officialEmail: '',
  contactName: '',
  contactRole: '',
  passwordHash: '',
  acceptedTerms: false,
  registeredAt: '',
  iso: '',
  regionCode: '',
  entityCatalogId: '',
  phone: '',
  phoneCountryCode: '',
  verificationStatus: '',
};

const ENTITY_TYPES = new Set<InstitutionEntityType>([
  'municipality',
  'ministry',
  'governorship',
  'agency',
  'other',
]);

function asEntityType(raw: string): InstitutionEntityType {
  return ENTITY_TYPES.has(raw as InstitutionEntityType)
    ? (raw as InstitutionEntityType)
    : 'other';
}

export function loadInstitutionRegistration(): InstitutionRegistration {
  if (typeof window === 'undefined') return { ...EMPTY_REGISTRATION };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_REGISTRATION };
    return { ...EMPTY_REGISTRATION, ...JSON.parse(raw) } as InstitutionRegistration;
  } catch {
    return { ...EMPTY_REGISTRATION };
  }
}

export function saveInstitutionRegistration(data: InstitutionRegistration): void {
  const next = { ...data, registeredAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function isInstitutionRegistrationComplete(): boolean {
  const r = loadInstitutionRegistration();
  return Boolean(
    r.legalName.trim() &&
      r.officialEmail.trim() &&
      r.passwordHash &&
      r.acceptedTerms &&
      r.registeredAt,
  );
}

export function clearInstitutionRegistration(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Tras login / magic-link / refresh: alinea el blob local con la sesión server
 * para que el piloto no exija re-registro ni muestre datos de otro usuario.
 */
export function syncRegistrationFromSession(session: InstitutionSession): void {
  const prev = loadInstitutionRegistration();
  const next: InstitutionRegistration = {
    ...prev,
    entityType: asEntityType(session.entityType),
    legalName: session.institutionName.trim() || prev.legalName,
    officialCode: session.officialCode?.trim() || prev.officialCode,
    officialEmail: session.email.trim() || prev.officialEmail,
    contactName: session.contactName?.trim() || prev.contactName,
    contactRole: session.contactRole?.trim() || prev.contactRole,
    passwordHash: 'server-managed',
    acceptedTerms: true,
    registeredAt: prev.registeredAt || session.issuedAt || new Date().toISOString(),
    iso: session.iso ?? prev.iso,
    regionCode: session.regionCode ?? prev.regionCode,
    entityCatalogId: session.entityCatalogId ?? prev.entityCatalogId,
    phone: session.phone ?? prev.phone,
    phoneCountryCode: session.phoneCountryCode ?? prev.phoneCountryCode,
    verificationStatus: session.verificationStatus ?? prev.verificationStatus,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
