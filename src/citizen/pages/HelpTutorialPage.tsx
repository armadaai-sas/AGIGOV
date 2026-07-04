import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { getHelpTopic } from '../content/helpTutorials.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';

export default function HelpTutorialPage() {
  const { topic: slug } = useParams<{ topic: string }>();
  const topic = slug ? getHelpTopic(slug) : undefined;

  if (!topic) {
    return <Navigate to="/ayuda" replace />;
  }

  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath(`/ayuda/${topic.slug}`)}>
      <Link to="/ayuda" className="agigov-help-back">
        <ArrowLeft className="h-4 w-4" />
        Centro de ayuda
      </Link>

      <SectionHeader
        eyebrow="Tutorial"
        title={topic.title}
        lead={topic.tagline}
      />

      <div className="space-y-6">
        <section className="agigov-card">
          <h2 className="font-display text-lg font-semibold text-agigov-text">¿De qué trata?</h2>
          <p className="agigov-lead mt-3">{topic.whatIs}</p>
        </section>

        <section className="agigov-card">
          <h2 className="font-display text-lg font-semibold text-agigov-text">¿Para quién es?</h2>
          <p className="agigov-lead mt-3">{topic.whoFor}</p>
        </section>

        <section className="agigov-card">
          <h2 className="font-display text-lg font-semibold text-agigov-text">Qué puedes hacer</h2>
          <ul className="agigov-help-list mt-4">
            {topic.youCan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="agigov-card">
          <h2 className="font-display text-lg font-semibold text-agigov-text">Pasos recomendados</h2>
          <ol className="agigov-help-steps mt-4">
            {topic.steps.map(({ title, text }, i) => (
              <li key={title}>
                <span className="agigov-help-step-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-medium text-agigov-text">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-agigov-text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link to={topic.actionRoute} className="ds-btn-app">
            {topic.actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/ayuda" className="ds-btn-secondary ds-btn-app-shape">
            Ver otros tutoriales
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
