import { useRef } from 'react';
import { useInView } from 'motion/react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroOsDiagram } from '../home/HomeHeroOsDiagram.js';
import '../../../styles/landing-below.css';

/** Sección Flujo — diagrama OS a ancho, título iPhone-grade. */
export function LandingFlowSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="flujo"
      className={`landing-section landing-section--flow scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-flow-title"
    >
      <div className="landing-flow-inner">
        <p className="hero-brand-kicker">{copy.LANDING_FLOW_KICKER}</p>
        <h2 id="landing-flow-title" className="landing-flow-title">
          {copy.LANDING_FLOW_TITLE}
        </h2>
        <p className="landing-flow-lead">{copy.LANDING_FLOW_LEAD}</p>
        <div className="landing-flow-visual">
          <HomeHeroOsDiagram />
        </div>
      </div>
    </section>
  );
}
