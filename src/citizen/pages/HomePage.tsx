import { useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingSpineRail } from '../components/landing/LandingSpineRail.js';
import { LandingConsoleSection } from '../components/landing/LandingConsoleSection.js';
import { LandingModelsInteractiveSection } from '../components/landing/LandingModelsInteractiveSection.js';
import { LandingServicesSection } from '../components/landing/LandingServicesSection.js';
import { LandingSecuritySection } from '../components/landing/LandingSecuritySection.js';
import { LandingApplicationSection } from '../components/landing/LandingApplicationSection.js';
import { LandingDevelopersSection } from '../components/landing/LandingDevelopersSection.js';
import { LandingCtaSection } from '../components/landing/LandingCtaSection.js';
import { LandingContactSection } from '../components/landing/LandingContactSection.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing.css';
import '../../styles/landing-below.css';

/** Landing AGIGOV — 9 diapositivas wide-open + spine timeline (eager: un solo paint). */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-snap-root');
    return () => document.documentElement.classList.remove('landing-snap-root');
  }, []);

  return (
    <div className="landing-manifest">
      <LandingSpineRail />
      <HeroOrchestrator />
      <LandingConsoleSection />
      <LandingModelsInteractiveSection />
      <LandingServicesSection />
      <LandingSecuritySection />
      <LandingApplicationSection />
      <LandingDevelopersSection />
      <LandingCtaSection />
      <LandingContactSection />
      <SiteFooter />
    </div>
  );
}
