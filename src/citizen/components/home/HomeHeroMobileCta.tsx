import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Barra CTA fija en móvil — visible entre pantalla 1 y 3 del hero. */
export function HomeHeroMobileCta() {
  const copy = useLandingCopy();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const demo = document.getElementById('hero-demo');
    const cta = document.getElementById('hero-cta');
    if (!demo || !cta) return;

    let pastDemo = false;
    let ctaVisible = false;

    const update = () => setVisible(pastDemo && !ctaVisible);

    const demoObs = new IntersectionObserver(
      ([entry]) => {
        if (entry) pastDemo = !entry.isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );

    const ctaObs = new IntersectionObserver(
      ([entry]) => {
        if (entry) ctaVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.2 },
    );

    demoObs.observe(demo);
    ctaObs.observe(cta);
    return () => {
      demoObs.disconnect();
      ctaObs.disconnect();
    };
  }, []);

  return (
    <div className={`hero-mobile-cta ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-mobile-cta-btn">
        {copy.HERO_CTA_PRIMARY.label}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
