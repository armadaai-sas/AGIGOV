import { lazy, Suspense, useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingSpineRail } from '../components/landing/LandingSpineRail.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing.css';

const LandingConsoleSection = lazy(() =>
  import('../components/landing/LandingConsoleSection.js').then((m) => ({
    default: m.LandingConsoleSection,
  })),
);
const LandingModelsInteractiveSection = lazy(() =>
  import('../components/landing/LandingModelsInteractiveSection.js').then((m) => ({
    default: m.LandingModelsInteractiveSection,
  })),
);
const LandingServicesSection = lazy(() =>
  import('../components/landing/LandingServicesSection.js').then((m) => ({
    default: m.LandingServicesSection,
  })),
);
const LandingSecuritySection = lazy(() =>
  import('../components/landing/LandingSecuritySection.js').then((m) => ({
    default: m.LandingSecuritySection,
  })),
);
const LandingApplicationSection = lazy(() =>
  import('../components/landing/LandingApplicationSection.js').then((m) => ({
    default: m.LandingApplicationSection,
  })),
);
const LandingDevelopersSection = lazy(() =>
  import('../components/landing/LandingDevelopersSection.js').then((m) => ({
    default: m.LandingDevelopersSection,
  })),
);
const LandingCtaSection = lazy(() =>
  import('../components/landing/LandingCtaSection.js').then((m) => ({
    default: m.LandingCtaSection,
  })),
);
const LandingContactSection = lazy(() =>
  import('../components/landing/LandingContactSection.js').then((m) => ({
    default: m.LandingContactSection,
  })),
);

/** Landing AGIGOV — 9 diapositivas wide-open + spine timeline. */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-snap-root');
    return () => document.documentElement.classList.remove('landing-snap-root');
  }, []);

  return (
    <div className="landing-manifest">
      <LandingSpineRail />
      <HeroOrchestrator />
      <Suspense fallback={null}>
        <LandingConsoleSection />
        <LandingModelsInteractiveSection />
        <LandingServicesSection />
        <LandingSecuritySection />
        <LandingApplicationSection />
        <LandingDevelopersSection />
        <LandingCtaSection />
        <LandingContactSection />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
