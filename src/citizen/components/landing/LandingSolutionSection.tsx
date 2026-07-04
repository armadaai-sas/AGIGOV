import { lazy, Suspense, useMemo, useRef } from 'react';
import { useInView } from 'motion/react';

import {
  LANDING_MODELS_BODY,
  LANDING_MODELS_KICKER,
  LANDING_MODELS_TITLE,
} from '../../hero/landingCopy.js';
import { useDataPulseCycle } from '../../hooks/useDataPulseCycle.js';
import { GenerativeDataCanvas } from './GenerativeDataCanvas.js';
import { iapCanvasShouldDegrade } from './IapNetworkCanvas.js';

const IapNetworkCanvas = lazy(() =>
  import('./IapNetworkCanvas.js').then((m) => ({ default: m.IapNetworkCanvas })),
);

type VizProps = {
  pulsePhase: number;
  active: boolean;
};

function InfrastructureViz({ pulsePhase, active }: VizProps) {
  const degrade = useMemo(() => iapCanvasShouldDegrade(), []);

  if (degrade) {
    return <GenerativeDataCanvas pulsePhase={pulsePhase} active={active} />;
  }

  return (
    <Suspense fallback={<GenerativeDataCanvas pulsePhase={pulsePhase} active={active} />}>
      <IapNetworkCanvas pulsePhase={pulsePhase} active={active} />
    </Suspense>
  );
}

/** Sección — Infraestructura Generativa (consola de mando, full-bleed claro). */
export function LandingSolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });
  const pulsePhase = useDataPulseCycle(inView);

  return (
    <section
      ref={sectionRef}
      id="modelo"
      className="landing-section landing-section--infrastructure landing-section--light"
      aria-labelledby="landing-infra-title"
    >
      <div className="landing-infrastructure-stage" aria-hidden>
        <InfrastructureViz pulsePhase={pulsePhase} active={inView} />
      </div>

      <div className="landing-infrastructure-overlay">
        <p className="landing-section-kicker">{LANDING_MODELS_KICKER}</p>
        <h2 id="landing-infra-title" className="landing-section-title landing-section-title--infra">
          {LANDING_MODELS_TITLE}
        </h2>
        <p className="landing-section-body landing-section-body--infra">{LANDING_MODELS_BODY}</p>
      </div>
    </section>
  );
}
