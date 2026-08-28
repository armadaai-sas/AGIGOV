import { Link } from 'react-router-dom';
import { ArrowRight, Mail, LogIn, Rocket, ScrollText, Code2, ChevronRight } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { HelpTopicLink } from '../components/HelpTopicLink.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';

const LINKS = [
  { to: INSTITUTION_ROUTES.register, name: 'Abrir entorno de prueba', meta: 'Registro autoservicio', icon: Rocket, status: 'Camino 1' },
  { to: TEAM_CONTACT_MAILTO, name: 'Hablar con el equipo', meta: 'contacto@agigov.org · piloto guiado', icon: Mail, status: 'Camino 2', external: true },
  { to: INSTITUTION_ROUTES.login, name: 'Iniciar sesión', meta: 'Cuenta institucional existente', icon: LogIn, status: 'Acceso' },
  { to: '/modelos', name: 'Modelos', meta: 'Catálogo operativo por audiencia', icon: ScrollText, status: 'Catálogo' },
  { to: '/desarrolladores', name: 'Desarrolladores', meta: 'API pública e integradores', icon: Code2, status: 'API' },
] as const;

/**
 * Hub institucional — lista minimal estilo escritorio.
 */
export default function InstitutionalPage() {
  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Institucional</h1>
            <p className="os-workspace-sub">
              Protocolo verificable, modelos operativos y despliegue por jurisdicción.
            </p>
            <p className="mt-2">
              <HelpTopicLink topic="institucional" />
            </p>
          </div>
        </header>

        <ul className="os-workspace-list">
          {LINKS.map(({ to, name, meta, icon: Icon, status, external }) => (
            <li key={to}>
              {external ? (
                <a href={to} className="os-workspace-row">
                  <span className="os-workspace-row-icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="os-workspace-row-body">
                    <span className="os-workspace-row-name">{name}</span>
                    <span className="os-workspace-row-meta">{meta}</span>
                  </span>
                  <span className="os-workspace-row-status">{status}</span>
                  <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                </a>
              ) : (
                <Link to={to} className="os-workspace-row">
                  <span className="os-workspace-row-icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="os-workspace-row-body">
                    <span className="os-workspace-row-name">{name}</span>
                    <span className="os-workspace-row-meta">{meta}</span>
                  </span>
                  <span className="os-workspace-row-status">{status}</span>
                  <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <footer className="os-workspace-foot">
          <Link to={INSTITUTION_ROUTES.pilot} className="os-workspace-foot-link">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            Piloto fiscal EGS
          </Link>
        </footer>
      </div>
    </PageShell>
  );
}
