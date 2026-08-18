import { Link } from 'react-router-dom';
import { BookOpen, LifeBuoy, ArrowRight, GraduationCap } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Aprende más — glosario, ayuda y tutoriales visibles. */
export function LandingLearnSection() {
  const copy = useLandingCopy();

  const cards = [
    {
      to: '/aprender/glosario',
      title: copy.LANDING_LEARN_GLOSSARY_TITLE,
      body: copy.LANDING_LEARN_GLOSSARY_BODY,
      cta: copy.LANDING_LEARN_GLOSSARY_CTA,
      Icon: BookOpen,
    },
    {
      to: '/ayuda',
      title: copy.LANDING_LEARN_HELP_TITLE,
      body: copy.LANDING_LEARN_HELP_BODY,
      cta: copy.LANDING_LEARN_HELP_CTA,
      Icon: LifeBuoy,
    },
    {
      to: '/ayuda/modelo',
      title: copy.LANDING_LEARN_TUTORIAL_TITLE,
      body: copy.LANDING_LEARN_TUTORIAL_BODY,
      cta: copy.LANDING_LEARN_TUTORIAL_CTA,
      Icon: GraduationCap,
    },
  ] as const;

  return (
    <section id="aprender" className="ls-section ls-section--focus" aria-labelledby="landing-learn-title">
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_LEARN_KICKER}</p>
          <h2 id="landing-learn-title" className="ls-title">
            {copy.LANDING_LEARN_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_LEARN_LEAD}</p>
        </header>

        <ul className="ls-learn-grid">
          {cards.map(({ to, title, body, cta, Icon }) => (
            <li key={to}>
              <Link to={to} className="ls-learn-card">
                <span className="ls-learn-icon" aria-hidden>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="ls-learn-card-title">{title}</h3>
                <p className="ls-learn-card-body">{body}</p>
                <span className="ls-learn-card-cta">
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
