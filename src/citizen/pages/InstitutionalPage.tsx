import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, Mail, Rocket } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';
import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';

/**
 * Institucional — una acción principal: probar EGS con cuenta propia.
 */
export default function InstitutionalPage() {
  return (
    <PageShell shell narrow>
      <div className="inst-auth-page">
        <header className="inst-auth-page-head">
          <p className="inst-auth-kicker">Institucional</p>
          <h1 className="inst-auth-title">Pruebe EGS con su institución</h1>
          <p className="inst-auth-lead">
            Cree su cuenta, cargamos datos de ejemplo del trimestre y abre la consola fiscal — sin
            credenciales compartidas ni pasos técnicos.
          </p>
        </header>

        <div className="inst-auth-panel">
          <div className="inst-auth-card inst-trial-hero">
            <Link to={INSTITUTION_ROUTES.register} className="desk-page-primary-btn w-full justify-center no-underline">
              <Rocket className="h-4 w-4" aria-hidden />
              Crear cuenta para probar
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="inst-auth-footnote inst-auth-footnote--center">
              Tarda menos de un minuto · Q1 de ejemplo incluido
            </p>
          </div>
        </div>

        <ul className="inst-trial-links">
          <li>
            <Link to={INSTITUTION_ROUTES.login} className="inst-trial-link">
              <LogIn className="h-4 w-4" aria-hidden />
              <span>Ya tengo cuenta — iniciar sesión</span>
            </Link>
          </li>
          <li>
            <Link to={EGS_CONSOLE_PATH} className="inst-trial-link">
              <ArrowRight className="h-4 w-4" aria-hidden />
              <span>Ver consola EGS (telemetría pública)</span>
            </Link>
          </li>
          <li>
            <a href={TEAM_CONTACT_MAILTO} className="inst-trial-link">
              <Mail className="h-4 w-4" aria-hidden />
              <span>Piloto guiado con el equipo</span>
            </a>
          </li>
        </ul>
      </div>
    </PageShell>
  );
}
