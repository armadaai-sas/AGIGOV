import { HomeHero } from '../home/HomeHero.js';
import { HomeHeroNav } from '../home/HomeHeroNav.js';

/** Landing home — hero de modelos AGIGOV. */
export function HeroOrchestrator() {
  return (
    <>
      <HomeHeroNav />
      <HomeHero />
    </>
  );
}
