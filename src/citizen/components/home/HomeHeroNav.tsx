import { Link } from 'react-router-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { EGS_CONSOLE_PATH, EGS_MODEL_PATH } from '../../platform/agigovModels.js';

type NavLink = { to: string; label: string; hint?: string; external?: boolean };

type NavSection = { title: string; items: NavLink[] };

type NavGroup = { id: string; label: string; sections: NavSection[] };

function DropdownSections({
  sections,
  onNavigate,
}: {
  sections: NavSection[];
  onNavigate: () => void;
}) {
  return (
    <div className="ls-nav-sections">
      {sections.map((section) => (
        <div key={section.title} className="ls-nav-section">
          <p className="ls-nav-section-title">{section.title}</p>
          <ul className="ls-nav-dropdown-list">
            {section.items.map((item) => (
              <li key={`${section.title}-${item.to}`}>
                {item.external ? (
                  <a
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ls-nav-dropdown-link"
                    onClick={onNavigate}
                  >
                    <span className="ls-nav-dropdown-label">{item.label}</span>
                    {item.hint ? <span className="ls-nav-dropdown-hint">{item.hint}</span> : null}
                  </a>
                ) : (
                  <Link to={item.to} className="ls-nav-dropdown-link" onClick={onNavigate}>
                    <span className="ls-nav-dropdown-label">{item.label}</span>
                    {item.hint ? <span className="ls-nav-dropdown-hint">{item.hint}</span> : null}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Marketing header — menú por audiencia + Productos, Comenzar gratis seccionado.
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
      sections: [
        {
          title: t('nav.marketing.products.sec.platform'),
          items: [
            { to: '/#os', label: t('nav.marketing.products.os'), hint: t('nav.marketing.products.osHint') },
            {
              to: '/#resultados',
              label: t('nav.marketing.products.results'),
              hint: t('nav.marketing.products.resultsHint'),
            },
            {
              to: '/modelos',
              label: t('nav.marketing.products.apps'),
              hint: t('nav.marketing.products.appsHint'),
            },
            {
              to: EGS_CONSOLE_PATH,
              label: t('nav.marketing.products.console'),
              hint: t('nav.marketing.products.consoleHint'),
            },
            {
              to: '/#desplegar',
              label: t('nav.marketing.products.deploy'),
              hint: t('nav.marketing.products.deployHint'),
            },
          ],
        },
        {
          title: t('nav.marketing.products.sec.models'),
          items: [
            {
              to: '/modelos?audiencia=gubernamental',
              label: t('nav.marketing.products.govModels'),
              hint: t('nav.marketing.products.govModelsHint'),
            },
            {
              to: '/modelos?audiencia=empresarial',
              label: t('nav.marketing.products.bizModels'),
              hint: t('nav.marketing.products.bizModelsHint'),
            },
            {
              to: '/modelos?audiencia=ciudadano',
              label: t('nav.marketing.products.citizenModels'),
              hint: t('nav.marketing.products.citizenModelsHint'),
            },
            {
              to: EGS_MODEL_PATH,
              label: t('nav.marketing.products.egs'),
              hint: t('nav.marketing.products.egsHint'),
            },
          ],
        },
      ],
    },
    {
      id: 'government',
      label: t('nav.marketing.government'),
      sections: [
        {
          title: t('nav.marketing.government.sec.start'),
          items: [
            {
              to: INSTITUTION_ROUTES.hub,
              label: t('nav.marketing.institution.hub'),
              hint: t('nav.marketing.institution.hubHint'),
            },
            {
              to: INSTITUTION_ROUTES.register,
              label: t('nav.marketing.institution.register'),
              hint: t('nav.marketing.institution.registerHint'),
            },
            {
              to: INSTITUTION_ROUTES.login,
              label: t('nav.marketing.institution.login'),
              hint: t('nav.marketing.institution.loginHint'),
            },
            {
              to: INSTITUTION_ROUTES.pilot,
              label: t('nav.marketing.institution.pilot'),
              hint: t('nav.marketing.institution.pilotHint'),
            },
          ],
        },
        {
          title: t('nav.marketing.government.sec.operate'),
          items: [
            {
              to: INSTITUTION_ROUTES.desk,
              label: t('nav.marketing.institution.desk'),
              hint: t('nav.marketing.institution.deskHint'),
            },
            {
              to: EGS_CONSOLE_PATH,
              label: t('nav.marketing.products.console'),
              hint: t('nav.marketing.products.consoleHint'),
            },
            {
              to: '/modelos?audiencia=gubernamental',
              label: t('nav.marketing.products.govModels'),
              hint: t('nav.marketing.products.govModelsHint'),
            },
          ],
        },
      ],
    },
    {
      id: 'business',
      label: t('nav.marketing.business'),
      sections: [
        {
          title: t('nav.marketing.business.sec.models'),
          items: [
            {
              to: '/modelos?audiencia=empresarial',
              label: t('nav.marketing.business.catalog'),
              hint: t('nav.marketing.business.catalogHint'),
            },
            {
              to: '/modelos/iaau',
              label: t('nav.marketing.business.iaau'),
              hint: t('nav.marketing.business.iaauHint'),
            },
            {
              to: '/modelos/data-trust',
              label: t('nav.marketing.business.dataTrust'),
              hint: t('nav.marketing.business.dataTrustHint'),
            },
          ],
        },
        {
          title: t('nav.marketing.business.sec.talk'),
          items: [
            {
              to: INSTITUTION_ROUTES.register,
              label: t('nav.marketing.business.sandbox'),
              hint: t('nav.marketing.business.sandboxHint'),
            },
            {
              to: '/#contacto',
              label: t('nav.marketing.contact'),
              hint: t('nav.marketing.business.contactHint'),
            },
            {
              to: '/desarrolladores',
              label: t('nav.marketing.developers.api'),
              hint: t('nav.marketing.developers.apiHint'),
            },
          ],
        },
      ],
    },
    {
      id: 'citizens',
      label: t('nav.marketing.citizens'),
      sections: [
        {
          title: t('nav.marketing.citizens.sec.see'),
          items: [
            {
              to: '/gestion',
              label: t('nav.marketing.citizens.ledger'),
              hint: t('nav.marketing.citizens.ledgerHint'),
            },
            {
              to: '/modelos?audiencia=ciudadano',
              label: t('nav.marketing.products.citizenModels'),
              hint: t('nav.marketing.products.citizenModelsHint'),
            },
          ],
        },
        {
          title: t('nav.marketing.citizens.sec.act'),
          items: [
            {
              to: '/participar',
              label: t('nav.marketing.citizens.participate'),
              hint: t('nav.marketing.citizens.participateHint'),
            },
            {
              to: '/propuestas',
              label: t('nav.marketing.citizens.proposals'),
              hint: t('nav.marketing.citizens.proposalsHint'),
            },
          ],
        },
      ],
    },
  ];

  const trySections: NavSection[] = isAuthenticated
    ? [
        {
          title: t('nav.marketing.try.sec.continue'),
          items: [
            { to: INSTITUTION_ROUTES.desk, label: t('nav.desk'), hint: t('nav.marketing.try.deskHint') },
            {
              to: INSTITUTION_ROUTES.pilot,
              label: t('nav.marketing.try.pilot'),
              hint: t('nav.marketing.try.pilotHint'),
            },
            {
              to: EGS_CONSOLE_PATH,
              label: t('nav.marketing.try.console'),
              hint: t('nav.marketing.try.consoleHint'),
            },
          ],
        },
      ]
    : [
        {
          title: t('nav.marketing.try.sec.government'),
          items: [
            {
              to: INSTITUTION_ROUTES.register,
              label: t('nav.marketing.try.self'),
              hint: t('nav.marketing.try.selfHint'),
            },
            {
              to: INSTITUTION_ROUTES.pilot,
              label: t('nav.marketing.try.pilot'),
              hint: t('nav.marketing.try.pilotHint'),
            },
            {
              to: EGS_CONSOLE_PATH,
              label: t('nav.marketing.try.console'),
              hint: t('nav.marketing.try.consoleHint'),
            },
          ],
        },
        {
          title: t('nav.marketing.try.sec.business'),
          items: [
            {
              to: '/modelos?audiencia=empresarial',
              label: t('nav.marketing.try.biz'),
              hint: t('nav.marketing.try.bizHint'),
            },
            {
              to: '/#contacto',
              label: t('nav.marketing.try.support'),
              hint: t('nav.marketing.try.supportHint'),
            },
          ],
        },
        {
          title: t('nav.marketing.try.sec.citizen'),
          items: [
            {
              to: '/gestion',
              label: t('nav.marketing.citizens.ledger'),
              hint: t('nav.marketing.citizens.ledgerHint'),
            },
            {
              to: '/participar',
              label: t('nav.marketing.citizens.participate'),
              hint: t('nav.marketing.citizens.participateHint'),
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
      if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null);
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

  function closeAll() {
    setOpenGroup(null);
    setMobileOpen(false);
  }

  function toggleGroup(id: string) {
    setOpenGroup((cur) => (cur === id ? null : id));
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
                  onClick={() => toggleGroup(group.id)}
                >
                  {group.label}
                  <ChevronDown className="ls-nav-chevron" aria-hidden />
                </button>
                <div
                  id={`${menuId}-${group.id}`}
                  className={`ls-nav-dropdown ls-nav-dropdown--panel ${group.sections.length > 1 ? 'ls-nav-dropdown--wide' : ''}`}
                  hidden={!open}
                >
                  <p className="ls-nav-dropdown-kicker">{group.label}</p>
                  <DropdownSections sections={group.sections} onNavigate={closeAll} />
                </div>
              </div>
            );
          })}
        </nav>

        <div className="ls-nav-actions">
          <Link to="/#contacto" className="ls-nav-contact" onClick={closeAll}>
            {t('nav.marketing.contact')}
          </Link>

          <div className={`ls-nav-try ${openGroup === 'try' ? 'is-open' : ''}`}>
            <button
              type="button"
              className="ls-nav-register"
              aria-expanded={openGroup === 'try'}
              aria-controls={`${menuId}-try`}
              onClick={() => toggleGroup('try')}
            >
              {isAuthenticated ? t('nav.desk') : t('nav.marketing.tryFree')}
              <ChevronDown className="ls-nav-chevron ls-nav-chevron--on-cta" aria-hidden />
            </button>
            <div
              id={`${menuId}-try`}
              className="ls-nav-dropdown ls-nav-dropdown--try ls-nav-dropdown--wide"
              hidden={openGroup !== 'try'}
            >
              <p className="ls-nav-dropdown-kicker">{t('nav.marketing.try.kicker')}</p>
              <DropdownSections sections={trySections} onNavigate={closeAll} />
            </div>
          </div>

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
              {group.sections.map((section) => (
                <div key={section.title} className="ls-nav-mobile-section">
                  <p className="ls-nav-mobile-section-title">{section.title}</p>
                  <ul>
                    {section.items.map((item) => (
                      <li key={`${group.id}-${item.to}`}>
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
            </div>
          ))}
          <div className="ls-nav-mobile-group">
            <p className="ls-nav-mobile-heading">{t('nav.marketing.tryFree')}</p>
            {trySections.map((section) => (
              <div key={section.title} className="ls-nav-mobile-section">
                <p className="ls-nav-mobile-section-title">{section.title}</p>
                <ul>
                  {section.items.map((item) => (
                    <li key={`try-${item.to}`}>
                      <Link to={item.to} onClick={closeAll}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="ls-nav-mobile-ctas">
            <Link to="/#contacto" className="ls-btn ls-btn--ghost" onClick={closeAll}>
              {t('nav.marketing.contact')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
