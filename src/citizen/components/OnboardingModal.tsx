import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Compass, Landmark, LifeBuoy, Users, X, ArrowRight } from 'lucide-react';

import { usePlatform, type OnboardingPersona } from '../context/PlatformContext.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

const PATHS: Array<{
  persona: OnboardingPersona;
  icon: typeof Users;
  title: string;
  text: string;
  to: string;
}> = [
  {
    persona: 'citizen',
    icon: Users,
    title: 'Soy ciudadano',
    text: 'Enviar propuestas, seguir dictámenes y aportar a proyectos con trazabilidad.',
    to: '/participar',
  },
  {
    persona: 'explorer',
    icon: Compass,
    title: 'Quiero explorar',
    text: 'Ver gestión publicada, propuestas, proyectos y suministros ya validados.',
    to: '/gestion',
  },
  {
    persona: 'government',
    icon: Landmark,
    title: 'Represento un gobierno',
    text: 'Crear cuenta institucional y abrir el escritorio — ahorro y modelos.',
    to: INSTITUTION_ROUTES.register,
  },
  {
    persona: 'business',
    icon: Briefcase,
    title: 'Represento una empresa',
    text: 'Evidencia certificada, IAAU y fideicomiso de datos — registro o catálogo.',
    to: '/modelos?audiencia=empresarial',
  },
];

/** Onboarding 3 pasos — no en la home: el landing debe verse limpio. */
export function OnboardingModal() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { onboardingDone, completeOnboarding, dismissOnboarding } = usePlatform();

  // La página de producto (/) no debe abrirse con un modal encima.
  if (pathname === '/' || onboardingDone) return null;

  function choose(persona: OnboardingPersona, to: string) {
    completeOnboarding(persona);
    navigate(to);
  }

  return (
    <div className="agigov-onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <button type="button" className="agigov-onboarding-backdrop" aria-label="Cerrar" onClick={dismissOnboarding} />
      <div className="agigov-onboarding-panel">
        <div className="agigov-onboarding-head">
          <div>
            <p className="agigov-onboarding-kicker">Bienvenido a AGIGOV</p>
            <h2 id="onboarding-title" className="agigov-onboarding-title">
              ¿Cómo quieres empezar?
            </h2>
            <p className="agigov-onboarding-lead">
            Elige tu camino. Siempre puedes cambiar desde el menú, el{' '}
            <strong className="text-agigov-text">Centro de ayuda</strong> o con{' '}
            <kbd className="agigov-kbd">⌘K</kbd>.
            </p>
          </div>
          <button type="button" className="agigov-onboarding-close" onClick={dismissOnboarding} aria-label="Omitir">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="agigov-onboarding-grid">
          {PATHS.map(({ persona, icon: Icon, title, text, to }) => (
            <button
              key={persona}
              type="button"
              className="agigov-onboarding-card"
              onClick={() => choose(persona, to)}
            >
              <span className="agigov-onboarding-icon" aria-hidden>
                <Icon className="h-6 w-6" />
              </span>
              <span className="agigov-onboarding-card-title">{title}</span>
              <span className="agigov-onboarding-card-text">{text}</span>
              <span className="agigov-onboarding-card-cta">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>

        <button type="button" className="agigov-onboarding-skip" onClick={dismissOnboarding}>
          Explorar la home primero · o ir al{' '}
          <LifeBuoy className="inline h-3.5 w-3.5 align-text-bottom" aria-hidden /> centro de ayuda después
        </button>
      </div>
    </div>
  );
}
