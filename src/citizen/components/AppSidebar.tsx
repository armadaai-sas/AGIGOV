import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, PanelLeftClose, PanelLeft, Moon, Sun, Settings2 } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { OsPreferencesModal } from './os/OsPreferencesModal.js';
import {
  getNavSidebarSections,
  isNavActive,
  NAV_MORE_ICON,
  type NavSection,
  type NavItem,
} from '../platform/navConfig.js';
import { usePlatform } from '../context/PlatformContext.js';
import { prefetchRoute } from '../platform/routePrefetch.js';

export function AppSidebar() {
  const { pathname, hash, search } = useLocation();
  const { skinId, setSkinId, implementationId } = usePlatform();
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const sections = getNavSidebarSections(implementationId);

  return (
    <>
      <aside
        className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''}`}
        aria-label="Navegación AGIGOV"
      >
        <div className="app-sidebar-head">
          <Link to="/escritorio" className="app-sidebar-brand" aria-label="AGIGOV escritorio">
            <AgigovLogo size="sm" showWordmark={!collapsed} variant="light" />
          </Link>
          <button
            type="button"
            className="app-sidebar-collapse hidden lg:inline-flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="app-sidebar-nav">
          {sections.map((section) => (
            <SidebarSection
              key={section.id}
              section={section}
              pathname={pathname}
              hash={hash}
              search={search}
              collapsed={collapsed}
              moreOpen={moreOpen}
              onToggleMore={() => setMoreOpen((v) => !v)}
            />
          ))}
        </nav>

        <div className="app-sidebar-foot">
          <div className="app-sidebar-foot-actions">
            <button
              type="button"
              className="app-sidebar-skin-btn"
              title="Preferencias"
              aria-label="Preferencias"
              onClick={() => setPrefsOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="app-sidebar-skin-btn"
              title={skinId === 'trust' ? 'Tema oscuro' : 'Tema claro'}
              aria-label="Cambiar tema"
              onClick={() => setSkinId(skinId === 'trust' ? 'legacy' : 'trust')}
            >
              {skinId === 'trust' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>
      <OsPreferencesModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </>
  );
}

function SidebarSection({
  section,
  pathname,
  hash,
  search,
  collapsed,
  moreOpen,
  onToggleMore,
}: {
  section: NavSection;
  pathname: string;
  hash: string;
  search: string;
  collapsed: boolean;
  moreOpen: boolean;
  onToggleMore: () => void;
}) {
  const isMore = section.id === 'ven-more';
  const sectionClass = isMore
    ? 'app-sidebar-section app-sidebar-section--more'
    : 'app-sidebar-section';

  if (isMore) {
    return (
      <div className={sectionClass}>
        <button
          type="button"
          className="app-sidebar-more-toggle"
          onClick={onToggleMore}
          aria-expanded={moreOpen}
        >
          <NAV_MORE_ICON className="h-4 w-4 shrink-0" aria-hidden />
          {!collapsed ? (
            <>
              <span className="app-sidebar-link-label">{section.label}</span>
              <ChevronDown
                className={`ml-auto h-4 w-4 transition ${moreOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </>
          ) : null}
        </button>
        {moreOpen || collapsed ? (
          <div className={moreOpen ? 'app-sidebar-more-panel' : 'sr-only'}>
            {section.groups?.map((group) => (
              <div key={group.label} className="app-sidebar-group">
                {!collapsed && moreOpen ? (
                  <p className="app-sidebar-group-label">{group.label}</p>
                ) : null}
                <NavLinkList
                  items={group.items}
                  pathname={pathname}
                  hash={hash}
                  search={search}
                  collapsed={collapsed}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={sectionClass}>
      {!collapsed ? (
        <p className="app-sidebar-section-title">{section.label}</p>
      ) : null}

      {section.items ? (
        <NavLinkList
          items={section.items}
          pathname={pathname}
          hash={hash}
          search={search}
          collapsed={collapsed}
        />
      ) : null}
    </div>
  );
}

function NavLinkList({
  items,
  pathname,
  hash,
  search,
  collapsed,
}: {
  items: readonly NavItem[];
  pathname: string;
  hash: string;
  search: string;
  collapsed: boolean;
}) {
  return (
    <ul className="app-sidebar-list">
      {items.map(({ to, label, icon: Icon, hint }) => {
        const active = isNavActive(pathname, hash, to, search);
        return (
          <li key={to}>
            <Link
              to={to}
              className={`app-sidebar-link ${active ? 'app-sidebar-link--active' : ''}`}
              title={collapsed ? label : hint}
              onMouseEnter={() => prefetchRoute(to)}
              onFocus={() => prefetchRoute(to)}
            >
              <Icon className="app-sidebar-link-icon" aria-hidden />
              {!collapsed ? <span className="app-sidebar-link-label">{label}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
