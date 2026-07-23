import type { JurisdictionIso, SovereignLocale } from './jurisdictions.js';
import { jurisdictionByIso } from './jurisdictions.js';
import { resolveSovereignConfig, type SovereignConfig } from './resolve-config.js';

export type NodeSovereignEnv = {
  iso: JurisdictionIso;
  jurisdictionCode: string;
  currency: string;
  locale: SovereignLocale;
  timezone: string;
  territoryCode: string;
};

/** Configuración autoritativa del nodo — .env en prod, no geo del navegador. */
export function loadNodeSovereignEnv(): NodeSovereignEnv {
  const isoRaw = (process.env.AGIGOV_ISO?.trim() || 'VEN').toUpperCase();
  const profile = jurisdictionByIso(isoRaw) ?? jurisdictionByIso('VEN')!;

  return {
    iso: profile.iso,
    jurisdictionCode: process.env.AGIGOV_JURISDICTION?.trim() || profile.jurisdictionCode,
    currency: process.env.AGIGOV_CURRENCY?.trim() || profile.currency,
    locale: (process.env.AGIGOV_LOCALE?.trim() || profile.locale) as SovereignLocale,
    timezone: process.env.AGIGOV_TIMEZONE?.trim() || profile.timezone,
    territoryCode: process.env.TERRITORY_CODE?.trim() || profile.territoryCode,
  };
}

export function buildPublicSovereignConfig(): SovereignConfig {
  const node = loadNodeSovereignEnv();
  return resolveSovereignConfig({
    nodeIso: node.iso,
    nodeCurrency: node.currency,
    nodeLocale: node.locale,
    geoHintIso: null,
  });
}

export function nodeIdentityFromEnv() {
  const node = loadNodeSovereignEnv();
  return {
    jurisdiction: node.jurisdictionCode,
    iso: node.iso,
    nodeId: process.env.ORIGIN_NODE_ID?.trim() || 'node-core-01',
    territoryCode: node.territoryCode,
    service: 'armada-public-api',
  };
}
