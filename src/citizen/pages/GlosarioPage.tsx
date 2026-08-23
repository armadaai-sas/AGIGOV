import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';

const TERMS = [
  {
    term: 'Ledger',
    definition:
      'Registro inmutable de decisiones y evidencia. Cada entrada queda firmada y trazable — no se borra ni se edita en silencio.',
    example: 'Un reporte de gestión publicado aparece como entrada verificable en el ledger.',
  },
  {
    term: 'Centinela',
    definition:
      'Agente de integridad del OS. Si el flujo no cuadra con la evidencia, pausa la operación antes de publicar o pagar.',
    example: 'Una discrepancia en un hito de escrow dispara revisión — no un pago automático a ciegas.',
  },
  {
    term: 'FREEZE',
    definition:
      'Congelación controlada: el sistema detiene el efecto y un humano decide el siguiente paso.',
    example: 'Ante anomalía electoral o fiscal, FREEZE evita publicar un resultado dudoso.',
  },
  {
    term: 'Multifirma',
    definition:
      'Varias firmas institucionales deben coincidir antes de un acto irreversible (presupuesto, pago, cierre).',
    example: 'Un techo presupuestario solo vale cuando hay quórum de firmas, no con un solo clic.',
  },
  {
    term: 'Kernel',
    definition:
      'Núcleo del OS que decide qué se publica y qué se paga — con evidencia. No es un chatbot.',
    example: 'Los agentes y un LLM opcional corren encima del kernel, subordinados a Centinela.',
  },
  {
    term: 'Propuesta',
    definition:
      'Iniciativa ciudadana con hechos verificables. Entra al pipeline como recibida y avanza solo si centinela valida la evidencia.',
    example: 'Enviar una idea con fuentes desde Participar crea una propuesta en estado recibido.',
  },
  {
    term: 'Dictamen',
    definition:
      'Evaluación del agente Soberano sobre una propuesta. Puede ser CONFORME (avanza) o REVISAR (requiere ajustes antes de efecto).',
    example: 'Tras validación, soberano emite dictamen alineado al marco AGIGOV.',
  },
  {
    term: 'Escrow',
    definition:
      'Fondos retenidos de forma programática hasta cumplir hitos del proyecto. El monto no compra privilegio político.',
    example: 'Un proyecto DAO muestra escrow en estado pendiente, bloqueado o liberado.',
  },
] as const;

export default function GlosarioPage() {
  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/aprender/glosario')}>
      <SectionHeader
        eyebrow="AGIGOV · Aprender"
        title="Glosario ciudadano"
        lead="Conceptos clave del modelo — en lenguaje claro, sin jerga innecesaria."
        action={
          <Link to="/ayuda" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
            <BookOpen className="h-4 w-4" />
            Centro de ayuda
          </Link>
        }
      />

      <dl className="agigov-glossary space-y-4">
        {TERMS.map(({ term, definition, example }) => (
          <div key={term} className="agigov-card">
            <dt className="font-display text-lg font-semibold text-agigov-text">{term}</dt>
            <dd className="agigov-lead mt-2">{definition}</dd>
            <dd className="agigov-glossary-example">{example}</dd>
          </div>
        ))}
      </dl>

      <section className="agigov-card mt-8 border-sky-500/20 bg-sky-950/10">
        <h2 className="font-display text-lg font-semibold text-agigov-text">¿Listo para actuar?</h2>
        <p className="agigov-lead mt-2">
          Explora gestión publicada o envía tu primera propuesta con evidencia verificable.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/gestion" className="ds-btn-app">
            Ver gestión
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/participar" className="ds-btn-secondary ds-btn-app-shape">
            Participar
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
