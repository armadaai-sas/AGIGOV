import { Link } from 'react-router-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { EGS_CONSOLE_PATH, EGS_MODEL_PATH } from '../../platform/agigovModels.js';

type NavLink = { to: string; label: string; hint?: string; external?: boolean };

type NavGroup = { id: string; label: string; items: NavLink[] };

/**
 * Marketing header — craft x.ai (menús + Contact / Try free), identidad AGIGOV.
 */
export function HomeHeroNav() {
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  const groups: NavGroup[] = [
    {
      id: 'products',
      label: t('nav.marketing.products'),
      items: [
        { to: '/#os', label: t('nav.marketing.products.os'), hint: t('nav.marketing.products.osHint') },
        { to: '/modelos', label: t('nav.marketing.products.apps'), hint: t('nav.marketing.products.appsHint') },
        { to: EGS_MODEL_PATH, label: t('nav.marketing.products.egs'), hint: t('nav.marketing.products.egsHint') },
        { to: EGS_CONSOLE_PATH, label: t('nav.marketing.products.console'), hint: t('nav.marketing.products.consoleHint') },
        { to: '/#desplegar', label: t('nav.marketing.products.deploy'), hint: t('nav.marketing.products.deployHint') },
      ],
    },
    {
      id: 'institution',
      label: t('nav.marketing.institution'),
      items: [
        { to: INSTITUTION_ROUTES.register, label: t('nav.marketing.institution.register'), hint: t('nav.marketing.institution.registerHint') },
        { to: INSTITUTION_ROUTES.login, label: t('nav.marketing.institution.login'), hint: t('nav.marketing.institution.loginHint') },
        { to: INSTITUTION_ROUTES.pilot, label: t('nav.marketing.institution.pilot'), hint: t('nav.marketing.institution.pilotHint') },
        { to: INSTITUTION_ROUTES.desk, label: t('nav.marketing.institution.desk'), hint: t('nav.marketing.institution.deskHint') },
      ],
    },
    {
      id: 'citizens',
      label: t('nav.marketing.citizens'),
      items: [
        { to: '/gestion', label: t('nav.marketing.citizens.ledger'), hint: t('nav.marketing.citizens.ledgerHint') },
        { to: '/participar', label: t('nav.marketing.citizens.participate'), hint: t('nav.marketing.citizens.participateHint') },
        { to: '/propuestas', label: t('nav.marketing.citizens.proposals'), hint: t('nav.marketing.citizens.proposalsHint') },
      ],
    },
    {
      id: 'developers',
      label: t('nav.marketing.developers'),
      items: [
        { to: '/desarrolladores', label: t('nav.marketing.developers.api'), hint: t('nav.marketing.developers.apiHint') },
        { to: '/ayuda', label: t('nav.marketing.developers.docs'), hint: t('nav.marketing.developers.docsHint') },
        { to: '/aprender/glosario', label: t('nav.marketing.developers.glossary'), hint: t('nav.marketing.developers.glossaryHint') },
        {
          to: 'https://github.com/armadaai-sas/Armada-VZLA',
          label: t('nav.marketing.developers.github'),
          hint: t('nav.marketing.developers.githubHint'),
          external: true,
        },
      ],
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const tryPath = isAuthenticated ? INSTITUTION_ROUTES.desk : INSTITUTION_ROUTES.register;
  const tryLabel = isAuthenticated ? t('nav.desk') : t('nav.marketing.tryFree');

  function closeAll() {
    setOpenGroup(null);
    setMobileOpen(false);
  }

  return (
    <header ref={navRef} className={`ls-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ls-announce" role="note">
        <span className="ls-announce-new">{t('nav.marketing.announceNew')}</span>
        <span className="ls-announce-text">{t('nav.marketing.announce')}</span>
      </div>

      <div className="ls-nav-bar">
        <Link to="/" className="ls-nav-logo" aria-label={t('nav.home')} onClick={closeAll}>
          <AgigovLogo size="sm" showWordmark variant="dark" />
        </Link>

        <nav className="ls-nav-menus" aria-label={t('nav.main')}>
          {groups.map((group) => {
            const open = openGroup === group.id;
            return (
              <div key={group.id} className={`ls-nav-group ${open ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="ls-nav-group-trigger"
                  aria-expanded={open}
                  aria-controls={`${menuId}-${group.id}`}
                  onClick={() => setOpenGroup(open ? null : group.id)}
                >
                  {group.label}
                  <ChevronDown className="ls-nav-chevron" aria-hidden />
                </button>
                <div id={`${menuId}-${group.id}`} className="ls-nav-dropdown" hidden={!open}>
                  <ul className="ls-nav-dropdown-list">
                    {group.items.map((item) => (
                      <li key={item.to}>
                        {item.external ? (
                          <a
                            href={item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ls-nav-dropdown-link"
                            onClick={closeAll}
                          >
                            <span className="ls-nav-dropdown-label">{item.label}</span>
                            {item.hint ? <span className="ls-nav-dropdown-hint">{item.hint}</span> : null}
                          </a>
                        ) : (
                          <Link to={item.to} className="ls-nav-dropdown-link" onClick={closeAll}>
                            <span className="ls-nav-dropdown-label">{item.label}</span>
                            {item.hint ? <span className="ls-nav-dropdown-hint">{item.hint}</span> : null}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="ls-nav-actions">
          <Link to="/#contacto" className="ls-nav-contact" onClick={closeAll}>
            {t('nav.marketing.contact')}
          </Link>
          <Link to={tryPath} className="ls-nav-register" onClick={closeAll}>
            {tryLabel}
          </Link>
          <button
            type="button"
            className="ls-nav-burger"
            aria-expanded={mobileOpen}
            aria-controls={`${menuId}-mobile`}
            aria-label={mobileOpen ? t('nav.marketing.closeMenu') : t('nav.marketing.openMenu')}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div id={`${menuId}-mobile`} className={`ls-nav-mobile ${mobileOpen ? 'is-open' : ''}`} hidden={!mobileOpen}>
        <div className="ls-nav-mobile-inner">
          {groups.map((group) => (
            <div key={group.id} className="ls-nav-mobile-group">
              <p className="ls-nav-mobile-heading">{group.label}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.to}>
                    {item.external ? (
                      <a href={item.to} target="_blank" rel="noopener noreferrer" onClick={closeAll}>
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.to} onClick={closeAll}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="ls-nav-mobile-ctas">
            <Link to="/#contacto" className="ls-btn ls-btn--ghost" onClick={closeAll}>
              {t('nav.marketing.contact')}
            </Link>
            <Link to={tryPath} className="ls-btn ls-btn--primary" onClick={closeAll}>
              {tryLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
