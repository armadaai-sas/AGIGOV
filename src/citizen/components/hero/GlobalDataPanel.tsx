import { motion } from 'motion/react';

import { fetchGlobalNetworkMetrics } from '../../api.js';
import { useCachedFetch } from '../../hooks/useCitizenData.js';
import { easeHeroPhase } from '../../hero/useHeroScrollChoreography.js';

type Props = {
  phase: number;
};

/** Panel IAP global — telemetría real, skin Trust, fijo tras el scroll inicial. */
export function GlobalDataPanel({ phase }: Props) {
  const { data, state } = useCachedFetch('hero-global-network', fetchGlobalNetworkMetrics, 45_000);
  const t = easeHeroPhase(phase);

  if (t <= 0.65) return null;
  if (state === 'error' || !data?.ok) return null;

  const opacity = Math.min(1, (t - 0.65) / 0.2);
  const fixed = t > 0.72;

  return (
    <motion.aside
      className={`hero-global-panel ${fixed ? 'hero-global-panel--fixed' : ''}`}
      aria-label="Global IAP Network status"
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <p className="hero-global-panel-title">GLOBAL IAP NETWORK</p>
      <dl className="hero-global-panel-metrics">
        <div>
          <dt>Active nodes</dt>
          <dd>{data.activeNodes}</dd>
        </div>
        <div>
          <dt>Integrity</dt>
          <dd>{data.integrityLabel}</dd>
        </div>
      </dl>
    </motion.aside>
  );
}
