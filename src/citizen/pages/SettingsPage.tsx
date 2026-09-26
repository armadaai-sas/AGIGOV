import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import {
  JURISDICTIONS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LOCALES,
  type JurisdictionIso,
  type SovereignLocale,
  type SupportedCurrency,
} from '../../config/sovereign/index.js';
import { fetchBillingPlans, fetchBillingUsage } from '../api.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { loginPathWithRedirect } from '../institutional/authRedirect.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { humanizeIaauUnit } from '../platform/iaauMetrics.js';
import { getDeskPageMeta } from '../platform/deskPageMeta.js';

const meta = getDeskPageMeta('/ajustes')!;

const LOCALE_LABELS: Record<SovereignLocale, string> = {
  en: 'English',
  'en-US': 'English (US)',
  es: 'Español',
  'es-VE': 'Español (Venezuela)',
  'es-CO': 'Español (Colombia)',
};

function money(amount: number): string {
  if (amount === 0) return '0 USD';
  return `${amount.toLocaleString('en-US')} USD / año`;
}

export default function SettingsPage() {
  const { sovereign, setSovereignPref, t } = useSovereignConfig();
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useInstitutionAuth();
  const plans = useCachedFetch('billing-plans', fetchBillingPlans, 60_000);
  const usage = useCachedFetch('settings-usage', () => fetchBillingUsage(), 30_000);

  async function handleLogout() {
    await logout();
    navigate(INSTITUTION_ROUTES.login, { replace: true, state: { loggedOut: true } });
  }

  const units = Object.entries(usage.data?.summary.byUnit ?? {});

  return (
    <PageShell shell>
      <div className="desk-page">
        <DeskPageHeader title="Ajustes" result={meta.result} dataHint={meta.dataHint} />

        <section className="desk-settings-section">
          <h2 className="desk-page-title">Cuenta</h2>
          {isAuthenticated && session ? (
            <>
              <p className="desk-page-result">{session.institutionName?.trim() || session.email}</p>
              <button type="button" className="ds-btn-secondary" onClick={() => void handleLogout()}>
                <LogOut className="h-4 w-4" aria-hidden />
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <p className="desk-page-result">
              <Link to={loginPathWithRedirect('/ajustes')}>Iniciar sesión</Link>
              <span aria-hidden> · </span>
              <Link to={INSTITUTION_ROUTES.register}>Crear cuenta</Link>
            </p>
          )}
        </section>

        <section className="desk-settings-section">
          <h2 className="desk-page-title">Región</h2>
          <div className="desk-billing-form">
            <label className="os-field">
              <span className="os-form-label">{t('settings.language')}</span>
              <select
                className="os-form-input"
                value={sovereign.locale}
                onChange={(e) => setSovereignPref({ locale: e.target.value as SovereignLocale })}
              >
                {SUPPORTED_LOCALES.map((loc) => (
                  <option key={loc} value={loc}>
                    {LOCALE_LABELS[loc]}
                  </option>
                ))}
              </select>
            </label>
            <label className="os-field">
              <span className="os-form-label">{t('settings.currency')}</span>
              <select
                className="os-form-input"
                value={sovereign.currency}
                onChange={(e) => setSovereignPref({ currency: e.target.value as SupportedCurrency })}
              >
                {SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
            <label className="os-field">
              <span className="os-form-label">País</span>
              <select
                className="os-form-input"
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
          </div>
        </section>

        <section className="desk-settings-section">
          <h2 className="desk-page-title">Plan</h2>
          <p className="desk-page-result">
            El plan activo del servicio es {usage.data?.plan ?? '…'}. Elegir otro plan no cobra la tarjeta.
          </p>
          <ul className="desk-page-list">
            {(plans.data?.plans ?? []).map((item) => (
              <li key={item.id} className="desk-page-row">
                <span className="desk-page-row-copy">
                  <span className="desk-page-row-title">{item.name}</span>
                  <span className="desk-page-row-summary">{item.summary}</span>
                </span>
                <span className="desk-page-row-meta">{money(item.amountUsd)}</span>
              </li>
            ))}
          </ul>
          <p className="desk-page-data-hint">
            <Link to="/facturacion">Pedir un plan</Link>
          </p>
        </section>

        <section className="desk-settings-section">
          <h2 className="desk-page-title">Uso de modelos</h2>
          <p className="desk-page-result">
            {usage.data
              ? `${usage.data.summary.totalUnits} unidades en ${usage.data.summary.period}. Esto no es una factura.`
              : 'Cargando el uso medido.'}
          </p>
          {units.length > 0 ? (
            <ul className="desk-page-list">
              {units.map(([unit, count]) => (
                <li key={unit} className="desk-page-row">
                  <span className="desk-page-row-title">{humanizeIaauUnit(unit)}</span>
                  <span className="desk-page-row-meta">{count}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {usage.data?.disclaimer ? <p className="desk-page-data-hint">{usage.data.disclaimer}</p> : null}
        </section>
      </div>
    </PageShell>
  );
}
