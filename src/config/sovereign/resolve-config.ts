import type { ConfigSource, JurisdictionIso, SovereignLocale, SupportedCurrency } from './jurisdictions.js';
import { JURISDICTIONS, jurisdictionByIso } from './jurisdictions.js';

export type SovereignConfig = {
  iso: JurisdictionIso;
  jurisdictionCode: string;
  label: string;
  currency: SupportedCurrency;
  currencySymbol: string;
  locale: SovereignLocale;
  timezone: string;
  territoryCode: string;
  ministryCode: string;
  implementationId: 'ven' | 'col' | 'usa' | 'sbx' | 'generic';
  source: ConfigSource;
  geoHintIso: JurisdictionIso | null;
};

export type ResolveSovereignInput = {
  nodeIso?: string;
  nodeCurrency?: string;
  nodeLocale?: string;
  userIso?: string | null;
  userCurrency?: string | null;
  userLocale?: string | null;
  geoHintIso?: JurisdictionIso | null;
};

export function resolveSovereignConfig(input: ResolveSovereignInput): SovereignConfig {
  let iso: JurisdictionIso = 'GEN';
  let source: ConfigSource = 'default';

  if (input.userIso && jurisdictionByIso(input.userIso)) {
    iso = input.userIso.toUpperCase() as JurisdictionIso;
    source = 'user';
  } else if (input.nodeIso && jurisdictionByIso(input.nodeIso)) {
    iso = input.nodeIso.toUpperCase() as JurisdictionIso;
    source = 'node';
  } else if (input.geoHintIso && jurisdictionByIso(input.geoHintIso)) {
    iso = input.geoHintIso;
    source = 'geo-hint';
  }

  const profile = JURISDICTIONS[iso];
  const currency = (input.userCurrency ??
    input.nodeCurrency ??
    profile.currency) as SupportedCurrency;
  const locale = (input.userLocale ?? input.nodeLocale ?? profile.locale) as SovereignLocale;

  return {
    iso: profile.iso,
    jurisdictionCode: profile.jurisdictionCode,
    label: profile.label,
    currency,
    currencySymbol: profile.currencySymbol,
    locale,
    timezone: profile.timezone,
    territoryCode: profile.territoryCode,
    ministryCode: profile.ministryCode,
    implementationId: profile.implementationId,
    source,
    geoHintIso: input.geoHintIso ?? null,
  };
}

export function formatSovereignAmount(
  value: string | number,
  config: Pick<SovereignConfig, 'locale' | 'currency' | 'currencySymbol'>,
  options?: { showCode?: boolean },
): string {
  const n = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(n)) return String(value);

  const formatted = n.toLocaleString(
    config.locale === 'en' || config.locale === 'en-US' ? 'en-US' : config.locale,
    {
      maximumFractionDigits: config.currency === 'COP' || config.currency === 'VES' ? 0 : 2,
      minimumFractionDigits: 0,
    },
  );

  if (options?.showCode) {
    return `${formatted} ${config.currency}`;
  }
  return formatted;
}
