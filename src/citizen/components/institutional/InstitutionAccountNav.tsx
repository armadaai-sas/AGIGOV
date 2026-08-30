import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, LogIn, LogOut } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { loginPathWithRedirect } from '../../institutional/authRedirect.js';
import { EGS_CONSOLE_PATH } from '../../platform/agigovModels.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

type Variant = 'topbar' | 'hero';

type Props = {
  variant?: Variant;
  showLabel?: boolean;
};

/** Cuenta institucional — entrar, consola EGS o salir. */
export function InstitutionAccountNav({ variant = 'topbar', showLabel = false }: Props) {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAuthenticated, logout } = useInstitutionAuth();
  const isHero = variant === 'hero';
  const withLabel = showLabel || isHero;

  async function handleLogout() {
    await logout();
    navigate(INSTITUTION_ROUTES.login, {
      replace: true,
      state: { loggedOut: true },
    });
  }

  if (isAuthenticated && session) {
    const label = session.institutionName?.trim() || session.email;
    return (
      <div className={`app-topbar-account${withLabel ? ' app-topbar-account--labeled' : ''}`}>
        <Link
          to={EGS_CONSOLE_PATH}
          className={
            withLabel ? 'app-btn app-btn--ghost' : 'app-btn app-btn--ghost app-btn--icon'
          }
          title={label}
          aria-label={label}
        >
          <Building2 className="h-4 w-4" aria-hidden />
          {withLabel ? <span className="max-w-[10rem] truncate">{label}</span> : null}
        </Link>
        <button
          type="button"
          className="app-topbar-account-logout"
          onClick={() => void handleLogout()}
          title={t('nav.logout')}
          aria-label={t('nav.logout')}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          {withLabel ? <span>{t('nav.logout')}</span> : null}
        </button>
      </div>
    );
  }

  return (
    <Link
      to={loginPathWithRedirect(location.pathname)}
      className={withLabel ? 'app-btn app-btn--ghost' : 'app-btn app-btn--ghost app-btn--icon'}
      title={t('nav.login')}
      aria-label={t('nav.login')}
    >
      <LogIn className="h-4 w-4" aria-hidden />
      {withLabel ? <span>{t('nav.login')}</span> : null}
    </Link>
  );
}
