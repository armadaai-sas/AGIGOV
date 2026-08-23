import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingExperience } from '../components/landing/LandingExperience.js';
import { LandingConsoleSection } from '../components/landing/LandingConsoleSection.js';
import { LandingWhySection } from '../components/landing/LandingWhySection.js';
import { LandingAuthoritySection } from '../components/landing/LandingAuthoritySection.js';
import { LandingModelsInteractiveSection } from '../components/landing/LandingModelsInteractiveSection.js';
import { LandingDeploySection } from '../components/landing/LandingDeploySection.js';
import { LandingContactSection } from '../components/landing/LandingContactSection.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing-system.css';

/**
 * Landing marketing — sin rail de app (simplificación).
 * Boot → Consola → Alcance → Autoridad → Apps → Instalar → Contacto.
 * Simplificación interna (Escritorio/nav) llega en oleada aparte.
 */
export default function HomePage() {
  return (
    <div className="ls-root ls-root--os ls-root--marketing">
      <LandingExperience />
      <HeroOrchestrator />
      <LandingConsoleSection />
      <LandingWhySection />
      <LandingAuthoritySection />
      <LandingModelsInteractiveSection />
      <LandingDeploySection />
      <LandingContactSection />
      <SiteFooter />
    </div>
  );
}
