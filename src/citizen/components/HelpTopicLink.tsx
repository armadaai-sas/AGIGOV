import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

import type { HelpTopicSlug } from '../content/helpTutorials.js';

/** Enlace contextual al tutorial de la sección. */
export function HelpTopicLink({ topic, className = '' }: { topic: HelpTopicSlug; className?: string }) {
  return (
    <Link to={`/ayuda/${topic}`} className={`agigov-help-topic-link ${className}`}>
      <HelpCircle className="h-4 w-4" aria-hidden />
      ¿Qué es esto?
    </Link>
  );
}
