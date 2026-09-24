import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  readStoredDeskPersona,
  storeDeskPersona,
  type DeskPersonaId,
} from '../platform/deskNav.js';

const SIDEBAR_COLLAPSED_KEY = 'agigov.sidebar.collapsed';

type DeskShellContextValue = {
  sidebarCollapsed: boolean;
  persona: DeskPersonaId;
  setPersona: (id: DeskPersonaId) => void;
  toggleSidebar: () => void;
};

const DeskShellContext = createContext<DeskShellContextValue | null>(null);

export function DeskShellProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
  });
  const [persona, setPersonaState] = useState<DeskPersonaId>(readStoredDeskPersona);

  const setPersona = useCallback((id: DeskPersonaId) => {
    setPersonaState(id);
    storeDeskPersona(id);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      persona,
      setPersona,
      toggleSidebar,
    }),
    [sidebarCollapsed, persona, setPersona, toggleSidebar],
  );

  return <DeskShellContext.Provider value={value}>{children}</DeskShellContext.Provider>;
}

export function useDeskShell(): DeskShellContextValue {
  const ctx = useContext(DeskShellContext);
  if (!ctx) {
    throw new Error('useDeskShell must be used within DeskShellProvider');
  }
  return ctx;
}

/** Para ⌘K global — fuera del shell usa persona almacenada. */
export function useDeskPersonaOptional(): DeskPersonaId {
  const ctx = useContext(DeskShellContext);
  if (ctx) return ctx.persona;
  return readStoredDeskPersona();
}
