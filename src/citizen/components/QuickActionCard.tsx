import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function QuickActionCard({
  to,
  icon: Icon,
  title,
  description,
  badge,
  accent = false,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group agigov-card-interactive flex flex-col gap-4 ${accent ? 'ring-1 ring-amber-500/20' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="agigov-pillar-icon">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        {badge ? (
          <span className={accent ? 'agigov-badge-ven' : 'agigov-badge-global'}>{badge}</span>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-agigov-text group-hover:text-sky-100">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-agigov-text-muted">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-sky-400 group-hover:text-sky-300">
        Explorar
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function PillarCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  key?: string;
}) {
  return (
    <div className="agigov-card flex flex-col gap-3">
      <div className="agigov-pillar-icon">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-base font-semibold text-agigov-text">{title}</h3>
      <p className="text-sm leading-relaxed text-agigov-text-muted">{text}</p>
    </div>
  );
}
