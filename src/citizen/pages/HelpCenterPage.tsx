import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { HELP_CATEGORIES, HELP_TOPICS, type HelpTopicSlug } from '../content/helpTutorials.js';
import { PageShell } from '../components/PageShell.js';

const TOPIC_ICONS: Record<HelpTopicSlug, LucideIcon> = {
  gestion: BookOpen,
  propuestas: BookOpen,
  proyectos: BookOpen,
  suministros: BookOpen,
  participar: BookOpen,
  institucional: BookOpen,
  modelo: BookOpen,
};

export default function HelpCenterPage() {
  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Centro de ayuda</h1>
            <p className="os-workspace-sub">
              Tutoriales por sección — qué es, para quién y qué puedes hacer.
            </p>
          </div>
          <div className="os-workspace-cta">
            <Link to="/aprender/glosario" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
              Glosario
            </Link>
          </div>
        </header>

        <p className="text-[13px] text-zinc-600">
          Primera vez: elige una sección. El{' '}
          <Link to="/escritorio/mapa" className="underline-offset-2 hover:underline">
            mapa del sistema
          </Link>{' '}
          está aquí, no en el menú.
        </p>

        {HELP_CATEGORIES.map(({ id, label, description }) => {
          const topics = HELP_TOPICS.filter((t) => t.category === id);
          return (
            <section key={id} className="os-workspace-section">
              <h2 className="os-workspace-section-title">{label}</h2>
              <p className="text-xs text-zinc-500">{description}</p>
              <ul className="os-workspace-list mt-2">
                {topics.map((topic) => {
                  const Icon = TOPIC_ICONS[topic.slug];
                  return (
                    <li key={topic.slug}>
                      <Link to={`/ayuda/${topic.slug}`} className="os-workspace-row">
                        <span className="os-workspace-row-icon" aria-hidden>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="os-workspace-row-body">
                          <span className="os-workspace-row-name">{topic.title}</span>
                          <span className="os-workspace-row-meta">{topic.tagline}</span>
                        </span>
                        <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
