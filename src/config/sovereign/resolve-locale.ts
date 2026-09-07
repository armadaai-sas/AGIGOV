import type { JurisdictionIso, SovereignLocale } from './jurisdictions.js';
import { JURISDICTIONS } from './jurisdictions.js';
import type { GeoHint } from './detect-region.js';

/**
 * Idioma UI: español por defecto (AGIGOV es hispanohablante) → locale por país
 * (VEN/COL/USA) o preferencia explícita del usuario cuando exista.
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

  // Español por defecto: el contenido del escritorio está en español y la
  // audiencia es hispanohablante. El usuario puede cambiar idioma en Preferencias.
  return 'es';
}
