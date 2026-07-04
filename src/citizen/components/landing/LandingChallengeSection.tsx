import {
  LANDING_CHALLENGE_BODY,
  LANDING_CHALLENGE_LEAD,
  LANDING_CHALLENGE_TITLE,
} from '../../hero/landingCopy.js';

/** Sección — El Desafío (premium, fondo claro). */
export function LandingChallengeSection() {
  return (
    <section
      className="landing-section landing-section--challenge landing-section--light"
      aria-labelledby="landing-challenge-title"
    >
      <div className="landing-section-inner landing-section-inner--challenge">
        <h2 id="landing-challenge-title" className="landing-section-title landing-section-title--challenge">
          {LANDING_CHALLENGE_TITLE}
        </h2>
        <p className="landing-section-lead">{LANDING_CHALLENGE_LEAD}</p>
        <p className="landing-section-body landing-section-body--challenge">{LANDING_CHALLENGE_BODY}</p>
      </div>
    </section>
  );
}
