import { Link } from 'react-router-dom';
import { Activity, FileText, Package } from 'lucide-react';

const links = [
  { to: '/', label: 'Gestión', icon: Activity },
  { to: '/propuestas', label: 'Propuestas', icon: FileText },
  { to: '/suministros', label: 'Suministros', icon: Package },
] as const;

export function CitizenNav() {
  return (
    <nav className="border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-tactical-cyan font-black text-black">
            A
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide">Armada Ciudadano</p>
            <p className="font-mono text-[10px] text-white/40">TRANSPARENCIA_v1</p>
          </div>
        </div>
        <div className="flex gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-white/50 hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
