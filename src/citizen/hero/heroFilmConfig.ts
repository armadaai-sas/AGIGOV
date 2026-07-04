/** @deprecated Usar heroConfig.ts — re-export de compatibilidad. */
export {
  HERO_CONFIG,
  HERO_STORY_BEATS,
  beatIndexAtProgress,
  beatIndexAtTime,
  type HeroStoryBeat,
} from './heroConfig.js';

import { HERO_CONFIG, HERO_STORY_BEATS, beatIndexAtTime } from './heroConfig.js';

export const HERO_FILM = {
  mode: 'trust' as const,
  poster: HERO_CONFIG.poster,
  videoAvailable: false,
  webm: '/hero/agigov-dream.webm',
  mp4: '/hero/agigov-dream.mp4',
  durationSec: HERO_CONFIG.cycleSec,
} as const;

export const HERO_SLIDES = HERO_STORY_BEATS.map((beat, i) => ({
  id: `act-${i + 1}`,
  act: beat.act,
  theme: beat.theme,
  image: HERO_CONFIG.poster,
}));

export const HERO_FILM_CHAPTERS = HERO_STORY_BEATS.map((b) => ({
  title: b.act,
  subtitle: b.theme,
}));

export function shouldLoadHeroVideo(): boolean {
  return false;
}

export function beatAtTime(seconds: number) {
  return HERO_STORY_BEATS[beatIndexAtTime(seconds)];
}
