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
  detectGeoHint,
  formatSovereignAmount,
  JURISDICTIONS,
  resolveSovereignConfig,
  resolveUiLocale,
  type JurisdictionIso,
  type SovereignConfig,
  type SovereignLocale,
  type SupportedCurrency,
} from '../../config/sovereign/index.js';
import { createTranslator, type MessageKey, type TFunction } from '../../i18n/index.js';
import {
  HERO_STORY_BEATS,
  type HeroStoryBeat,
} from '../hero/heroConfig.js';
import {
  getImplementation,
  implementationIdFromIso,
  type ImplementationId,
  type ImplementationOption,
} from '../platform/implementations.js';
import { fetchPublicConfig, type PublicConfigResponse } from '../api.js';

const ONBOARDING_KEY = 'agigov-onboarding-v1';
const IMPLEMENTATION_KEY = 'agigov-implementation';
const SOVEREIGN_PREF_KEY = 'agigov-sovereign-pref-v1';
const GEO_APPLIED_KEY = 'agigov-geo-hint-applied-v1';

export type OnboardingPersona = 'citizen' | 'explorer' | 'government';

export type SkinId = 'trust' | 'legacy';

const SKIN_KEY = 'agigov-skin';

export type SovereignUserPref = {
  iso?: JurisdictionIso;
  currency?: SupportedCurrency;
  locale?: SovereignLocale;
};

type PlatformContextValue = {
  onboardingDone: boolean;
  completeOnboarding: (persona: OnboardingPersona) => void;
  dismissOnboarding: () => void;
  implementation: ImplementationOption;
  implementationId: ImplementationId;
  setImplementationId: (id: ImplementationId) => void;
  sovereign: SovereignConfig;
  setSovereignPref: (pref: SovereignUserPref) => void;
  formatMoney: (value: string | number, options?: { showCode?: boolean }) => string;
  t: TFunction;
  nodeConfigLoaded: boolean;
  skinId: SkinId;
  setSkinId: (id: SkinId) => void;
  heroBeatIndex: number;
  heroBeat: HeroStoryBeat;
  heroScrollProgress: number;
  heroPathDraw: number;
  setHeroNarrative: (index: number, scrollProgress: number, pathDraw: number) => void;
  heroChoreographyPhase: number;
  setHeroChoreographyPhase: (phase: number) => void;
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
  if (
    stored === 'ven' ||
    stored === 'col' ||
    stored === 'usa' ||
    stored === 'sbx' ||
    stored === 'generic'
  ) {
    return stored;
  }
  return 'generic';
}

function readUserPref(): SovereignUserPref | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SOVEREIGN_PREF_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SovereignUserPref;
  } catch {
    return null;
  }
}

function writeUserPref(pref: SovereignUserPref) {
  localStorage.setItem(SOVEREIGN_PREF_KEY, JSON.stringify(pref));
}

