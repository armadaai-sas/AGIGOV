/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface AgigovDesktopBridge {
  desktop: boolean;
  openExternal: (url: string) => Promise<boolean>;
  getMeta: () => Promise<{
    desktop: boolean;
    platform: string;
    arch: string;
    versions: { app: string; electron: string; chrome: string };
  }>;
}

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL?: string;
  readonly VITE_DESKTOP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    agigov?: AgigovDesktopBridge;
  }
}

export {};
