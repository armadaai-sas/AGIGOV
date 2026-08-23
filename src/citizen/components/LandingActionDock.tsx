import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Landmark, Users } from 'lucide-react';

const ACTIONS = [
  {
    to: '/gestion',
    icon: Compass,
    title: 'Explorar la plataforma',
    text: 'Gestión pública, propuestas, proyectos y suministros ya publicados.',
    cta: 'Abrir explorador',
    variant: 'primary' as const,
  },
  {
    to: '/institucional#sandbox',
    icon: Landmark,
    title: 'Abrir entorno de prueba institucional',
    text: 'Gobiernos e instituciones: registro autoservicio para probar el OS en tu jurisdicción.',
    cta: 'Abrir entorno de prueba',
    variant: 'gold' as const,
  },
  {
    to: '/participar',
    icon: Users,
    title: 'Participar ahora',
    text: 'Envía una propuesta ciudadana con hechos verificables y trazabilidad pública.',
    cta: 'Crear propuesta',
    variant: 'default' as const,
  },
] as const;

export function LandingActionDock() {
  return (
    <section id="acceso" className="landing-section landing-section--dock scroll-mt-24">
      <div className="landing-section-head">
        <p className="landing-section-kicker">Acceso directo</p>
        <h2 className="landing-section-title">Entra a la plataforma</h2>
        <p className="landing-section-lead">
          Tres caminos concretos. Sin intermediarios opacos: explorar datos, registrar tu
          institución o participar como ciudadano.
        </p>
      </div>

      <div className="landing-dock-grid">
        {ACTIONS.map(({ to, icon: Icon, title, text, cta, variant }) => (
          <Link
            key={to}
            to={to}
            className={`landing-dock-card landing-dock-card--${variant}`}
          >
            <span className="landing-dock-icon" aria-hidden>
              <Icon className="h-6 w-6" />
            </span>
            <span className="landing-dock-title">{title}</span>
            <span className="landing-dock-text">{text}</span>
            <span className="landing-dock-cta">
              {cta}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
