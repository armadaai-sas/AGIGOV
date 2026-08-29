import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Settings2 } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { DeskGlyph, DeskIconButton } from './desk/DeskGlyph.js';
import { OsPreferencesModal } from './os/OsPreferencesModal.js';
import { SidebarTooltip } from './SidebarTooltip.js';
import { useDeskShell } from '../context/DeskShellContext.js';
import {
  getNavSidebarSections,
  isNavActive,
  type NavSection,
  type NavItem,
} from '../platform/navConfig.js';
import { usePlatform } from '../context/PlatformContext.js';
import { prefetchRoute } from '../platform/routePrefetch.js';

const SIDEBAR_SECTIONS_KEY = 'agigov.sidebar.sections';

const ESSENTIAL_SECTION_IDS = new Set(['modelos', 'operar']);

const DEFAULT_SECTION_OPEN: Record<string, boolean> = {
  modelos: true,
  operar: true,
  acceso: false,
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
  const { sidebarCollapsed, essentialMode, toggleSidebar, toggleEssential } = useDeskShell();
  const [openSections, setOpenSections] = useState(readStoredSections);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const sections = getNavSidebarSections(implementationId);

  const visibleSections = useMemo(() => {
    if (!essentialMode) return sections;
    return sections.filter(
      (section) =>
        ESSENTIAL_SECTION_IDS.has(section.id) ||
        sectionHasActive(section, pathname, hash, search),
    );
  }, [essentialMode, sections, pathname, hash, search]);

  const toggleSection = useCallback((id: string) => {
    setOpenSections((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      window.localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
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
        className={`app-sidebar ${sidebarCollapsed ? 'app-sidebar--collapsed' : ''} ${
          essentialMode ? 'app-sidebar--essential' : ''
        }`}
        aria-label="Navegación del desk"
      >
        <div className="app-sidebar-head">
          <Link to="/escritorio" className="app-sidebar-brand" aria-label="Escritorio">
            <AgigovLogo size="sm" variant="light" />
          </Link>
          <SidebarTooltip
            label={sidebarCollapsed ? 'Expandir panel' : 'Contraer panel'}
            hint="Ancho del menú lateral"
            enabled={sidebarCollapsed}
          >
            <DeskIconButton
              kind={sidebarCollapsed ? 'expand' : 'collapse'}
              label={sidebarCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
              className="app-sidebar-collapse hidden lg:inline-flex"
              onClick={toggleSidebar}
            />
          </SidebarTooltip>
        </div>

        <nav className="app-sidebar-nav">
          {visibleSections.map((section, index) => (
            <SidebarSection
              key={section.id}
              section={section}
              pathname={pathname}
              hash={hash}
              search={search}
              collapsed={sidebarCollapsed}
              open={openSections[section.id] ?? ESSENTIAL_SECTION_IDS.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              showDivider={index > 0}
            />
          ))}
        </nav>

        <div className="app-sidebar-foot">
          <div className="app-sidebar-foot-actions">
            <SidebarTooltip
              label={essentialMode ? 'Menú completo' : 'Modo esencial'}
              hint={essentialMode ? 'Mostrar todas las secciones' : 'Solo Modelos y Operar'}
              enabled={sidebarCollapsed}
            >
              <DeskIconButton
                kind={essentialMode ? 'expand' : 'collapse'}
                label={essentialMode ? 'Mostrar menú completo' : 'Activar modo esencial'}
                className={`app-sidebar-essential-btn ${essentialMode ? 'app-sidebar-essential-btn--on' : ''}`}
                aria-pressed={essentialMode}
                onClick={toggleEssential}
              />
            </SidebarTooltip>
            <SidebarTooltip label="Preferencias" hint="Idioma y cuenta" enabled={sidebarCollapsed}>
              <button
                type="button"
                className="app-sidebar-skin-btn"
                aria-label="Preferencias"
                onClick={() => setPrefsOpen(true)}
              >
                <Settings2 className="h-4 w-4" />
              </button>
            </SidebarTooltip>
          </div>
          {!sidebarCollapsed && essentialMode ? (
            <p className="app-sidebar-essential-note">Esencial · Modelos y Operar</p>
          ) : null}
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
  const active = useMemo(
    () => sectionHasActive(section, pathname, hash, search),
    [section, pathname, hash, search],
  );

  if (collapsed) {
    return (
      <div className={`app-sidebar-section ${showDivider ? 'app-sidebar-section--rail' : ''}`}>
        {section.id === 'ven-more'
          ? section.groups?.map((group) => (
              <NavLinkList
                key={group.label}
                items={group.items}
                pathname={pathname}
                hash={hash}
                search={search}
                collapsed
              />
            ))
          : (
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
      className={`app-sidebar-section ${showDivider ? 'app-sidebar-section--divided' : ''} ${
        active ? 'app-sidebar-section--active' : ''
      }`}
    >
      <button
        type="button"
        className="app-sidebar-section-toggle"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="app-sidebar-section-toggle-label">{section.label}</span>
        <DeskGlyph kind={open ? 'collapse' : 'expand'} className="app-sidebar-section-glyph" />
      </button>

      <div
        className={`app-sidebar-section-panel ${open ? 'app-sidebar-section-panel--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="app-sidebar-section-panel-inner">
          {section.id === 'ven-more'
            ? section.groups?.map((group) => (
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
            : (
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
            <SidebarTooltip label={label} hint={hint} enabled={collapsed}>
              <Link
                to={to}
                className={`app-sidebar-link ${active ? 'app-sidebar-link--active' : ''}`}
                onMouseEnter={() => prefetchRoute(to)}
                onFocus={() => prefetchRoute(to)}
              >
                <span className="app-sidebar-link-icon-wrap" aria-hidden>
                  <Icon className="app-sidebar-link-icon" />
                </span>
                {!collapsed ? <span className="app-sidebar-link-label">{label}</span> : null}
              </Link>
            </SidebarTooltip>
          </li>
        );
      })}
    </ul>
  );
}
