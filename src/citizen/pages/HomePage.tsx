import { lazy, Suspense, useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import '../../styles/landing.css';

const LandingGovernanceCompareSection = lazy(() =>
  import('../components/landing/LandingGovernanceCompareSection.js').then((m) => ({
    default: m.LandingGovernanceCompareSection,
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

/** Landing AGIGOV — hero eager; below-fold lazy for LCP. */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-snap-root');
    return () => document.documentElement.classList.remove('landing-snap-root');
  }, []);

  return (
    <div className="landing-manifest bg-[#f9fafb]">
      <HeroOrchestrator />
      <Suspense fallback={null}>
        <LandingGovernanceCompareSection />
        <LandingModelsInteractiveSection />
        <LandingCtaSection />
      </Suspense>
    </div>
  );
}
