import { Link } from 'react-router-dom';
import { Download, ExternalLink, ChevronRight, FileText, Scale, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

const DOCS: Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  download: string;
  icon: LucideIcon;
}> = [
  {
    id: 'ciudadano',
    title: 'Contrato de Eficiencia Pública',
    description: 'Versión ciudadana — reparto 70/20/10 y transparencia.',
    href: '/docs/contrato-eficiencia-publica.md',
    download: 'Contrato-Eficiencia-Publica-AGIGOV.md',
    icon: ShieldCheck,
  },
  {
    id: 'aei',
    title: 'AEI Anexo I — Piloto Vial v0.1',
    description: 'Acuerdo marco legal — escrow y reparto del ahorro.',
    href: '/docs/aei-piloto-vial-v0.1.md',
    download: 'AEI-Piloto-Vial-v0.1.md',
    icon: Scale,
  },
  {
    id: 'dictamen',
    title: 'Dictamen Soberano — CONFORME',
    description: 'Validación institucional del AEI.',
    href: '/docs/dictamen-soberano-aei-v0.1.md',
    download: 'Dictamen-Soberano-AEI-v0.1.md',
    icon: FileText,
  },
];

export default function TransparenciaPage() {
  return (
    <PageShell shell>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Transparencia</h1>
            <p className="os-workspace-sub">Documentos públicos — marco legal y dictamen.</p>
          </div>
        </header>

        <ul className="os-workspace-list">
          {DOCS.map((doc) => {
            const Icon = doc.icon;
            return (
              <li key={doc.id}>
                <div className="os-workspace-row os-workspace-row--static flex-col items-stretch gap-3 py-3 sm:flex-row sm:items-center">
                  <span className="os-workspace-row-icon shrink-0" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="os-workspace-row-body">
                    <span className="os-workspace-row-name">{doc.title}</span>
                    <span className="os-workspace-row-meta">{doc.description}</span>
                  </span>
                  <span className="flex shrink-0 flex-wrap gap-2">
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ds-btn-secondary ds-btn-app-shape"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Leer
                    </a>
                    <a href={doc.href} download={doc.download} className="ds-btn-app">
                      <Download className="h-3.5 w-3.5" />
                      Descargar
                    </a>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <section className="os-workspace-section os-workspace-section--border">
          <h2 className="os-workspace-section-title">Operación</h2>
          <p className="text-[13px] text-zinc-600">
            Los documentos describen las reglas. El panel muestra ejecución trimestral reconciliada.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to={modelWorkspacePath('egs')} className="ds-btn-app">
              Espacio EGS
            </Link>
            <Link to="/contratos" className="ds-btn-secondary ds-btn-app-shape">
              Contratos
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
