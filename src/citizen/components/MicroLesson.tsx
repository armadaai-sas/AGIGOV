import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

/** Micro-lección inline accesible (Fase E2). */
export function MicroLesson({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <span className="agigov-micro-lesson">
      <button
        type="button"
        className="agigov-micro-lesson-trigger"
        aria-label={`Qué es ${term}`}
        title={typeof children === 'string' ? children : term}
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span className="agigov-micro-lesson-panel" role="tooltip">
        <strong className="agigov-micro-lesson-term">{term}</strong>
        <span className="agigov-micro-lesson-body">{children}</span>
      </span>
    </span>
  );
}
