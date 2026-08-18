import { useRef } from 'react';
import { useInView } from 'motion/react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroConsoleDemo } from '../home/HomeHeroConsoleDemo.js';
import '../home/hero-console.css';
import '../../../styles/landing-below.css';

/** Diapositiva Consola — mismo ancho wide que el diagrama OS. */
export function LandingConsoleSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="consola"
      className={`landing-section landing-section--slide landing-section--console scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-console-title"
    >
      <div className="landing-slide-inner">
        <p className="hero-brand-kicker">{copy.LANDING_CONSOLE_KICKER}</p>
        <h2 id="landing-console-title" className="landing-slide-title">
          {copy.LANDING_CONSOLE_TITLE}
        </h2>
        <p className="landing-slide-lead">{copy.LANDING_CONSOLE_LEAD}</p>
        <div className="landing-wide-stage">
          <div className="hero-product-frame hero-product-frame--full">
            <HomeHeroConsoleDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
