import { Link } from 'react-router-dom';

import { useSovereignConfig } from '../../context/PlatformContext.js';

/** Atajos de una palabra — sin CTAs duplicados (registro vive en hero + #contacto). */
const SHORTCUTS = [
  { to: '/#utilidad', key: 'landing.continuum.see' as const },
  { to: '/#autoridad', key: 'landing.continuum.why' as const },
  { to: '/#modelos', key: 'landing.continuum.models' as const },
  { to: '/#contacto', key: 'landing.continuum.contact' as const },
] as const;

export function LandingContinuumStrip() {
  const { t } = useSovereignConfig();

  return (
    <nav className="ls-continuum" aria-label={t('landing.continuum.aria')}>
      <div className="ls-inner ls-continuum-inner">
        <p className="ls-continuum-kicker">{t('landing.continuum.kicker')}</p>
        <ul className="ls-continuum-steps">
          {SHORTCUTS.map((step) => (
            <li key={step.to} className="ls-continuum-step">
              <Link to={step.to} className="ls-continuum-link">
                <span className="ls-continuum-label">{t(step.key)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
