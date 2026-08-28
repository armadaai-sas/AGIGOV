/** Runtime Electron o build empaquetado para escritorio. */
export function isDesktopRuntime(): boolean {
  return (
    import.meta.env.VITE_DESKTOP === '1' ||
    (typeof window !== 'undefined' && Boolean(window.agigov?.desktop))
  );
}
