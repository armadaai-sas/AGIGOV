/** Copy compartido — landing alineado a catálogo de modelos AGIGOV. */

export const HERO_EYEBROW = 'AGIGOV · Protocolo · Catálogo de modelos';

export const HERO_TITLE = 'Gobernar con evidencia verificable';

export const HERO_TITLE_ACCENT = 'Un protocolo. Modelos modulares. Ingresos alineados al ahorro.';

export const HERO_LEAD =
  'Ledger, agentes institucionales y firmas Ed25519 empaquetados en servicios para gobierno, empresa y ciudadanía. Cobro AGIGOV principal: success fee solo sobre ahorro fiscal Δ certificado — cero fee si no hay ahorro.';

export const HERO_PIPELINE_STEPS = [
  { id: 'received', label: 'Recibido' },
  { id: 'validated', label: 'Validado' },
  { id: 'decided', label: 'Decidido' },
  { id: 'committed', label: 'Comprometido' },
  { id: 'published', label: 'Publicado' },
] as const;

export const HERO_PRICING_STRIP = [
  { label: 'Licencia jurisdicción', hint: 'Acceso protocolo + nodo' },
  { label: 'IaaU · pago por uso', hint: 'Firmas, hitos, sync' },
  { label: 'EGS · success fee', hint: '5–15% del Δ · 0 si Δ ≤ 0' },
] as const;

export const LANDING_CHALLENGE_TITLE = 'El problema';

export const LANDING_CHALLENGE_LEAD =
  'El aparato estatal opera en silos: presupuesto, justicia, logística, elecciones y datos sensibles sin un lenguaje común de evidencia.';

export const LANDING_CHALLENGE_BODY =
  'Cada ministerio compra su ERP, su opacidad y su narrativa. La contraloría llega tarde. El ciudadano no distingue gestión real de relato. Los integradores pierden meses cobrando sin prueba compartida.';

export const LANDING_MODELS_KICKER = 'Catálogo modular';

export const LANDING_MODELS_TITLE = 'Mismo motor. Distinto modelo por función estatal.';

export const LANDING_MODELS_BODY =
  'Cada modelo define agentes, flujo, tier de confidencialidad y métrica de negocio. EGS reconcilia ahorro; Escrow libera al hito; SET audita elecciones; Participación cierra propuestas con dictamen publicado.';

export const LANDING_EXECUTION_KICKER = 'Ejecución';

export const LANDING_EXECUTION_TITLE = 'Pipeline institucional único';

export const LANDING_EXECUTION_BODY =
  'Todo acto pasa por received → validated → decided → committed → published. Centinela congela ante irregularidad. Solo lo publicado llega al ciudadano — sin PII donde el tier lo exige.';

export const LANDING_CTA_TITLE = 'Elija un modelo. Verifique el nodo. Ejecute con evidencia.';

export const LANDING_CTA_LEAD =
  'Empiece por el catálogo o active Efficiency Gain Share: fee del operador solo sobre ahorro verificado, reparto configurable 70/20/10.';

/** @deprecated Legacy — no usar en landing activa */
export const HERO_INSPIRATION_LINE =
  'Imagina despertar sabiendo que quienes lideran, sirven.';

export const LANDING_INFRA_KICKER = LANDING_EXECUTION_KICKER;
export const LANDING_INFRA_TITLE = LANDING_EXECUTION_TITLE;
export const LANDING_INFRA_BODY = LANDING_EXECUTION_BODY;
