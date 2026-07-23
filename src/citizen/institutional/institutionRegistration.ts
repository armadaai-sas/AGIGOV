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
};

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
