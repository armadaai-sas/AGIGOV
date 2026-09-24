import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Settings2 } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { DeskIconButton } from './desk/DeskGlyph.js';
import { DeskSidebarAccount } from './desk/DeskSidebarAccount.js';
import { agigovIconProps } from './icons/agigovIcon.js';
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

export function AppSidebar({ variant = 'desk' }: { variant?: 'desk' | 'drawer' }) {
  const { pathname, hash, search } = useLocation();
  const { sidebarCollapsed, toggleSidebar, persona } = useDeskShell();
  const collapsed = variant === 'desk' && sidebarCollapsed;
  const [prefsOpen, setPrefsOpen] = useState(false);
  const sections = getDeskNavSections(persona);

  return (
    <>
      <aside
        className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''}`}
        aria-label="Navegación del desk"
      >
        <div className="app-sidebar-head">
          <Link to="/escritorio" className="app-sidebar-brand" aria-label="Escritorio AGIGOV">
            <AgigovLogo size="xs" variant="light" showWordmark={!collapsed} className="app-sidebar-brand-mark" />
          </Link>
        </div>

        {!collapsed ? <DeskPersonaSwitch /> : null}

        <nav className="app-sidebar-nav app-sidebar-nav--desk">
          <ul className="app-sidebar-list">
            <DeskNavLink
              item={DESK_HOME_ITEM}
              collapsed={collapsed}
              active={isNavActive(pathname, hash, DESK_HOME_ITEM.to, search)}
            />
          </ul>
          {sections.map((section, index) => (
            <DeskNavSectionBlock
              key={section.id}
              section={section}
              collapsed={collapsed}
              showDivider={index > 0}
            />
          ))}
        </nav>

        <div className="app-sidebar-foot">
          {collapsed ? <DeskPersonaSwitch compact /> : null}
          <div className="app-sidebar-foot-actions">
            <SidebarTooltip
              label={collapsed ? 'Expandir panel' : 'Contraer panel'}
              hint="Ancho del menú lateral"
              enabled={collapsed}
            >
              <DeskIconButton
                kind={collapsed ? 'expand' : 'collapse'}
                label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
                className="app-sidebar-skin-btn hidden lg:inline-flex"
                onClick={toggleSidebar}
              />
            </SidebarTooltip>
            <SidebarTooltip label="Preferencias" hint="Idioma y cuenta" enabled={collapsed}>
              <button
                type="button"
                className="app-sidebar-skin-btn"
                aria-label="Preferencias"
                onClick={() => setPrefsOpen(true)}
              >
                <Settings2 {...agigovIconProps('md')} />
              </button>
            </SidebarTooltip>
            <DeskSidebarAccount collapsed={collapsed} />
          </div>
          {!collapsed ? <p className="app-sidebar-desk-hint">⌘K — todo lo demás</p> : null}
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
      {!collapsed && section.label ? (
        <p className="app-sidebar-desk-section-label">{section.label}</p>
      ) : null}
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
  const isSecondary = item.tier === 'secondary';
  // Expandido: icono y etiqueta. Colapsado: solo icono, con tooltip.
  const showLabel = !collapsed;

  const link = (
    <Link
      to={item.to}
      className={`app-sidebar-link app-sidebar-link--desk ${active ? 'app-sidebar-link--active' : ''} ${isSecondary ? 'app-sidebar-link--muted' : ''} ${showLabel ? 'app-sidebar-link--named' : ''}`}
      onMouseEnter={() => prefetchRoute(item.to)}
      onFocus={() => prefetchRoute(item.to)}
      aria-label={!showLabel ? item.label : undefined}
    >
      <span className="app-sidebar-link-icon-wrap" aria-hidden>
        <Icon className="app-sidebar-link-icon" />
      </span>
      {showLabel ? (
        <span className="app-sidebar-link-body app-sidebar-link-body--named">
          <span className="app-sidebar-link-label">{item.label}</span>
        </span>
      ) : null}
    </Link>
  );

  return (
    <li>
      <SidebarTooltip label={item.label} hint={item.outcome} enabled={collapsed}>
        {link}
      </SidebarTooltip>
    </li>
  );
}
