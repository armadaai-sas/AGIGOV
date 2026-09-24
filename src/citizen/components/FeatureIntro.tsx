import type { LucideIcon } from 'lucide-react';

export type FeatureIntroContent = {
  title: string;
  what: string;
  why: string;
  see: string;
  icon?: LucideIcon;
};

/** Presentación de una función: qué es, para qué sirve y qué se ve. */
export function FeatureIntro({ title, what, why, see, icon: Icon }: FeatureIntroContent) {
  return (
    <section className="feature-intro" aria-label={title}>
      <div className="feature-intro-mark" aria-hidden>
        {Icon ? <Icon className="h-4 w-4" /> : <span className="feature-intro-mark-bar" />}
      </div>
      <div className="feature-intro-body">
        <h2 className="feature-intro-title">{title}</h2>
        <dl className="feature-intro-points">
          <div>
            <dt>Qué es</dt>
            <dd>{what}</dd>
          </div>
          <div>
            <dt>Para qué</dt>
            <dd>{why}</dd>
          </div>
          <div>
            <dt>Qué se ve</dt>
            <dd>{see}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
