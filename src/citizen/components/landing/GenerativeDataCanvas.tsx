import { useEffect, useMemo, useRef } from 'react';

type Props = {
  pulsePhase: number;
  active?: boolean;
};

type Point = { x: number; y: number; w: number; phase: number };

function shouldDegrade() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const cores = navigator.hardwareConcurrency ?? 4;
  return cores < 4;
}

/** Visualización generativa ligera — puntos globales reactivos al pulso IAP. */
export function GenerativeDataCanvas({ pulsePhase, active = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef(pulsePhase);
  pulseRef.current = pulsePhase;
  const degrade = useMemo(() => shouldDegrade(), []);

  useEffect(() => {
    if (degrade || !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let points: Point[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(120, Math.floor((width * height) / 9000));
      points = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        w: 0.4 + Math.random() * 1.2,
        phase: Math.random(),
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const wave = pulseRef.current * Math.PI * 2;

      for (const p of points) {
        const px = p.x * width;
        const py = p.y * height;
        const pulse = 0.5 + 0.5 * Math.sin(wave + p.phase * Math.PI * 2);
        const alpha = 0.04 + pulse * 0.12;
        const radius = p.w * (0.8 + pulse * 0.6);

        ctx.beginPath();
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [active, degrade]);

  if (degrade) {
    return <div className="landing-solution-bg-fallback" aria-hidden />;
  }

  return <canvas ref={canvasRef} className="landing-solution-canvas" aria-hidden />;
}
