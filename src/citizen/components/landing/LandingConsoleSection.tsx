import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroConsoleDemo } from '../home/HomeHeroConsoleDemo.js';
import '../home/hero-console-demo.css';

type OpsHealth = { ok?: boolean };

/** Consola — stage ancho centrado + badge LIVE desde health real. */
export function LandingConsoleSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });
  const [opsLive, setOpsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const probe = async () => {
      try {
        const res = await fetch('/api/ops/health', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as OpsHealth;
        if (!cancelled) setOpsLive(Boolean(json.ok));
      } catch {
        if (!cancelled) setOpsLive(false);
      }
    };
    void probe();
    const id = window.setInterval(probe, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="consola"
      className={`ls-section ls-section--alt ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-console-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_CONSOLE_KICKER}</p>
          <h2 id="landing-console-title" className="ls-title">
            {copy.LANDING_CONSOLE_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_CONSOLE_LEAD}</p>
        </header>
      </div>
      <div className="ls-stage ls-stage--console">
        <div className="ls-inner ls-inner--stage">
          <HomeHeroConsoleDemo forceLive={opsLive} />
        </div>
      </div>
    </section>
  );
}
