import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, Mail, Rocket } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';

/**
 * Institucional — una acción principal: probar EGS con cuenta propia.
 */
export default function InstitutionalPage() {
  return (
    <PageShell shell narrow>
      <div className="inst-auth-page">
        <header className="inst-auth-page-head">
          <p className="inst-auth-kicker">Institucional</p>
          <h1 className="inst-auth-title">Cuenta de la institución</h1>
          <p className="inst-auth-lead">
            Con la cuenta se entra al escritorio y a los modelos que la institución tenga activos.
          </p>
        </header>

        <div className="inst-auth-panel">
          <div className="inst-auth-card inst-trial-hero">
            <Link to={INSTITUTION_ROUTES.register} className="desk-page-primary-btn justify-center no-underline">
              <Rocket className="h-4 w-4" aria-hidden />
              Crear cuenta
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="inst-auth-footnote inst-auth-footnote--center">
              Correo institucional y contraseña.
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
            <Link to="/modelos" className="inst-trial-link">
              <ArrowRight className="h-4 w-4" aria-hidden />
              <span>Ver los modelos</span>
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
