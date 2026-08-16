import { Link } from 'react-router-dom';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { useHeroEgsData } from '../../hooks/useHeroEgsData.js';
import { HomeHeroConsoleDemo } from './HomeHeroConsoleDemo.js';
import './hero-console.css';

/** Consola EGS flotante — datos y copy por jurisdicción. */
export function HomeHeroFloatingConsole() {
  const copy = useLandingCopy();
  const { live } = useHeroEgsData('home-hero-egs-float');

  return (
    <div className="hero-cinematic-float-wrap">
      <div className="hero-cinematic-float-glow" aria-hidden />
      <div className="hero-brand-float hero-cinematic-float-shell">
        <HomeHeroConsoleDemo />
      </div>

      <p className="hero-cinematic-live-caption">
        <span
          className={`hero-cinematic-live-dot ${live ? 'hero-cinematic-live-dot--on' : ''}`}
          aria-hidden
        />
        {copy.HERO_CINEMATIC_LIVE_CAPTION}
      </p>

      <Link to="/modelos/egs/consola" className="sr-only">
        {copy.HERO_FIRST_MODEL.demoLabel}
      </Link>
    </div>
  );
}
