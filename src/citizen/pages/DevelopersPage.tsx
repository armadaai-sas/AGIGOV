import { Link } from 'react-router-dom';
import { ArrowRight, Code2, ExternalLink, Shield, Wallet, Vote } from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';

const ENDPOINTS = [
  { method: 'GET', path: '/api/public/health', desc: 'Salud plataforma + panicMode' },
  { method: 'GET', path: '/api/public/dashboard', desc: 'Telemetría gestión publicada' },
  { method: 'GET', path: '/api/public/projects', desc: 'Listado proyectos DAO' },
  { method: 'GET', path: '/api/public/projects/:id', desc: 'Detalle + aportes recientes' },
  { method: 'POST', path: '/api/public/proposals', desc: 'Propuesta ciudadana (sin PII)' },
  { method: 'POST', path: '/api/public/contributions', desc: 'Aporte ciudadano simulado (demo)' },
  { method: 'POST', path: '/api/public/reports/irregularity', desc: 'Reporte centinela ciudadano' },
  { method: 'GET', path: '/api/public/cne/consultation', desc: 'Consulta ciudadana verificable (demo)' },
  { method: 'POST', path: '/api/public/cne/vote', desc: 'Voto agregado consulta demo' },
  { method: 'POST', path: '/api/public/payments/webhook', desc: 'Webhook pasarela demo (stub)' },
  { method: 'GET', path: '/api/public/pilot', desc: 'Estado multi-sig del despliegue demo' },
  { method: 'GET', path: '/api/public/openapi.json', desc: 'OpenAPI stub' },
] as const;

export default function DevelopersPage() {
  const apiBase = import.meta.env.VITE_PUBLIC_API_URL ?? '(proxy /api en dev)';

  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/desarrolladores')}>
      <SectionHeader
        eyebrow="AGIGOV · Desarrolladores"
        title="Portal para integradores"
        lead="Integra la API pública, IAP entre agentes y health checks — sin leer todo el monorepo."
      />

      <section className="agigov-card mb-6 border-sky-500/20 bg-sky-950/10">
        <div className="flex gap-3">
          <Code2 className="h-8 w-8 shrink-0 text-sky-400" aria-hidden />
          <div>
            <h2 className="font-display text-lg font-semibold">Inicio rápido</h2>
            <pre className="agigov-dev-code mt-3">{`# Terminal 1
npm run api:public

# Terminal 2
npm run dev

# Health
curl -s http://127.0.0.1:3001/api/public/health | jq .`}</pre>
            <p className="agigov-lead mt-3">
              Base URL demo: <code className="text-sky-300">{apiBase || 'http://127.0.0.1:3001'}</code>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="agigov-help-category-title">Endpoints públicos</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="agigov-dev-table">
            <thead>
              <tr>
                <th>Método</th>
                <th>Ruta</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map(({ method, path, desc }) => (
                <tr key={path}>
                  <td>
                    <span className={`agigov-dev-method agigov-dev-method--${method.toLowerCase()}`}>
                      {method}
                    </span>
                  </td>
                  <td>
                    <code>{path}</code>
                  </td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a
          href="/api/public/openapi.json"
          target="_blank"
          rel="noopener noreferrer"
          className="ds-btn-secondary ds-btn-app-shape mt-4 inline-flex"
        >
          OpenAPI stub
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="agigov-card">
          <Wallet className="h-6 w-6 text-amber-300" aria-hidden />
          <h2 className="mt-3 font-display text-lg font-semibold">Pasarela VES (Paso 7)</h2>
          <p className="agigov-lead mt-2">
            Webhook stub <code>POST /api/public/payments/webhook</code> — convierte pago{' '}
            <code>paid</code> en aporte ledger. 👤 Requiere proveedor real + HMAC en producción.
          </p>
          <pre className="agigov-dev-code mt-3 text-xs">{`{
  "externalRef": "pay-001",
  "projectId": "proj-dao-agua-zulia",
  "amount": 250,
  "status": "paid"
}`}</pre>
        </section>

        <section className="agigov-card">
          <Vote className="h-6 w-6 text-sky-300" aria-hidden />
          <h2 className="mt-3 font-display text-lg font-semibold">Token gobernanza (Paso 8)</h2>
          <p className="agigov-lead mt-2">
            Testnet no desplegada en este entorno. 👤 Requiere acta soberano CONFORME + asesoría legal
            antes de mainnet. Ver <code>docs/AGIGOV/ECONOMIA-DAO.md</code>.
          </p>
        </section>

        <section className="agigov-card md:col-span-2">
          <Shield className="h-6 w-6 text-emerald-400" aria-hidden />
          <h2 className="mt-3 font-display text-lg font-semibold">IAP y agentes</h2>
          <p className="agigov-lead mt-2">
            Envelopes firmados Ed25519 entre centinela, soberano, conciliador y comunicador. Código en{' '}
            <code>src/protocol/</code> · guía en repo <code>AGENTS.md</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/institucional#protocolo" className="ds-btn-secondary ds-btn-app-shape">
              Protocolo institucional
            </Link>
            <Link to="/ayuda" className="ds-btn-secondary ds-btn-app-shape">
              Centro de ayuda
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
