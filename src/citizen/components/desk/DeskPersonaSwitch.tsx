import { useNavigate } from 'react-router-dom';

import {
  landingPersonaLabelKey,
  LANDING_PERSONA_IDS,
  type LandingPersonaId,
} from '../../content/landingMinimalCopy.js';
import { useDeskShell } from '../../context/DeskShellContext.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { deskPersonaHomePath, type DeskPersonaId } from '../../platform/deskNav.js';

/** Selector de persona — alineado al landing «Eres». */
export function DeskPersonaSwitch({ compact = false }: { compact?: boolean }) {
  const { persona, setPersona } = useDeskShell();
  const { t } = useSovereignConfig();
  const navigate = useNavigate();

  function select(id: DeskPersonaId) {
    if (id === persona) return;
    setPersona(id);
    navigate(deskPersonaHomePath(id));
  }

  if (compact) {
    const idx = LANDING_PERSONA_IDS.indexOf(persona);
    const next = LANDING_PERSONA_IDS[(idx + 1) % LANDING_PERSONA_IDS.length]!;
    return (
      <button
        type="button"
        className="app-sidebar-persona-cycle"
        aria-label={`Cambiar rol — ahora ${t(landingPersonaLabelKey(persona))}`}
        title={t(landingPersonaLabelKey(persona))}
        onClick={() => select(next)}
      >
        {t(landingPersonaLabelKey(persona)).slice(0, 1)}
      </button>
    );
  }

  return (
    <div className="app-sidebar-persona" role="group" aria-label={t('landing.min.persona.label')}>
      <span className="app-sidebar-persona-label">{t('landing.min.persona.label')}</span>
      <div className="app-sidebar-persona-row">
        {LANDING_PERSONA_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`app-sidebar-persona-btn ${persona === id ? 'app-sidebar-persona-btn--active' : ''}`}
            aria-pressed={persona === id}
            onClick={() => select(id as LandingPersonaId)}
          >
            {t(landingPersonaLabelKey(id))}
          </button>
        ))}
      </div>
    </div>
  );
}
