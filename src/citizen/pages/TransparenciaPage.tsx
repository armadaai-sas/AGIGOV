import { Link } from 'react-router-dom';
import { Download, ExternalLink, FileText, Scale, ShieldCheck } from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import { EGS_MODEL_PATH } from '../services/egs-vial-service.js';

const DOCS: Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  download: string;
  icon: typeof ShieldCheck;
  primary?: boolean;
}> = [
  {
    id: 'ciudadano',
    title: 'Contrato de Eficiencia Pública',
    description:
      'Versión ciudadana de 1 página — reparto 70/20/10, transparencia y protección del ejecutor.',
    href: '/docs/contrato-eficiencia-publica.md',
    download: 'Contrato-Eficiencia-Publica-AGIGOV.md',
    icon: ShieldCheck,
    primary: true,
  },
  {
    id: 'aei',
    title: 'AEI Anexo I — Piloto Vial v0.1',
    description: 'Acuerdo marco legal vinculante — Smart Escrow y Efficiency Gain Share.',
    href: '/docs/aei-piloto-vial-v0.1.md',
    download: 'AEI-Piloto-Vial-v0.1.md',
    icon: Scale,
  },
  {
    id: 'dictamen',
    title: 'Dictamen Soberano — CONFORME',
    description: 'Validación institucional del AEI con condiciones previas a firma.',
    href: '/docs/dictamen-soberano-aei-v0.1.md',
    download: 'Dictamen-Soberano-AEI-v0.1.md',
    icon: FileText,
  },
];

export default function TransparenciaPage() {
  return (
    <PageShell banner={undefined} breadcrumbs={breadcrumbsForPath('/transparencia')}>
      <SectionHeader
        eyebrow="AGIGOV · EGS · Transparencia"
        title="Transparencia institucional"
        lead="Documentos públicos del modelo EGS — marco legal, versión ciudadana y dictamen de conformidad."
        helpTopic="proyectos"
      />

      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        Demo técnica validada — promulgación pública sujeta a firma multi-sig del marco contractual.
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DOCS.map((doc) => {
          const Icon = doc.icon;
          return (
            <article
              key={doc.id}
              className={`agigov-card flex flex-col ${doc.primary ? 'border-sky-500/30' : ''}`}
            >
              <Icon className="h-6 w-6 text-sky-400" />
              <h2 className="mt-4 font-display text-lg font-semibold text-agigov-text">
                {doc.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-agigov-text-muted">{doc.description}</p>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-btn-secondary w-full"
                >
                  <ExternalLink className="h-4 w-4" />
                  Leer en línea
                </a>
                <a href={doc.href} download={doc.download} className="ui-btn-primary w-full">
                  <Download className="h-4 w-4" />
                  Descargar
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <section className="agigov-card mt-8">
        <h2 className="font-display text-lg font-semibold">Verdad operativa en vivo</h2>
        <p className="mt-2 text-sm text-agigov-text-muted">
          Los documentos describen las reglas. El panel muestra la ejecución trimestral con datos
          reconciliados por centinela.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={EGS_MODEL_PATH} className="ui-btn-primary">
            Ver servicio EGS
          </Link>
          <Link to="/contratos" className="ui-btn-secondary">
            Ver contratos
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
