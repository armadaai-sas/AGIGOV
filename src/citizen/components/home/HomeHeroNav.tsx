import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { InstitutionAccountNav } from '../institutional/InstitutionAccountNav.js';

const GITHUB_REPO = 'https://github.com/armadaai-sas/Armada-VZLA';

/** Nav landing — marca, GitHub (estilo n8n), CTA. */
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
    <header className={`hero-trust-nav hero-trust-nav--navy ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="hero-trust-nav-inner">
        <Link to="/" className="shrink-0 no-underline" aria-label={t('nav.home')}>
          <AgigovLogo size="sm" showWordmark variant="dark" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3" aria-label={t('nav.main')}>
          <Link to="/#modelos" className="hero-trust-nav-ghost hero-trust-nav-ghost--navy hidden sm:inline">
            {t('landing.models.kicker')}
          </Link>
          <Link to="/#desarrolladores" className="hero-trust-nav-ghost hero-trust-nav-ghost--navy hidden md:inline">
            {t('landing.developers.kicker')}
          </Link>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-trust-nav-github"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">GitHub</span>
          </a>
          <Link
            to={copy.HERO_CTA_PRIMARY.path}
            className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--nav hero-brand-btn--navy"
          >
            {copy.HERO_CTA_PRIMARY.label}
          </Link>
          <InstitutionAccountNav variant="hero" />
        </nav>
      </div>
    </header>
  );
}
