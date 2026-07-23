import { useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingCtaSection } from '../components/landing/LandingCtaSection.js';
import { LandingGovernanceCompareSection } from '../components/landing/LandingGovernanceCompareSection.js';
import { LandingModelsInteractiveSection } from '../components/landing/LandingModelsInteractiveSection.js';

/** Landing AGIGOV — hero + comparativo + catálogo + CTA. */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-snap-root');
    return () => document.documentElement.classList.remove('landing-snap-root');
  }, []);

  return (
    <div className="landing-manifest bg-[#f9fafb]">
      <HeroOrchestrator />
      <LandingGovernanceCompareSection />
      <LandingModelsInteractiveSection />
      <LandingCtaSection />
    </div>
  );
}
