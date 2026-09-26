import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';

const TERMS = [
  {
    term: 'Registro',
    definition:
      'Registro inmutable de decisiones y evidencia. Cada entrada queda firmada y trazable.',
    example: 'Un reporte de gestión publicado aparece como entrada verificable.',
  },
  {
    term: 'Pausa',
    definition:
      'Si el flujo no cuadra con la evidencia, la operación se detiene.',
    example: 'Una discrepancia en un hito dispara revisión antes del pago.',
  },
  {
    term: 'Congelación',
    definition: 'Detiene el efecto y un humano decide el siguiente paso.',
    example: 'Ante anomalía, evita publicar un resultado dudoso.',
  },
  {
    term: 'Multifirma',
    definition: 'Varias firmas deben coincidir antes de un acto irreversible.',
    example: 'Un techo presupuestario requiere quórum de firmas.',
  },
  {
    term: 'Kernel',
    definition: 'Núcleo de gobernanza que decide qué se publica y qué se paga — con evidencia.',
    example: 'Lo que se publica pasa por evidencia y por una persona si algo no cuadra.',
  },
  {
    term: 'Ahorro',
    definition: 'Reparto del ahorro por eficiencia fiscal verificada con reglas publicadas.',
    example: 'Ahorro certificado se reparte según contrato publicado.',
  },
  {
    term: 'Propuesta',
    definition: 'Iniciativa ciudadana con hechos verificables en el pipeline.',
    example: 'Participar crea una propuesta en estado recibido.',
  },
  {
    term: 'Dictamen',
    definition: 'Evaluación del agente Soberano: CONFORME o REVISAR.',
    example: 'Tras validación, soberano emite dictamen alineado al marco.',
  },
  {
    term: 'Custodia',
    definition: 'Fondos retenidos hasta cumplir hitos del proyecto.',
    example: 'Proyecto DAO: pendiente, bloqueado o liberado.',
  },
] as const;

export default function GlosarioPage() {
  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Glosario</h1>
            <p className="os-workspace-sub">Conceptos clave en lenguaje claro.</p>
          </div>
          <div className="os-workspace-cta">
            <Link to="/ayuda" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
              Centro de ayuda
            </Link>
          </div>
        </header>

        <dl className="rounded-lg border border-zinc-200 px-4">
          {TERMS.map(({ term, definition, example }) => (
            <div key={term} className="os-glossary-row">
              <dt className="os-glossary-term">{term}</dt>
              <dd className="os-glossary-def">{definition}</dd>
              <dd className="os-glossary-example">{example}</dd>
            </div>
          ))}
        </dl>

        <footer className="os-workspace-foot flex flex-wrap gap-2">
          <Link to="/gestion" className="ds-btn-app">
            Ver gestión
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/participar" className="ds-btn-secondary ds-btn-app-shape">
            Participar
          </Link>
        </footer>
      </div>
    </PageShell>
  );
}
