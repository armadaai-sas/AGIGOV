import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogIn, LogOut, UserPlus } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

type Variant = 'topbar' | 'hero';

type Props = {
  variant?: Variant;
};

/**
 * Navegación de cuenta institucional — patrón estándar:
 * sin sesión → Iniciar sesión + Registrarse · con sesión → Mi piloto + Cerrar sesión
 */
export function InstitutionAccountNav({ variant = 'topbar' }: Props) {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useInstitutionAuth();

  async function handleLogout() {
    await logout();
    navigate(INSTITUTION_ROUTES.login, {
      replace: true,
      state: { loggedOut: true },
    });
  }

  if (isAuthenticated && session) {
    if (variant === 'hero') {
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={INSTITUTION_ROUTES.pilot}
            className="hero-trust-nav-ghost inline-flex items-center gap-1.5"
          >
            <Building2 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline max-w-[8rem] truncate">{session.institutionName}</span>
            <span className="sm:hidden">{t('nav.myPilot')}</span>
          </Link>
          <button
            type="button"
            className="hero-trust-nav-ghost inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-inherit cursor-pointer"
            onClick={() => void handleLogout()}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {t('nav.logout')}
          </button>
        </div>
      );
    }

    return (
      <div className="app-topbar-account">
        <Link
          to={INSTITUTION_ROUTES.pilot}
          className="app-topbar-account-link"
          title={session.institutionName}
        >
          <Building2 className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden lg:inline max-w-[10rem] truncate">{session.institutionName}</span>
          <span className="lg:hidden">{t('nav.myPilot')}</span>
        </Link>
        <button
          type="button"
          className="app-topbar-account-logout"
          onClick={() => void handleLogout()}
          title={t('nav.logout')}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden md:inline">{t('nav.logout')}</span>
        </button>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to={INSTITUTION_ROUTES.login} className="hero-trust-nav-ghost inline-flex items-center gap-1.5">
          <LogIn className="h-4 w-4" aria-hidden />
          {t('nav.login')}
        </Link>
        <Link
          to={INSTITUTION_ROUTES.register}
          className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--nav"
        >
          {t('nav.register')}
        </Link>
      </div>
    );
  }

  return (
    <div className="app-topbar-account app-topbar-account--guest">
      <Link to={INSTITUTION_ROUTES.login} className="app-topbar-auth app-topbar-auth--primary">
        <LogIn className="h-4 w-4" aria-hidden />
        <span>{t('nav.login')}</span>
      </Link>
      <Link to={INSTITUTION_ROUTES.register} className="app-topbar-auth app-topbar-auth--secondary">
        <UserPlus className="h-4 w-4" aria-hidden />
        <span>{t('nav.register')}</span>
      </Link>
    </div>
  );
}
