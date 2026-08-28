import { Settings2, X } from 'lucide-react';
import { useEffect } from 'react';

import {
  JURISDICTIONS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LOCALES,
  type JurisdictionIso,
  type SovereignLocale,
  type SupportedCurrency,
} from '../../../config/sovereign/index.js';
import { usePlatform, useSovereignConfig } from '../../context/PlatformContext.js';

const LOCALE_LABELS: Record<SovereignLocale, string> = {
  en: 'English',
  'en-US': 'English (US)',
  es: 'Español',
  'es-VE': 'Español (Venezuela)',
  'es-CO': 'Español (Colombia)',
};

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Preferencias — fuera del sidebar (patrón industria). */
export function OsPreferencesModal({ open, onClose }: Props) {
  const { sovereign, setSovereignPref, t } = useSovereignConfig();
  const { skinId, setSkinId } = usePlatform();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="os-modal-root" role="dialog" aria-modal="true" aria-labelledby="os-prefs-title">
      <button type="button" className="os-modal-backdrop" aria-label="Cerrar" onClick={onClose} />
      <div className="os-modal-panel os-modal-panel--narrow">
        <header className="os-modal-head">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-agigov-text-muted" aria-hidden />
            <h2 id="os-prefs-title" className="os-modal-title">
              Preferencias
            </h2>
          </div>
          <button type="button" className="os-modal-close" onClick={onClose} aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="os-modal-body space-y-4">
          <label className="os-field">
            <span>{t('settings.appearance')}</span>
            <select
              value={skinId}
              onChange={(e) => setSkinId(e.target.value === 'legacy' ? 'legacy' : 'trust')}
            >
              <option value="trust">{t('settings.theme.light')}</option>
              <option value="legacy">{t('settings.theme.dark')}</option>
            </select>
          </label>

          <label className="os-field">
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

          <label className="os-field">
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

          <details className="os-field-advanced">
            <summary>Tenant / jurisdicción (avanzado)</summary>
            <label className="os-field mt-3">
              <span>{t('settings.country')}</span>
              <select
                value={sovereign.iso}
                onChange={(e) => setSovereignPref({ iso: e.target.value as JurisdictionIso })}
              >
                {(Object.keys(JURISDICTIONS) as JurisdictionIso[]).map((iso) => (
                  <option key={iso} value={iso}>
                    {JURISDICTIONS[iso].label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs text-agigov-text-muted">
              La jurisdicción operativa se define en registro y piloto institucional.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
