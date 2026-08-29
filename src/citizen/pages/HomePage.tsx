import {
  LandingDownloadStrip,
  LandingHero,
  LandingModelsSection,
  LandingNav,
  LandingOpenSourceSection,
  LandingUtilityByRoleSection,
  LandingUtilitySection,
  LandingWhatSection,
} from '../components/landing/LandingMinimal.js';
import { SiteFooter } from '../components/SiteFooter.js';
import '../../styles/landing-minimal.css';

/** Landing — customer-centric: nav, hero, qué es, modelos, empezar. */
export default function HomePage() {
  return (
    <div className="ls-root ls-root--minimal">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingWhatSection />
        <LandingOpenSourceSection />
        <LandingUtilitySection />
        <LandingUtilityByRoleSection />
        <LandingModelsSection />
        <LandingDownloadStrip />
      </main>
      <SiteFooter />
    </div>
  );
}
