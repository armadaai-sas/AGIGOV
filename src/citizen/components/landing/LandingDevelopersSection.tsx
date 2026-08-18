import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ArrowRight, Github, GitFork, Star } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const GITHUB_ORG = 'https://github.com/armadaai-sas';
const GITHUB_REPO = 'https://github.com/armadaai-sas/Armada-VZLA';

/** Desarrolladores — panel GitHub. */
export function LandingDevelopersSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="desarrolladores"
      className={`ls-section ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-developers-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_DEVELOPERS_KICKER}</p>
          <h2 id="landing-developers-title" className="ls-title">
            {copy.LANDING_DEVELOPERS_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_DEVELOPERS_LEAD}</p>
        </header>

        <div className="ls-panel">
          <div className="ls-panel-head">
            <span className="ls-panel-gh">
              <Github className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="ls-panel-repo">armadaai-sas / Armada-VZLA</p>
              <p className="ls-panel-desc">{copy.LANDING_DEVELOPERS_REPO}</p>
            </div>
          </div>
          <div className="ls-actions">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="ls-btn ls-btn--primary">
              <Star className="h-4 w-4" aria-hidden />
              {copy.LANDING_DEVELOPERS_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href={`${GITHUB_REPO}/fork`} target="_blank" rel="noopener noreferrer" className="ls-btn ls-btn--ghost">
              <GitFork className="h-4 w-4" aria-hidden />
              {copy.LANDING_DEVELOPERS_FORK}
            </a>
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" className="ls-btn ls-btn--ghost">
              {copy.LANDING_DEVELOPERS_ORG}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
