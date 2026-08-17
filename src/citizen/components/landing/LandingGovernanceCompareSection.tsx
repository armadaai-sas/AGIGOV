import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ROTATE_MS = 4500;

/** Comparativo visual — poco texto, paneles que venden. */
export function LandingGovernanceCompareSection() {
  const copy = useLandingCopy();
  const compare = copy.HERO_GOVERNANCE_COMPARE;
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, once: false });
  const dimension = compare.dimensions[active]!;

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setActive((n) => (n + 1) % compare.dimensions.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [inView, compare.dimensions.length]);

  return (
    <section
      ref={sectionRef}
      id="gobernanza-2"
      className={`landing-section landing-section--compare scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-compare-title"
    >
      <div className="landing-compare-inner">
        <p className="hero-brand-kicker">{compare.kicker}</p>
        <h2 id="landing-compare-title" className="landing-compare-title">
          {compare.title}
        </h2>
        <p className="landing-compare-lead">{compare.lead}</p>

        <div className="landing-compare-layout">
          <div className="landing-compare-nav" role="tablist" aria-label={compare.title}>
            {compare.dimensions.map((dim, i) => (
              <button
                key={dim.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`landing-compare-tab ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                {dim.label}
              </button>
            ))}
          </div>

          <div className="landing-compare-panels" role="tabpanel">
            <div className="landing-compare-panel landing-compare-panel--traditional">
              <p className="landing-compare-panel-label">{compare.traditionalLabel}</p>
              <p className="landing-compare-panel-text">{dimension.traditional}</p>
            </div>
            <div className="landing-compare-panel landing-compare-panel--g2">
              <p className="landing-compare-panel-label">{compare.governance2Label}</p>
              <p className="landing-compare-panel-text">{dimension.governance2}</p>
            </div>
          </div>
        </div>

        <Link to={compare.ctaPath} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy landing-compare-cta">
          {compare.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
