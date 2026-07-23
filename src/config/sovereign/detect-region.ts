import type { JurisdictionIso } from './jurisdictions.js';
import { HISPANIC_COUNTRY_CODES } from './jurisdictions.js';

export type GeoHint = {
  iso: JurisdictionIso | null;
  confidence: 'high' | 'medium' | 'low';
  hispanicRegion: boolean;
  signals: {
    timezone?: string;
    browserLocale?: string;
  };
};

const CO_TIMEZONES = new Set(['America/Bogota']);
const VE_TIMEZONES = new Set(['America/Caracas']);
const US_TIMEZONES = new Set([
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Detroit',
  'America/Indiana/Indianapolis',
]);

function regionFromLocale(lang: string): string | null {
  const parts = lang.split('-');
  return parts.length >= 2 ? parts[1]!.toUpperCase() : null;
}

/** Pista no autoritativa — solo UX PWA. El nodo institucional manda vía env/API. */
export function detectGeoHint(): GeoHint {
  if (typeof Intl === 'undefined') {
    return { iso: null, confidence: 'low', hispanicRegion: false, signals: {} };
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const browserLocale =
    typeof navigator !== 'undefined' ? navigator.language : undefined;
  const lang = browserLocale?.toLowerCase() ?? '';
  const region = regionFromLocale(lang);
  const hispanicRegion =
    lang.startsWith('es') || (region ? HISPANIC_COUNTRY_CODES.has(region) : false);

  const signals = { timezone, browserLocale };

  if (CO_TIMEZONES.has(timezone) || lang.startsWith('es-co') || region === 'CO') {
    return { iso: 'COL', confidence: 'high', hispanicRegion: true, signals };
  }

  if (VE_TIMEZONES.has(timezone) || lang.startsWith('es-ve') || region === 'VE') {
    return { iso: 'VEN', confidence: 'high', hispanicRegion: true, signals };
  }

  if (
    US_TIMEZONES.has(timezone) ||
    lang.startsWith('en-us') ||
    region === 'US'
  ) {
    return { iso: 'USA', confidence: 'high', hispanicRegion: false, signals };
  }

  if (hispanicRegion) {
    return { iso: null, confidence: 'medium', hispanicRegion: true, signals };
  }

  return { iso: null, confidence: 'low', hispanicRegion: false, signals };
}
