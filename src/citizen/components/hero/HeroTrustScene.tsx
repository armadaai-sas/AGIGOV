import { GovernanceStructure } from './GovernanceStructure.js';

/** Fondo limpio — grafo emerge con scroll detrás del núcleo. */
export function HeroTrustScene() {
  return (
    <div className="hero-trust-scene">
      <div className="hero-trust-decor" aria-hidden>
        <div className="hero-trust-gradient" />
      </div>

      <div className="hero-trust-stage">
        <GovernanceStructure />
      </div>
    </div>
  );
}
