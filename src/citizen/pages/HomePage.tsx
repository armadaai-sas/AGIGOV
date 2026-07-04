import { useEffect } from 'react';

import { HeroOrchestrator } from '../components/hero/HeroOrchestrator.js';
import { LandingChallengeSection } from '../components/landing/LandingChallengeSection.js';
import { LandingCtaSection } from '../components/landing/LandingCtaSection.js';
import { LandingSolutionSection } from '../components/landing/LandingSolutionSection.js';

/** Landing AGIGOV — catálogo de modelos + manifesto. */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-snap-root');
    return () => document.documentElement.classList.remove('landing-snap-root');
  }, []);

  return (
    <div className="landing-manifest bg-[#f9fafb]">
      <HeroOrchestrator />
      <LandingChallengeSection />
      <LandingSolutionSection />
      <LandingCtaSection />
    </div>
  );
}
