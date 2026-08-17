import { lazy, Suspense, useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingSpineRail } from '../components/landing/LandingSpineRail.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing.css';

const LandingGovernanceCompareSection = lazy(() =>
  import('../components/landing/LandingGovernanceCompareSection.js').then((m) => ({
    default: m.LandingGovernanceCompareSection,
  })),
);
const LandingFlowSection = lazy(() =>
  import('../components/landing/LandingFlowSection.js').then((m) => ({
    default: m.LandingFlowSection,
  })),
);
const LandingConnectSection = lazy(() =>
  import('../components/landing/LandingConnectSection.js').then((m) => ({
    default: m.LandingConnectSection,
  })),
);
const LandingModelsInteractiveSection = lazy(() =>
  import('../components/landing/LandingModelsInteractiveSection.js').then((m) => ({
    default: m.LandingModelsInteractiveSection,
  })),
);
const LandingCtaSection = lazy(() =>
  import('../components/landing/LandingCtaSection.js').then((m) => ({
    default: m.LandingCtaSection,
  })),
);

/** Landing AGIGOV — storyboard producto; spine Railway; hero eager. */
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
        <LandingGovernanceCompareSection />
        <LandingFlowSection />
        <LandingConnectSection />
        <LandingModelsInteractiveSection />
        <LandingCtaSection />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
