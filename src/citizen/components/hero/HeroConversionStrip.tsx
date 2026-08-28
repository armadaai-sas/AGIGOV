import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';

import { EGS_VIAL_PRODUCT_PATH } from '../../services/egs-vial-service.js';
import { easeHeroPhase } from '../../hero/useHeroScrollChoreography.js';

type Props = {
  phase: number;
};

/** Capa B — promesa EGS + CTAs piloto (siempre visible en primera pantalla). */
export function HeroConversionStrip({ phase }: Props) {
  const t = easeHeroPhase(phase);
  const scrollBoost = Math.min(1, t * 1.4);

  return (
    <div
      className="hero-conversion-strip"
      style={{
        opacity: 1,
        transform: `translateY(${Math.max(0, (1 - scrollBoost) * 6)}px)`,
      }}
      aria-label="Piloto Reparto del ahorro por eficiencia"
    >
      <p className="hero-conversion-eyebrow">AGIGOV-VEN · Piloto MPPI</p>
      <h1 className="hero-conversion-title">
        El sistema nervioso que ejecuta presupuesto con transparencia verificable.
      </h1>
      <p className="hero-conversion-lead">
        Modelo EGS: convertimos ineficiencia en obra pública. Mismo presupuesto, ejecución
        trazable, cierre trimestral automático.
      </p>
      <div className="hero-conversion-actions">
        <Link to={EGS_VIAL_PRODUCT_PATH} className="ui-btn-primary ui-btn-lg">
          Ver piloto de eficiencia vial
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
        <Link to="/transparencia" className="ui-btn-secondary ui-btn-lg">
          <Download className="h-4 w-4" aria-hidden />
          Contrato de Eficiencia Pública
        </Link>
      </div>
    </div>
  );
}
