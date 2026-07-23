import type { JurisdictionIso, SovereignLocale } from './jurisdictions.js';
import { JURISDICTIONS } from './jurisdictions.js';
import type { GeoHint } from './detect-region.js';

/**
 * Idioma UI: inglés por defecto → español en hispanohablantes → locale por país.
 */
export function resolveUiLocale(input: {
  userLocale?: SovereignLocale | null;
  countryIso: JurisdictionIso;
  geoHint?: Pick<GeoHint, 'hispanicRegion'>;
  browserLang?: string;
}): SovereignLocale {
  if (input.userLocale) return input.userLocale;

  const profile = JURISDICTIONS[input.countryIso];
  if (profile.iso === 'VEN') return 'es-VE';
  if (profile.iso === 'COL') return 'es-CO';
  if (profile.iso === 'USA') return 'en-US';

  const lang = input.browserLang?.toLowerCase() ?? '';
  if (input.geoHint?.hispanicRegion || lang.startsWith('es')) return 'es';

  return 'en';
}
