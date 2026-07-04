import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { AppSidebar } from './AppSidebar.js';
import { CatalogMobileDock, usesCatalogMobileDock } from './models/CatalogMobileDock.js';
import { LegacyRedirectBanner } from './LegacyRedirectBanner.js';
import { SiteFooterCompact } from './SiteFooterCompact.js';
import { CommandPaletteButton } from './CommandPalette.js';

import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';
import { usesFunnelShell } from '../platform/navConfig.js';
import { usePlatform } from '../context/PlatformContext.js';

function topbarContext(pathname: string): { prefix: string; label: string } {
  if (pathname === EGS_CONSOLE_PATH || pathname.startsWith(`${EGS_CONSOLE_PATH}/`)) {
    return { prefix: 'AGIGOV', label: 'Consola EGS' };
  }
  if (pathname.startsWith('/modelos')) {
    return { prefix: 'AGIGOV', label: 'Modelos' };
  }
  if (
    pathname.startsWith('/gestion') ||
    pathname.startsWith('/propuestas') ||
    pathname.startsWith('/proyectos') ||
    pathname.startsWith('/contratos') ||
    pathname.startsWith('/transparencia') ||
    pathname.startsWith('/suministros') ||
    pathname.startsWith('/cne') ||
    pathname.startsWith('/participar')
  ) {
    return { prefix: 'AGIGOV', label: 'Operación' };
  }
  return { prefix: 'AGIGOV', label: '' };
}

export function AppShellLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { implementationId } = usePlatform();
  const funnelMode = usesFunnelShell(pathname, implementationId);
  const ctx = topbarContext(pathname);
  const catalogDock = usesCatalogMobileDock(pathname);
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
            <span className="text-agigov-text-muted">{ctx.prefix}</span>
            {ctx.label ? (
              <>
                <span className="mx-2 text-agigov-text-muted/40">/</span>
                <span className="font-medium text-agigov-text">{ctx.label}</span>
              </>
            ) : (
              <span className="ml-0 font-medium text-agigov-text">{ctx.prefix}</span>
            )}
          </p>
          <div className="app-topbar-actions">
            <CommandPaletteButton />
            <Link to="/" className="app-topbar-home hidden md:inline-flex">
              Inicio AGIGOV
            </Link>
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

        <div className={`app-shell-content ${catalogDock ? 'app-shell-content--catalog-dock' : ''}`}>
          {showLegacyBanner ? <LegacyRedirectBanner /> : null}
          {children}
        </div>
        <SiteFooterCompact />
        <CatalogMobileDock />
      </div>
    </div>
  );
}
