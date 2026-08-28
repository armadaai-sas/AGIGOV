import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { PlatformProvider } from './context/PlatformContext.js';
import { PanicBanner } from './components/PanicBanner.js';
import { CommandPalette } from './components/CommandPalette.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { ConciergeDock } from './components/os/ConciergeDock.js';
import { OsToastProvider } from './components/os/OsToast.js';
import { RouteLoadingFallback } from './components/RouteLoadingFallback.js';
import { ScrollToTop, PageTransition } from './components/ScrollToTop.js';
import { AppShellLayout } from './components/AppShellLayout.js';
import { LegacyVenRouteRedirect } from './components/LegacyVenRouteRedirect.js';
import { usesAppShell, usesConciergeDock } from './platform/navConfig.js';
import { prefetchWarmRoutes } from './platform/routePrefetch.js';
/** Home eager: landing sin chunk extra. */
import HomePage from './pages/HomePage.js';
/** Rutas OS frecuentes — eager para evitar flash al navegar. */
import EscritorioPage from './pages/EscritorioPage.js';
import ModelsCatalogPage from './pages/ModelsCatalogPage.js';
import DesktopDownloadPage from './pages/DesktopDownloadPage.js';
import ModelWorkspacePage from './pages/ModelWorkspacePage.js';
import EgsVialConsolePage from './pages/EgsVialConsolePage.js';
import ContratosPage from './pages/ContratosPage.js';
import DashboardPage from './pages/DashboardPage.js';
import ModelDetailPage from './pages/ModelDetailPage.js';

const ProposalsPage = lazy(() => import('./pages/ProposalsPage.js'));
const SupplyPage = lazy(() => import('./pages/SupplyPage.js'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.js'));
const ParticiparPage = lazy(() => import('./pages/ParticiparPage.js'));
const InstitutionalPage = lazy(() => import('./pages/InstitutionalPage.js'));
const InstitutionPilotPage = lazy(() => import('./pages/InstitutionPilotPage.js'));
const InstitutionRegisterPage = lazy(() => import('./pages/InstitutionRegisterPage.js'));
const InstitutionAccessPage = lazy(() => import('./pages/InstitutionAccessPage.js'));
const GlosarioPage = lazy(() => import('./pages/GlosarioPage.js'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage.js'));
const HelpTutorialPage = lazy(() => import('./pages/HelpTutorialPage.js'));
const DevelopersPage = lazy(() => import('./pages/DevelopersPage.js'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.js'));
const EgsContractDetailPage = lazy(() => import('./pages/EgsContractDetailPage.js'));
const TransparenciaPage = lazy(() => import('./pages/TransparenciaPage.js'));
const IaauConsolePage = lazy(() => import('./pages/IaauConsolePage.js'));
const DataTrustConsolePage = lazy(() => import('./pages/DataTrustConsolePage.js'));
const EvidenciaConsolePage = lazy(() => import('./pages/EvidenciaConsolePage.js'));
const SetConsolePage = lazy(() => import('./pages/SetConsolePage.js'));
const CnePage = lazy(() => import('./pages/CnePage.js'));

function RouteSuspenseFallback() {
  const { pathname } = useLocation();
  const withShell = usesAppShell(pathname) && pathname !== '/';
  return <RouteLoadingFallback shell={withShell} />;
}

function AppRoutes() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const withShell = usesAppShell(pathname);

  const routes = (
    <Suspense fallback={<RouteSuspenseFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/escritorio" element={<EscritorioPage />} />
        <Route path="/descargar" element={<DesktopDownloadPage />} />
        <Route path="/gestion" element={<DashboardPage />} />
        <Route path="/propuestas" element={<ProposalsPage />} />
        <Route path="/suministros" element={<SupplyPage />} />
        <Route path="/modelos" element={<ModelsCatalogPage />} />
        <Route path="/modelos/egs/consola" element={<EgsVialConsolePage />} />
        <Route path="/modelos/iaau/consola" element={<IaauConsolePage />} />
        <Route path="/modelos/data-trust/consola" element={<DataTrustConsolePage />} />
        <Route path="/modelos/evidencia-certificada/consola" element={<EvidenciaConsolePage />} />
        <Route path="/modelos/set/consola" element={<SetConsolePage />} />
        <Route path="/modelos/:modelId/espacio" element={<ModelWorkspacePage />} />
        <Route path="/modelos/:modelId" element={<ModelDetailPage />} />
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
        <Route path="/institucional/registro" element={<InstitutionRegisterPage />} />
        <Route path="/institucional/acceso" element={<InstitutionAccessPage />} />
        <Route path="/institucional/piloto" element={<InstitutionPilotPage />} />
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
  const { pathname } = useLocation();

  useEffect(() => {
    prefetchWarmRoutes();
  }, []);

  return (
    <OsToastProvider>
      <div className="min-h-screen bg-white text-zinc-900">
        <PanicBanner />
        <ScrollToTop />
        <PageTransition>
          <AppRoutes />
        </PageTransition>
        <CommandPalette />
        <OnboardingModal />
        {usesConciergeDock(pathname) ? <ConciergeDock /> : null}
      </div>
    </OsToastProvider>
  );
}
