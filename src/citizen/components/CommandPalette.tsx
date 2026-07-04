import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

import { filterPaletteItems, type PaletteItem } from '../platform/paletteItems.js';

const OPEN_EVENT = 'agigov-open-palette';

/** Command palette global ⌘K / Ctrl+K (Fase F2). */
export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => filterPaletteItems(query), [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    function onOpenEvent() {
      setOpen(true);
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(item: PaletteItem) {
    setOpen(false);
    navigate(item.to);
  }

  function onInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && items[activeIndex]) {
      e.preventDefault();
      go(items[activeIndex]);
    }
  }

  if (!open) return null;

  const grouped = items.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div className="agigov-palette" role="dialog" aria-modal="true" aria-label="Buscar rutas y guías">
      <button type="button" className="agigov-palette-backdrop" aria-label="Cerrar" onClick={() => setOpen(false)} />
      <div className="agigov-palette-panel">
        <div className="agigov-palette-search">
          <Search className="h-4 w-4 shrink-0 text-agigov-text-muted" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Buscar rutas, guías, secciones…"
            className="agigov-palette-input"
            aria-label="Buscar"
          />
          <button type="button" className="agigov-palette-close" onClick={() => setOpen(false)} aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="agigov-palette-results" role="listbox">
          {items.length === 0 ? (
            <p className="agigov-palette-empty">Sin resultados para «{query}»</p>
          ) : (
            Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group} className="agigov-palette-group">
                <p className="agigov-palette-group-label">{group}</p>
                <ul>
                  {(groupItems as PaletteItem[]).map((item) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={idx === activeIndex}
                          className={`agigov-palette-item ${idx === activeIndex ? 'agigov-palette-item--active' : ''}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => go(item)}
                        >
                          <span>{item.label}</span>
                          <span className="agigov-palette-item-path">{item.to}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <p className="agigov-palette-foot">
          <kbd className="agigov-kbd">↑↓</kbd> navegar · <kbd className="agigov-kbd">Enter</kbd> abrir ·{' '}
          <kbd className="agigov-kbd">Esc</kbd> cerrar
        </p>
      </div>
    </div>
  );
}

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Botón en header para abrir el palette (Fase F2). */
export function CommandPaletteButton() {
  return (
    <button
      type="button"
      className="agigov-palette-trigger hidden md:inline-flex"
      onClick={openCommandPalette}
      aria-label="Buscar rutas y guías (⌘K)"
    >
      <Search className="h-4 w-4" aria-hidden />
      <span>Buscar</span>
      <kbd className="agigov-kbd">⌘K</kbd>
    </button>
  );
}
