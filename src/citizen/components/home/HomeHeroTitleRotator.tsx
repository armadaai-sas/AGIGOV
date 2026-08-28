import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { useSovereignConfig } from '../../context/PlatformContext.js';

export type HeroAudience = 'government' | 'business' | 'citizen';

const AUDIENCE_ORDER: HeroAudience[] = ['government', 'business', 'citizen'];

type RotorBeat = {
  audience: HeroAudience;
  connector: string;
  word: string;
};

type Props = {
  audience: HeroAudience;
  onAudienceChange: (audience: HeroAudience) => void;
};

/** Título en dos líneas: prefijo fijo + audiencia que rota (sincroniza con las tarjetas). */
export function HomeHeroTitleRotator({ audience, onAudienceChange }: Props) {
  const { t } = useSovereignConfig();
  const reduceMotion = useReducedMotion();

  const beats: RotorBeat[] = [
    {
      audience: 'government',
      connector: t('hero.cinematic.rotor.state.connector'),
      word: t('hero.cinematic.rotor.state.word'),
    },
    {
      audience: 'business',
      connector: t('hero.cinematic.rotor.business.connector'),
      word: t('hero.cinematic.rotor.business.word'),
    },
    {
      audience: 'citizen',
      connector: t('hero.cinematic.rotor.citizen.connector'),
      word: t('hero.cinematic.rotor.citizen.word'),
    },
  ];

  const index = Math.max(0, AUDIENCE_ORDER.indexOf(audience));

  useEffect(() => {
    const ms = reduceMotion ? 4200 : 2600;
    const id = window.setInterval(() => {
      const current = AUDIENCE_ORDER.indexOf(audience);
      const next = AUDIENCE_ORDER[(current + 1) % AUDIENCE_ORDER.length]!;
      onAudienceChange(next);
    }, ms);
    return () => window.clearInterval(id);
  }, [audience, onAudienceChange, reduceMotion]);

  const beat = beats[index]!;
  const sizer = beats.reduce((best, b) => {
    const phrase = `${b.connector} ${b.word}`;
    return phrase.length > best.length ? phrase : best;
  }, `${beats[0]!.connector} ${beats[0]!.word}`);

  return (
    <h1 id="home-hero-title" className="ls-hero-title">
      <span className="ls-hero-title-prefix">{t('hero.cinematic.titlePrefix')}</span>
      <span className="ls-hero-title-rotor" aria-live="polite">
        <span className="ls-hero-title-rotor-sizer" aria-hidden>
          {sizer}.
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${beat.connector}-${beat.word}`}
            className="ls-hero-title-rotor-inner"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="ls-hero-title-phrase">
              <span className="ls-hero-title-connector">{beat.connector}</span>
              <span className="ls-hero-title-word">{beat.word}</span>
              <span className="ls-hero-title-end">.</span>
            </span>
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
