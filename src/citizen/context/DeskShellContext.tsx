import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const SIDEBAR_COLLAPSED_KEY = 'agigov.sidebar.collapsed';
const SIDEBAR_ESSENTIAL_KEY = 'agigov.sidebar.essential';

type DeskShellContextValue = {
  sidebarCollapsed: boolean;
  essentialMode: boolean;
  toggleSidebar: () => void;
  toggleEssential: () => void;
};

const DeskShellContext = createContext<DeskShellContextValue | null>(null);

export function DeskShellProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
  });
  const [essentialMode, setEssentialMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_ESSENTIAL_KEY) === '1';
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  const toggleEssential = useCallback(() => {
    setEssentialMode((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_ESSENTIAL_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      essentialMode,
      toggleSidebar,
      toggleEssential,
    }),
    [sidebarCollapsed, essentialMode, toggleSidebar, toggleEssential],
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
