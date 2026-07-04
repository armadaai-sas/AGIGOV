import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';

/** Barra superior — landing y navegación global AGIGOV. */
export function HomeHeroNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#030508]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link to="/" className="shrink-0 no-underline" aria-label="AGIGOV — Inicio">
          <AgigovLogo size="sm" showWordmark />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Navegación principal">
          <Link
            to="/modelos"
            className="hidden text-sm font-medium text-slate-400 no-underline hover:text-white sm:inline"
          >
            Modelos
          </Link>
          <Link
            to="/institucional"
            className="hidden text-sm font-medium text-slate-400 no-underline hover:text-white md:inline"
          >
            Institucional
          </Link>
          <Link
            to="/modelos"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white no-underline ring-1 ring-white/10 hover:bg-white/15"
          >
            Catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
