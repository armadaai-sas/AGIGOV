import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  FileInput,
  GitBranch,
  Landmark,
  Radio,
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

type FlowScenarioId = 'treasury' | 'audit' | 'escrow' | 'citizen';

const SCENARIO_META: Record<FlowScenarioId, { icon: LucideIcon }> = {
  treasury: { icon: TrendingDown },
  audit: { icon: ShieldAlert },
  escrow: { icon: Landmark },
  citizen: { icon: Users },
};

const NODE_ICONS: LucideIcon[] = [FileInput, GitBranch, Scale, ShieldCheck];

/** Case rail AGIGOV — educa con poco texto; la consola debajo vende con imagen. */
export function HomeHeroCaseRail() {
  const copy = useLandingCopy();
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const scenarios = copy.HERO_FLOW_SCENARIOS;
  const [active, setActive] = useState(0);
  const scenario = scenarios[active] ?? scenarios[0];
  const TabIcon = SCENARIO_META[scenario.id].icon;

  return (
    <div className="hero-case-rail">
      <ol className="hero-flow-stages hero-flow-stages--compact" aria-label={copy.HERO_FLOW_EYEBROW}>
        {copy.HERO_FLOW_STAGES.map((stage, i) => (
          <li key={stage.id} className="hero-flow-stage">
            {i > 0 ? <span className="hero-flow-stage-sep" aria-hidden /> : null}
            <span className="hero-flow-stage-label">{stage.label}</span>
          </li>
        ))}
      </ol>

      <div className="hero-case-tabs" role="tablist" aria-label={copy.HERO_FLOW_EYEBROW}>
        {scenarios.map((s, i) => {
          const Icon = SCENARIO_META[s.id].icon;
          const selected = i === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              className={`hero-case-tab ${selected ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <Icon className="hero-case-tab-icon" aria-hidden />
              <span className="hero-case-tab-who">{s.who}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${scenario.id}`}
          className="hero-case-result"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.28 }}
        >
          <div className="hero-case-result-head">
            <TabIcon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
            <p className="hero-case-result-can">{scenario.can}</p>
          </div>
          <ol className="hero-case-nodes">
            {scenario.nodes.map((node, i) => {
              const Icon = NODE_ICONS[i] ?? Radio;
              return (
                <li key={`${scenario.id}-${i}`} className="hero-case-node">
                  <Icon className="hero-case-node-icon" aria-hidden />
                  <span className="hero-case-node-title">{node.title}</span>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
