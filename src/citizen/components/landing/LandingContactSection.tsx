import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { TRY_MODEL_ENTRY } from '../../platform/institutionalRoutes.js';

/** Contacto — canal institucional. */
export function LandingContactSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className={`ls-section ls-section--focus ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-contact-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_CONTACT_KICKER}</p>
          <h2 id="landing-contact-title" className="ls-title">
            {copy.LANDING_CONTACT_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_CONTACT_LEAD}</p>
          <div className="ls-actions">
            <Link to="/institucional#concierge" className="ls-btn ls-btn--primary">
              {copy.LANDING_CONTACT_CONCIERGE}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={TRY_MODEL_ENTRY} className="ls-btn ls-btn--ghost">
              {copy.LANDING_CONTACT_REGISTER}
            </Link>
            <a href="mailto:contacto@agigov.org" className="ls-btn ls-btn--ghost">
              <Mail className="h-4 w-4" aria-hidden />
              {copy.LANDING_CONTACT_EMAIL}
            </a>
          </div>
        </header>
      </div>
    </section>
  );
}
