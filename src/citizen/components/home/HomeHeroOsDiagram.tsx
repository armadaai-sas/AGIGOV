import { useReducedMotion } from 'motion/react';
import {
  FileInput,
  Landmark,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  Database,
  Radio,
  type LucideIcon,
} from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

type DiagramNode = {
  id: string;
  labelKey: 'ingest' | 'multisig' | 'escrow' | 'sentinel' | 'ledger' | 'publish';
  icon: LucideIcon;
  x: number;
  y: number;
};

const NODES: DiagramNode[] = [
  { id: 'ingest', labelKey: 'ingest', icon: FileInput, x: 8, y: 18 },
  { id: 'multisig', labelKey: 'multisig', icon: PenLine, x: 8, y: 62 },
  { id: 'escrow', labelKey: 'escrow', icon: Landmark, x: 78, y: 12 },
  { id: 'sentinel', labelKey: 'sentinel', icon: Radio, x: 78, y: 40 },
  { id: 'ledger', labelKey: 'ledger', icon: Database, x: 78, y: 68 },
  { id: 'publish', labelKey: 'publish', icon: LayoutDashboard, x: 52, y: 88 },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: 'ingest', to: 'hub' },
  { from: 'multisig', to: 'hub' },
  { from: 'hub', to: 'escrow' },
  { from: 'hub', to: 'sentinel' },
  { from: 'hub', to: 'ledger' },
  { from: 'sentinel', to: 'publish' },
  { from: 'ledger', to: 'publish' },
];

const HUB = { x: 42, y: 40 };

function point(id: string): { x: number; y: number } {
  if (id === 'hub') return HUB;
  const n = NODES.find((node) => node.id === id)!;
  return { x: n.x, y: n.y };
}

/** Diagrama OS — imagen principal que vende el flujo (estilo canvas interconectado). */
export function HomeHeroOsDiagram() {
  const copy = useLandingCopy();
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-os-diagram" aria-label={copy.HERO_DIAGRAM_EYEBROW}>
      <div className="hero-os-diagram-bar">
        <span className="hero-os-diagram-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="hero-os-diagram-path">{copy.HERO_DIAGRAM_PATH}</span>
        <span className="hero-os-diagram-live">
          <span className={`hero-cinematic-live-dot ${reduceMotion ? '' : 'hero-cinematic-live-dot--on'}`} aria-hidden />
          {copy.HERO_DIAGRAM_EYEBROW}
        </span>
      </div>

      <div className="hero-os-diagram-canvas">
        <svg className="hero-os-diagram-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {EDGES.map(({ from, to }) => {
            const a = point(from);
            const b = point(to);
            const mx = (a.x + b.x) / 2;
            return (
              <path
                key={`${from}-${to}`}
                className={`hero-os-edge ${reduceMotion ? '' : 'is-alive'}`}
                d={`M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`}
                fill="none"
              />
            );
          })}
        </svg>

        <div className="hero-os-hub" style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}>
          <ShieldCheck className="hero-os-hub-icon" aria-hidden />
          <p className="hero-os-hub-title">{copy.HERO_DIAGRAM_HUB}</p>
          <p className="hero-os-hub-sub">{copy.HERO_DIAGRAM_HUB_SUB}</p>
        </div>

        {NODES.map((node) => {
          const Icon = node.icon;
          const label = copy.HERO_DIAGRAM_NODES[node.labelKey];
          return (
            <div
              key={node.id}
              className="hero-os-node"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <span className="hero-os-node-icon">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="hero-os-node-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
