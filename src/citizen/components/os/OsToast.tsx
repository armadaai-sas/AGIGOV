import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ToastTone = 'info' | 'success' | 'error';

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  push: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function OsToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="os-toast-stack" aria-live="polite">
        {items.map((t) => (
          <p key={t.id} className={`os-toast os-toast--${t.tone}`}>
            {t.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useOsToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useOsToast requires OsToastProvider');
  return ctx;
}
