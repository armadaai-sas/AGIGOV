import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { getHelpTopic } from '../content/helpTutorials.js';
import {
  EGS_CONSOLE_PATH,
  EGS_MODEL_PATH,
  getAgigovModel,
} from '../platform/agigovModels.js';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export function AppBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="app-breadcrumbs agigov-enter-up" aria-label="Ruta de navegación">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`}>
              {item.to && !last ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last ? <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const modelosRoot: BreadcrumbItem = { label: 'Modelos', to: '/modelos' };
const gestion: BreadcrumbItem = { label: 'Gestión pública', to: '/gestion' };

/** Migas estándar para rutas de la plataforma. */
export function breadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  const root: BreadcrumbItem = { label: 'Inicio', to: '/' };

  if (pathname === '/modelos') {
    return [root, { label: 'Modelos' }];
  }

  if (pathname.startsWith('/modelos/')) {
    const segments = pathname.split('/').filter(Boolean);
    const modelId = segments[1];
    const model = modelId ? getAgigovModel(modelId) : undefined;

    if (pathname === EGS_CONSOLE_PATH) {
      return [
        root,
        modelosRoot,
        { label: 'Efficiency Gain Share', to: EGS_MODEL_PATH },
        { label: 'Consola operativa' },
      ];
    }

    if (model) {
      return [root, modelosRoot, { label: model.name }];
    }

    return [root, modelosRoot];
  }

  switch (pathname) {
    case '/gestion':
      return [root, { label: 'Gestión pública' }];
    case '/propuestas':
      return [root, gestion, { label: 'Propuestas' }];
    case '/proyectos':
      return [root, gestion, { label: 'Proyectos DAO' }];
    case '/contratos':
      return [root, modelosRoot, { label: 'Escrow · Contratos' }];
    case '/transparencia':
      return [root, modelosRoot, { label: 'Transparencia' }];
    case '/suministros':
      return [root, gestion, { label: 'Suministros' }];
    case '/participar':
      return [root, { label: 'Participar' }];
    case '/institucional':
      return [root, { label: 'Institucional' }];
    case '/institucional/piloto':
      return [root, { label: 'Institucional', to: '/institucional' }, { label: 'Piloto fiscal' }];
    case '/institucional/registro':
      return [root, { label: 'Institucional', to: '/institucional' }, { label: 'Registro institucional' }];
    case '/institucional/acceso':
      return [root, { label: 'Institucional', to: '/institucional' }, { label: 'Acceso institucional' }];
    case '/aprender/glosario':
      return [root, { label: 'Ayuda', to: '/ayuda' }, { label: 'Glosario' }];
    case '/ayuda':
      return [root, { label: 'Centro de ayuda' }];
    case '/desarrolladores':
      return [root, { label: 'Desarrolladores' }];
    case '/cne':
      return [
        root,
        modelosRoot,
        { label: 'Consulta Ciudadana Verificable', to: '/modelos/consulta-ciudadana' },
        { label: 'Demo en vivo' },
      ];
    default:
      if (pathname.startsWith('/proyectos/contrato/')) {
        return [
          root,
          gestion,
          { label: 'Proyectos', to: '/proyectos?tab=dao' },
          { label: 'Contrato escrow' },
        ];
      }
      if (pathname.startsWith('/proyectos/')) {
        return [
          root,
          gestion,
          { label: 'Proyectos', to: '/proyectos?tab=dao' },
          { label: 'Detalle' },
        ];
      }
      if (pathname.startsWith('/ayuda/')) {
        const slug = pathname.slice('/ayuda/'.length);
        const topic = getHelpTopic(slug);
        return [
          root,
          { label: 'Ayuda', to: '/ayuda' },
          { label: topic?.title ?? 'Tutorial' },
        ];
      }
      return [root];
  }
}
