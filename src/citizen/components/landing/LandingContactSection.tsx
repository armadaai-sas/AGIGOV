import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { TRY_MODEL_ENTRY } from '../../platform/institutionalRoutes.js';
import '../../../styles/landing-below.css';

/** Diapositiva Contacto — canal institucional (sin “Acceso”). */
export function LandingContactSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className={`landing-section landing-section--slide landing-section--contact scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-contact-title"
    >
      <div className="landing-slide-inner">
        <p className="hero-brand-kicker">{copy.LANDING_CONTACT_KICKER}</p>
        <h2 id="landing-contact-title" className="landing-slide-title">
          {copy.LANDING_CONTACT_TITLE}
        </h2>
        <p className="landing-slide-lead">{copy.LANDING_CONTACT_LEAD}</p>
        <div className="landing-contact-actions">
          <Link to="/institucional#concierge" className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy">
            {copy.LANDING_CONTACT_CONCIERGE}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to={TRY_MODEL_ENTRY} className="hero-brand-btn hero-brand-btn--ghost-navy">
            {copy.LANDING_CONTACT_REGISTER}
          </Link>
          <a href="mailto:contacto@agigov.org" className="hero-brand-btn hero-brand-btn--ghost-navy">
            <Mail className="h-4 w-4" aria-hidden />
            {copy.LANDING_CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
