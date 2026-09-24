import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';

import { SidebarTooltip } from '../SidebarTooltip.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { loginPathWithRedirect } from '../../institutional/authRedirect.js';

type SessionPhase = 'comprobando' | 'dentro' | 'fuera' | 'invitado';

/**
 * Pie del rail: un solo lugar para la sesión.
 * Estados: comprobando, dentro, fuera, invitado.
 */
export function DeskSidebarAccount({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAuthenticated, authReady, logout } = useInstitutionAuth();
  const loggedOut = Boolean((location.state as { loggedOut?: boolean } | null)?.loggedOut);

  async function handleLogout() {
    await logout();
    navigate('/escritorio', { replace: true, state: { loggedOut: true } });
  }

  const phase: SessionPhase = !authReady
    ? 'comprobando'
    : isAuthenticated
      ? 'dentro'
      : loggedOut
        ? 'fuera'
        : 'invitado';

  const name = session?.institutionName?.trim() || session?.email?.trim() || 'Institución';
  const label =
    phase === 'comprobando'
      ? 'Comprobando'
      : phase === 'dentro'
        ? name
        : phase === 'fuera'
          ? 'Fuera'
          : 'Invitado';

  if (phase === 'comprobando') {
    return (
      <span className="app-sidebar-session" aria-live="polite">
        {collapsed ? null : <span className="app-sidebar-session-label">{label}</span>}
      </span>
    );
  }

  if (phase === 'dentro') {
    return (
      <SidebarTooltip label={name} hint="Cerrar sesión" enabled={collapsed}>
        <button
          type="button"
          className="app-sidebar-session"
          aria-label={`Cerrar sesión de ${name}`}
          onClick={() => void handleLogout()}
        >
          <LogOut {...agigovIconProps('md')} />
          {collapsed ? null : <span className="app-sidebar-session-label">{label}</span>}
        </button>
      </SidebarTooltip>
    );
  }

  return (
    <SidebarTooltip label={phase === 'fuera' ? 'Fuera' : 'Iniciar sesión'} enabled={collapsed}>
      <Link
        to={loginPathWithRedirect(`${location.pathname}${location.search}`)}
        className="app-sidebar-session"
        aria-label={phase === 'fuera' ? 'Fuera. Iniciar sesión' : 'Iniciar sesión'}
      >
        <LogIn {...agigovIconProps('md')} />
        {collapsed ? null : <span className="app-sidebar-session-label">{label}</span>}
      </Link>
    </SidebarTooltip>
  );
}
