import { Link } from 'react-router-dom';
import { ArrowRight, Mail, LogIn, Rocket, ScrollText, Code2 } from 'lucide-react';

import { AgigovLogo } from '../components/AgigovLogo.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell } from '../components/PageShell.js';
import { HelpTopicLink } from '../components/HelpTopicLink.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';

/**
 * Hub institucional — dos caminos, sin jerga:
 * 1) Sandbox autoservicio (registro)
 * 2) Hablar con el equipo (correo humano)
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
      </section>

      <section id="sandbox" className="agigov-card mb-6 scroll-mt-28">
        <div className="flex items-start gap-3">
          <div className="agigov-pillar-icon shrink-0">
            <Rocket className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-agigov-text-muted">
              Camino 1 · Autoservicio
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-agigov-text">Abrir entorno de prueba</h2>
            <p className="mt-2 text-sm leading-relaxed text-agigov-text-muted">
              Te registras, creas una cuenta y pruebas el OS solo. No necesitas hablar con nadie.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={INSTITUTION_ROUTES.register} className="ds-btn-app">
                Abrir entorno de prueba
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={INSTITUTION_ROUTES.login} className="ds-btn-secondary ds-btn-app-shape">
                <LogIn className="h-4 w-4" aria-hidden />
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="hablar" className="agigov-card mb-8 scroll-mt-28">
        <div className="flex items-start gap-3">
          <div className="agigov-pillar-icon shrink-0">
            <Mail className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-agigov-text-muted">
              Camino 2 · Humano
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-agigov-text">
              Hablar con el equipo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-agigov-text-muted">
              Para piloto guiado, readiness, carta o onboarding enterprise. Es correo real al
              equipo — no un formulario genérico ni un alias de registro.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={TEAM_CONTACT_MAILTO} className="ds-btn-app">
                <Mail className="h-4 w-4" aria-hidden />
                contacto@agigov.org
              </a>
              <Link to={INSTITUTION_ROUTES.pilot} className="ds-btn-secondary ds-btn-app-shape">
                Ver piloto fiscal
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
