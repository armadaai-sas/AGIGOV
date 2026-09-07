import { Link } from 'react-router-dom';
import { Copy, ExternalLink } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';

const CORE_ENDPOINTS = [
  { method: 'GET', path: '/api/public/health', desc: 'Salud de plataforma' },
  { method: 'GET', path: '/api/public/dashboard', desc: 'Telemetría de gestión' },
  { method: 'GET', path: '/api/public/projects', desc: 'Proyectos DAO' },
  { method: 'POST', path: '/api/public/proposals', desc: 'Propuesta ciudadana' },
  { method: 'GET', path: '/api/public/openapi.json', desc: 'Especificación OpenAPI (stub)' },
] as const;

const EXTRA_ENDPOINTS = [
  { method: 'POST', path: '/api/public/contributions', desc: 'Aporte a proyecto DAO' },
  { method: 'GET', path: '/api/public/cne/consultation', desc: 'Consulta ciudadana' },
  { method: 'POST', path: '/api/public/payments/webhook', desc: 'Aviso HTTP firmado (stub)' },
  { method: 'GET', path: '/api/public/pilot', desc: 'Estado de despliegue' },
] as const;

const PROCESS_DOCS = [
  { path: 'docs/process/README.md', label: 'Índice de procesos' },
  { path: 'docs/process/02-DEVELOPER-PROCESS.md', label: 'Contribución y PR' },
  { path: 'docs/process/03-MODEL-LIFECYCLE.md', label: 'Publicar un modelo' },
  { path: 'docs/process/07-INTEGRATOR-GUIDE.md', label: 'Guía integradores' },
] as const;

const QUICK_START = `curl -s http://127.0.0.1:3001/api/public/health | jq .`;

function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="os-endpoint-row">
      <span className={`os-endpoint-method os-endpoint-method--${method.toLowerCase()}`}>
        {method}
      </span>
      <code className="os-endpoint-path">{path}</code>
      <span className="os-endpoint-desc">{desc}</span>
    </div>
  );
}

export default function DevelopersPage() {
  const apiBase = import.meta.env.VITE_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Desarrolladores</h1>
            <p className="os-workspace-sub">
              API pública mínima. Verifica health en vivo antes de integrar.
            </p>
          </div>
        </header>

        <section className="os-workspace-section">
          <h2 className="os-workspace-section-title">Inicio rápido</h2>
          <pre className="os-dev-code">{QUICK_START}</pre>
          <p className="mt-2 text-xs text-zinc-500">
            Base: <code className="os-mono-id">{apiBase}</code>
          </p>
          <button
            type="button"
            className="os-btn-ghost mt-2 inline-flex items-center gap-1 text-xs"
            onClick={() => void navigator.clipboard?.writeText(QUICK_START)}
          >
            <Copy className="h-3.5 w-3.5" />
            Copiar curl
          </button>
        </section>

        <section className="os-workspace-section">
          <h2 className="os-workspace-section-title">Endpoints core</h2>
          <div className="os-endpoint-list">
            {CORE_ENDPOINTS.map((e) => (
              <EndpointRow key={e.path} {...e} />
            ))}
          </div>
          <a
            href="/api/public/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="os-btn-text mt-3 inline-flex items-center gap-1"
          >
            OpenAPI
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        <section className="os-workspace-section">
          <h2 className="os-workspace-section-title">Endpoints adicionales</h2>
          <div className="os-endpoint-list">
            {EXTRA_ENDPOINTS.map((e) => (
              <EndpointRow key={e.path} {...e} />
            ))}
          </div>
        </section>

        <section className="os-workspace-section os-workspace-section--border">
          <h2 className="os-workspace-section-title">Procesos estándar (repo)</h2>
          <ul className="os-workspace-list mt-2">
            {PROCESS_DOCS.map(({ path, label }) => (
              <li key={path}>
                <div className="os-workspace-row os-workspace-row--static">
                  <span className="os-workspace-row-body">
                    <span className="os-workspace-row-name">{label}</span>
                    <span className="os-workspace-row-meta os-mono-id">{path}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-zinc-600">
            Envelopes Ed25519 entre agentes —{' '}
            <Link to="/ayuda/institucional" className="os-btn-text">
              protocolo IAP
            </Link>
            .
          </p>
        </section>
      </div>
    </PageShell>
  );
}
