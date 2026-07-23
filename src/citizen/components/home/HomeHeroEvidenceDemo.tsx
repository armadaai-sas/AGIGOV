import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Pipeline de evidencia animado — pantalla 2 del hero. */
export function HomeHeroEvidenceDemo() {
  const reduceMotion = useReducedMotion();
  const copy = useLandingCopy();
  const steps = copy.HERO_PIPELINE_STEPS;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActive((n) => (n + 1) % (steps.length + 1));
    }, 1400);
    return () => clearInterval(id);
  }, [reduceMotion, steps.length]);

  const doneThrough = active;

  return (
    <div className="hero-evidence-demo" aria-hidden>
      <div className="hero-evidence-demo-glow" />
      <div className="hero-evidence-demo-card">
        <p className="hero-evidence-demo-kicker">{copy.HERO_PIPELINE_KICKER}</p>
        <ol className="hero-evidence-demo-steps">
          {steps.map((step, i) => {
            const done = i < doneThrough;
            const current = i === doneThrough;
            return (
              <li
                key={step.id}
                className={`hero-evidence-demo-step ${done ? 'is-done' : ''} ${current ? 'is-active' : ''}`}
              >
                <span className="hero-evidence-demo-step-mark">
                  {done ? <Check className="h-3 w-3" aria-hidden /> : String(i + 1).padStart(2, '0')}
                </span>
                <span className="hero-evidence-demo-step-label">{step.label}</span>
                {current && !reduceMotion ? (
                  <motion.span
                    className="hero-evidence-demo-step-pulse"
                    layoutId="pipeline-pulse"
                    transition={{ duration: 0.3 }}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="hero-evidence-demo-caption">{copy.HERO_PIPELINE_CAPTION}</p>
      </div>
    </div>
  );
}
