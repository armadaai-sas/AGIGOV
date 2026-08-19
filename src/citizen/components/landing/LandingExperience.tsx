import { useEffect, useState } from 'react';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** Smooth-scroll to a landing section id (nav offset aware). */
export function scrollToLandingId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
}

function hashFromHref(href: string | null): string | null {
  if (!href) return null;
  if (href.startsWith('#')) return href.slice(1) || null;
  try {
    const url = new URL(href, window.location.origin);
    if (url.pathname === '/' || url.pathname === window.location.pathname) {
      return url.hash ? url.hash.slice(1) : null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Salsa secreta de navegación: barra de progreso + scroll suave global del landing.
 */
export function LandingExperience() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max <= 0 ? 0 : Math.min(100, (window.scrollY / max) * 100));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const a = t.closest('a');
      if (!a) return;
      const id = hashFromHref(a.getAttribute('href'));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToLandingId(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      requestAnimationFrame(() => scrollToLandingId(hash));
    }
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.ls-root .ls-section'));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('is-inview');
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    for (const s of sections) io.observe(s);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="ls-scroll-progress"
      role="progressbar"
      aria-hidden
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div className="ls-scroll-progress-bar" style={{ width: `${progress}%`, transition: `width 80ms ${EASE}` }} />
    </div>
  );
}
