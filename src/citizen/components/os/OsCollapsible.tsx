import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  hint?: string;
};

/** Sección minimizable — default colapsada salvo defaultOpen. */
export function OsCollapsible({ title, children, defaultOpen = false, hint }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="os-collapsible">
      <button
        type="button"
        className="os-collapsible-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="os-collapsible-title">{title}</span>
        {hint && !open ? <span className="os-collapsible-hint">{hint}</span> : null}
        <ChevronDown className={`os-collapsible-chevron ${open ? 'is-open' : ''}`} aria-hidden />
      </button>
      {open ? (
        <div id={panelId} className="os-collapsible-panel">
          {children}
        </div>
      ) : null}
    </section>
  );
}
