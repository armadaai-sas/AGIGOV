import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { agigovIconProps } from '../icons/agigovIcon.js';
import type { DeskPersonaHome } from '../../platform/deskHome.js';

type DeskHomeCanvasProps = {
  home: DeskPersonaHome;
  personaLabel: string;
  greet: string | null;
};

/** Escritorio: una frase y la acción. El menú lateral ya lista el resto. */
export function DeskHomeCanvas({ home, personaLabel, greet }: DeskHomeCanvasProps) {
  const PrimaryIcon = home.primary.icon;

  return (
    <div className="desk-home">
      <header className="desk-home-hero">
        <p className="desk-home-kicker">{personaLabel}</p>
        <h1 className="desk-home-title">{greet ? `Hola, ${greet}` : 'Escritorio'}</h1>
        <p className="desk-home-result">{home.resultFocus}</p>
      </header>

      <Link to={home.primary.to} className="desk-home-primary">
        <PrimaryIcon {...agigovIconProps('md')} />
        <span>{home.primary.label}</span>
        <ArrowRight {...agigovIconProps('md', 'desk-home-primary-arrow')} />
      </Link>
    </div>
  );
}
