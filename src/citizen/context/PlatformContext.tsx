import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  HERO_STORY_BEATS,
  type HeroStoryBeat,
} from '../hero/heroConfig.js';
import {
  getImplementation,
  type ImplementationId,
  type ImplementationOption,
} from '../platform/implementations.js';

const ONBOARDING_KEY = 'agigov-onboarding-v1';
const IMPLEMENTATION_KEY = 'agigov-implementation';

export type OnboardingPersona = 'citizen' | 'explorer' | 'government';

export type SkinId = 'trust' | 'legacy';

const SKIN_KEY = 'agigov-skin';

type PlatformContextValue = {
  onboardingDone: boolean;
  completeOnboarding: (persona: OnboardingPersona) => void;
  dismissOnboarding: () => void;
  implementation: ImplementationOption;
  implementationId: ImplementationId;
  setImplementationId: (id: ImplementationId) => void;
  skinId: SkinId;
  setSkinId: (id: SkinId) => void;
  /** Acto narrativo del hero — sincronizado globalmente en la landing. */
  heroBeatIndex: number;
  heroBeat: HeroStoryBeat;
  heroScrollProgress: number;
  heroPathDraw: number;
  setHeroNarrative: (index: number, scrollProgress: number, pathDraw: number) => void;
  /** Fase 0–1 de la coreografía scroll del hero (logo → ancla, panel, nav). */
  heroChoreographyPhase: number;
  setHeroChoreographyPhase: (phase: number) => void;
  /** Nav y panel global visibles tras scroll inicial. */
  heroChromeRevealed: boolean;
};

const PlatformContext = createContext<PlatformContextValue | null>(null);

function readSkinId(): SkinId {
  if (typeof window === 'undefined') return 'trust';
  const stored = localStorage.getItem(SKIN_KEY);
  if (stored === 'legacy' || stored === 'trust') return stored;
  return 'trust';
}

function applySkin(id: SkinId) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-agigov-skin', id);
}
function readImplementationId(): ImplementationId {
  if (typeof window === 'undefined') return 'generic';
  const stored = localStorage.getItem(IMPLEMENTATION_KEY);
  if (stored === 'ven' || stored === 'sbx' || stored === 'generic') return stored;
  return 'generic';
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [onboardingDone, setOnboardingDone] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_KEY) === '1',
  );
  const [implementationId, setImplementationIdState] = useState<ImplementationId>(readImplementationId);
  const [skinId, setSkinIdState] = useState<SkinId>(() => {
    const id = readSkinId();
    applySkin(id);
    return id;
  });
  const [heroBeatIndex, setHeroBeatIndex] = useState(0);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [heroPathDraw, setHeroPathDraw] = useState(0);
  const [heroChoreographyPhase, setHeroChoreographyPhaseState] = useState(0);

  const setHeroChoreographyPhase = useCallback((phase: number) => {
    setHeroChoreographyPhaseState(Math.min(1, Math.max(0, phase)));
  }, []);

  const heroChromeRevealed = heroChoreographyPhase > 0.72;

  const setHeroNarrative = useCallback((index: number, scrollProgress: number, pathDraw: number) => {
    setHeroBeatIndex(index);
    setHeroScrollProgress(scrollProgress);
    setHeroPathDraw(pathDraw);
  }, []);

  const heroBeat = HERO_STORY_BEATS[heroBeatIndex] ?? HERO_STORY_BEATS[0];

  const setSkinId = useCallback((id: SkinId) => {
    setSkinIdState(id);
    localStorage.setItem(SKIN_KEY, id);
    applySkin(id);
  }, []);

  const setImplementationId = useCallback((id: ImplementationId) => {
    setImplementationIdState(id);
    localStorage.setItem(IMPLEMENTATION_KEY, id);
  }, []);

  const completeOnboarding = useCallback((_persona: OnboardingPersona) => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setOnboardingDone(true);
  }, []);

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setOnboardingDone(true);
  }, []);

  const value = useMemo(
    () => ({
      onboardingDone,
      completeOnboarding,
      dismissOnboarding,
      implementation: getImplementation(implementationId),
      implementationId,
      setImplementationId,
      skinId,
      setSkinId,
      heroBeatIndex,
      heroBeat,
      heroScrollProgress,
      heroPathDraw,
      setHeroNarrative,
      heroChoreographyPhase,
      setHeroChoreographyPhase,
      heroChromeRevealed,
    }),
    [
      onboardingDone,
      completeOnboarding,
      dismissOnboarding,
      implementationId,
      setImplementationId,
      skinId,
      setSkinId,
      heroBeatIndex,
      heroBeat,
      heroScrollProgress,
      heroPathDraw,
      setHeroNarrative,
      heroChoreographyPhase,
      setHeroChoreographyPhase,
      heroChromeRevealed,
    ],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
