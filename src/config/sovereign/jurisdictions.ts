/** Catálogo de jurisdicciones AGIGOV — fuente única para moneda, locale y nodo. */

export type JurisdictionIso = 'VEN' | 'COL' | 'USA' | 'SBX' | 'GEN';

export type SovereignLocale = 'en' | 'en-US' | 'es' | 'es-VE' | 'es-CO';

export type ConfigSource = 'node' | 'user' | 'geo-hint' | 'default';

export type JurisdictionProfile = {
  iso: JurisdictionIso;
  jurisdictionCode: string;
  label: string;
  currency: string;
  currencySymbol: string;
  /** Locale UI + formato numérico por defecto */
  locale: SovereignLocale;
  timezone: string;
  territoryCode: string;
  ministryCode: string;
  implementationId: 'ven' | 'col' | 'usa' | 'sbx' | 'generic';
  documentRef?: string;
  status: 'active' | 'pilot' | 'sandbox' | 'generic';
};

export const JURISDICTIONS: Record<JurisdictionIso, JurisdictionProfile> = {
  VEN: {
    iso: 'VEN',
    jurisdictionCode: 'AGIGOV-VEN',
    label: 'Venezuela',
    currency: 'VES',
    currencySymbol: 'Bs.',
    locale: 'es-VE',
    timezone: 'America/Caracas',
    territoryCode: 'MAR_NORTH_01',
    ministryCode: 'MPPI',
    implementationId: 'ven',
    documentRef: 'docs/AGIGOV/CARTA-AGIGOV-VEN.md',
    status: 'active',
  },
  COL: {
    iso: 'COL',
    jurisdictionCode: 'AGIGOV-COL',
    label: 'Colombia',
    currency: 'COP',
    currencySymbol: '$',
    locale: 'es-CO',
    timezone: 'America/Bogota',
    territoryCode: 'COL_PILOT_01',
    ministryCode: 'MINTRANS',
    implementationId: 'col',
    documentRef: 'docs/AGIGOV/ANEXO-AGIGOV-COL.md',
    status: 'pilot',
  },
  USA: {
    iso: 'USA',
    jurisdictionCode: 'AGIGOV-USA',
    label: 'United States',
    currency: 'USD',
    currencySymbol: 'US$',
    locale: 'en-US',
    timezone: 'America/New_York',
    territoryCode: 'USA_PILOT_01',
    ministryCode: 'USDOT',
    implementationId: 'usa',
    documentRef: 'docs/AGIGOV/ANEXO-LOCAL-TEMPLATE.md',
    status: 'pilot',
  },
  SBX: {
    iso: 'SBX',
    jurisdictionCode: 'AGIGOV-SBX',
    label: 'Sandbox interop',
    currency: 'USD',
    currencySymbol: 'US$',
    locale: 'en',
    timezone: 'UTC',
    territoryCode: 'SBX_WEST_01',
    ministryCode: 'DEMO',
    implementationId: 'sbx',
    documentRef: 'docs/AGIGOV/CARTA-AGIGOV-SBX.md',
    status: 'sandbox',
  },
  GEN: {
    iso: 'GEN',
    jurisdictionCode: 'AGIGOV',
    label: 'Global model',
    currency: 'USD',
    currencySymbol: 'US$',
    locale: 'es',
    timezone: 'UTC',
    territoryCode: 'GLOBAL',
    ministryCode: 'DEMO',
    implementationId: 'generic',
    documentRef: 'docs/AGIGOV/CARTA-AGIGOV-BASE.md',
    status: 'generic',
  },
};

export function jurisdictionByIso(iso: string): JurisdictionProfile | undefined {
  const key = iso.toUpperCase() as JurisdictionIso;
  return JURISDICTIONS[key];
}

export function jurisdictionByCode(code: string): JurisdictionProfile | undefined {
  return Object.values(JURISDICTIONS).find((j) => j.jurisdictionCode === code);
}

export const SUPPORTED_LOCALES: readonly SovereignLocale[] = [
  'en',
  'en-US',
  'es',
  'es-VE',
  'es-CO',
];

export const SUPPORTED_CURRENCIES = ['VES', 'COP', 'USD'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/** Hispanoamérica — sugiere español neutro si no hay país específico. */
export const HISPANIC_COUNTRY_CODES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GQ', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE',
]);
