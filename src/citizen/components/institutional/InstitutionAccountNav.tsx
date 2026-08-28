import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogIn, LogOut } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

type Variant = 'topbar' | 'hero';

type Props = {
  variant?: Variant;
  /** Desktop marketing header: show text label next to icon (international Sign in pattern). */
  showLabel?: boolean;
};

/**
 * Un solo control de cuenta:
 * — sin sesión → entrar (icono; opcional label)
 * — con sesión → institución (escritorio) + salir
 */
export function InstitutionAccountNav({ variant = 'topbar', showLabel = false }: Props) {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
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
    return (
      <div className={`app-topbar-account${withLabel ? ' app-topbar-account--labeled' : ''}`}>
        <Link
          to={INSTITUTION_ROUTES.desk}
          className={
            withLabel
              ? 'app-btn app-btn--ghost'
              : 'app-btn app-btn--ghost app-btn--icon'
          }
          title={session.institutionName || t('nav.desk')}
          aria-label={session.institutionName || t('nav.desk')}
        >
          <Building2 className="h-4 w-4" aria-hidden />
          {withLabel ? <span>{t('nav.desk')}</span> : null}
        </Link>
        <button
          type="button"
          className="app-topbar-account-logout"
          onClick={() => void handleLogout()}
          title={t('nav.logout')}
          aria-label={t('nav.logout')}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      to={INSTITUTION_ROUTES.login}
      className={
        withLabel
          ? 'app-btn app-btn--ghost'
          : 'app-btn app-btn--ghost app-btn--icon'
      }
      title={t('nav.login')}
      aria-label={t('nav.login')}
    >
      <LogIn className="h-4 w-4" aria-hidden />
      {withLabel ? <span>{t('nav.login')}</span> : null}
    </Link>
  );
}
