import { useEffect, useState } from 'react';

import { useSovereignConfig } from '../../context/PlatformContext.js';

type OpsHealth = {
  ok?: boolean;
  panicMode?: boolean;
  ledgerEntries?: number;
  publishedReports?: number;
  plan?: string;
};

type PulseState =
  | { status: 'probing' }
  | { status: 'live'; data: OpsHealth; source: 'proxy' | 'public' }
  | { status: 'offline' };

const LIVE_PUBLIC = 'http://137.184.66.163/api/ops/health';

/**
 * Pulso real del OS — solo LIVE con evidencia HTTP.
 * Si falla, no inventa PASS: muestra enlace a la superficie pública.
 */
export function HomeHeroLivePulse() {
  const { t } = useSovereignConfig();
  const [pulse, setPulse] = useState<PulseState>({ status: 'probing' });

  useEffect(() => {
    let cancelled = false;

    const read = async (url: string, source: 'proxy' | 'public'): Promise<PulseState | null> => {
      try {
        const res = await fetch(url, { cache: 'no-store', mode: source === 'public' ? 'cors' : 'same-origin' });
        if (!res.ok) return null;
        const data = (await res.json()) as OpsHealth;
        if (!data.ok) return null;
        return { status: 'live', data, source };
      } catch {
        return null;
      }
    };

    const probe = async () => {
      const local = await read('/api/ops/health', 'proxy');
      if (!cancelled && local) {
        setPulse(local);
        return;
      }
      const remote = await read(LIVE_PUBLIC, 'public');
      if (!cancelled) setPulse(remote ?? { status: 'offline' });
    };

    void probe();
    const id = window.setInterval(probe, 45_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (pulse.status === 'probing') {
    return (
      <p className="ls-live-pulse is-probing" aria-live="polite">
        <span className="ls-live-pulse-dot" aria-hidden />
        {t('hero.live.probing')}
      </p>
    );
  }

  if (pulse.status === 'offline') {
    return (
      <p className="ls-live-pulse is-offline" aria-live="polite">
        <span className="ls-live-pulse-dot" aria-hidden />
        {t('hero.live.offline')}
        <a href="http://137.184.66.163/" target="_blank" rel="noopener noreferrer" className="ls-live-pulse-link">
          {t('hero.live.openProd')}
        </a>
      </p>
    );
  }

  const { data } = pulse;
  const panic = Boolean(data.panicMode);

  return (
    <p className={`ls-live-pulse is-live${panic ? ' is-panic' : ''}`} aria-live="polite">
      <span className="ls-live-pulse-dot" aria-hidden />
      <span className="ls-live-pulse-badge">{panic ? t('hero.live.panic') : t('hero.live.live')}</span>
      <span className="ls-live-pulse-meta">
        {t('hero.live.meta', {
          ledger: String(data.ledgerEntries ?? '—'),
          reports: String(data.publishedReports ?? '—'),
          plan: String(data.plan ?? '—'),
        })}
      </span>
    </p>
  );
}
