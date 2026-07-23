import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { INSTITUTION_ROUTES, TRY_MODEL_ENTRY } from '../platform/institutionalRoutes.js';

/** Header landing — logo suave; menú sin cambios. */
export function SiteHeader() {
  return (
    <header className="site-header site-header--landing">
      <div className="site-header-inner site-header-inner--wide">
        <Link to="/" className="site-brand" aria-label="AGIGOV — Inicio">
          <AgigovLogo size="sm" showWordmark />
        </Link>

        <div className="site-header-actions site-header-actions--landing">
          <Link to="/institucional#modelo" className="site-nav-link site-nav-link--landing">
            Modelo
          </Link>
          <Link to={INSTITUTION_ROUTES.login} className="site-nav-link site-nav-link--landing">
            Iniciar sesión
          </Link>
          <Link to={TRY_MODEL_ENTRY} className="site-nav-link site-nav-link--landing site-nav-link--concierge">
            Registrarse
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** @deprecated Sidebar reemplaza nav app */
export function CitizenNav() {
  return null;
}
