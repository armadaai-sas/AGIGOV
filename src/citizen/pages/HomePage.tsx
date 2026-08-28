import {
  LandingDownloadStrip,
  LandingHero,
  LandingModelsSection,
  LandingNav,
  LandingStartSection,
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
        <LandingModelsSection />
        <LandingStartSection />
        <LandingDownloadStrip />
      </main>
      <SiteFooter />
    </div>
  );
}
