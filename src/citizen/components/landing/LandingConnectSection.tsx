import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, Building2, PenLine, MonitorSmartphone } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { TRY_MODEL_ENTRY } from '../../platform/institutionalRoutes.js';
import '../../../styles/landing-below.css';

const STEP_ICONS = [Building2, PenLine, MonitorSmartphone] as const;

/** Sección Conéctate — tres pasos visuales hacia acceso institucional. */
export function LandingConnectSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="conectate"
      className={`landing-section landing-section--connect scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-connect-title"
    >
      <div className="landing-connect-inner">
        <p className="hero-brand-kicker">{copy.LANDING_CONNECT_KICKER}</p>
        <h2 id="landing-connect-title" className="landing-connect-title">
          {copy.LANDING_CONNECT_TITLE}
        </h2>
        <p className="landing-connect-lead">{copy.LANDING_CONNECT_LEAD}</p>

        <ol className="landing-connect-steps">
          {copy.LANDING_CONNECT_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i]!;
            return (
              <li key={step.id} className="landing-connect-step">
                <span className="landing-connect-step-num" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="landing-connect-step-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="landing-connect-step-title">{step.title}</h3>
                <p className="landing-connect-step-body">{step.body}</p>
              </li>
            );
          })}
        </ol>

        <Link to={TRY_MODEL_ENTRY} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy landing-connect-cta">
          {copy.LANDING_CONNECT_CTA}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
