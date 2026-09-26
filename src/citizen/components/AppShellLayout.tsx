import type { ReactNode } from 'react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';

import { publicDemoActive, subscribePublicDemo } from '../demo/publicDemo.js';

import '../../styles/app.css';
import '../../styles/desk.css';

import { AppSidebar } from './AppSidebar.js';
import { LegacyRedirectBanner } from './LegacyRedirectBanner.js';
import { CommandPaletteButton } from './CommandPalette.js';
import { DeskIconButton } from './desk/DeskGlyph.js';
import { DeskShellProvider, useDeskShell } from '../context/DeskShellContext.js';

import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { usesFunnelShell } from '../platform/navConfig.js';
import { usePlatform } from '../context/PlatformContext.js';

function deskPageTitle(pathname: string): string {
  if (pathname === '/escritorio') return 'Escritorio';
  if (pathname === '/escritorio/mapa') return 'Mapa del sistema';
  if (pathname === EGS_CONSOLE_PATH || pathname.startsWith(`${EGS_CONSOLE_PATH}/`)) return 'Consola EGS';
  if (pathname.startsWith('/modelos')) return 'Modelos';
  if (pathname.startsWith('/empresas')) return 'Empresas';
  if (pathname.startsWith('/institucional')) {
    if (pathname.startsWith(INSTITUTION_ROUTES.register)) return 'Registro';
    if (pathname.startsWith(INSTITUTION_ROUTES.login)) return 'Acceso';
    if (pathname.startsWith(INSTITUTION_ROUTES.pilot)) return 'Piloto';
    return 'Institucional';
  }
  if (pathname.startsWith('/gestion')) return 'Gestión pública';
  if (pathname.startsWith('/participar')) return 'Participar';
  if (pathname.startsWith('/propuestas')) return 'Dictámenes';
  if (pathname.startsWith('/contratos')) return 'Contratos';
  if (pathname.startsWith('/proyectos')) return 'Proyectos';
  if (pathname.startsWith('/desarrolladores')) return 'Desarrolladores';
  if (pathname.startsWith('/ayuda') || pathname.startsWith('/aprender')) return 'Ayuda';
  if (pathname.startsWith('/descargar')) return 'Escritorio app';
  return 'Desk';
}

function AppShellLayoutInner({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { implementationId } = usePlatform();
  const { sidebarCollapsed } = useDeskShell();
  const funnelMode = usesFunnelShell(pathname, implementationId);
  const accountScreen =
    pathname === INSTITUTION_ROUTES.hub ||
    pathname.startsWith(INSTITUTION_ROUTES.login) ||
    pathname.startsWith(INSTITUTION_ROUTES.register);
  const pageTitle = deskPageTitle(pathname);
  const showLegacyBanner = pathname.startsWith('/modelos');

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div
      className="app-shell"
      data-agigov-mode={funnelMode ? 'funnel' : 'full'}
      data-desk-collapsed={sidebarCollapsed ? 'true' : 'false'}
      data-account-screen={accountScreen ? 'true' : 'false'}
    >
      {accountScreen ? null : (
        <>
          <div className={`app-sidebar-drawer ${mobileOpen ? 'app-sidebar-drawer--open' : ''}`}>
            <div
              className="app-sidebar-drawer-backdrop"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <AppSidebar variant="drawer" />
          </div>

          <div className="app-sidebar-desktop">
            <AppSidebar variant="desk" />
          </div>
        </>
      )}

      <div className="app-shell-main">
        {accountScreen ? null : (
        <header className="app-topbar">
          <div className="app-topbar-lead">
            <DeskIconButton
              kind={mobileOpen ? 'close' : 'menu'}
              label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="app-topbar-menu lg:hidden"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            />
            <span className="app-topbar-title">{pageTitle}</span>
          </div>
          <div className="app-topbar-trail">
            <CommandPaletteButton />
          </div>
        </header>
        )}

        <div className="app-shell-content app-shell-content--desk">
          {showLegacyBanner ? <LegacyRedirectBanner /> : null}
          <PublicDemoNotice />
          {children}
        </div>
      </div>
    </div>
  );
}

function PublicDemoNotice() {
  const { pathname } = useLocation();
  const active = useSyncExternalStore(subscribePublicDemo, publicDemoActive, () => false);
  if (!active || pathname.startsWith('/modelos/egs/consola')) return null;
  if (pathname.startsWith('/institucional/acceso') || pathname.startsWith('/institucional/registro')) {
    return null;
  }
  return (
    <p className="egs-demo-banner" role="status">
      Demostración. Estos datos muestran el producto; no son un cierre publicado.
    </p>
  );
}

export function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <DeskShellProvider>
      <AppShellLayoutInner>{children}</AppShellLayoutInner>
    </DeskShellProvider>
  );
}
