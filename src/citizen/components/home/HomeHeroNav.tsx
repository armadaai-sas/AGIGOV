import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { InstitutionAccountNav } from '../institutional/InstitutionAccountNav.js';

/** Nav — sombra al scroll, CTA de conversión. */
export function HomeHeroNav() {
  const [scrolled, setScrolled] = useState(false);
  const copy = useLandingCopy();
  const { t } = useSovereignConfig();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hero-trust-nav hero-trust-nav--light ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="hero-trust-nav-inner">
        <Link to="/" className="shrink-0 no-underline" aria-label={t('nav.home')}>
          <AgigovLogo size="sm" showWordmark variant="light" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3" aria-label={t('nav.main')}>
          <Link to="/#gobernanza-2" className="hero-trust-nav-ghost hidden sm:inline">
            {t('nav.governance2')}
          </Link>
          <Link to="/institucional" className="hero-trust-nav-ghost hidden md:inline">
            {t('nav.institutional')}
          </Link>
          <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-trust-nav-ghost hidden sm:inline">
            {copy.HERO_CTA_SECONDARY.label}
          </Link>
          <InstitutionAccountNav variant="hero" />
        </nav>
      </div>
    </header>
  );
}
