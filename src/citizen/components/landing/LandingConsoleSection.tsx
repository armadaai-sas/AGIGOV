import { useRef } from 'react';
import { useInView } from 'motion/react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroConsoleDemo } from '../home/HomeHeroConsoleDemo.js';
import '../home/hero-console-demo.css';

/** Consola — mismo ancho .ls-inner que el resto. */
export function LandingConsoleSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="consola"
      className={`ls-section ls-section--alt ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-console-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_CONSOLE_KICKER}</p>
          <h2 id="landing-console-title" className="ls-title">
            {copy.LANDING_CONSOLE_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_CONSOLE_LEAD}</p>
        </header>
        <div className="ls-stage">
          <div className="ls-frame">
            <HomeHeroConsoleDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
