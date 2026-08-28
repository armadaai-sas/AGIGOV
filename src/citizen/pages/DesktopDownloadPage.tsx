import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Apple,
  ChevronRight,
  Download,
  HardDrive,
  Laptop,
  Monitor,
  RefreshCw,
  Terminal,
} from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import {
  detectClientArch,
  detectClientPlatform,
  fetchDesktopReleases,
  formatBytes,
  groupDownloadsByPlatform,
  pickRecommendedDownload,
  PLATFORM_LABELS,
  type DesktopDownload,
  type DesktopPlatform,
  type DesktopReleasesManifest,
} from '../platform/desktopReleases.js';
import { isDesktopRuntime } from '../platform/desktopRuntime.js';

const PLATFORM_ORDER: DesktopPlatform[] = ['windows', 'macos', 'linux'];

const PLATFORM_ICONS: Record<DesktopPlatform, typeof Monitor> = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
  unknown: Laptop,
};

function DownloadRow({
  item,
  recommended,
  onDownload,
}: {
  item: DesktopDownload;
  recommended: boolean;
  onDownload: (item: DesktopDownload) => void;
}) {
  const size = formatBytes(item.sizeBytes);
  const ready = item.available && item.url;

  return (
    <li className="os-workspace-row os-workspace-row--static">
      <span className="os-workspace-row-icon" aria-hidden>
        <Download className="h-4 w-4" />
      </span>
      <span className="os-workspace-row-body">
        <span className="os-workspace-row-name">
          {item.label}
          {recommended ? (
            <span className="ml-2 inline-flex rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
              Recomendado
            </span>
          ) : null}
        </span>
        <span className="os-workspace-row-meta">
          {item.format}
          {size ? ` · ${size}` : ''}
          {item.sha256 ? ` · SHA-256 ${item.sha256.slice(0, 12)}…` : ''}
        </span>
      </span>
      {ready ? (
        <button
          type="button"
          className="ds-btn-primary ds-btn-app-shape shrink-0 text-xs"
          onClick={() => onDownload(item)}
        >
          Descargar
        </button>
      ) : (
        <span className="shrink-0 text-xs text-zinc-500">Próximamente</span>
      )}
    </li>
  );
}

export default function DesktopDownloadPage() {
  const [manifest, setManifest] = useState<DesktopReleasesManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const inDesktop = isDesktopRuntime();

  const clientPlatform = detectClientPlatform();
  const clientArch = detectClientArch();

  async function loadManifest() {
    setLoading(true);
    setError(null);
    try {
      setManifest(await fetchDesktopReleases());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar descargas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadManifest();
  }, []);

  const grouped = useMemo(
    () => groupDownloadsByPlatform(manifest?.downloads ?? []),
    [manifest],
  );

  const recommended = useMemo(
    () => (manifest ? pickRecommendedDownload(manifest, clientPlatform, clientArch) : undefined),
    [manifest, clientPlatform, clientArch],
  );

  function handleDownload(item: DesktopDownload) {
    if (!item.url) return;
    if (window.agigov?.openExternal) {
      void window.agigov.openExternal(item.url);
      return;
    }
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">App de escritorio</h1>
            <p className="os-workspace-sub">
              Instala AGIGOV como aplicación nativa en Windows, macOS o Linux. Mismo OS, ventana
              dedicada y acceso directo al servicio en la nube.
            </p>
          </div>
          <div className="os-workspace-cta flex flex-wrap gap-2">
            <button
              type="button"
              className="ds-btn-secondary ds-btn-app-shape inline-flex items-center gap-1.5 text-xs"
              onClick={() => void loadManifest()}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <Link to="/escritorio" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
              Escritorio
            </Link>
          </div>
        </header>

        {inDesktop ? (
          <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Ya estás usando la app de escritorio AGIGOV.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            {error}
          </p>
        ) : null}

        {manifest ? (
          <>
            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Versión actual</h2>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-zinc-600">
                <span>
                  <strong className="text-zinc-900">v{manifest.version}</strong> · canal{' '}
                  {manifest.channel}
                </span>
                <span>
                  Publicada{' '}
                  {new Date(manifest.releasedAt).toLocaleDateString('es', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{manifest.notes}</p>
            </section>

            {recommended ? (
              <section className="os-workspace-section">
                <h2 className="os-workspace-section-title">Para tu equipo</h2>
                <p className="text-xs text-zinc-500">
                  Detectado: {PLATFORM_LABELS[clientPlatform]} · {clientArch}
                </p>
                <ul className="os-workspace-list mt-2">
                  <DownloadRow
                    item={recommended}
                    recommended
                    onDownload={handleDownload}
                  />
                </ul>
                {!recommended.available ? (
                  <p className="mt-3 text-sm text-zinc-600">
                    Los instaladores se publican con cada release. Mientras tanto puedes compilar
                    localmente con{' '}
                    <code className="agigov-kbd">npm run desktop:pack</code>.
                  </p>
                ) : null}
              </section>
            ) : null}

            {PLATFORM_ORDER.map((platform) => {
              const items = grouped[platform];
              if (!items.length) return null;
              const Icon = PLATFORM_ICONS[platform];
              const req = manifest.minRequirements[platform === 'macos' ? 'macos' : platform];

              return (
                <section key={platform} className="os-workspace-section">
                  <h2 className="os-workspace-section-title flex items-center gap-2">
                    <Icon className="h-4 w-4" aria-hidden />
                    {PLATFORM_LABELS[platform]}
                  </h2>
                  {req ? <p className="text-xs text-zinc-500">Requisitos: {req}</p> : null}
                  <ul className="os-workspace-list mt-2">
                    {items.map((item) => (
                      <DownloadRow
                        key={item.id}
                        item={item}
                        recommended={
                          recommended?.id === item.id &&
                          item.platform === clientPlatform &&
                          item.arch === clientArch
                        }
                        onDownload={handleDownload}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title flex items-center gap-2">
                <HardDrive className="h-4 w-4" aria-hidden />
                Alternativas
              </h2>
              <ul className="os-workspace-list">
                <li>
                  <Link to="/" className="os-workspace-row">
                    <span className="os-workspace-row-body">
                      <span className="os-workspace-row-name">Web + PWA</span>
                      <span className="os-workspace-row-meta">
                        Usa el navegador o instala como app web progresiva
                      </span>
                    </span>
                    <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                  </Link>
                </li>
                {manifest.releasePageUrl ? (
                  <li>
                    <a
                      href={manifest.releasePageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="os-workspace-row"
                    >
                      <span className="os-workspace-row-body">
                        <span className="os-workspace-row-name">Historial de releases</span>
                        <span className="os-workspace-row-meta">Versiones anteriores y notas</span>
                      </span>
                      <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                    </a>
                  </li>
                ) : null}
              </ul>
            </section>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Compilar desde código</h2>
              <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800">
{`# Desarrollo (ventana Electron + Vite local)
npm run desktop:dev

# Empaquetar para tu SO actual
npm run desktop:pack

# Plataforma específica
npm run desktop:pack:win
npm run desktop:pack:mac
npm run desktop:pack:linux`}
              </pre>
            </section>
          </>
        ) : loading ? (
          <p className="text-sm text-zinc-500">Cargando manifiesto de descargas…</p>
        ) : null}
      </div>
    </PageShell>
  );
}
