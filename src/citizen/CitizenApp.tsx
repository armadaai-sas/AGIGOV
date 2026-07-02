import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { CitizenNav } from './components/CitizenNav.js';

const DashboardPage = lazy(() => import('./pages/DashboardPage.js'));
const ProposalsPage = lazy(() => import('./pages/ProposalsPage.js'));
const SupplyPage = lazy(() => import('./pages/SupplyPage.js'));
const LandingPage = lazy(() => import('../landing/LandingPage.js'));

function PageFallback() {
  return (
    <p className="px-4 py-16 text-center font-mono text-sm text-white/40">
      Cargando módulo…
    </p>
  );
}

export default function CitizenApp() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <CitizenNav />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/propuestas" element={<ProposalsPage />} />
          <Route path="/suministros" element={<SupplyPage />} />
          <Route path="/institucional" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
