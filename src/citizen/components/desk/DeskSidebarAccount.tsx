import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogIn, LogOut } from 'lucide-react';

import { SidebarTooltip } from '../SidebarTooltip.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { EGS_CONSOLE_PATH } from '../../platform/agigovModels.js';
import { loginPathWithRedirect } from '../../institutional/authRedirect.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

/**
 * Pie del rail: solo la sesión.
 * El escritorio no ofrece salida al landing. La marca y el ítem Escritorio
 * ya vuelven a /escritorio; el marketing vive en `/`, fuera de este menú.
 */
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
            label={session.institutionName || t('auth.goConsole')}
            hint={t('auth.goConsole')}
            enabled={collapsed}
          >
            <Link to={EGS_CONSOLE_PATH} className="app-sidebar-skin-btn" aria-label={session.institutionName || t('auth.goConsole')}>
              <Building2 {...agigovIconProps('md')} />
            </Link>
          </SidebarTooltip>
          <SidebarTooltip label={t('nav.logout')} enabled={collapsed}>
            <button
              type="button"
              className="app-sidebar-skin-btn"
              aria-label={t('nav.logout')}
              onClick={() => void handleLogout()}
            >
              <LogOut {...agigovIconProps('md')} />
            </button>
          </SidebarTooltip>
        </>
      ) : (
        <SidebarTooltip label={t('nav.login')} hint={t('nav.login')} enabled={collapsed}>
          <Link to={loginPathWithRedirect('/escritorio')} className="app-sidebar-skin-btn" aria-label={t('nav.login')}>
            <LogIn {...agigovIconProps('md')} />
          </Link>
        </SidebarTooltip>
      )}
    </>
  );
}
