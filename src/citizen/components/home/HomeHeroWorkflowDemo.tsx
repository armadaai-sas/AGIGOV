import { useId, useState } from 'react';
import {
  Cloud,
  FileInput,
  GitBranch,
  Radio,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

type FlowNodeKind = 'in' | 'process' | 'gate' | 'out';
type FlowScenarioId = 'treasury' | 'audit' | 'n8n' | 'railway';

const SCENARIO_META: Record<FlowScenarioId, { icon: LucideIcon; nodeIcons: LucideIcon[] }> = {
  treasury: {
    icon: TrendingDown,
    nodeIcons: [FileInput, GitBranch, ShieldCheck, TrendingDown],
  },
  audit: {
    icon: ShieldAlert,
    nodeIcons: [FileInput, Radio, ShieldAlert, ShieldCheck],
  },
  n8n: {
    icon: Workflow,
    nodeIcons: [Workflow, GitBranch, Radio, ShieldCheck],
  },
  railway: {
    icon: Cloud,
    nodeIcons: [Cloud, Radio, FileInput, TrendingDown],
  },
};

const KIND_ORDER: FlowNodeKind[] = ['in', 'process', 'gate', 'out'];

/** Product preview: lifecycle stages + case tabs + input→process→result nodes. */
export function HomeHeroWorkflowDemo() {
  const copy = useLandingCopy();
  const baseId = useId();
  const scenarios = copy.HERO_FLOW_SCENARIOS;
  const [active, setActive] = useState(0);
  const scenario = scenarios[active] ?? scenarios[0];
  const meta = SCENARIO_META[scenario.id];
  const TabIcon = meta.icon;

  return (
    <div className="hero-flow">
      <ol className="hero-flow-stages" aria-label={copy.HERO_FLOW_EYEBROW}>
        {copy.HERO_FLOW_STAGES.map((stage, i) => (
          <li key={stage.id} className="hero-flow-stage">
            {i > 0 ? <span className="hero-flow-stage-sep" aria-hidden /> : null}
            <span className="hero-flow-stage-label">{stage.label}</span>
          </li>
        ))}
      </ol>

      <div className="hero-flow-window">
        <div className="hero-flow-window-bar">
          <span className="hero-flow-window-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="hero-flow-window-path">{copy.HERO_FLOW_WINDOW_PATH}</span>
        </div>

        <div className="hero-flow-window-body">
          <p className="hero-flow-eyebrow">{copy.HERO_FLOW_EYEBROW}</p>

          <div className="hero-flow-tabs" role="tablist" aria-label={copy.HERO_FLOW_EYEBROW}>
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
                  className={`hero-flow-tab ${selected ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <Icon className="hero-flow-tab-icon" aria-hidden />
                  <span className="hero-flow-tab-copy">
                    <span className="hero-flow-tab-who">{s.who}</span>
                    <span className="hero-flow-tab-can">{s.can}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="hero-flow-canvas"
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${scenario.id}`}
          >
            <div className="hero-flow-canvas-head">
              <TabIcon className="h-4 w-4 shrink-0 text-sky-800" aria-hidden />
              <p className="hero-flow-canvas-title">{scenario.canvasTitle}</p>
            </div>

            <ol className="hero-flow-rail">
              {scenario.nodes.map((node, i) => {
                const NodeIcon = meta.nodeIcons[i] ?? FileInput;
                const kind = KIND_ORDER[i] ?? 'process';
                return (
                  <li key={`${scenario.id}-${i}`} className="hero-flow-step">
                    {i > 0 ? <span className="hero-flow-edge" aria-hidden /> : null}
                    <div className={`hero-flow-node hero-flow-node--${kind}`}>
                      <span className="hero-flow-node-phase">{node.phase}</span>
                      <div className="hero-flow-node-body">
                        <NodeIcon className="hero-flow-node-icon" aria-hidden />
                        <div>
                          <p className="hero-flow-node-title">{node.title}</p>
                          <p className="hero-flow-node-detail">{node.detail}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="hero-flow-result">
              <span className="hero-flow-result-label">{copy.HERO_FLOW_RESULT_LABEL}</span>
              {scenario.result}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
