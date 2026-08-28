import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { getHelpTopic } from '../content/helpTutorials.js';
import { PageShell } from '../components/PageShell.js';

export default function HelpTutorialPage() {
  const { topic: slug } = useParams<{ topic: string }>();
  const topic = slug ? getHelpTopic(slug) : undefined;

  if (!topic) {
    return <Navigate to="/ayuda" replace />;
  }

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <Link to="/ayuda" className="os-workspace-foot-link inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Centro de ayuda
        </Link>

        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <p className="os-workspace-section-title">Tutorial</p>
            <h1 className="os-workspace-title">{topic.title}</h1>
            <p className="os-workspace-sub">{topic.tagline}</p>
          </div>
        </header>

        <section className="os-panel">
          <h2 className="text-[13px] font-semibold text-zinc-900">¿De qué trata?</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{topic.whatIs}</p>
        </section>

        <section className="os-panel">
          <h2 className="text-[13px] font-semibold text-zinc-900">¿Para quién es?</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{topic.whoFor}</p>
        </section>

        <section className="os-panel">
          <h2 className="text-[13px] font-semibold text-zinc-900">Qué puedes hacer</h2>
          <ul className="mt-3 space-y-2 text-[13px] text-zinc-600">
            {topic.youCan.map((item) => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:text-zinc-400 before:content-['·']">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="os-panel">
          <h2 className="text-[13px] font-semibold text-zinc-900">Pasos recomendados</h2>
          <ol className="mt-3 space-y-4">
            {topic.steps.map(({ title, text }, i) => (
              <li key={title} className="flex gap-3">
                <span className="font-mono text-xs font-medium text-zinc-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-zinc-900">{title}</p>
                  <p className="mt-1 text-[13px] text-zinc-600">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="os-workspace-foot flex flex-wrap gap-2">
          <Link to={topic.actionRoute} className="ds-btn-app">
            {topic.actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/ayuda" className="ds-btn-secondary ds-btn-app-shape">
            Otros tutoriales
          </Link>
        </footer>
      </div>
    </PageShell>
  );
}
