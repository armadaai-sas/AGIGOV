import { Link } from 'react-router-dom';
import {
  Activity,
  FileText,
  Briefcase,
  Package,
  Users,
  Landmark,
  BookOpen,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { HELP_CATEGORIES, HELP_TOPICS, type HelpTopicSlug } from '../content/helpTutorials.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';

const TOPIC_ICONS: Record<HelpTopicSlug, LucideIcon> = {
  gestion: Activity,
  propuestas: FileText,
  proyectos: Briefcase,
  suministros: Package,
  participar: Users,
  institucional: Landmark,
  modelo: BookOpen,
};

export default function HelpCenterPage() {
  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/ayuda')}>
      <SectionHeader
        eyebrow="AGIGOV · Ayuda"
        title="Centro de ayuda"
        lead="Tutoriales claros por sección — qué es, para quién es y qué puedes hacer. Sin jerga innecesaria."
        action={
          <Link to="/aprender/glosario" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
            Glosario
          </Link>
        }
      />

      <div className="agigov-help-intro agigov-card mb-8">
        <LifeBuoy className="h-8 w-8 text-sky-400" aria-hidden />
        <div>
          <p className="font-display text-lg font-semibold text-agigov-text">¿Primera vez aquí?</p>
          <p className="agigov-lead mt-2">
            Elige la sección que te interese. Cada tutorial explica el propósito antes de llevarte a la
            plataforma. También puedes usar <kbd className="agigov-kbd">⌘K</kbd> para buscar rutas.
          </p>
        </div>
      </div>

      {HELP_CATEGORIES.map(({ id, label, description }) => {
        const topics = HELP_TOPICS.filter((t) => t.category === id);
        return (
          <section key={id} className="mb-10">
            <h2 className="agigov-help-category-title">{label}</h2>
            <p className="agigov-help-category-desc">{description}</p>
            <ul className="agigov-help-grid mt-4">
              {topics.map((topic) => {
                const Icon = TOPIC_ICONS[topic.slug];
                return (
                  <li key={topic.slug}>
                    <Link to={`/ayuda/${topic.slug}`} className="agigov-help-card">
                      <span className="agigov-help-card-icon" aria-hidden>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="agigov-help-card-title">{topic.title}</span>
                      <span className="agigov-help-card-tagline">{topic.tagline}</span>
                      <span className="agigov-help-card-cta">
                        Ver tutorial
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </PageShell>
  );
}
