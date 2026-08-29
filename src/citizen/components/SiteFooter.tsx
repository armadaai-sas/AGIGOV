import { Link } from 'react-router-dom';

import { AgigovLogo } from './AgigovLogo.js';
import { IconDiscord, IconGitHub, IconX, IconYouTube } from './SocialBrandIcons.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import type { SovereignLocale } from '../../config/sovereign/index.js';
import { GITHUB_RELEASES_URL } from '../content/landingMinimalCopy.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';
import { SOCIAL_LINKS } from '../platform/socialLinks.js';

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.x, labelKey: 'landing.footer.link.x' as const, Icon: IconX },
  { href: SOCIAL_LINKS.youtube, labelKey: 'landing.footer.link.youtube' as const, Icon: IconYouTube },
  { href: SOCIAL_LINKS.github, labelKey: 'landing.footer.link.github' as const, Icon: IconGitHub },
  { href: SOCIAL_LINKS.discord, labelKey: 'landing.footer.link.discord' as const, Icon: IconDiscord },
];

function FooterLocaleSwitch() {
  const { sovereign, setSovereignPref, t } = useSovereignConfig();
  const isEn = sovereign.locale.startsWith('en');

  function setLocale(locale: SovereignLocale) {
    setSovereignPref({ locale });
  }

  return (
    <div className="ls-footer-locale" role="group" aria-label={t('landing.footer.language')}>
      <button
        type="button"
        className={`ls-footer-locale-btn${!isEn ? ' ls-footer-locale-btn--active' : ''}`}
        aria-pressed={!isEn}
        onClick={() => setLocale('es')}
      >
        ES
      </button>
      <button
        type="button"
        className={`ls-footer-locale-btn${isEn ? ' ls-footer-locale-btn--active' : ''}`}
        aria-pressed={isEn}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  );
}

/** Footer del landing — aislado de estilos globales oscuros. */
export function SiteFooter() {
  const { t } = useSovereignConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="ls-footer" aria-label="Pie de página">
      <div className="ls-footer-rule" aria-hidden />
      <div className="ls-min-inner ls-footer-inner">
        <div className="ls-footer-main">
          <div className="ls-footer-brand">
            <AgigovLogo size="sm" showWordmark variant="light" />
            <p className="ls-footer-tagline">{t('landing.footer.tagline')}</p>
          </div>

          <nav className="ls-footer-links" aria-label="Enlaces">
            <Link to={INSTITUTION_ROUTES.desk}>{t('landing.footer.link.desk')}</Link>
            <Link to={INSTITUTION_ROUTES.hub}>{t('landing.footer.link.institutional')}</Link>
            <Link to="/modelos">{t('landing.footer.link.modelsAll')}</Link>
            <Link to="/aprender/glosario">{t('landing.footer.link.glossary')}</Link>
            <Link to={INSTITUTION_ROUTES.login}>{t('landing.footer.link.access')}</Link>
            <Link to="/descargar">{t('landing.footer.link.desktop')}</Link>
            <Link to="/desarrolladores">{t('landing.footer.link.devs')}</Link>
            <Link to="/ayuda">{t('landing.footer.link.help')}</Link>
            <a href={TEAM_CONTACT_MAILTO}>{t('landing.footer.link.contact')}</a>
            <a href={GITHUB_RELEASES_URL} target="_blank" rel="noopener noreferrer">
              {t('landing.footer.link.releases')}
            </a>
            <Link to="/legal/privacidad">{t('landing.footer.link.privacy')}</Link>
            <Link to="/legal/piloto">{t('landing.footer.link.pilotTerms')}</Link>
          </nav>

          <div className="ls-footer-aside">
            <nav className="ls-footer-social" aria-label={t('landing.footer.community')}>
              {SOCIAL_ITEMS.map(({ href, labelKey, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ls-footer-social-link"
                  aria-label={t(labelKey)}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </nav>
            <FooterLocaleSwitch />
          </div>
        </div>

        <p className="ls-footer-legal">{t('landing.footer.legal', { year: String(year) })}</p>
      </div>
    </footer>
  );
}
