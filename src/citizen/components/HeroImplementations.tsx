import { Link } from 'react-router-dom';
import { ArrowRight, Globe, MapPin } from 'lucide-react';

const IMPLEMENTATIONS = [
  {
    icon: Globe,
    title: 'Modelo genérico AGIGOV',
    text: 'Protocolo base replicable en cualquier gobierno bajo el código AGIGOV-[ISO].',
    action: 'Documentación del protocolo',
    to: '/institucional#protocolo',
  },
  {
    icon: MapPin,
    title: 'Implementación Venezuela',
    text: 'Carta nacional, piloto territorial y plataforma ciudadana en operación demo.',
    action: 'Ver implementación Venezuela',
    to: '/institucional',
  },
] as const;

export function HeroImplementations() {
  return (
    <section className="landing-section" aria-labelledby="impl-heading">
      <div className="landing-section-head">
        <p className="landing-section-kicker">Dentro de AGIGOV</p>
        <h2 id="impl-heading" className="landing-section-title">
          Modelo genérico e implementaciones nacionales
        </h2>
        <p className="landing-section-lead">
          La organización publica un modelo único. Cada gobierno adopta su implementación
          sin perder soberanía normativa local.
        </p>
      </div>

      <div className="impl-grid">
        {IMPLEMENTATIONS.map(({ icon: Icon, title, text, action, to }) => (
          <Link key={to} to={to} className="impl-card">
            <span className="impl-card-icon" aria-hidden>
              <Icon className="h-6 w-6" />
            </span>
            <span className="impl-card-title">{title}</span>
            <span className="impl-card-text">{text}</span>
            <span className="impl-card-action">
              {action}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
