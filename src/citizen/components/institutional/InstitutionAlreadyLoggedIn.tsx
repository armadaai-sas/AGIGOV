import { ArrowRight, Building2, LogOut } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { resolvePostLoginRedirect } from '../../institutional/authRedirect.js';
import { EGS_CONSOLE_PATH } from '../../platform/agigovModels.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

/** Sesión activa en pantalla de acceso — continuar o cerrar sesión. */
export function InstitutionAlreadyLoggedIn() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, logout } = useInstitutionAuth();

  const continueTo = resolvePostLoginRedirect(searchParams.get('redirect'));

  async function handleLogout() {
    await logout();
    navigate(INSTITUTION_ROUTES.login, {
      replace: true,
      state: { loggedOut: true },
    });
  }

  const name = session?.institutionName?.trim() || session?.email?.trim();

  return (
    <div className="inst-auth-panel">
      <div className="inst-auth-card">
        <div className="inst-auth-session-head">
          <Building2 className="h-5 w-5 shrink-0 text-agigov-text-muted" aria-hidden />
          <div>
            <p className="inst-auth-session-title">{t('auth.alreadyLoggedIn')}</p>
            {name ? <p className="inst-auth-session-name">{name}</p> : null}
            <p className="inst-auth-session-lead">{t('auth.alreadyLoggedInLead')}</p>
          </div>
        </div>

        <div className="inst-auth-actions">
          <Link to={continueTo} className="desk-page-primary-btn flex-1 justify-center no-underline">
            {t('auth.continue')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to={EGS_CONSOLE_PATH} className="app-btn app-btn--secondary flex-1 justify-center no-underline">
            {t('auth.goConsole')}
          </Link>
        </div>

        <button
          type="button"
          className="app-btn app-btn--secondary w-full justify-center"
          onClick={() => void handleLogout()}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
}
