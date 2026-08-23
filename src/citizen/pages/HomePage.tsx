import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingExperience } from '../components/landing/LandingExperience.js';
import { LandingContinuumStrip } from '../components/landing/LandingContinuumStrip.js';
import { LandingOutcomesSection } from '../components/landing/LandingOutcomesSection.js';
import { LandingAuthoritySection } from '../components/landing/LandingAuthoritySection.js';
import { LandingModelsInteractiveSection } from '../components/landing/LandingModelsInteractiveSection.js';
import { LandingDeploySection } from '../components/landing/LandingDeploySection.js';
import { LandingContactSection } from '../components/landing/LandingContactSection.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing-system.css';

/**
 * Landing marketing — lean continuum.
 * Hero → Atajos → Resultados → Por qué OS → Modelos → Desplegar → Empezar.
 */
export default function HomePage() {
  return (
    <div className="ls-root ls-root--os ls-root--marketing">
      <LandingExperience />
      <HeroOrchestrator />
      <LandingContinuumStrip />
      <LandingOutcomesSection />
      <LandingAuthoritySection />
      <LandingModelsInteractiveSection />
      <LandingDeploySection />
      <LandingContactSection />
      <SiteFooter />
    </div>
  );
}
