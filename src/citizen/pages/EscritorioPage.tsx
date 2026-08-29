import { Link } from 'react-router-dom';
import { ChevronRight, Rocket } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { DeskPersonaSwitch } from '../components/desk/DeskPersonaSwitch.js';
import { useDeskShell } from '../context/DeskShellContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import {
  getDeskWorkspaceCards,
  type DeskWorkspaceCard,
} from '../platform/deskNav.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { landingPersonaLabelKey } from '../content/landingMinimalCopy.js';

/**
 * Escritorio — home del OS por persona (utilidad → resultado).
 */
export default function EscritorioPage() {
  const { persona } = useDeskShell();
  const { t } = useSovereignConfig();
  const { isAuthenticated, session } = useInstitutionAuth();
  const cards = getDeskWorkspaceCards(persona);
  const greet =
    session?.institutionName?.split(/\s+/)[0] ??
    session?.email?.split('@')[0] ??
    null;

  return (
    <PageShell narrow shell>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <p className="os-workspace-section-title">{t(landingPersonaLabelKey(persona))}</p>
            <h1 className="os-workspace-title mt-1">
              {greet ? `Hola, ${greet}` : 'Escritorio'}
            </h1>
            <p className="os-workspace-sub">Utilidad clara · resultado verificable.</p>
          </div>
        </header>

        <DeskPersonaSwitch />

        <ul className="os-workspace-list os-workspace-list--desk">
          {cards.map((card) => (
            <DeskWorkspaceRow key={card.to} card={card} />
          ))}
        </ul>

        <footer className="os-workspace-foot">
          {isAuthenticated ? (
            <Link to={INSTITUTION_ROUTES.pilot} className="os-workspace-foot-link">
              <Rocket className="h-3.5 w-3.5" aria-hidden />
              Piloto fiscal
            </Link>
          ) : (
            <Link to={INSTITUTION_ROUTES.register} className="os-workspace-foot-link">
              Crear cuenta para desplegar
            </Link>
          )}
          <p className="app-sidebar-desk-hint mt-3">⌘K — catálogo completo, ayuda y más rutas</p>
        </footer>
      </div>
    </PageShell>
  );
}

function DeskWorkspaceRow({ card }: { card: DeskWorkspaceCard }) {
  const Icon = card.icon;

  return (
    <li>
      <Link to={card.to} className="os-workspace-row os-workspace-row--desk">
        <span className="os-workspace-row-icon" aria-hidden>
          <Icon className="h-4 w-4" />
        </span>
        <span className="os-workspace-row-body">
          <span className="os-workspace-row-name">{card.name}</span>
          <span className="os-workspace-row-meta">
            {card.utility}
            <span className="os-workspace-row-pricing"> → {card.outcome}</span>
          </span>
        </span>
        <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
      </Link>
    </li>
  );
}
