import { Link } from 'react-router-dom';
import { ArrowRight, Rocket } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

type Props = {
  /** Institutional entry (real deploy action). */
  to?: string;
  /** In-page handoff (e.g. #desplegar). */
  href?: string;
  impact?: boolean;
  className?: string;
};

/** CTA Desplegar — mismo icono (cohete) + flecha en todo el landing. */
export function LandingDeployCta({ to, href, impact = false, className = '' }: Props) {
  const copy = useLandingCopy();
  const classes = [
    'ls-btn',
    'ls-btn--primary',
    impact ? 'ls-btn--impact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <Rocket className="h-4 w-4" aria-hidden />
      <span>{copy.LANDING_DEPLOY_CTA}</span>
      <ArrowRight className="h-4 w-4" aria-hidden />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href ?? '#desplegar'} className={classes}>
      {content}
    </a>
  );
}
