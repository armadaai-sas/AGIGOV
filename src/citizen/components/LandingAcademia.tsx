import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  GitBranch,
  Landmark,
  ScrollText,
  Users,
  LifeBuoy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const GUIDES = [
  {
    icon: BookOpen,
    title: 'Qué es Gobernanza 2.0',
    text: 'Por qué el modelo tradicional ya no alcanza y qué cambia con política post-IA.',
    to: '/#modelo',
    cta: 'Leer comparación',
  },
  {
    icon: GitBranch,
    title: 'Cómo funciona el flujo',
    text: 'Recibido → validado → decidido → comprometido → publicado. Cada paso deja evidencia.',
    to: '/#flujo',
    cta: 'Ver el recorrido',
  },
  {
    icon: Users,
    title: 'Qué puedo hacer como ciudadano',
    text: 'Enviar propuestas, seguir dictámenes y aportar a proyectos con trazabilidad.',
    to: '/participar',
    cta: 'Participar',
  },
  {
    icon: LifeBuoy,
    title: 'Centro de ayuda',
    text: 'Tutoriales por sección: qué es, para quién y qué puedes hacer en cada parte.',
    to: '/ayuda',
    cta: 'Abrir ayuda',
  },
  {
    icon: BookOpen,
    title: 'Glosario ciudadano',
    text: 'Ledger, propuesta, dictamen y escrow — conceptos clave en lenguaje claro.',
    to: '/aprender/glosario',
    cta: 'Abrir glosario',
  },
  {
    icon: Compass,
    title: 'Explorar gestión publicada',
    text: 'Presupuesto agregado, propuestas, proyectos DAO y suministros — datos abiertos.',
    to: '/gestion',
    cta: 'Abrir gestión',
  },
  {
    icon: Landmark,
    title: 'Adoptar como gobierno',
    text: 'Sandbox autoservicio o hablar con el equipo para piloto guiado y readiness.',
    to: '/institucional#sandbox',
    cta: 'Abrir camino institucional',
  },
  {
    icon: ScrollText,
    title: 'Protocolo y documentación',
    text: 'Especificación técnica del modelo genérico AGIGOV para desarrolladores e instituciones.',
    to: '/desarrolladores',
    cta: 'Ver API y docs',
  },
] as const;

const FLOW = [
  { step: '01', label: 'Recibido', desc: 'Propuesta o dato entra al sistema' },
  { step: '02', label: 'Validado', desc: 'Centinela verifica integridad y firmas' },
  { step: '03', label: 'Decidido', desc: 'Soberano o agentes emiten dictamen' },
  { step: '04', label: 'Comprometido', desc: 'multifirma antes de efectos irreversibles' },
  { step: '05', label: 'Publicado', desc: 'Ciudadano ve gestión en la plataforma' },
] as const;

export function LandingAcademia() {
  return (
    <section id="aprender" className="landing-section landing-section--learn scroll-mt-24">
      <div className="landing-section-head">
        <p className="landing-section-kicker">Academia AGIGOV</p>
        <h2 className="landing-section-title">Aprende el nuevo modelo</h2>
        <p className="landing-section-lead">
          Guías claras para entender qué es distinto, cómo funciona la plataforma y qué puedes
          hacer hoy — sin jerga innecesaria.
        </p>
      </div>

      <div className="landing-guide-grid">
        {GUIDES.map(({ icon: Icon, title, text, to, cta }) => (
          <GuideCard key={title} icon={Icon} title={title} text={text} to={to} cta={cta} />
        ))}
      </div>

      <div id="flujo" className="landing-flow scroll-mt-28">
        <h3 className="landing-flow-title">Recorrido de una decisión publicada</h3>
        <ol className="landing-flow-steps">
          {FLOW.map(({ step, label, desc }) => (
            <li key={step}>
              <span className="landing-flow-step">{step}</span>
              <span className="landing-flow-label">{label}</span>
              <span className="landing-flow-desc">{desc}</span>
            </li>
          ))}
        </ol>
        <div className="landing-flow-foot">
          <Link to="/gestion" className="landing-link">
            Ver datos ya publicados
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="landing-learn-cta">
        <div>
          <p className="landing-learn-cta-title">¿Listo para actuar?</p>
          <p className="landing-learn-cta-text">
            Elige un camino concreto: explorar datos, registrar tu institución o enviar una
            propuesta.
          </p>
        </div>
        <Link to="/#acceso" className="ds-btn-primary">
          Ver accesos
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function GuideCard({
  icon: Icon,
  title,
  text,
  to,
  cta,
}: {
  key?: string;
  icon: LucideIcon;
  title: string;
  text: string;
  to: string;
  cta: string;
}) {
  return (
    <Link to={to} className="landing-guide-card">
      <span className="landing-guide-icon" aria-hidden>
        <Icon className="h-5 w-5" />
      </span>
      <span className="landing-guide-title">{title}</span>
      <span className="landing-guide-text">{text}</span>
      <span className="landing-guide-cta">
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
