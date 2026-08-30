import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import type { DeskPersonaHome } from '../platform/deskHome.js';

type DeskHomeCanvasProps = {
  home: DeskPersonaHome;
  personaLabel: string;
  greet: string | null;
};

/** Hub por persona — zonas Mirar/Introducir/Aprender (o equivalente). */
export function DeskHomeCanvas({ home, personaLabel, greet }: DeskHomeCanvasProps) {
  const PrimaryIcon = home.primary.icon;

  return (
    <div className="desk-home">
      <header className="desk-home-hero">
        <p className="desk-home-eyebrow">
          {personaLabel}
          <span className="desk-home-badge">{home.hubBadge}</span>
        </p>
        {greet ? <p className="desk-home-greet">Hola, {greet}</p> : null}
        <p className="desk-home-result">{home.resultFocus}</p>
      </header>

      <section className="desk-home-zones" aria-label="Hub por utilidad">
        {home.zones.map((zone) => (
          <div key={zone.id} className="desk-home-zone">
            <h2 className="desk-home-zone-label">{zone.label}</h2>
            <ul className="desk-home-zone-list">
              {zone.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to} className="desk-home-zone-link">
                      <Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} aria-hidden />
                      <span className="desk-home-zone-link-body">
                        <span className="desk-home-zone-link-label">{item.label}</span>
                        <span className="desk-home-zone-link-outcome">{item.outcome}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="desk-home-steps-section" aria-labelledby="desk-home-steps-title">
        <h2 id="desk-home-steps-title" className="desk-home-steps-lead">
          {home.dataLead}
        </h2>
        <ol className="desk-home-steps">
          {home.steps.map((step, index) => (
            <li key={step.title} className="desk-home-step">
              <span className="desk-home-step-num" aria-hidden>
                {index + 1}
              </span>
              <span className="desk-home-step-body">
                <span className="desk-home-step-title">{step.title}</span>
                <span className="desk-home-step-detail">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="desk-home-actions" aria-label="Acción principal">
        <Link to={home.primary.to} className="desk-home-primary">
          <span className="desk-home-primary-icon" aria-hidden>
            <PrimaryIcon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="desk-home-primary-body">
            <span className="desk-home-primary-label">{home.primary.label}</span>
            <span className="desk-home-primary-outcome">{home.primary.outcome}</span>
          </span>
          <ArrowRight className="desk-home-primary-arrow h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
