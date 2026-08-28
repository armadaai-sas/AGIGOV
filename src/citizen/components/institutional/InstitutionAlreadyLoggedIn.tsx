import { ArrowRight, Building2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

/** Sesión activa en pantallas de acceso/registro — escritorio o cerrar sesión. */
export function InstitutionAlreadyLoggedIn() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const { session, logout } = useInstitutionAuth();

  async function handleLogout() {
    await logout();
    navigate(INSTITUTION_ROUTES.login, {
      replace: true,
      state: { loggedOut: true },
    });
  }

  const name = session?.institutionName?.trim() || session?.email?.trim();

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="agigov-card space-y-5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" aria-hidden />
          <div>
            <p className="font-medium text-agigov-text">{t('auth.alreadyLoggedIn')}</p>
            {name ? (
              <p className="mt-1 text-sm text-agigov-text-muted">{name}</p>
            ) : null}
            <p className="mt-2 text-sm text-agigov-text-muted">{t('auth.alreadyLoggedInLead')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={INSTITUTION_ROUTES.desk} className="ds-btn-app flex-1 justify-center no-underline">
            {t('auth.goDesk')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="ds-btn-ghost flex-1 justify-center border border-agigov-border"
            onClick={() => void handleLogout()}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
