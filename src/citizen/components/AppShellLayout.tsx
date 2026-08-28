import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import '../../styles/app.css';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { AppSidebar } from './AppSidebar.js';
import { LegacyRedirectBanner } from './LegacyRedirectBanner.js';
import { CommandPaletteButton } from './CommandPalette.js';
import { InstitutionAccountNav } from './institutional/InstitutionAccountNav.js';

import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { usesFunnelShell } from '../platform/navConfig.js';
import { usePlatform } from '../context/PlatformContext.js';

function topbarContext(pathname: string): { prefix: string; label: string } {
  if (pathname === '/escritorio') {
    return { prefix: 'AGIGOV', label: 'Escritorio' };
  }
  if (pathname === EGS_CONSOLE_PATH || pathname.startsWith(`${EGS_CONSOLE_PATH}/`)) {
    return { prefix: 'AGIGOV', label: 'Consola EGS' };
  }
  if (pathname.startsWith('/modelos')) {
    return { prefix: 'AGIGOV', label: 'Modelos' };
  }
  if (pathname.startsWith('/institucional')) {
    if (pathname.startsWith(INSTITUTION_ROUTES.register)) {
      return { prefix: 'AGIGOV', label: 'Registro' };
    }
    if (pathname.startsWith(INSTITUTION_ROUTES.login)) {
      return { prefix: 'AGIGOV', label: 'Acceso' };
    }
    if (pathname.startsWith(INSTITUTION_ROUTES.pilot)) {
      return { prefix: 'AGIGOV', label: 'Piloto' };
    }
    return { prefix: 'AGIGOV', label: 'Institucional' };
  }
  if (pathname.startsWith('/gestion')) {
    return { prefix: 'AGIGOV', label: 'Gestión pública' };
  }
  if (pathname.startsWith('/participar')) {
    return { prefix: 'AGIGOV', label: 'Participar' };
  }
  if (pathname.startsWith('/propuestas')) {
    return { prefix: 'AGIGOV', label: 'Propuestas' };
  }
  if (pathname.startsWith('/contratos')) {
    return { prefix: 'AGIGOV', label: 'Contratos' };
  }
  if (pathname.startsWith('/ayuda') || pathname.startsWith('/desarrolladores') || pathname.startsWith('/aprender')) {
    return { prefix: 'AGIGOV', label: 'Ayuda' };
  }
  return { prefix: 'AGIGOV', label: '' };
}

export function AppShellLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { implementationId } = usePlatform();
  const funnelMode = usesFunnelShell(pathname, implementationId);
  const ctx = topbarContext(pathname);
  const showLegacyBanner = pathname.startsWith('/modelos');

  return (
    <div className="app-shell" data-agigov-mode={funnelMode ? 'funnel' : 'full'}>
      <div className={`app-sidebar-drawer ${mobileOpen ? 'app-sidebar-drawer--open' : ''}`}>
        <div
          className="app-sidebar-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
        <AppSidebar />
      </div>

      <div className="app-sidebar-desktop">
        <AppSidebar />
      </div>

      <div className="app-shell-main">
        <header className="app-topbar">
          <button
            type="button"
            className="app-topbar-menu lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="app-topbar-context hidden sm:block">
            <span className="app-topbar-crumb">{ctx.prefix}</span>
            {ctx.label ? (
              <>
                <span className="app-topbar-crumb-sep">/</span>
                <span className="app-topbar-crumb">{ctx.label}</span>
              </>
            ) : null}
          </p>
          <div className="app-topbar-actions">
            <CommandPaletteButton />
            <InstitutionAccountNav variant="topbar" />
          </div>
          {mobileOpen ? (
            <button
              type="button"
              className="app-topbar-close lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </header>

        <div className="app-shell-content">
          {showLegacyBanner ? <LegacyRedirectBanner /> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
