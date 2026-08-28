import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, LogIn, Mail, Rocket } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import {
  INSTITUTION_ROUTES,
  TEAM_CONTACT_MAILTO,
  TRY_MODEL_ENTRY,
} from '../../platform/institutionalRoutes.js';

/**
 * Empezar — dos caminos en paneles OS (contraste alto):
 * 1) Entorno de prueba (autoservicio)  2) Hablar con el equipo
 */
export function LandingContactSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className={`ls-section ls-section--focus ls-section--tone ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-contact-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_CONTACT_KICKER}</p>
          <h2 id="landing-contact-title" className="ls-title">
            {copy.LANDING_CONTACT_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_CONTACT_LEAD}</p>
        </header>

        <div className="ls-contact-paths">
          <article className="ls-contact-path ls-contact-path--primary">
            <p className="ls-contact-path-kicker">{copy.LANDING_CONTACT_SANDBOX_KICKER}</p>
            <h3 className="ls-contact-path-title">{copy.LANDING_CONTACT_SANDBOX_TITLE}</h3>
            <p className="ls-contact-path-body">{copy.LANDING_CONTACT_SANDBOX_BODY}</p>
            <div className="ls-actions ls-actions--stack">
              <Link to={TRY_MODEL_ENTRY} className="ls-btn ls-btn--primary">
                <Rocket className="h-4 w-4" aria-hidden />
                {copy.LANDING_CONTACT_SANDBOX}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to={INSTITUTION_ROUTES.login} className="ls-btn ls-btn--secondary">
                <LogIn className="h-4 w-4" aria-hidden />
                {copy.LANDING_CONTACT_LOGIN}
              </Link>
            </div>
          </article>

          <article className="ls-contact-path">
            <p className="ls-contact-path-kicker">{copy.LANDING_CONTACT_TALK_KICKER}</p>
            <h3 className="ls-contact-path-title">{copy.LANDING_CONTACT_TALK_TITLE}</h3>
            <p className="ls-contact-path-body">{copy.LANDING_CONTACT_TALK_BODY}</p>
            <div className="ls-actions ls-actions--stack">
              <a href={TEAM_CONTACT_MAILTO} className="ls-btn ls-btn--primary">
                <Mail className="h-4 w-4" aria-hidden />
                {copy.LANDING_CONTACT_TALK}
              </a>
              <Link to={INSTITUTION_ROUTES.talk} className="ls-btn ls-btn--secondary">
                {copy.LANDING_CONTACT_HUB}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
