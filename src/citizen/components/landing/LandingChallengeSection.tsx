import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Sección contexto — sin culpar al Estado; acompañar con herramientas. */
export function LandingChallengeSection() {
  const copy = useLandingCopy();

  return (
    <section
      className="landing-section landing-section--challenge landing-section--light"
      aria-labelledby="landing-challenge-title"
    >
      <div className="landing-section-inner landing-section-inner--challenge">
        <p className="landing-section-kicker landing-section-kicker--light">{copy.LANDING_CHALLENGE_KICKER}</p>
        <h2 id="landing-challenge-title" className="landing-section-title landing-section-title--challenge">
          {copy.LANDING_CHALLENGE_TITLE}
        </h2>
        <p className="landing-section-lead">{copy.LANDING_CHALLENGE_LEAD}</p>
        {copy.LANDING_CHALLENGE_BODY ? (
          <p className="landing-section-body landing-section-body--challenge">{copy.LANDING_CHALLENGE_BODY}</p>
        ) : null}
      </div>
    </section>
  );
}
