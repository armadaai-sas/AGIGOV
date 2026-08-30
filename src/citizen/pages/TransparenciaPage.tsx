import { Download, ExternalLink, FileText, Scale, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { DeskIconHint } from '../components/desk/DeskIconHint.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import { PageShell } from '../components/PageShell.js';

const meta = {
  result: 'Marco legal y dictámenes publicados — reglas verificables del sistema.',
  dataHint: 'Documentos abiertos. Sin cuenta.',
};

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
    <PageShell shell narrow>
      <div className="desk-page">
        <DeskPageHeader title="Transparencia" result={meta.result} dataHint={meta.dataHint} />

        <ul className="desk-page-list desk-doc-list">
          {DOCS.map((doc) => {
            const Icon = doc.icon;
            return (
              <li key={doc.id}>
                <article className="desk-page-row desk-doc-row">
                  <div className="desk-doc-row-main">
                    <span className="desk-doc-row-icon" aria-hidden>
                      <Icon {...agigovIconProps('md', 'opacity-60')} />
                    </span>
                    <div className="desk-page-row-body">
                      <h2 className="desk-page-row-title">{doc.title}</h2>
                      <p className="desk-page-row-summary">{doc.description}</p>
                    </div>
                  </div>
                  <div className="desk-doc-actions">
                    <DeskIconHint label="Leer">
                      <a
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="desk-doc-action-btn"
                        aria-label={`Leer ${doc.title}`}
                      >
                        <ExternalLink {...agigovIconProps('md')} />
                      </a>
                    </DeskIconHint>
                    <DeskIconHint label="Descargar">
                      <a
                        href={doc.href}
                        download={doc.download}
                        className="desk-doc-action-btn"
                        aria-label={`Descargar ${doc.title}`}
                      >
                        <Download {...agigovIconProps('md')} />
                      </a>
                    </DeskIconHint>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="desk-page-secondary-link">
          <a href="/gestion">Ver telemetría publicada en gestión →</a>
        </p>
      </div>
    </PageShell>
  );
}
