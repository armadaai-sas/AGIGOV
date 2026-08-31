import { Link } from 'react-router-dom';

import { PageShell } from '../components/PageShell.js';
import { DeskHomeCanvas } from '../components/desk/DeskHomeCanvas.js';
import { useDeskShell } from '../context/DeskShellContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { getDeskPersonaHome } from '../platform/deskHome.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { landingPersonaLabelKey } from '../content/landingMinimalCopy.js';

/**
 * Escritorio — canvas ergonómico por persona: resultado, pasos de data, una acción clara.
 */
export default function EscritorioPage() {
  const { persona } = useDeskShell();
  const { t } = useSovereignConfig();
  const { isAuthenticated, session } = useInstitutionAuth();
  const home = getDeskPersonaHome(persona);
  const greet =
    session?.institutionName?.split(/\s+/)[0] ??
    session?.email?.split('@')[0] ??
    null;

  return (
    <PageShell narrow shell>
      <DeskHomeCanvas
        home={home}
        personaLabel={t(landingPersonaLabelKey(persona))}
        greet={greet}
      />

      {!isAuthenticated && persona === 'state' ? (
        <p className="desk-home-register">
          <Link to={INSTITUTION_ROUTES.register}>Crear cuenta para probar EGS</Link>
          <span className="desk-home-register-sep"> · </span>
          <Link to={INSTITUTION_ROUTES.login}>Iniciar sesión</Link>
        </p>
      ) : null}
    </PageShell>
  );
}
