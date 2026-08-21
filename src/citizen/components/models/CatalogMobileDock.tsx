import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Package } from 'lucide-react';

import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

/** Dock móvil OS — mismos pilares mentales que el sidebar (no solo catálogo). */
const DOCK_ITEMS = [
  {
    to: INSTITUTION_ROUTES.desk,
    label: 'Escritorio',
    icon: LayoutDashboard,
    isActive: (path: string) => path === INSTITUTION_ROUTES.desk,
  },
  {
    to: '/modelos',
    label: 'Modelos',
    icon: Package,
    isActive: (path: string) => path.startsWith('/modelos'),
  },
  {
    to: '/gestion',
    label: 'Gestión',
    icon: Activity,
    isActive: (path: string) => path === '/gestion' || path.startsWith('/gestion/'),
  },
] as const;

const DOCK_PREFIXES = ['/escritorio', '/modelos', '/gestion', '/participar', '/propuestas', '/contratos', '/ayuda'];

export function CatalogMobileDock() {
  const { pathname } = useLocation();

  if (!usesCatalogMobileDock(pathname)) return null;

  return (
    <nav className="catalog-mobile-dock lg:hidden" aria-label="Acceso rápido OS">
      {DOCK_ITEMS.map(({ to, label, icon: Icon, isActive }) => {
        const active = isActive(pathname);
        return (
          <Link
            key={to}
            to={to}
            className={`catalog-mobile-dock-link ${active ? 'catalog-mobile-dock-link--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function usesCatalogMobileDock(pathname: string): boolean {
  return DOCK_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
