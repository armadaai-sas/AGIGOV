import { usePlatform } from '../context/PlatformContext.js';

/** Lee el acto narrativo global inyectado por HeroPage vía PlatformContext. */
export function useHeroStoryBeat() {
  const { heroBeatIndex, heroBeat, heroScrollProgress, heroPathDraw } = usePlatform();
  return {
    index: heroBeatIndex,
    beat: heroBeat,
    scrollProgress: heroScrollProgress,
    pathDraw: heroPathDraw,
  };
}
