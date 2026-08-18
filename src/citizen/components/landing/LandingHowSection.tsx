import { useRef } from 'react';
import { useInView } from 'motion/react';
import {
  Landmark,
  PenLine,
  Radio,
  Database,
  ShieldCheck,
  Snowflake,
  KeyRound,
  Shield,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const FLOW_ICONS = [PenLine, Landmark, Radio, Database] as const;
const SEC_ICONS = [KeyRound, Snowflake, ShieldCheck] as const;
const ROLE_ICONS = [Landmark, Shield, ShoppingCart] as const;

/** Cómo opera — flujo + capas + roles en un solo bloque. */
export function LandingHowSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });

  return (
    <section
      ref={sectionRef}
      id="operacion"
      className={`ls-section ls-section--alt ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-how-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_HOW_KICKER}</p>
          <h2 id="landing-how-title" className="ls-title">
            {copy.LANDING_HOW_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_HOW_LEAD}</p>
        </header>

        <ol className="ls-grid ls-grid--4" aria-label={copy.LANDING_SERVICES_TITLE}>
          {copy.LANDING_SERVICES_ITEMS.map((item, i) => {
            const Icon = FLOW_ICONS[i]!;
            return (
              <li key={item.id}>
                <p className="ls-step-index">{String(i + 1).padStart(2, '0')}</p>
                <span className="ls-step-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="ls-step-title">{item.title}</h3>
                <p className="ls-step-body">{item.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="ls-how-block">
          <h3 className="ls-how-subhead">{copy.LANDING_SECURITY_TITLE}</h3>
          <p className="ls-how-sublead">{copy.LANDING_SECURITY_LEAD}</p>
          <ol className="ls-how-layers" aria-label={copy.LANDING_SECURITY_TITLE}>
            {copy.LANDING_SECURITY_ITEMS.map((item, i) => {
              const Icon = SEC_ICONS[i]!;
              return (
                <li key={item.id} className="ls-how-layer">
                  <span className="ls-how-layer-icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="ls-how-layer-index">Capa {String(i + 1).padStart(2, '0')}</p>
                    <p className="ls-how-layer-title">{item.title}</p>
                    <p className="ls-how-layer-body">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="ls-how-block">
          <h3 className="ls-how-subhead">{copy.LANDING_APPLICATION_TITLE}</h3>
          <p className="ls-how-sublead">{copy.LANDING_APPLICATION_LEAD}</p>
          <ul className="ls-grid ls-grid--3" aria-label={copy.LANDING_APPLICATION_TITLE}>
            {copy.LANDING_APPLICATION_ITEMS.map((item, i) => {
              const Icon = ROLE_ICONS[i]!;
              return (
                <li key={item.id} className="ls-role">
                  <div className="ls-role-top">
                    <span className="ls-role-icon">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="ls-role-index">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="ls-role-title">{item.title}</h3>
                  <p className="ls-role-body">{item.body}</p>
                  <p className="ls-role-outcome">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{item.outcome}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
