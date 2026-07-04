import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { PlatformProvider } from './context/PlatformContext.js';
import { PanicBanner } from './components/PanicBanner.js';
import { CommandPalette } from './components/CommandPalette.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { LoadingState } from './components/PageShell.js';
import { ScrollToTop, PageTransition } from './components/ScrollToTop.js';
import { AppShellLayout } from './components/AppShellLayout.js';
import { LegacyVenRouteRedirect } from './components/LegacyVenRouteRedirect.js';
import { usesAppShell } from './platform/navConfig.js';
import HomePage from './pages/HomePage.js';
const DashboardPage = lazy(() => import('./pages/DashboardPage.js'));
const ProposalsPage = lazy(() => import('./pages/ProposalsPage.js'));
const SupplyPage = lazy(() => import('./pages/SupplyPage.js'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.js'));
const ParticiparPage = lazy(() => import('./pages/ParticiparPage.js'));
const InstitutionalPage = lazy(() => import('./pages/InstitutionalPage.js'));
const GlosarioPage = lazy(() => import('./pages/GlosarioPage.js'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage.js'));
const HelpTutorialPage = lazy(() => import('./pages/HelpTutorialPage.js'));
const DevelopersPage = lazy(() => import('./pages/DevelopersPage.js'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.js'));
const EgsContractDetailPage = lazy(() => import('./pages/EgsContractDetailPage.js'));
const ContratosPage = lazy(() => import('./pages/ContratosPage.js'));
const TransparenciaPage = lazy(() => import('./pages/TransparenciaPage.js'));
const ModelsCatalogPage = lazy(() => import('./pages/ModelsCatalogPage.js'));
const ModelDetailPage = lazy(() => import('./pages/ModelDetailPage.js'));
const EgsVialConsolePage = lazy(() => import('./pages/EgsVialConsolePage.js'));
const CnePage = lazy(() => import('./pages/CnePage.js'));

function AppRoutes() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const withShell = usesAppShell(pathname);

  const routes = (
    <Suspense
      fallback={
        <div className={withShell ? 'app-shell-content' : 'agigov-shell-narrow agigov-page-transition'}>
          <LoadingState label="Cargando página…" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gestion" element={<DashboardPage />} />
        <Route path="/propuestas" element={<ProposalsPage />} />
        <Route path="/suministros" element={<SupplyPage />} />
        <Route path="/modelos" element={<ModelsCatalogPage />} />
        <Route path="/modelos/:modelId" element={<ModelDetailPage />} />
        <Route path="/modelos/egs/consola" element={<EgsVialConsolePage />} />
        <Route path="/ven/servicios/*" element={<LegacyVenRouteRedirect />} />
        <Route path="/proyectos" element={<ProjectsPage />} />
        <Route path="/proyectos/contrato/:escrowProcessId" element={<EgsContractDetailPage />} />
        <Route path="/proyectos/:id" element={<ProjectDetailPage />} />
        <Route path="/contratos" element={<ContratosPage />} />
        <Route path="/transparencia" element={<TransparenciaPage />} />
        <Route path="/dashboard" element={<Navigate to="/modelos/egs/consola" replace />} />
        <Route path="/proyectos/salud" element={<Navigate to="/modelos/egs/consola" replace />} />
        <Route path="/desarrolladores" element={<DevelopersPage />} />
        <Route path="/cne" element={<CnePage />} />
        <Route path="/participar" element={<ParticiparPage />} />
        <Route path="/institucional" element={<InstitutionalPage />} />
        <Route path="/aprender/glosario" element={<GlosarioPage />} />
        <Route path="/ayuda" element={<HelpCenterPage />} />
        <Route path="/ayuda/:topic" element={<HelpTutorialPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );

  if (isHome) {
    return routes;
  }

  if (withShell) {
    return <AppShellLayout>{routes}</AppShellLayout>;
  }

  return routes;
}

export default function CitizenApp() {
  return (
    <PlatformProvider>
      <CitizenAppInner />
    </PlatformProvider>
  );
}

function CitizenAppInner() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-agigov-text">
      <PanicBanner />
      <ScrollToTop />
      <PageTransition>
        <AppRoutes />
      </PageTransition>
      <CommandPalette />
      <OnboardingModal />
    </div>
  );
}
