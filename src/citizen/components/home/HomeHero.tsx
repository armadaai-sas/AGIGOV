import { Link } from 'react-router-dom';
import { ArrowRight, Layers, ShieldCheck, TrendingDown } from 'lucide-react';

import {
  AGIGOV_MODELS,
  EGS_MODEL_PATH,
  MODEL_AUDIENCE_LABEL,
  MODEL_AUDIENCE_ORDER,
} from '../../platform/agigovModels.js';
import {
  HERO_EYEBROW,
  HERO_LEAD,
  HERO_PIPELINE_STEPS,
  HERO_PRICING_STRIP,
  HERO_TITLE,
  HERO_TITLE_ACCENT,
} from '../../hero/landingCopy.js';

const AVAILABLE = AGIGOV_MODELS.filter((m) => m.status === 'disponible').length;
const BETA = AGIGOV_MODELS.filter((m) => m.status === 'beta').length;

/**
 * Hero home v2 — protocolo, catálogo de modelos, pipeline de ejecución y ganar-ganar.
 */
export function HomeHero() {
  return (
    <section
      className="relative min-h-[100svh] snap-start overflow-hidden bg-[#030508] text-white"
      aria-labelledby="home-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 85% 15%, rgba(16,185,129,0.14), transparent 50%),
            radial-gradient(ellipse 55% 45% at 5% 85%, rgba(14,165,233,0.1), transparent 45%),
            linear-gradient(180deg, #030508 0%, #0a1018 45%, #030508 100%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pt-32">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {HERO_EYEBROW}
        </p>

        <h1
          id="home-hero-title"
          className="mt-5 max-w-4xl font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
        >
          {HERO_TITLE}
          <span className="mt-2 block text-[clamp(1.125rem,2.5vw,1.5rem)] font-normal text-slate-400">
            {HERO_TITLE_ACCENT}
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{HERO_LEAD}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to="/modelos"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 no-underline hover:bg-slate-100"
          >
            Catálogo de modelos
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={EGS_MODEL_PATH}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 text-sm font-medium text-emerald-100 no-underline hover:bg-emerald-500/15"
          >
            <TrendingDown className="h-4 w-4" />
            Efficiency Gain Share
          </Link>
          <Link
            to="/institucional#protocolo"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 text-sm text-slate-500 no-underline hover:text-slate-300"
          >
            <Layers className="h-4 w-4" />
            Protocolo IAP
          </Link>
        </div>

        {/* Pipeline de ejecución */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Cómo se ejecuta todo modelo
            </p>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              FREEZE centinela ante irregularidad
            </span>
          </div>
          <ol className="mt-4 flex flex-wrap gap-2 md:gap-0 md:justify-between">
            {HERO_PIPELINE_STEPS.map((step, i) => (
              <li
                key={step.id}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300 md:flex-1 md:justify-center md:rounded-none md:border-0 md:border-r md:border-white/10 md:bg-transparent md:px-2 md:last:border-r-0"
              >
                <span className="font-mono text-[10px] text-sky-400/80">{String(i + 1).padStart(2, '0')}</span>
                {step.label}
              </li>
            ))}
          </ol>
        </div>

        {/* Tres audiencias */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {MODEL_AUDIENCE_ORDER.map((audience) => {
            const models = AGIGOV_MODELS.filter((m) => m.audience === audience);
            return (
              <div
                key={audience}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {MODEL_AUDIENCE_LABEL[audience]}
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">{models.length}</p>
                <p className="text-xs text-slate-500">modelos en catálogo</p>
                <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {models.slice(0, 2).map((m) => (
                    <li key={m.id}>
                      <Link
                        to={m.productPath}
                        className="block text-sm font-medium text-slate-200 no-underline hover:text-white"
                      >
                        {m.shortName}
                        <span className="mt-0.5 block text-xs font-normal text-slate-500">{m.tagline}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/modelos#${audience}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-sky-400 no-underline hover:text-sky-300"
                >
                  Ver todos
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Ingresos ganar-ganar */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {HERO_PRICING_STRIP.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent px-4 py-3"
            >
              <p className="text-sm font-medium text-slate-200">{item.label}</p>
              <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] text-slate-600">
          {AVAILABLE} disponibles · {BETA} beta · mismo protocolo ·{' '}
          <Link to="/modelos" className="text-sky-500/80 no-underline hover:text-sky-400">
            explorar catálogo
          </Link>
        </p>
      </div>
    </section>
  );
}
