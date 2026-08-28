import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

export function QuickActionCard({
  to,
  icon: Icon,
  title,
  description,
  badge,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  accent?: boolean;
}) {
  return (
    <Link to={to} className="os-workspace-row">
      <span className="os-workspace-row-icon" aria-hidden>
        <Icon className="h-4 w-4" />
      </span>
      <span className="os-workspace-row-body">
        <span className="os-workspace-row-name">{title}</span>
        <span className="os-workspace-row-meta">{description}</span>
      </span>
      {badge ? <span className="os-workspace-row-status">{badge}</span> : null}
      <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
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
    <div className="os-panel">
      <div className="flex items-start gap-3">
        <span className="os-workspace-row-icon shrink-0" aria-hidden>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-900">{title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{text}</p>
        </div>
      </div>
    </div>
  );
}