function applyGeoHintOnce(): SovereignUserPref | null {
  if (typeof window === 'undefined') return null;
  if (localStorage.getItem(SOVEREIGN_PREF_KEY)) return null;
  if (localStorage.getItem(GEO_APPLIED_KEY)) return null;

  const hint = detectGeoHint();
  localStorage.setItem(GEO_APPLIED_KEY, '1');

  if (hint.iso && hint.confidence === 'high') {
    const profile = JURISDICTIONS[hint.iso];
    const pref: SovereignUserPref = {
      iso: hint.iso,
      currency: profile.currency as SupportedCurrency,
      locale: resolveUiLocale({ countryIso: hint.iso, geoHint: hint }),
    };
    writeUserPref(pref);
    localStorage.setItem(IMPLEMENTATION_KEY, implementationIdFromIso(hint.iso));
    return pref;
  }

  if (hint.hispanicRegion) {
    const pref: SovereignUserPref = { locale: 'es' };
    writeUserPref(pref);
    return pref;
  }

  return null;
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [onboardingDone, setOnboardingDone] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_KEY) === '1',
  );
  const [implementationId, setImplementationIdState] = useState<ImplementationId>(() => {
    applyGeoHintOnce();
    return readImplementationId();
  });
  const [userPref, setUserPref] = useState<SovereignUserPref | null>(() => {
    applyGeoHintOnce();
    return readUserPref();
  });
  const [nodeConfig, setNodeConfig] = useState<PublicConfigResponse | null>(null);
  const [nodeConfigLoaded, setNodeConfigLoaded] = useState(false);
  const [skinId, setSkinIdState] = useState<SkinId>(() => {
    const id = readSkinId();
    applySkin(id);
    return id;
  });
  const [heroBeatIndex, setHeroBeatIndex] = useState(0);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [heroPathDraw, setHeroPathDraw] = useState(0);
  const [heroChoreographyPhase, setHeroChoreographyPhaseState] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPublicConfig()
      .then((cfg) => {
        if (!cancelled) {
          setNodeConfig(cfg);
          setNodeConfigLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNodeConfigLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const geoHint = useMemo(() => detectGeoHint(), []);

  const sovereign = useMemo(() => {
    const base = resolveSovereignConfig({
      nodeIso: nodeConfig?.iso,
      nodeCurrency: nodeConfig?.currency,
      nodeLocale: nodeConfig?.locale,
      userIso: userPref?.iso ?? null,
      userCurrency: userPref?.currency ?? null,
      userLocale: null,
      geoHintIso: geoHint.iso,
    });

    const locale =
      userPref?.locale ??
      resolveUiLocale({
        countryIso: base.iso,
        geoHint: geoHint,
        browserLang: typeof navigator !== 'undefined' ? navigator.language : undefined,
      });

    return { ...base, locale };
  }, [nodeConfig, userPref, geoHint]);

  const t = useMemo(() => createTranslator(sovereign.locale), [sovereign.locale]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const htmlLang = sovereign.locale.startsWith('es') ? 'es' : 'en';
    document.documentElement.lang = htmlLang;
    document.documentElement.setAttribute('data-agigov-jurisdiction', sovereign.iso);
    document.documentElement.setAttribute('data-agigov-currency', sovereign.currency);
  }, [sovereign.locale, sovereign.iso, sovereign.currency]);

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
    const impl = getImplementation(id);
    const pref: SovereignUserPref = {
      iso: impl.iso,
      currency: JURISDICTIONS[impl.iso].currency as SupportedCurrency,
      locale: resolveUiLocale({ countryIso: impl.iso, geoHint: detectGeoHint() }),
    };
    writeUserPref(pref);
    setUserPref(pref);
  }, []);

  const setSovereignPref = useCallback((pref: SovereignUserPref) => {
    const merged: SovereignUserPref = { ...userPref, ...pref };
    if (pref.iso) {
      const profile = JURISDICTIONS[pref.iso];
      merged.currency = (pref.currency ?? profile.currency) as SupportedCurrency;
      merged.locale =
        pref.locale ??
        resolveUiLocale({ countryIso: pref.iso, geoHint: detectGeoHint() });
      const implId = implementationIdFromIso(pref.iso);
      setImplementationIdState(implId);
      localStorage.setItem(IMPLEMENTATION_KEY, implId);
    }
    writeUserPref(merged);
    setUserPref(merged);
  }, [userPref]);

  const formatMoney = useCallback(
    (value: string | number, options?: { showCode?: boolean }) =>
      formatSovereignAmount(value, sovereign, options),
    [sovereign],
  );

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
      sovereign,
      setSovereignPref,
      formatMoney,
      t,
      nodeConfigLoaded,
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
      sovereign,
      setSovereignPref,
      formatMoney,
      t,
      nodeConfigLoaded,
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

/** Atajo para moneda, locale y jurisdicción activos. */
export function useSovereignConfig() {
  const { sovereign, formatMoney, setSovereignPref, t, nodeConfigLoaded } = usePlatform();
  return { sovereign, formatMoney, setSovereignPref, t, nodeConfigLoaded };
}
