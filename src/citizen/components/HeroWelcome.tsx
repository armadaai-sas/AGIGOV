import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { CityProsperityIllustration } from './CityProsperityIllustration.js';
import { HeroMiniTelemetry } from './HeroMiniTelemetry.js';

export function HeroWelcome() {
  return (
    <section className="landing-hero landing-hero--impact" aria-labelledby="welcome-heading">
      <div className="landing-hero-glow" aria-hidden />
      <div className="landing-hero-grid">
        <div className="landing-hero-copy">
          <p className="landing-kicker">Organización oficial · AGIGOV</p>

          <h1 id="welcome-heading" className="landing-title">
            Gobernanza y política
            <span className="landing-title-accent"> para la era post-IA</span>
          </h1>
          <p className="landing-lead">
            <strong className="text-white">AGIGOV</strong> define el modelo genérico de Estado,
            política y economía verificables — adoptable por cualquier gobierno. Aquí encuentras
            el protocolo, las implementaciones nacionales y la plataforma para participar.
          </p>

          <HeroMiniTelemetry />

          <div className="landing-actions">
            <Link to="/#modelo" className="ds-btn-primary">
              Entender Gobernanza 2.0
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/#telemetria" className="ds-btn-secondary">
              Ver gestión en vivo
            </Link>
          </div>

          <a href="#modelo" className="landing-scroll-hint">
            <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
            Descubre Gobernanza 2.0
          </a>
        </div>

        <div className="landing-hero-visual">
          <div className="landing-preview landing-preview--hero">
            <div className="landing-preview-bar">
              <span className="landing-preview-dot" aria-hidden />
              <span className="landing-preview-title">AGIGOV</span>
              <span className="landing-preview-meta">Plataforma · Modelo · Guías</span>
            </div>
            <CityProsperityIllustration className="landing-preview-art" />
          </div>
        </div>
      </div>
    </section>
  );
}
