import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Landmark, Users } from 'lucide-react';

const PATHS = [
  {
    to: '/participar',
    icon: Users,
    title: 'Ciudadano',
    text: 'Envía una propuesta con trazabilidad pública.',
    action: 'Enviar propuesta',
  },
  {
    to: '/gestion',
    icon: Compass,
    title: 'Explorar',
    text: 'Consulta gestión, propuestas, proyectos y suministros publicados.',
    action: 'Abrir gestión pública',
  },
  {
    to: '/institucional#sandbox',
    icon: Landmark,
    title: 'Gobierno e institución',
    text: 'Abre un entorno de prueba autoservicio o habla con el equipo para un piloto guiado.',
    action: 'Abrir camino institucional',
  },
] as const;

export function HeroAccessPaths() {
  return (
    <section className="landing-section landing-section--access" aria-labelledby="access-heading">
      <div className="landing-section-head">
        <h2 id="access-heading" className="landing-section-title">
          Elige cómo entrar
        </h2>
        <p className="landing-section-lead">
          Tres accesos directos, sin jerga técnica: participar, explorar datos publicados o
          hablar con el equipo institucional.
        </p>
      </div>

      <div className="hero-paths hero-paths--row" role="list" aria-label="Accesos">
        {PATHS.map(({ to, icon: Icon, title, text, action }) => (
          <Link key={to} to={to} className="hero-path-card" role="listitem">
            <span className="hero-path-icon" aria-hidden>
              <Icon className="h-5 w-5" />
            </span>
            <span className="hero-path-body">
              <span className="hero-path-title">{title}</span>
              <span className="hero-path-text">{text}</span>
              <span className="hero-path-action">
                {action}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** @deprecated Use HeroAccessPaths */
export const HeroAudiencePaths = HeroAccessPaths;
