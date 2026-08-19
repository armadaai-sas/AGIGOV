import { useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Cloud, Server } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { LandingDeployCta } from './LandingDeployCta.js';

/** Desplegar — separado de Construir. CTA: Desplegar. */
export function LandingDeploySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [where, setWhere] = useState<'cloud' | 'local'>('cloud');

  return (
    <section
      ref={sectionRef}
      id="desplegar"
      className={`ls-section ls-section--focus ls-section--tone ls-section--tone-coral ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-deploy-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_DEPLOY_KICKER}</p>
          <h2 id="landing-deploy-title" className="ls-title">
            {copy.LANDING_DEPLOY_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_DEPLOY_LEAD}</p>
        </header>

        <div className="ls-deploy">
          <ul className="ls-deploy-points">
            {copy.LANDING_DEPLOY_POINTS.map((point) => (
              <li key={point.id} className="ls-deploy-point">
                <h3 className="ls-deploy-point-title">{point.title}</h3>
                <p className="ls-deploy-point-text">{point.body}</p>
              </li>
            ))}
          </ul>

          <div className="ls-build-panel ls-build-panel--deploy">
            <p className="ls-build-panel-label">{copy.LANDING_DEPLOY_WHERE_LABEL}</p>
            <div className="ls-build-toggle" role="group" aria-label={copy.LANDING_DEPLOY_WHERE_LABEL}>
              <button
                type="button"
                className={`ls-build-toggle-btn${where === 'cloud' ? ' is-active' : ''}`}
                onClick={() => setWhere('cloud')}
              >
                <Cloud className="h-4 w-4" aria-hidden />
                {copy.LANDING_PROCESS_CLOUD_SHORT}
              </button>
              <button
                type="button"
                className={`ls-build-toggle-btn${where === 'local' ? ' is-active' : ''}`}
                onClick={() => setWhere('local')}
              >
                <Server className="h-4 w-4" aria-hidden />
                {copy.LANDING_PROCESS_LOCAL_SHORT}
              </button>
            </div>
            <p className="ls-build-panel-hint">
              {where === 'cloud' ? copy.LANDING_DEPLOY_CLOUD : copy.LANDING_DEPLOY_LOCAL}
            </p>

            <LandingDeployCta to={copy.HERO_CTA_PRIMARY.path} impact />
            <p className="ls-build-micro">{copy.LANDING_DEPLOY_CTA_MICRO}</p>
            <div className="ls-build-links">
              <a href="#construir" className="ls-build-link">
                {copy.LANDING_DEPLOY_BACK_BUILD}
              </a>
              <a href="#consola" className="ls-build-link">
                {copy.LANDING_CTA_SEE_CONSOLE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
