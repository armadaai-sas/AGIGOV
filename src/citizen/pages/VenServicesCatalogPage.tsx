import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { ServiceConnectionPanel } from '../components/services/ServiceConnectionPanel.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import {
  EGS_VIAL_CONSOLE_PATH,
  EGS_VIAL_PRODUCT_PATH,
} from '../services/egs-vial-service.js';

const SERVICES = [
  {
    id: 'egs-vial',
    name: 'EGS Piloto Vial MPPI',
    description: 'Cierre trimestral · Smart Escrow · Efficiency Gain Share 70/20/10',
    status: 'Disponible',
    productPath: EGS_VIAL_PRODUCT_PATH,
    consolePath: EGS_VIAL_CONSOLE_PATH,
    primary: true,
  },
  {
    id: 'dao',
    name: 'Proyectos DAO',
    description: 'Escrow ciudadano · aportes programáticos',
    status: 'Beta',
    productPath: '/proyectos?tab=dao',
    consolePath: '/proyectos?tab=dao',
    primary: false,
  },
  {
    id: 'ledger',
    name: 'Gestión pública',
    description: 'Telemetría ledger · reportes publicados',
    status: 'Disponible',
    productPath: '/gestion',
    consolePath: '/gestion',
    primary: false,
  },
] as const;

export default function VenServicesCatalogPage() {
  return (
    <PageShell banner={undefined} breadcrumbs={breadcrumbsForPath('/ven/servicios')}>
      <SectionHeader
        eyebrow="AGIGOV / VEN"
        title="Catálogo de servicios"
        lead="Elija un servicio, verifique la conexión del nodo y abra la consola operativa."
      />

      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((svc) => (
          <article
            key={svc.id}
            className={`agigov-card flex flex-col ${svc.primary ? 'border-sky-500/30' : ''}`}
          >
            <Package className="h-6 w-6 text-sky-400" />
            <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
              {svc.status}
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold">{svc.name}</h2>
            <p className="mt-2 flex-1 text-sm text-agigov-text-muted">{svc.description}</p>
            <div className="mt-6 flex flex-col gap-2">
              <Link to={svc.productPath} className="ui-btn-secondary w-full">
                Ver servicio
              </Link>
              <Link to={svc.consolePath} className="ui-btn-primary w-full">
                Abrir consola
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <SectionHeader
        eyebrow="Nodo territorial"
        title="Conexión del piloto EGS"
        lead="Estado en tiempo real del backend público."
      />
      <ServiceConnectionPanel />
    </PageShell>
  );
}
