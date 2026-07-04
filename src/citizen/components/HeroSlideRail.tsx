import { HERO_SLIDES } from '../hero/heroFilmConfig.js';

type Props = {
  activeIndex: number;
};

/** Fondo fullscreen — transición lateral suave, sin marcos de placeholder. */
export function HeroSlideRail({ activeIndex }: Props) {
  return (
    <div className="hero-cinematic-backdrop" aria-hidden>
      <div
        className="hero-cinematic-track"
        style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
      >
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-cinematic-slide ${i === activeIndex ? 'hero-cinematic-slide--active' : ''}`}
          >
            <img
              src={slide.image}
              alt=""
              className="hero-cinematic-image"
              style={{ objectPosition: `center ${38 + i * 4}%` }}
              loading={i <= 1 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              width={1440}
              height={900}
            />
          </div>
        ))}
      </div>
      <div className="hero-cinematic-scrim" />
    </div>
  );
}
