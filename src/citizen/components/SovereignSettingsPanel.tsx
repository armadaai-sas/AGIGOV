import { Settings2 } from 'lucide-react';
import { useState } from 'react';

import {
  JURISDICTIONS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LOCALES,
  type JurisdictionIso,
  type SovereignLocale,
  type SupportedCurrency,
} from '../../config/sovereign/index.js';
import { useSovereignConfig } from '../context/PlatformContext.js';

const LOCALE_LABELS: Record<SovereignLocale, string> = {
  en: 'English',
  'en-US': 'English (US)',
  es: 'Español',
  'es-VE': 'Español (Venezuela)',
  'es-CO': 'Español (Colombia)',
};

/** Panel compacto — país, moneda, idioma. */
export function SovereignSettingsPanel({ compact = false }: { compact?: boolean }) {
  const { sovereign, setSovereignPref, t } = useSovereignConfig();
  const [open, setOpen] = useState(false);

  if (compact && !open) {
    return (
      <button
        type="button"
        className="app-sidebar-skin-btn"
        title={t('settings.region')}
        onClick={() => setOpen(true)}
        aria-label={t('settings.region')}
      >
        <Settings2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="agigov-sovereign-settings">
      <div className="agigov-sovereign-settings-head">
        <Settings2 className="h-4 w-4 opacity-70" aria-hidden />
        {!compact ? <span className="agigov-sovereign-settings-title">{t('settings.region')}</span> : null}
        {compact ? (
          <button type="button" className="agigov-sovereign-settings-close" onClick={() => setOpen(false)}>
            ×
          </button>
        ) : null}
      </div>

      <label className="agigov-sovereign-field">
        <span>{t('settings.country')}</span>
        <select
          value={sovereign.iso}
          onChange={(e) => setSovereignPref({ iso: e.target.value as JurisdictionIso })}
        >
          {(Object.keys(JURISDICTIONS) as JurisdictionIso[]).map((iso) => (
            <option key={iso} value={iso}>
              {JURISDICTIONS[iso].label} ({JURISDICTIONS[iso].jurisdictionCode})
            </option>
          ))}
        </select>
      </label>

      <label className="agigov-sovereign-field">
        <span>{t('settings.currency')}</span>
        <select
          value={sovereign.currency}
          onChange={(e) =>
            setSovereignPref({ currency: e.target.value as SupportedCurrency })
          }
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="agigov-sovereign-field">
        <span>{t('settings.language')}</span>
        <select
          value={sovereign.locale}
          onChange={(e) =>
            setSovereignPref({ locale: e.target.value as SovereignLocale })
          }
        >
          {SUPPORTED_LOCALES.map((loc) => (
            <option key={loc} value={loc}>
              {LOCALE_LABELS[loc]}
            </option>
          ))}
        </select>
      </label>

      <p className="agigov-sovereign-hint">
        {t('settings.source')}: <strong>{sovereign.source}</strong>
        {sovereign.source === 'geo-hint' ? ` ${t('settings.source.geo')}` : ''}
        {sovereign.source === 'node' ? ` ${t('settings.source.node')}` : ''}
      </p>
    </div>
  );
}
