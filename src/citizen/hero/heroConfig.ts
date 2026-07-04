/** Configuración canónica del Hero AGIGOV — estándar global. */
export const HERO_CONFIG = {
  poster: '/hero/poster.svg',
  /** Duración del ciclo automático cuando no hay scroll (segundos). */
  cycleSec: 40,
  /** Segundos por acto en la rotación del intro. */
  beatSec: 4,
  /** Altura de scroll por acto (vh). */
  scrollVhPerAct: 85,
} as const;

/** Un acto = tema + línea narrativa. */
export const HERO_STORY_BEATS = [
  {
    act: 'Acto I',
    theme: 'El amanecer del sueño',
    line: 'Imagina despertar sabiendo que quienes lideran, sirven.',
  },
  {
    act: 'Acto II',
    theme: 'La gente camina juntos',
    line: 'Comunidades que construyen juntas — no esperan milagros.',
  },
  {
    act: 'Acto III',
    theme: 'Trazamos el camino',
    line: 'Un camino por el cual levantarse cada día con esperanza.',
  },
  {
    act: 'Acto IV',
    theme: 'Construimos la institución',
    line: 'La IA al servicio de la vida, no de la opacidad.',
  },
  {
    act: 'Acto V',
    theme: 'Victoria — nuevo amanecer humano',
    line: 'Juntos levantamos instituciones que perduran.',
  },
] as const;

export type HeroStoryBeat = (typeof HERO_STORY_BEATS)[number];

export function beatIndexAtProgress(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  const idx = Math.floor(clamped * HERO_STORY_BEATS.length);
  return Math.min(HERO_STORY_BEATS.length - 1, idx);
}

export function beatIndexAtTime(seconds: number): number {
  const { cycleSec } = HERO_CONFIG;
  const elapsed = ((seconds % cycleSec) + cycleSec) % cycleSec;
  const step = cycleSec / HERO_STORY_BEATS.length;
  return Math.min(HERO_STORY_BEATS.length - 1, Math.floor(elapsed / step));
}
