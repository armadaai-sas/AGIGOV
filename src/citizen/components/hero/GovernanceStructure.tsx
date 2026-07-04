import { motion } from 'motion/react';

import { useHeroStoryBeat } from '../../hero/useHeroStoryBeat.js';
import { GOVERNANCE_NODES, nodePosition } from '../../hero/governanceNodes.js';

const CX = 200;
const CY = 200;

function edgeLength(x: number, y: number) {
  return Math.hypot(x - CX, y - CY);
}

/** Red orgánica — invisible al inicio; aparece con scroll, sin saturar. */
export function GovernanceStructure() {
  const { index: activeIndex, pathDraw, scrollProgress } = useHeroStoryBeat();

  const reveal = Math.min(1, Math.max(0, (scrollProgress - 0.14) / 0.32));
  const showLabels = scrollProgress > 0.38 && activeIndex >= 3;

  if (reveal <= 0.01) return null;

  return (
    <motion.svg
      className="hero-governance-graph"
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden
      initial={false}
      animate={{ opacity: reveal * 0.85 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {GOVERNANCE_NODES.map((node, i) => {
        const { x, y } = nodePosition(i);
        const len = edgeLength(x, y);
        const lit = i <= activeIndex && scrollProgress > 0.08;
        const draw =
          !lit ? 0 : activeIndex === i && scrollProgress < 0.35 ? pathDraw : lit ? 1 : 0;

        return (
          <motion.line
            key={`edge-${node.id}`}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--hero-gov-stroke)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeOpacity={0.35 * reveal}
            initial={false}
            animate={{ strokeDashoffset: len * (1 - draw) }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ strokeDasharray: len }}
          />
        );
      })}

      {GOVERNANCE_NODES.map((node, i) => {
        const { x, y } = nodePosition(i);
        const lit = i <= activeIndex && scrollProgress > 0.1;
        if (!lit) return null;

        return (
          <g key={node.id}>
            <circle cx={x} cy={y} r={4} className="hero-gov-dot" opacity={reveal} />
            {showLabels ? (
              <>
                <text x={x} y={y - 14} textAnchor="middle" className="hero-gov-node-label">
                  {node.label}
                </text>
                <text x={x} y={y + 22} textAnchor="middle" className="hero-gov-node-sub">
                  {node.sub}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </motion.svg>
  );
}
