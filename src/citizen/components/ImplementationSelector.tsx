import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';

import { usePlatform } from '../context/PlatformContext.js';
import { IMPLEMENTATIONS, type ImplementationId } from '../platform/implementations.js';

/** Selector de implementación / jurisdicción — sin badge VEN en logo (Fase F3). */
export function ImplementationSelector({ compact = false }: { compact?: boolean }) {
  const { implementation, implementationId, setImplementationId } = usePlatform();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  function select(id: ImplementationId) {
    setImplementationId(id);
    setOpen(false);
  }

  return (
    <div className="agigov-impl-select" ref={ref}>
      <button
        type="button"
        className="agigov-impl-select-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
        {!compact ? (
          <span className="agigov-impl-select-label">
            {implementation.label}
            <span className="agigov-impl-select-territory">{implementation.territory}</span>
          </span>
        ) : (
          <span className="agigov-impl-select-territory">{implementation.territory}</span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="agigov-impl-select-menu" role="listbox" aria-label="Implementación">
          {IMPLEMENTATIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === implementationId}
              className={`agigov-impl-select-item ${item.id === implementationId ? 'agigov-impl-select-item--active' : ''}`}
              onClick={() => select(item.id)}
            >
              <span className="agigov-impl-select-item-title">{item.label}</span>
              <span className="agigov-impl-select-item-meta">{item.territory}</span>
              <span className="agigov-impl-select-item-desc">{item.description}</span>
            </button>
          ))}
          <Link
            to={implementation.institutionalPath}
            className="agigov-impl-select-foot"
            onClick={() => setOpen(false)}
          >
            Ver documentación
          </Link>
        </div>
      ) : null}
    </div>
  );
}
