import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TRADITIONAL = [
  'Promesas sin datos comprobables',
  'Presupuesto y decisiones opacas',
  'Participación solo en elecciones',
  'Burocracia sin trazabilidad pública',
] as const;

const GOVERNANCE_2 = [
  'Gestión publicada y verificable',
  'Proyectos, propuestas y escrow visibles',
  'Participación continua con evidencia',
  'Agentes institucionales + firmas + auditoría',
] as const;

export function HeroGovernanceModel() {
  return (
    <section id="modelo" className="landing-section landing-section--model" aria-labelledby="modelo-heading">
      <div className="landing-section-head">
        <p className="landing-section-kicker">Gobernanza 2.0</p>
        <h2 id="modelo-heading" className="landing-section-title">
          Del modelo tradicional al modelo post-IA
        </h2>
        <p className="landing-section-lead">
          Hay que explicar la diferencia: la política tradicional opera con opacidad y ciclos
          largos. <strong className="text-white">Gobernanza 2.0</strong> usa inteligencia
          general, ledger y participación continua para que cada decisión tenga evidencia
          pública.
        </p>
      </div>

      <div className="governance-compare">
        <article className="governance-col governance-col--legacy">
          <p className="governance-col-label">Modelo tradicional</p>
          <p className="governance-col-desc">Política y gobernanza pre-IA</p>
          <ul>
            {TRADITIONAL.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="governance-col governance-col--next">
          <p className="governance-col-label">Gobernanza 2.0</p>
          <p className="governance-col-desc">Política y gobernanza post-IA</p>
          <ul>
            {GOVERNANCE_2.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="landing-section-foot">
        <Link to="/institucional" className="landing-link">
          Ver marco institucional completo
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
