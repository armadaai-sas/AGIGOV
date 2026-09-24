import { PageShell } from '../components/PageShell.js';
import { DeskHomeCanvas } from '../components/desk/DeskHomeCanvas.js';
import { useDeskShell } from '../context/DeskShellContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { getDeskPersonaHome } from '../platform/deskHome.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { landingPersonaLabelKey } from '../content/landingMinimalCopy.js';

/**
 * Escritorio — canvas ergonómico por persona: resultado, pasos de data, una acción clara.
 */
export default function EscritorioPage() {
  const { persona } = useDeskShell();
  const { t } = useSovereignConfig();
  const { session } = useInstitutionAuth();
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
    </PageShell>
  );
}
