import { lazy, Suspense, useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { SiteFooter } from '../components/SiteFooter.js';
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

/** Landing AGIGOV — dark navy visual-first; hero eager; below-fold lazy. */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-snap-root');
    return () => document.documentElement.classList.remove('landing-snap-root');
  }, []);

  return (
    <div className="landing-manifest">
      <HeroOrchestrator />
      <Suspense fallback={null}>
        <LandingGovernanceCompareSection />
        <LandingModelsInteractiveSection />
        <LandingCtaSection />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
