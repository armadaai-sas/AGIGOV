import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingSpineRail } from '../components/landing/LandingSpineRail.js';
import { LandingConsoleSection } from '../components/landing/LandingConsoleSection.js';
import { LandingWhySection } from '../components/landing/LandingWhySection.js';
import { LandingModelsInteractiveSection } from '../components/landing/LandingModelsInteractiveSection.js';
import { LandingDeploySection } from '../components/landing/LandingDeploySection.js';
import { LandingContactSection } from '../components/landing/LandingContactSection.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing-system.css';

/**
 * Landing OS — pocas pantallas, como el lanzamiento de un sistema:
 * Boot (hero) → Escritorio (consola) → Para quién (ciudadano+) → Apps → Instalar → Contacto.
 */
export default function HomePage() {
  return (
    <div className="ls-root ls-root--os">
      <LandingSpineRail />
      <HeroOrchestrator />
      <LandingConsoleSection />
      <LandingWhySection />
      <LandingModelsInteractiveSection />
      <LandingDeploySection />
      <LandingContactSection />
      <SiteFooter />
    </div>
  );
}
