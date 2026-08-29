import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import type { DeskPersonaHome } from '../platform/deskHome.js';

type DeskHomeCanvasProps = {
  home: DeskPersonaHome;
  personaLabel: string;
  greet: string | null;
};

/** Canvas ergonómico — espacio, resultado y pasos simples por persona. */
export function DeskHomeCanvas({ home, personaLabel, greet }: DeskHomeCanvasProps) {
  const PrimaryIcon = home.primary.icon;
  const SecondaryIcon = home.secondary?.icon;

  return (
    <div className="desk-home">
      <header className="desk-home-hero">
        <p className="desk-home-eyebrow">{personaLabel}</p>
        <h1 className="desk-home-greet">{greet ? `Hola, ${greet}` : 'Escritorio'}</h1>
        <p className="desk-home-result">{home.resultFocus}</p>
      </header>

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

        {home.secondary ? (
          <Link to={home.secondary.to} className="desk-home-secondary">
            {SecondaryIcon ? (
              <SecondaryIcon className="h-4 w-4 shrink-0 opacity-60" aria-hidden strokeWidth={1.75} />
            ) : null}
            <span>{home.secondary.label}</span>
            <span className="desk-home-secondary-outcome">→ {home.secondary.outcome}</span>
          </Link>
        ) : null}
      </section>

      <p className="desk-home-quiet">⌘K — buscar rutas, ayuda y catálogo completo</p>
    </div>
  );
}
