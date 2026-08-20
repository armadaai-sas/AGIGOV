import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, TrendingDown } from 'lucide-react';

import { EGS_CONSOLE_PATH, EGS_MODEL_PATH } from '../../platform/agigovModels.js';

const DOCK_ITEMS = [
  { to: '/modelos', label: 'Modelos', icon: Package, isActive: (path: string) => path === '/modelos' },
  {
    to: EGS_MODEL_PATH,
    label: 'EGS',
    icon: TrendingDown,
    isActive: (path: string) =>
      path === EGS_MODEL_PATH || (path.startsWith('/modelos/egs') && !path.includes('/consola')),
  },
  {
    to: EGS_CONSOLE_PATH,
    label: 'Consola',
    icon: LayoutDashboard,
    isActive: (path: string) => path === EGS_CONSOLE_PATH || path.startsWith(`${EGS_CONSOLE_PATH}/`),
  },
] as const;

export function CatalogMobileDock() {
  const { pathname } = useLocation();

  if (!pathname.startsWith('/modelos')) return null;

  return (
    <nav
      className="catalog-mobile-dock lg:hidden"
      aria-label="Acceso rápido catálogo"
    >
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
  return pathname.startsWith('/modelos');
}
