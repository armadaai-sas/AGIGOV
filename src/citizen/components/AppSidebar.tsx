import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeft, Settings2 } from 'lucide-react';

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

const SIDEBAR_COLLAPSED_KEY = 'agigov.sidebar.collapsed';
const SIDEBAR_SECTIONS_KEY = 'agigov.sidebar.sections';

const DEFAULT_SECTION_OPEN: Record<string, boolean> = {
  modelos: true,
  operar: true,
  acceso: true,
  explorar: false,
  'ven-more': false,
};

function readStoredSections(): Record<string, boolean> {
  if (typeof window === 'undefined') return DEFAULT_SECTION_OPEN;
  try {
    const raw = window.localStorage.getItem(SIDEBAR_SECTIONS_KEY);
    if (!raw) return DEFAULT_SECTION_OPEN;
    return { ...DEFAULT_SECTION_OPEN, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SECTION_OPEN;
  }
}

function sectionItems(section: NavSection): readonly NavItem[] {
  if (section.items?.length) return section.items;
  return section.groups?.flatMap((group) => group.items) ?? [];
}

function sectionHasActive(
  section: NavSection,
  pathname: string,
  hash: string,
  search: string,
): boolean {
  return sectionItems(section).some((item) => isNavActive(pathname, hash, item.to, search));
}

export function AppSidebar() {
  const { pathname, hash, search } = useLocation();
  const { implementationId } = usePlatform();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
  });
  const [openSections, setOpenSections] = useState(readStoredSections);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const sections = getNavSidebarSections(implementationId);

  const toggleSection = useCallback((id: string) => {
    setOpenSections((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      window.localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  useEffect(() => {
    setOpenSections((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const section of sections) {
        if (sectionHasActive(section, pathname, hash, search) && !next[section.id]) {
          next[section.id] = true;
          changed = true;
        }
      }
      if (changed) {
        window.localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
      }
      return changed ? next : prev;
    });
  }, [pathname, hash, search, sections]);

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
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="app-sidebar-nav">
          {sections.map((section, index) => (
            <SidebarSection
              key={section.id}
              section={section}
              pathname={pathname}
              hash={hash}
              search={search}
              collapsed={collapsed}
              open={openSections[section.id] ?? false}
              onToggle={() => toggleSection(section.id)}
              showDivider={index > 0}
            />
          ))}
        </nav>

        <div className="app-sidebar-foot">
          <button
            type="button"
            className="app-sidebar-skin-btn"
            title="Preferencias"
            aria-label="Preferencias"
            onClick={() => setPrefsOpen(true)}
          >
            <Settings2 className="h-4 w-4" />
          </button>
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
  open,
  onToggle,
  showDivider,
}: {
  section: NavSection;
  pathname: string;
  hash: string;
  search: string;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  showDivider: boolean;
}) {
  const isMore = section.id === 'ven-more';
  const active = useMemo(
    () => sectionHasActive(section, pathname, hash, search),
    [section, pathname, hash, search],
  );

  if (collapsed) {
    return (
      <div className={`app-sidebar-section ${showDivider ? 'app-sidebar-section--rail' : ''}`}>
        {isMore ? (
          section.groups?.map((group) => (
            <NavLinkList
              key={group.label}
              items={group.items}
              pathname={pathname}
              hash={hash}
              search={search}
              collapsed
            />
          ))
        ) : (
          <NavLinkList
            items={section.items ?? []}
            pathname={pathname}
            hash={hash}
            search={search}
            collapsed
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`app-sidebar-section ${isMore ? 'app-sidebar-section--more' : ''} ${
        showDivider ? 'app-sidebar-section--divided' : ''
      } ${active ? 'app-sidebar-section--active' : ''}`}
    >
      <button
        type="button"
        className="app-sidebar-section-toggle"
        onClick={onToggle}
        aria-expanded={open}
      >
        {isMore ? (
          <NAV_MORE_ICON className="app-sidebar-section-toggle-icon" aria-hidden />
        ) : (
          <span className="app-sidebar-section-dot" aria-hidden />
        )}
        <span className="app-sidebar-section-toggle-label">{section.label}</span>
        <ChevronDown
          className={`app-sidebar-section-chevron ${open ? 'app-sidebar-section-chevron--open' : ''}`}
          aria-hidden
        />
      </button>

      <div
        className={`app-sidebar-section-panel ${open ? 'app-sidebar-section-panel--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="app-sidebar-section-panel-inner">
          {isMore ? (
            section.groups?.map((group) => (
              <div key={group.label} className="app-sidebar-group">
                <p className="app-sidebar-group-label">{group.label}</p>
                <NavLinkList
                  items={group.items}
                  pathname={pathname}
                  hash={hash}
                  search={search}
                  collapsed={false}
                />
              </div>
            ))
          ) : (
            <NavLinkList
              items={section.items ?? []}
              pathname={pathname}
              hash={hash}
              search={search}
              collapsed={false}
            />
          )}
        </div>
      </div>
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
              <span className="app-sidebar-link-icon-wrap" aria-hidden>
                <Icon className="app-sidebar-link-icon" />
              </span>
              {!collapsed ? <span className="app-sidebar-link-label">{label}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
