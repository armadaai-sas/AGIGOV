export type DesktopPlatform = 'windows' | 'macos' | 'linux' | 'unknown';

export type DesktopArch = 'x64' | 'arm64' | 'unknown';

export type DesktopDownload = {
  id: string;
  platform: DesktopPlatform;
  arch: DesktopArch;
  label: string;
  format: string;
  filename: string;
  url: string;
  available: boolean;
  sizeBytes: number | null;
  sha256: string | null;
};

export type DesktopReleasesManifest = {
  version: string;
  releasedAt: string;
  channel: 'stable' | 'beta' | 'nightly';
  releasePageUrl: string;
  notes: string;
  minRequirements: Record<string, string>;
  downloads: DesktopDownload[];
};

const MANIFEST_PATH = '/desktop/releases.json';

export async function fetchDesktopReleases(): Promise<DesktopReleasesManifest> {
  const res = await fetch(MANIFEST_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar el manifiesto de escritorio (${res.status})`);
  return (await res.json()) as DesktopReleasesManifest;
}

export function detectClientPlatform(): DesktopPlatform {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform ?? '').toLowerCase();

  if (ua.includes('win') || platform.includes('win')) return 'windows';
  if (ua.includes('mac') || platform.includes('mac')) return 'macos';
  if (ua.includes('linux') || platform.includes('linux')) return 'linux';
  return 'unknown';
}

export function detectClientArch(): DesktopArch {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('arm') || ua.includes('aarch64')) return 'arm64';
  return 'x64';
}

export function formatBytes(size: number | null): string | null {
  if (size == null || size <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export function pickRecommendedDownload(
  manifest: DesktopReleasesManifest,
  platform: DesktopPlatform,
  arch: DesktopArch,
): DesktopDownload | undefined {
  const forPlatform = manifest.downloads.filter((d) => d.platform === platform);
  if (!forPlatform.length) return undefined;
  return forPlatform.find((d) => d.arch === arch) ?? forPlatform.find((d) => d.arch === 'x64') ?? forPlatform[0];
}

export function groupDownloadsByPlatform(
  downloads: DesktopDownload[],
): Record<DesktopPlatform, DesktopDownload[]> {
  return downloads.reduce<Record<DesktopPlatform, DesktopDownload[]>>(
    (acc, item) => {
      (acc[item.platform] ??= []).push(item);
      return acc;
    },
    { windows: [], macos: [], linux: [], unknown: [] },
  );
}

export const PLATFORM_LABELS: Record<DesktopPlatform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  unknown: 'Otro',
};
