import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { Cloud, Server } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/**
 * Desplegar — dónde corre el OS. CTA único en hero + #contacto (sin duplicar registro).
 */
export function LandingDeploySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [where, setWhere] = useState<'cloud' | 'local'>('cloud');

  return (
    <section
      ref={sectionRef}
      id="desplegar"
      className={`ls-section ls-section--focus ls-section--tone ${inView ? 'is-inview' : ''}`}
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

            <div className="ls-build-links">
              <Link to="/#modelos" className="ls-btn ls-btn--secondary">
                {copy.LANDING_DEPLOY_BACK_BUILD}
              </Link>
              <Link to="/#utilidad" className="ls-btn ls-btn--secondary">
                {copy.LANDING_DEPLOY_SEE_RESULTS}
              </Link>
              <Link to="/#contacto" className="ls-btn ls-btn--primary">
                {copy.LANDING_DEPLOY_CTA}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
