import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Activity,
  Users,
  ArrowRight,
  Rocket,
} from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell } from '../components/PageShell.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';

const ACTIONS = [
  {
    to: EGS_CONSOLE_PATH,
    title: 'Abrir consola EGS',
    body: 'Operar el modelo fiscal: salud presupuestaria y evidencia.',
    icon: LayoutDashboard,
    primary: true,
  },
  {
    to: '/modelos',
    title: 'Ver modelos',
    body: 'Elegir una app del OS (EGS, escrow, participación…).',
    icon: Package,
    primary: false,
  },
  {
    to: '/gestion',
    title: 'Gestión pública',
    body: 'Ver el ledger público — datos verificables para la ciudadanía.',
    icon: Activity,
    primary: false,
  },
  {
    to: '/participar',
    title: 'Participar',
    body: 'Enviar una propuesta con hechos.',
    icon: Users,
    primary: false,
  },
] as const;

/**
 * Escritorio OSGOV — home simple tras cuenta (estilo Cursor):
 * sidebar = herramientas; centro = pocas acciones claras.
 */
export default function EscritorioPage() {
  const { isAuthenticated, session } = useInstitutionAuth();
  const greet =
    session?.institutionName?.split(/\s+/)[0] ??
    session?.email?.split('@')[0] ??
    'bienvenido';

  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/escritorio')}>
      <div className="os-desk">
        <header className="os-desk-head">
          <p className="os-desk-kicker">Escritorio AGIGOV</p>
          <h1 className="os-desk-title">
            {isAuthenticated ? `Hola, ${greet}` : 'Tu sistema operativo'}
          </h1>
          <p className="os-desk-lead">
            Elige una acción. Sin ruido — igual que un OS.
          </p>
        </header>

        <ul className="os-desk-actions">
          {ACTIONS.map(({ to, title, body, icon: Icon, primary }) => (
            <li key={to}>
              <Link
                to={to}
                className={`os-desk-card${primary ? ' os-desk-card--primary' : ''}`}
              >
                <span className="os-desk-card-icon" aria-hidden>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="os-desk-card-text">
                  <span className="os-desk-card-title">{title}</span>
                  <span className="os-desk-card-body">{body}</span>
                </span>
                <ArrowRight className="os-desk-card-arrow h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <p className="os-desk-foot">
          {isAuthenticated ? (
            <Link to={INSTITUTION_ROUTES.pilot} className="os-desk-foot-link">
              <Rocket className="h-3.5 w-3.5" aria-hidden />
              Piloto fiscal EGS (Trust Pack)
            </Link>
          ) : (
            <Link to={INSTITUTION_ROUTES.register} className="os-desk-foot-link">
              Crear cuenta para desplegar
            </Link>
          )}
        </p>
      </div>
    </PageShell>
  );
}
