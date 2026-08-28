import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Activity,
  Users,
  ChevronRight,
  Rocket,
  Monitor,
} from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

type Workspace = {
  to: string;
  name: string;
  status: string;
  meta: string;
  icon: typeof LayoutDashboard;
};

const WORKSPACES: Workspace[] = [
  {
    to: modelWorkspacePath('egs'),
    name: 'EGS',
    status: 'Activo',
    meta: 'Reparto del ahorro por eficiencia',
    icon: LayoutDashboard,
  },
  {
    to: '/modelos',
    name: 'Modelos',
    status: 'Disponible',
    meta: 'Catálogo de modelos operativos',
    icon: Package,
  },
  {
    to: '/gestion',
    name: 'Gestión pública',
    status: 'En vivo',
    meta: 'Registro publicado verificable',
    icon: Activity,
  },
  {
    to: '/participar',
    name: 'Participar',
    status: 'Abierto',
    meta: 'Propuestas con hechos',
    icon: Users,
  },
];

/**
 * Escritorio — home del OS de trabajo (estilo Cursor: sidebar + lista de proyectos).
 */
export default function EscritorioPage() {
  const { isAuthenticated, session } = useInstitutionAuth();
  const greet =
    session?.institutionName?.split(/\s+/)[0] ??
    session?.email?.split('@')[0] ??
    null;

  return (
    <PageShell narrow shell>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">
              {greet ? `Hola, ${greet}` : 'Escritorio'}
            </h1>
            <p className="os-workspace-sub">
              Tus espacios de trabajo. Elige uno para continuar.
            </p>
          </div>
        </header>

        <ul className="os-workspace-list">
          {WORKSPACES.map(({ to, name, status, meta, icon: Icon }) => (
            <li key={to}>
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
            </li>
          ))}
        </ul>

        <section className="os-workspace-section mt-6">
          <h2 className="os-workspace-section-title">Instalar en tu equipo</h2>
          <Link to="/descargar" className="os-workspace-row">
            <span className="os-workspace-row-icon" aria-hidden>
              <Monitor className="h-4 w-4" />
            </span>
            <span className="os-workspace-row-body">
              <span className="os-workspace-row-name">App de escritorio</span>
              <span className="os-workspace-row-meta">Windows · macOS · Linux</span>
            </span>
            <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
          </Link>
        </section>

        <footer className="os-workspace-foot">
          {isAuthenticated ? (
            <Link to={INSTITUTION_ROUTES.pilot} className="os-workspace-foot-link">
              <Rocket className="h-3.5 w-3.5" aria-hidden />
              Piloto fiscal EGS
            </Link>
          ) : (
            <Link to={INSTITUTION_ROUTES.register} className="os-workspace-foot-link">
              Crear cuenta para desplegar
            </Link>
          )}
        </footer>
      </div>
    </PageShell>
  );
}
