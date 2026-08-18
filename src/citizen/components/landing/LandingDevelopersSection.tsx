import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ArrowRight, Github, GitFork, Star } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const GITHUB_ORG = 'https://github.com/armadaai-sas';
const GITHUB_REPO = 'https://github.com/armadaai-sas/Armada-VZLA';

/** Diapositiva Desarrolladores — comunidad GitHub. */
export function LandingDevelopersSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="desarrolladores"
      className={`landing-section landing-section--slide landing-section--developers scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-developers-title"
    >
      <div className="landing-slide-inner">
        <p className="hero-brand-kicker">{copy.LANDING_DEVELOPERS_KICKER}</p>
        <h2 id="landing-developers-title" className="landing-slide-title">
          {copy.LANDING_DEVELOPERS_TITLE}
        </h2>
        <p className="landing-slide-lead">{copy.LANDING_DEVELOPERS_LEAD}</p>

        <div className="landing-developers-card">
          <div className="landing-developers-card-head">
            <span className="landing-developers-github-icon">
              <Github className="h-6 w-6" aria-hidden />
            </span>
            <div className="landing-developers-card-meta">
              <p className="landing-developers-repo">armadaai-sas / Armada-VZLA</p>
              <p className="landing-developers-repo-desc">{copy.LANDING_DEVELOPERS_REPO}</p>
            </div>
          </div>
          <div className="landing-developers-actions">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy"
            >
              <Star className="h-4 w-4" aria-hidden />
              {copy.LANDING_DEVELOPERS_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={`${GITHUB_REPO}/fork`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-brand-btn hero-brand-btn--ghost-navy"
            >
              <GitFork className="h-4 w-4" aria-hidden />
              {copy.LANDING_DEVELOPERS_FORK}
            </a>
            <a
              href={GITHUB_ORG}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-brand-btn hero-brand-btn--ghost-navy"
            >
              {copy.LANDING_DEVELOPERS_ORG}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
