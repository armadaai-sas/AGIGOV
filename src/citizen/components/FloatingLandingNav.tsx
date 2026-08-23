import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { EGS_VIAL_PRODUCT_PATH } from '../services/egs-vial-service.js';

/** Nav flotante landing — logo y acceso al servicio EGS. */
export function FloatingLandingNav() {
  return (
    <nav className="landing-float-nav is-revealed" aria-label="Navegación AGIGOV">
      <Link to="/" className="landing-float-brand" aria-label="AGIGOV — Inicio">
        <AgigovLogo size="sm" showWordmark />
      </Link>

      <div className="landing-float-actions">
        <Link to="/institucional" className="site-nav-link site-nav-link--landing hidden sm:inline-flex">
          Modelo AGIGOV
        </Link>
        <Link to="/transparencia" className="site-nav-link site-nav-link--landing hidden md:inline-flex">
          Transparencia
        </Link>
        <Link
          to={EGS_VIAL_PRODUCT_PATH}
          className="site-nav-link site-nav-link--landing site-nav-link--cta"
        >
          Servicio EGS
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </nav>
  );
}
