import { Link, useNavigate } from 'react-router-dom';
import { Building2, Home, LogIn, LogOut } from 'lucide-react';

import { SidebarTooltip } from '../SidebarTooltip.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

/** Cuenta e inicio — iconos alineados al rail del sidebar. */
export function DeskSidebarAccount({ collapsed }: { collapsed: boolean }) {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useInstitutionAuth();

  async function handleLogout() {
    await logout();
    navigate(INSTITUTION_ROUTES.login, { replace: true, state: { loggedOut: true } });
  }

  return (
    <>
      {isAuthenticated && session ? (
        <>
          <SidebarTooltip
            label={session.institutionName || t('nav.desk')}
            hint={t('nav.desk')}
            enabled={collapsed}
          >
            <Link to={INSTITUTION_ROUTES.desk} className="app-sidebar-skin-btn" aria-label={t('nav.desk')}>
              <Building2 className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </SidebarTooltip>
          <SidebarTooltip label={t('nav.logout')} enabled={collapsed}>
            <button
              type="button"
              className="app-sidebar-skin-btn"
              aria-label={t('nav.logout')}
              onClick={() => void handleLogout()}
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </SidebarTooltip>
        </>
      ) : (
        <SidebarTooltip label={t('nav.login')} hint={t('nav.login')} enabled={collapsed}>
          <Link to={INSTITUTION_ROUTES.login} className="app-sidebar-skin-btn" aria-label={t('nav.login')}>
            <LogIn className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </SidebarTooltip>
      )}
      <SidebarTooltip label="Inicio" hint="Salir al landing" enabled={collapsed}>
        <Link to="/" className="app-sidebar-skin-btn" aria-label="Inicio">
          <Home className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </SidebarTooltip>
    </>
  );
}
