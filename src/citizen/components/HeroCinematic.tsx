import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, Shield, Scale, Eye, Radio, Megaphone, Sparkles } from 'lucide-react';

/** @deprecated Usar HeroPage — re-export de compatibilidad. */
export { HeroPage as HeroCinematic } from './hero/HeroPage.js';

const PIPELINE = [
  { icon: Radio, label: 'Sensores', sub: 'Evidencia' },
  { icon: Shield, label: 'Centinela', sub: 'Validación' },
  { icon: Scale, label: 'Soberano', sub: 'Dictamen' },
  { icon: Eye, label: 'Ledger', sub: 'Inmutable' },
  { icon: Megaphone, label: 'Comunicador', sub: 'Ciudadanía' },
] as const;

/** Sección visión — usar en /institucional u otras rutas, no en home. */
export function HeroVisionStrip() {
  return (
    <section id="vision" className="cinematic-vision scroll-mt-20">
      <div className="cinematic-vision-inner">
        <p className="cinematic-kicker">
          <Sparkles className="inline h-4 w-4 -translate-y-px" aria-hidden />
          {' '}El sueño · Gobernanza 2.0
        </p>
        <h1 className="cinematic-vision-title">
          Construimos instituciones
          <span className="cinematic-title-accent"> que perduran</span>
        </h1>
        <p className="cinematic-vision-lead">
          No en un día. Capa a capa — con gente trabajando, comunidades caminando el mismo
          camino, y líderes cuyo trabajo se puede verificar. La IA nos ayuda a vivir mejor
          cuando sirve a la evidencia, no a la opacidad.
        </p>
        <p className="cinematic-vision-sub">
          El modelo es global (<strong>AGIGOV-[ISO]</strong>). Venezuela opera en{' '}
          <strong>AGIGOV-VEN</strong> — sin mezclar jurisdicciones.
        </p>

        <div className="cinematic-vision-actions">
          <Link to="/institucional#desplegar" className="cinematic-btn-primary">
            Concierge · registrarse
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          <Link to="/gestion" className="cinematic-btn-secondary">
            Entrar a AGIGOV-VEN
          </Link>
          <Link to="#modelo" className="cinematic-btn-secondary">
            Ver el modelo
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Sección modelo — usar fuera de home. */
export function HeroModelStrip() {
  return (
    <section id="modelo" className="cinematic-strip scroll-mt-20">
      <div className="cinematic-strip-inner">
        <h2 className="cinematic-strip-title">Modelo genérico · cualquier país</h2>
        <p className="cinematic-strip-lead">
          Tres pilares replicables. La operación nacional — proyectos, votos, gestión — ocurre
          en cada implementación.
        </p>
        <ul className="cinematic-strip-list">
          <li>Estado transparente — ledger público verificable</li>
          <li>Participación continua — más allá del ciclo electoral</li>
          <li>Economía trazada — escrow programático, sin captura</li>
        </ul>

        <div className="cinematic-strip-pipeline">
          {PIPELINE.map(({ icon: Icon, label, sub }, i) => (
            <div key={label} className="cinematic-strip-node" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="cinematic-strip-node-icon">
                <Icon className="h-4 w-4" />
              </div>
              <div className="cinematic-strip-node-copy">
                <p className="cinematic-strip-node-label">{label}</p>
                <p className="cinematic-strip-node-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/institucional#protocolo" className="ds-btn-secondary ds-btn-app-shape inline-flex">
            Protocolo
          </Link>
          <Link to="/institucional#whitepaper" className="ds-btn-secondary ds-btn-app-shape inline-flex">
            White paper
          </Link>
          <Link to="/institucional#desplegar" className="ds-btn-secondary ds-btn-app-shape inline-flex">
            <Rocket className="h-4 w-4" />
            Desplegar AGIGOV
          </Link>
          <Link to="/desarrolladores" className="ds-btn-secondary ds-btn-app-shape inline-flex">
            Desarrolladores
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
