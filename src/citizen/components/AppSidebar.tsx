import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, PanelLeftClose, PanelLeft, Moon, Sun } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { CommandPaletteButton } from './CommandPalette.js';
import { ImplementationSelector } from './ImplementationSelector.js';
import { SovereignSettingsPanel } from './SovereignSettingsPanel.js';
import {
  getNavSidebarSections,
  isNavActive,
  NAV_MORE_ICON,
  type NavSection,
  type NavItem,
} from '../platform/navConfig.js';
import { usePlatform } from '../context/PlatformContext.js';

export function AppSidebar() {
  const { pathname, hash, search } = useLocation();
  const { skinId, setSkinId, implementationId } = usePlatform();
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const sections = getNavSidebarSections(implementationId);

  return (
    <aside
      className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''}`}
      aria-label="Navegación AGIGOV"
    >
      <div className="app-sidebar-head">
        <Link to="/" className="app-sidebar-brand" aria-label="AGIGOV inicio">
          <AgigovLogo size="sm" showWordmark={!collapsed} />
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
        {!collapsed ? (
          <>
            <ImplementationSelector compact />
            <SovereignSettingsPanel />
          </>
        ) : (
          <SovereignSettingsPanel compact />
        )}
        <div className="app-sidebar-foot-actions">
          <CommandPaletteButton />
          <button
            type="button"
            className="app-sidebar-skin-btn"
            title={skinId === 'trust' ? 'Tema oscuro legacy' : 'Tema claro confianza'}
            onClick={() => setSkinId(skinId === 'trust' ? 'legacy' : 'trust')}
          >
            {skinId === 'trust' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
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

  const sectionClass =
    section.id === 'ven-funnel'
      ? 'app-sidebar-section app-sidebar-section--ven'
      : section.id === 'modelo'
        ? 'app-sidebar-section app-sidebar-section--modelo'
        : section.id === 'ven-more'
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
        <div className="app-sidebar-section-label">
          <span className="app-sidebar-section-title">{section.label}</span>
          <span className="app-sidebar-section-sub">{section.subtitle}</span>
        </div>
      ) : null}

      {section.groups
        ? section.groups.map((group) => (
            <div key={group.label} className="app-sidebar-group">
              {!collapsed ? <p className="app-sidebar-group-label">{group.label}</p> : null}
              <NavLinkList
                items={group.items}
                pathname={pathname}
                hash={hash}
                search={search}
                collapsed={collapsed}
              />
            </div>
          ))
        : null}

      {section.items ? (
        <NavLinkList
          items={section.items}
          pathname={pathname}
          hash={hash}
          search={search}
          collapsed={collapsed}
        />
      ) : null}

      {section.cta && !collapsed ? (
        <Link to={section.cta.to} className="app-sidebar-cta" title={section.cta.hint}>
          <section.cta.icon className="h-4 w-4 shrink-0" aria-hidden />
          {section.cta.label}
        </Link>
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
