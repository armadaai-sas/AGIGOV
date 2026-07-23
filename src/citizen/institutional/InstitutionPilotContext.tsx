import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  fetchTenantOnboarding,
  type TenantOnboardingStatus,
} from '../api.js';
import {
  computeSuggestedStep,
  hydratePilotSessionFromServer,
} from './hydratePilotSession.js';
import {
  EMPTY_PILOT_SESSION,
  loadPilotSession,
  savePilotSession,
  type PilotSession,
} from './institutionPilotSession.js';

export const PILOT_WIZARD_STEPS = [
  'profile',
  'model',
  'baseline',
  'ingest',
  'reconcile',
  'close',
  'dashboard',
] as const;

export type PilotWizardStepId = (typeof PILOT_WIZARD_STEPS)[number];

type Ctx = {
  session: PilotSession;
  activeStep: number;
  onboarding: TenantOnboardingStatus | null;
  hydrating: boolean;
  setActiveStep: (n: number) => void;
  goNext: () => void;
  goBack: () => void;
  updateSession: (patch: Partial<PilotSession>) => void;
  refreshOnboarding: () => Promise<void>;
  hydrateSession: () => Promise<void>;
  canAdvanceFromStep: (step: number) => boolean;
  isStepComplete: (step: number) => boolean;
  suggestedStep: number;
};

const InstitutionPilotContext = createContext<Ctx | null>(null);

export function isPilotStepComplete(
  step: number,
  session: PilotSession,
  onboarding: TenantOnboardingStatus | null,
): boolean {
  switch (step) {
    case 0:
      return Boolean(session.slug && session.ingestToken);
    case 1:
      return session.modelId === 'egs';
    case 2:
      return onboarding?.onboardingStatus === 'ingest_ready';
    case 3:
      return session.ingestAccepted > 0;
    case 4:
      return session.reconcileOk === true;
    case 5:
      return session.published;
    case 6:
      return session.published;
    default:
      return false;
  }
}

export function InstitutionPilotProvider({ children }: { children: ReactNode }) {
  const initialSession = loadPilotSession();
  const [session, setSession] = useState<PilotSession>(initialSession);
  const [activeStep, setActiveStep] = useState(() => {
    if (!initialSession.slug) return 0;
    return Math.min(
      Math.max(0, initialSession.maxStepReached),
      PILOT_WIZARD_STEPS.length - 1,
    );
  });
  const [onboarding, setOnboarding] = useState<TenantOnboardingStatus | null>(null);
  const [hydrating, setHydrating] = useState(false);

  const updateSession = useCallback((patch: Partial<PilotSession>) => {
    setSession((prev) => {
      const next = { ...prev, ...patch };
      savePilotSession(next);
      return next;
    });
  }, []);

  const refreshOnboarding = useCallback(async () => {
    if (!session.slug) {
      setOnboarding(null);
      return;
    }
    try {
      const status = await fetchTenantOnboarding(session.slug);
      setOnboarding(status);
    } catch {
      setOnboarding(null);
    }
  }, [session.slug]);

  const hydrateSession = useCallback(async () => {
    if (!session.slug) return;
    setHydrating(true);
    try {
      const patch = await hydratePilotSessionFromServer(session);
      if (Object.keys(patch).length > 0) {
        updateSession(patch);
        if (patch.maxStepReached !== undefined && patch.maxStepReached > activeStep) {
          setActiveStep(patch.maxStepReached);
        }
      }
      await refreshOnboarding();
    } finally {
      setHydrating(false);
    }
  }, [session, activeStep, updateSession, refreshOnboarding]);

  useEffect(() => {
    if (!session.slug && activeStep > 0) {
      setActiveStep(0);
    }
  }, [session.slug, activeStep]);

  useEffect(() => {
    void refreshOnboarding();
  }, [refreshOnboarding]);

  useEffect(() => {
    if (!session.slug) return;
    void hydrateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar / cambiar slug
  }, [session.slug]);

  const suggestedStep = useMemo(
    () => computeSuggestedStep(session, onboarding?.onboardingStatus),
    [session, onboarding?.onboardingStatus],
  );

  useEffect(() => {
    if (suggestedStep > session.maxStepReached) {
      updateSession({ maxStepReached: suggestedStep });
      setActiveStep((prev) => Math.max(prev, suggestedStep));
    }
  }, [suggestedStep, session.maxStepReached, updateSession]);

  const canAdvanceFromStep = useCallback(
    (step: number): boolean => isPilotStepComplete(step, session, onboarding),
    [session, onboarding],
  );

  const isStepComplete = useCallback(
    (step: number): boolean => isPilotStepComplete(step, session, onboarding),
    [session, onboarding],
  );

  const goNext = useCallback(() => {
    setActiveStep((s) => {
      const next = Math.min(s + 1, PILOT_WIZARD_STEPS.length - 1);
      setSession((prev) => {
        const updated = { ...prev, maxStepReached: Math.max(prev.maxStepReached, next) };
        savePilotSession(updated);
        return updated;
      });
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    setActiveStep((s) => Math.max(0, s - 1));
  }, []);

  const value = useMemo(
    () => ({
      session,
      activeStep,
      onboarding,
      hydrating,
      setActiveStep,
      goNext,
      goBack,
      updateSession,
      refreshOnboarding,
      hydrateSession,
      canAdvanceFromStep,
      isStepComplete,
      suggestedStep,
    }),
    [
      session,
      activeStep,
      onboarding,
      hydrating,
      goNext,
      goBack,
      updateSession,
      refreshOnboarding,
      hydrateSession,
      canAdvanceFromStep,
      isStepComplete,
      suggestedStep,
    ],
  );

  return (
    <InstitutionPilotContext.Provider value={value}>{children}</InstitutionPilotContext.Provider>
  );
}

export function useInstitutionPilot() {
  const ctx = useContext(InstitutionPilotContext);
  if (!ctx) throw new Error('useInstitutionPilot must be used within InstitutionPilotProvider');
  return ctx;
}

export function resetPilotSession() {
  savePilotSession({ ...EMPTY_PILOT_SESSION });
}
