import type { JurisdictionIso } from '../../../config/sovereign/jurisdictions.js';
import type { InstitutionEntityType } from '../institutionRegistration.js';

export type CatalogEntity = {
  id: string;
  name: string;
  officialCode?: string;
};

export type CatalogRegion = {
  code: string;
  name: string;
  entities: CatalogEntity[];
};

export type EntityCatalogByType = Partial<Record<InstitutionEntityType, CatalogRegion[]>>;

/** Prefijos telefónicos por jurisdicción (captura; OTP en fase posterior). */
export const PHONE_COUNTRY_CODES: Partial<Record<JurisdictionIso, string>> = {
  VEN: '+58',
  COL: '+57',
  USA: '+1',
  SBX: '+1',
  GEN: '+00',
};

const OTHER_ID = '__other__';

export const ENTITY_CATALOG_OTHER_ID = OTHER_ID;

const VEN: EntityCatalogByType = {
  municipality: [
    {
      code: 'MIR',
      name: 'Miranda',
      entities: [
        { id: 'ven-alc-chacao', name: 'Alcaldía de Chacao', officialCode: 'ALC-CHACAO' },
        { id: 'ven-alc-baruta', name: 'Alcaldía de Baruta', officialCode: 'ALC-BARUTA' },
        { id: 'ven-alc-sucre', name: 'Alcaldía de Sucre (Miranda)', officialCode: 'ALC-SUCRE-MIR' },
      ],
    },
    {
      code: 'DCS',
      name: 'Distrito Capital',
      entities: [
        { id: 'ven-alc-libertador', name: 'Alcaldía de Libertador', officialCode: 'ALC-LIBERTADOR' },
      ],
    },
    {
      code: 'ZUL',
      name: 'Zulia',
      entities: [
        { id: 'ven-alc-maracaibo', name: 'Alcaldía de Maracaibo', officialCode: 'ALC-MARACAIBO' },
      ],
    },
  ],
  governorship: [
    {
      code: 'EST',
      name: 'Estados',
      entities: [
        { id: 'ven-gob-miranda', name: 'Gobernación de Miranda', officialCode: 'GOB-MIR' },
        { id: 'ven-gob-zulia', name: 'Gobernación del Zulia', officialCode: 'GOB-ZUL' },
        { id: 'ven-gob-lara', name: 'Gobernación de Lara', officialCode: 'GOB-LAR' },
      ],
    },
  ],
  ministry: [
    {
      code: 'NAC',
      name: 'Nacional',
      entities: [
        { id: 'ven-min-mppi', name: 'Ministerio de Obras Públicas', officialCode: 'MPPI' },
        { id: 'ven-min-mppef', name: 'Ministerio de Economía y Finanzas', officialCode: 'MPPEF' },
      ],
    },
  ],
  agency: [
    {
      code: 'NAC',
      name: 'Nacional',
      entities: [
        { id: 'ven-agy-seniat', name: 'SENIAT', officialCode: 'SENIAT' },
      ],
    },
  ],
};

const COL: EntityCatalogByType = {
  municipality: [
    {
      code: 'ANT',
      name: 'Antioquia',
      entities: [
        { id: 'col-alc-medellin', name: 'Alcaldía de Medellín', officialCode: 'ALC-MDE' },
        { id: 'col-alc-envigado', name: 'Alcaldía de Envigado', officialCode: 'ALC-ENV' },
      ],
    },
    {
      code: 'CUN',
      name: 'Cundinamarca / Bogotá',
      entities: [
        { id: 'col-alc-bogota', name: 'Alcaldía Mayor de Bogotá', officialCode: 'ALC-BOG' },
      ],
    },
    {
      code: 'VAL',
      name: 'Valle del Cauca',
      entities: [
        { id: 'col-alc-cali', name: 'Alcaldía de Cali', officialCode: 'ALC-CAL' },
      ],
    },
  ],
  governorship: [
    {
      code: 'DEP',
      name: 'Departamentos',
      entities: [
        { id: 'col-gob-antioquia', name: 'Gobernación de Antioquia', officialCode: 'GOB-ANT' },
        { id: 'col-gob-valle', name: 'Gobernación del Valle del Cauca', officialCode: 'GOB-VAL' },
      ],
    },
  ],
  ministry: [
    {
      code: 'NAC',
      name: 'Nacional',
      entities: [
        { id: 'col-min-minhacienda', name: 'Ministerio de Hacienda', officialCode: 'MINHACIENDA' },
        { id: 'col-min-mintransporte', name: 'Ministerio de Transporte', officialCode: 'MINTRANSPORTE' },
      ],
    },
  ],
  agency: [
    {
      code: 'NAC',
      name: 'Nacional',
      entities: [
        { id: 'col-agy-dian', name: 'DIAN', officialCode: 'DIAN' },
      ],
    },
  ],
};

const USA: EntityCatalogByType = {
  municipality: [
    {
      code: 'CA',
      name: 'California',
      entities: [
        { id: 'usa-city-sf', name: 'City of San Francisco', officialCode: 'CA-SF' },
        { id: 'usa-city-la', name: 'City of Los Angeles', officialCode: 'CA-LA' },
      ],
    },
    {
      code: 'TX',
      name: 'Texas',
      entities: [
        { id: 'usa-city-austin', name: 'City of Austin', officialCode: 'TX-AUS' },
      ],
    },
    {
      code: 'NY',
      name: 'New York',
      entities: [
        { id: 'usa-city-nyc', name: 'City of New York', officialCode: 'NY-NYC' },
      ],
    },
  ],
  governorship: [
    {
      code: 'ST',
      name: 'States',
      entities: [
        { id: 'usa-st-ca', name: 'State of California', officialCode: 'ST-CA' },
        { id: 'usa-st-tx', name: 'State of Texas', officialCode: 'ST-TX' },
      ],
    },
  ],
  ministry: [
    {
      code: 'FED',
      name: 'Federal',
      entities: [
        { id: 'usa-dept-dot', name: 'U.S. Department of Transportation', officialCode: 'USDOT' },
        { id: 'usa-dept-treasury', name: 'U.S. Department of the Treasury', officialCode: 'USDT' },
      ],
    },
  ],
  agency: [
    {
      code: 'FED',
      name: 'Federal',
      entities: [
        { id: 'usa-agy-gsa', name: 'General Services Administration', officialCode: 'GSA' },
      ],
    },
  ],
};

const BY_ISO: Partial<Record<JurisdictionIso, EntityCatalogByType>> = {
  VEN,
  COL,
  USA,
  SBX: VEN,
};

export function getCatalogForIso(iso: JurisdictionIso): EntityCatalogByType {
  return BY_ISO[iso] ?? {};
}

export function getRegionsForType(
  iso: JurisdictionIso,
  entityType: InstitutionEntityType,
): CatalogRegion[] {
  return getCatalogForIso(iso)[entityType] ?? [];
}

export function findCatalogEntity(
  iso: JurisdictionIso,
  entityType: InstitutionEntityType,
  entityId: string,
): { region: CatalogRegion; entity: CatalogEntity } | null {
  for (const region of getRegionsForType(iso, entityType)) {
    const entity = region.entities.find((e) => e.id === entityId);
    if (entity) return { region, entity };
  }
  return null;
}

export function defaultPhoneCountryCode(iso: JurisdictionIso): string {
  return PHONE_COUNTRY_CODES[iso] ?? '+00';
}
