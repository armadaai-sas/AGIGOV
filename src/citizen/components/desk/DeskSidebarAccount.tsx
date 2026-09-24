import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';

import { SidebarTooltip } from '../SidebarTooltip.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { loginPathWithRedirect } from '../../institutional/authRedirect.js';

/**
 * Pie del rail: un solo lugar para la sesión.
 * Sin sesión el botón dice «Iniciar sesión». Con sesión, el nombre.
 */
export function DeskSidebarAccount({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAuthenticated, authReady, logout } = useInstitutionAuth();
  async function handleLogout() {
    await logout();
    navigate('/escritorio', { replace: true });
  }

  const name = session?.institutionName?.trim() || session?.email?.trim() || 'Institución';

  if (!authReady) {
    return <span className="app-sidebar-session" aria-hidden />;
  }

  if (isAuthenticated) {
    return (
      <SidebarTooltip label={name} hint="Cerrar sesión" enabled={collapsed}>
        <button
          type="button"
          className="app-sidebar-session"
          aria-label={`Cerrar sesión de ${name}`}
          onClick={() => void handleLogout()}
        >
          <LogOut {...agigovIconProps('md')} />
          {collapsed ? null : <span className="app-sidebar-session-label">{name}</span>}
        </button>
      </SidebarTooltip>
    );
  }

  return (
    <SidebarTooltip label="Iniciar sesión" enabled={collapsed}>
      <Link
        to={loginPathWithRedirect(`${location.pathname}${location.search}`)}
        className="app-sidebar-session"
        aria-label="Iniciar sesión"
      >
        <LogIn {...agigovIconProps('md')} />
        {collapsed ? null : <span className="app-sidebar-session-label">Iniciar sesión</span>}
      </Link>
    </SidebarTooltip>
  );
}
