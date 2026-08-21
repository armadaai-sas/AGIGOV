import { Link } from 'react-router-dom';
import { ArrowRight, Users, ScrollText, Code2 } from 'lucide-react';

import { AgigovLogo } from '../components/AgigovLogo.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell } from '../components/PageShell.js';
import { HelpTopicLink } from '../components/HelpTopicLink.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/**
 * Hub institucional — corto: visión en una frase + concierge + 2 CTAs.
 * Narrativa larga (Actos I–V) vive en docs; no bloquea el camino feliz.
 */
export default function InstitutionalPage() {
  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/institucional')}>
      <section className="mb-10">
        <AgigovLogo size="md" showWordmark />
        <h1 className="mt-6 font-display text-3xl font-bold text-agigov-text md:text-4xl">
          Institucional
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-agigov-text-muted">
          Protocolo de gobernanza verificable: evidencia pública, modelos operativos y
          despliegue por jurisdicción (AGIGOV-[ISO]).
        </p>
        <p className="mt-3">
          <HelpTopicLink topic="institucional" />
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={INSTITUTION_ROUTES.register} className="ds-btn-app">
            Crear cuenta
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to={INSTITUTION_ROUTES.desk} className="ds-btn-secondary ds-btn-app-shape">
            Abrir escritorio
          </Link>
        </div>
      </section>

      <section id="desplegar" className="agigov-card mb-8 scroll-mt-28">
        <div className="flex items-start gap-3">
          <div className="agigov-pillar-icon shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-agigov-text">
              Concierge institucional
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-agigov-text-muted">
              Evaluación de readiness, carta y sandbox controlado. Si ya tiene cuenta, entre al
              escritorio.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={INSTITUTION_ROUTES.register} className="ds-btn-app">
                Registro
              </Link>
              <Link to={INSTITUTION_ROUTES.login} className="ds-btn-secondary ds-btn-app-shape">
                Ya tengo cuenta
              </Link>
              <Link to="/#contacto" className="agigov-link inline-flex items-center text-sm">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link to="/modelos" className="agigov-card-interactive block no-underline">
          <ScrollText className="mb-2 h-5 w-5 text-sky-500" aria-hidden />
          <p className="font-semibold text-agigov-text">Modelos</p>
          <p className="mt-1 text-sm text-agigov-text-muted">Apps del OS por audiencia</p>
        </Link>
        <Link to="/desarrolladores" className="agigov-card-interactive block no-underline">
          <Code2 className="mb-2 h-5 w-5 text-sky-500" aria-hidden />
          <p className="font-semibold text-agigov-text">Desarrolladores</p>
          <p className="mt-1 text-sm text-agigov-text-muted">API pública e integradores</p>
        </Link>
      </section>
    </PageShell>
  );
}
