import { Link } from 'react-router-dom';

import { AgigovLogo } from './AgigovLogo.js';
import { IconDiscord, IconGitHub, IconX, IconYouTube } from './SocialBrandIcons.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import {
  landingPersonaLabelKey,
  landingPersonaPath,
  LANDING_PERSONA_IDS,
} from '../content/landingMinimalCopy.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';
import { SOCIAL_LINKS } from '../platform/socialLinks.js';

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.github, labelKey: 'landing.footer.link.github' as const, Icon: IconGitHub },
  { href: SOCIAL_LINKS.x, labelKey: 'landing.footer.link.x' as const, Icon: IconX },
  { href: SOCIAL_LINKS.youtube, labelKey: 'landing.footer.link.youtube' as const, Icon: IconYouTube },
  { href: SOCIAL_LINKS.discord, labelKey: 'landing.footer.link.discord' as const, Icon: IconDiscord },
];

/** Footer del landing — caminos, producto y confianza. */
export function SiteFooter() {
  const { t } = useSovereignConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="ls-footer" aria-label="Pie de página">
      <div className="ls-footer-rule" aria-hidden />
      <div className="ls-min-inner ls-footer-inner">
        <div className="ls-footer-brand">
          <AgigovLogo size="sm" showWordmark variant="light" />
          <p className="ls-footer-tagline">{t('landing.footer.tagline')}</p>
        </div>

        <div className="ls-footer-grid">
          <nav className="ls-footer-col" aria-label={t('landing.footer.group.paths')}>
            <p className="ls-footer-col-title">{t('landing.footer.group.paths')}</p>
            {LANDING_PERSONA_IDS.map((id) => (
              <Link key={id} to={landingPersonaPath(id)}>
                {t(landingPersonaLabelKey(id))}
              </Link>
            ))}
          </nav>

          <nav className="ls-footer-col" aria-label={t('landing.footer.group.product')}>
            <p className="ls-footer-col-title">{t('landing.footer.group.product')}</p>
            <Link to={INSTITUTION_ROUTES.desk}>{t('landing.footer.link.desk')}</Link>
            <Link to="/modelos">{t('landing.footer.link.modelsAll')}</Link>
            <Link to={INSTITUTION_ROUTES.hub}>{t('landing.footer.link.institutional')}</Link>
            <Link to="/descargar">{t('landing.footer.link.desktop')}</Link>
            <Link to="/desarrolladores">{t('landing.footer.link.devs')}</Link>
          </nav>

          <nav className="ls-footer-col" aria-label={t('landing.footer.group.trust')}>
            <p className="ls-footer-col-title">{t('landing.footer.group.trust')}</p>
            <Link to={INSTITUTION_ROUTES.login}>{t('landing.footer.link.access')}</Link>
            <a href={TEAM_CONTACT_MAILTO}>{t('landing.footer.link.contact')}</a>
            <Link to="/ayuda">{t('landing.footer.link.help')}</Link>
            <Link to="/aprender/glosario">{t('landing.footer.link.glossary')}</Link>
            <Link to="/legal/privacidad">{t('landing.footer.link.privacy')}</Link>
            <Link to="/legal/piloto">{t('landing.footer.link.pilotTerms')}</Link>
          </nav>
        </div>

        <div className="ls-footer-bottom">
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
          <p className="ls-footer-legal">{t('landing.footer.legal', { year: String(year) })}</p>
        </div>
      </div>
    </footer>
  );
}
