import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingSpineRail } from '../components/landing/LandingSpineRail.js';
import { LandingConsoleSection } from '../components/landing/LandingConsoleSection.js';
import { LandingWhySection } from '../components/landing/LandingWhySection.js';
import { LandingModelsInteractiveSection } from '../components/landing/LandingModelsInteractiveSection.js';
import { LandingHowSection } from '../components/landing/LandingHowSection.js';
import { LandingSecuritySection } from '../components/landing/LandingSecuritySection.js';
import { LandingLearnSection } from '../components/landing/LandingLearnSection.js';
import { LandingDevelopersSection } from '../components/landing/LandingDevelopersSection.js';
import { LandingProcessSection } from '../components/landing/LandingProcessSection.js';
import { LandingCtaSection } from '../components/landing/LandingCtaSection.js';
import { LandingContactSection } from '../components/landing/LandingContactSection.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing-system.css';

/** Landing AGIGOV — sistema .ls-* (un ancho, mobile-first, sin 100svh). */
export default function HomePage() {
  return (
    <div className="ls-root">
      <LandingSpineRail />
      <HeroOrchestrator />
      <LandingConsoleSection />
      <LandingWhySection />
      <LandingModelsInteractiveSection />
      <LandingHowSection />
      <LandingSecuritySection />
      <LandingLearnSection />
      <LandingDevelopersSection />
      <LandingProcessSection />
      <LandingCtaSection />
      <LandingContactSection />
      <SiteFooter />
    </div>
  );
}
