import { useCallback, useEffect, useRef, useState } from 'react';

import { HERO_FILM, shouldLoadHeroVideo } from '../hero/heroFilmConfig.js';

export { useHeroStoryBeat } from '../hero/useHeroStoryBeat.js';

type FilmState = 'poster' | 'loading' | 'playing' | 'failed';

/**
 * Hero tipo película — poster instantáneo (LCP) + video WebM/MP4 lazy.
 * Sustituir assets en public/hero/ con export After Effects (ver docs).
 */
export function HeroFilmBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<FilmState>('poster');
  const [posterOk, setPosterOk] = useState(true);
  const [videoEnabled] = useState(() => shouldLoadHeroVideo());

  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setState('failed'));
  }, []);

  useEffect(() => {
    if (!videoEnabled) return;

    let cancelled = false;
    const mountVideo = () => {
      if (!cancelled) setState('loading');
    };

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(mountVideo, { timeout: 1800 });
    } else {
      timeoutId = setTimeout(mountVideo, 400);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [videoEnabled]);

  const showKenBurns = state === 'failed' || !videoEnabled;
  const posterSrc = HERO_FILM.poster;

  return (
    <div
      className="hero-film"
      style={posterOk ? { backgroundImage: `url(${posterSrc})` } : undefined}
      aria-hidden
    >
      {posterOk ? (
        <img
          src={posterSrc}
          alt=""
          className={`hero-film-poster ${state === 'playing' ? 'hero-film-poster--hidden' : ''} ${showKenBurns ? 'hero-film-poster--motion' : ''}`}
          fetchPriority="high"
          decoding="sync"
          width={1440}
          height={900}
          onError={() => setPosterOk(false)}
        />
      ) : (
        <div className="hero-film-gradient-fallback" aria-hidden />
      )}

      {videoEnabled && state !== 'poster' && state !== 'failed' ? (
        <video
          ref={videoRef}
          className={`hero-film-video ${state === 'playing' ? 'hero-film-video--visible' : ''}`}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          poster={posterSrc}
          onLoadedData={() => {
            setState('playing');
            tryPlay();
          }}
          onCanPlayThrough={() => setState('playing')}
          onError={() => setState('failed')}
        >
          <source src={HERO_FILM.webm} type="video/webm" />
          <source src={HERO_FILM.mp4} type="video/mp4" />
        </video>
      ) : null}

      <div className="hero-film-vignette" />
    </div>
  );
}
