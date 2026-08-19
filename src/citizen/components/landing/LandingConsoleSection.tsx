import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { BookOpen, ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroConsoleDemo } from '../home/HomeHeroConsoleDemo.js';
import '../home/hero-console-demo.css';

type OpsHealth = { ok?: boolean };

/** Consola — tamaño fijo; solo cambia el contenido interno. */
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
      className={`ls-section ls-section--alt ls-section--tone ls-section--tone-cyan ${inView ? 'is-inview' : ''}`}
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
          <div className="ls-learn-more">
            <Link to="/aprender/glosario" className="ls-btn ls-btn--ghost">
              <BookOpen className="h-4 w-4" aria-hidden />
              {copy.LANDING_LEARN_MORE}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/ayuda" className="ls-learn-more-link">
              {copy.LANDING_LEARN_HELP_CTA}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
