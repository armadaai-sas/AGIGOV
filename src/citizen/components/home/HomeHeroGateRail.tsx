import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { useSovereignConfig } from '../../context/PlatformContext.js';

const STEPS = [
  { id: 'in', key: 'hero.gate.in' as const },
  { id: 'evidence', key: 'hero.gate.evidence' as const },
  { id: 'centinela', key: 'hero.gate.centinela' as const },
  { id: 'gate', key: 'hero.gate.decide' as const },
  { id: 'out', key: 'hero.gate.out' as const },
] as const;

/** Firma visual del OS: evidencia → Centinela → decisión → resultado. */
export function HomeHeroGateRail() {
  const { t } = useSovereignConfig();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [freezeNext, setFreezeNext] = useState(false);

  useEffect(() => {
    const ms = reduceMotion ? 4200 : 1500;
    const id = window.setInterval(() => {
      setActive((n) => {
        const next = (n + 1) % STEPS.length;
        if (STEPS[next]!.id === 'gate') setFreezeNext((f) => !f);
        return next;
      });
    }, ms);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const current = STEPS[active]!;
  const progress = (active / (STEPS.length - 1)) * 100;
  const verdict =
    current.id === 'gate'
      ? freezeNext
        ? t('hero.gate.verdict.freeze')
        : t('hero.gate.verdict.allow')
      : current.id === 'out'
        ? freezeNext
          ? t('hero.gate.verdict.held')
          : t('hero.gate.verdict.published')
        : t('hero.gate.verdict.running');

  return (
    <div className="ls-gate-rail" aria-label={t('hero.gate.aria')}>
      <div className="ls-gate-rail-track" aria-hidden>
        <div className="ls-gate-rail-progress" style={{ width: `${progress}%` }} />
      </div>
      <ol className="ls-gate-rail-steps">
        {STEPS.map((step, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <li
              key={step.id}
              className={`ls-gate-rail-step${on ? ' is-active' : ''}${done ? ' is-done' : ''}`}
            >
              <span className="ls-gate-rail-dot" aria-hidden />
              <span className="ls-gate-rail-label">{t(step.key)}</span>
            </li>
          );
        })}
      </ol>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${current.id}-${verdict}`}
          className={`ls-gate-rail-verdict${current.id === 'gate' && freezeNext ? ' is-freeze' : ''}${current.id === 'out' && !freezeNext ? ' is-ok' : ''}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
        >
          {verdict}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
