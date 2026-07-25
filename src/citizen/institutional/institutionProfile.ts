import type { JurisdictionIso } from '../../config/sovereign/jurisdictions.js';
import { jurisdictionByIso } from '../../config/sovereign/jurisdictions.js';
import { getPilotProfileForIso } from '../../pilot/pilot-jurisdiction-profiles.js';

export type InstitutionProfileDraft = {
  iso: JurisdictionIso;
  jurisdictionCode: string;
  currency: string;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  displayName: string;
  programName: string;
  territoryCode: string;
  fiscalYear: number;
  quarter: number;
  contactName: string;
  contactEmail: string;
  /** Partida anual estimada (editable; default = escala sandbox de la jurisdicción). */
  annualBaselineEstimate: number;
  updatedAt: string;
};

const STORAGE_KEY = 'agigov-institution-profile-v1';

export function profileFromIso(iso: JurisdictionIso): InstitutionProfileDraft {
  const j = jurisdictionByIso(iso) ?? jurisdictionByIso('GEN')!;
  const pilot = getPilotProfileForIso(iso);
  return {
    iso: j.iso,
    jurisdictionCode: j.jurisdictionCode,
    currency: j.currency,
    slug: pilot.slug,
    ministryCode: pilot.ministryCode,
    budgetCode: pilot.budgetCode,
    displayName: pilot.displayName,
    programName: pilot.programName,
    territoryCode: pilot.territoryCode,
    fiscalYear: 2026,
    quarter: 2,
    contactName: '',
    contactEmail: '',
    annualBaselineEstimate: pilot.egsScale.annualBaseline,
    updatedAt: new Date().toISOString(),
  };
}

export function loadInstitutionProfile(iso: JurisdictionIso): InstitutionProfileDraft {
  if (typeof window === 'undefined') return profileFromIso(iso);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return profileFromIso(iso);
    const parsed = JSON.parse(raw) as InstitutionProfileDraft;
    if (parsed.iso !== iso) {
      return {
        ...profileFromIso(iso),
        contactName: parsed.contactName,
        contactEmail: parsed.contactEmail,
      };
    }
    const defaults = profileFromIso(iso);
    return {
      ...defaults,
      ...parsed,
      annualBaselineEstimate:
        typeof parsed.annualBaselineEstimate === 'number' && parsed.annualBaselineEstimate > 0
          ? parsed.annualBaselineEstimate
          : defaults.annualBaselineEstimate,
    };
  } catch {
    return profileFromIso(iso);
  }
}

export function saveInstitutionProfile(profile: InstitutionProfileDraft): void {
  const next = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function slugifyInstitution(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}
