import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Settings2 } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { DeskIconButton } from './desk/DeskGlyph.js';
import { DeskSidebarAccount } from './desk/DeskSidebarAccount.js';
import { DeskPersonaSwitch } from './desk/DeskPersonaSwitch.js';
import { OsPreferencesModal } from './os/OsPreferencesModal.js';
import { SidebarTooltip } from './SidebarTooltip.js';
import { useDeskShell } from '../context/DeskShellContext.js';
import {
  DESK_HOME_ITEM,
  getDeskNavSections,
  type DeskNavItem,
  type DeskNavSection,
} from '../platform/deskNav.js';
import { isNavActive } from '../platform/navConfig.js';
import { prefetchRoute } from '../platform/routePrefetch.js';

export function AppSidebar() {
  const { pathname, hash, search } = useLocation();
  const { sidebarCollapsed, toggleSidebar, persona } = useDeskShell();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const sections = getDeskNavSections(persona);

  return (
    <>
      <aside
        className={`app-sidebar ${sidebarCollapsed ? 'app-sidebar--collapsed' : ''}`}
        aria-label="Navegación del desk"
      >
        <div className="app-sidebar-head">
          <Link to="/escritorio" className="app-sidebar-brand" aria-label="Escritorio AGIGOV">
            <AgigovLogo size="xs" variant="light" className="gap-0" />
          </Link>
        </div>

        {!sidebarCollapsed ? <DeskPersonaSwitch /> : null}

        <nav className="app-sidebar-nav app-sidebar-nav--desk">
          <ul className="app-sidebar-list">
            <DeskNavLink
              item={DESK_HOME_ITEM}
              collapsed={sidebarCollapsed}
              active={isNavActive(pathname, hash, DESK_HOME_ITEM.to, search)}
            />
          </ul>
          {sections.map((section, index) => (
            <DeskNavSectionBlock
              key={section.id}
              section={section}
              collapsed={sidebarCollapsed}
              showDivider={index > 0}
            />
          ))}
        </nav>

        <div className="app-sidebar-foot">
          <div className="app-sidebar-foot-actions">
            {sidebarCollapsed ? <DeskPersonaSwitch compact /> : null}
            <SidebarTooltip
              label={sidebarCollapsed ? 'Expandir panel' : 'Contraer panel'}
              hint="Ancho del menú lateral"
              enabled={sidebarCollapsed}
            >
              <DeskIconButton
                kind={sidebarCollapsed ? 'expand' : 'collapse'}
                label={sidebarCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
                className="app-sidebar-skin-btn hidden lg:inline-flex"
                onClick={toggleSidebar}
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
            <DeskSidebarAccount collapsed={sidebarCollapsed} />
          </div>
          {!sidebarCollapsed ? <p className="app-sidebar-desk-hint">⌘K — todo lo demás</p> : null}
        </div>
      </aside>
      <OsPreferencesModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </>
  );
}

function DeskNavSectionBlock({
  section,
  collapsed,
  showDivider,
}: {
  section: DeskNavSection;
  collapsed: boolean;
  showDivider: boolean;
}) {
  const { pathname, hash, search } = useLocation();

  return (
    <div className={`app-sidebar-section ${showDivider ? 'app-sidebar-section--divided' : ''}`}>
      {!collapsed ? <p className="app-sidebar-desk-section-label">{section.label}</p> : null}
      <ul className="app-sidebar-list">
        {section.items.map((item) => (
          <DeskNavLink
            key={item.to}
            item={item}
            collapsed={collapsed}
            active={isNavActive(pathname, hash, item.to, search)}
          />
        ))}
      </ul>
    </div>
  );
}

function DeskNavLink({
  item,
  collapsed,
  active,
}: {
  item: DeskNavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <li>
      <SidebarTooltip label={item.label} hint={item.outcome} enabled={collapsed}>
        <Link
          to={item.to}
          className={`app-sidebar-link app-sidebar-link--desk ${active ? 'app-sidebar-link--active' : ''}`}
          onMouseEnter={() => prefetchRoute(item.to)}
          onFocus={() => prefetchRoute(item.to)}
        >
          <span className="app-sidebar-link-icon-wrap" aria-hidden>
            <Icon className="app-sidebar-link-icon" />
          </span>
          {!collapsed ? (
            <span className="app-sidebar-link-body">
              <span className="app-sidebar-link-label">{item.label}</span>
              <span className="app-sidebar-link-outcome">{item.outcome}</span>
            </span>
          ) : null}
        </Link>
      </SidebarTooltip>
    </li>
  );
}
