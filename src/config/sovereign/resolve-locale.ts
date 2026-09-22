import type { JurisdictionIso, SovereignLocale } from './jurisdictions.js';
import { JURISDICTIONS } from './jurisdictions.js';
import type { GeoHint } from './detect-region.js';

/**
 * Idioma UI: español por defecto para todos los usuarios, porque el contenido
 * del escritorio está en español (aún no i18n-izado). Solo se respeta el idioma
 * cuando el usuario lo elige explícitamente en Preferencias (`userLocale`).
 *
 * Regionaliza dentro del español (VEN/COL) para formato y matices, pero no cae a
 * inglés por geografía/navegador: eso rompía la coherencia landing↔escritorio
 * (landing en inglés, interior en español). El inglés queda como opt-in manual.
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

  return 'es';
}
