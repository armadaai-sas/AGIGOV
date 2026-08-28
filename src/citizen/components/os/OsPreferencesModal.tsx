import { LogOut, Settings2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  JURISDICTIONS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LOCALES,
  type JurisdictionIso,
  type SovereignLocale,
  type SupportedCurrency,
} from '../../../config/sovereign/index.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

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
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useInstitutionAuth();

  async function handleLogout() {
    await logout();
    onClose();
    navigate(INSTITUTION_ROUTES.login, {
      replace: true,
      state: { loggedOut: true },
    });
  }

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
          {isAuthenticated && session ? (
            <section className="rounded-xl border border-agigov-border bg-agigov-surface/50 p-4">
              <p className="text-sm font-medium text-agigov-text">{t('auth.badge')}</p>
              <p className="mt-1 text-sm text-agigov-text-muted">
                {session.institutionName?.trim() || session.email}
              </p>
              <button
                type="button"
                className="app-topbar-account-logout mt-3 w-full justify-center"
                onClick={() => void handleLogout()}
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                <span>{t('nav.logout')}</span>
              </button>
            </section>
          ) : null}

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
