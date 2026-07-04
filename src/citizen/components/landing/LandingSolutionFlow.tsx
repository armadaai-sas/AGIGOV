import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Landmark, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';

import { pulseSegmentActive } from '../../hooks/useDataPulseCycle.js';

const STEPS = [
  { icon: Users, label: 'CIUDADANOS' },
  { icon: ShieldCheck, label: 'PROTOCOLO AGIGOV', core: true },
  { icon: Landmark, label: 'RESULTADO SOBERANO' },
] as const;

type FlowProps = {
  pulsePhase: number;
};

function FlowConnector({ pulsePhase, index }: { pulsePhase: number; index: number }) {
  const energy = pulseSegmentActive(pulsePhase, index);

  return (
    <div className="landing-flow-connector landing-flow-connector--desktop" aria-hidden>
      <ArrowRight className="landing-solution-flow-arrow landing-solution-flow-arrow--desktop" />
      <motion.span
        className="landing-flow-pulse-beam"
        animate={{ opacity: 0.25 + energy * 0.75, scaleX: 0.35 + energy * 0.65 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    </div>
  );
}

function FlowBlock({
  icon: Icon,
  label,
  core,
  pulsePhase,
  index,
}: {
  icon: typeof Users;
  label: string;
  core?: boolean;
  pulsePhase: number;
  index: number;
}) {
  const energy = pulseSegmentActive(pulsePhase, index);

  return (
    <motion.div
      className={`landing-solution-flow-box ${core ? 'landing-solution-flow-box--core' : ''}`}
      animate={{
        boxShadow:
          energy > 0.2
            ? `0 0 ${12 + energy * 24}px rgba(56, 189, 248, ${0.15 + energy * 0.35})`
            : '0 0 0 rgba(56, 189, 248, 0)',
        borderColor:
          energy > 0.2
            ? `rgba(56, 189, 248, ${0.35 + energy * 0.45})`
            : core
              ? 'rgba(14, 165, 233, 0.35)'
              : 'rgba(71, 85, 105, 0.4)',
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Icon className="landing-solution-flow-icon" aria-hidden />
      <span>{label}</span>
    </motion.div>
  );
}

/** Diagrama cinético — pulso cian institucional 4s. */
export function LandingSolutionFlow({ pulsePhase }: FlowProps) {
  return (
    <div
      className="landing-solution-flow"
      role="img"
      aria-label="Ciudadanos, Protocolo AGIGOV, Resultado soberano"
    >
      {STEPS.map((step, index) => (
        <div key={step.label} className="landing-solution-flow-step">
          <FlowBlock
            icon={step.icon}
            label={step.label}
            core={'core' in step ? step.core : undefined}
            pulsePhase={pulsePhase}
            index={index}
          />
          {index < STEPS.length - 1 ? (
            <FlowConnector pulsePhase={pulsePhase} index={index} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function LandingSolutionFlowMobile({ pulsePhase }: FlowProps) {
  return (
    <ol className="landing-solution-stack" aria-label="Flujo del protocolo AGIGOV">
      {STEPS.map((step, index) => (
        <li key={step.label}>
          <FlowBlock
            icon={step.icon}
            label={step.label}
            core={'core' in step ? step.core : undefined}
            pulsePhase={pulsePhase}
            index={index}
          />
          {index < STEPS.length - 1 ? (
            <div className="landing-flow-connector landing-flow-connector--mobile" aria-hidden>
              <ArrowRight className="landing-solution-stack-arrow" />
              <motion.span
                className="landing-flow-pulse-beam landing-flow-pulse-beam--vertical"
                animate={{
                  opacity: 0.2 + pulseSegmentActive(pulsePhase, index) * 0.7,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** Activa animaciones solo cuando la sección entra en viewport. */
export function useSolutionInView() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: false });
  return { ref, inView };
}
