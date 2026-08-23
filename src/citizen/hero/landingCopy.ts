/** @deprecated Use `useLandingCopy()` + `src/i18n/` — copy estático solo para referencia. */
/** Copy hero — producción · conversión institucional. */

export const HERO_EYEBROW = 'Organización oficial';

export const HERO_CINEMATIC_TITLE = 'El OS multi-agente del Estado.';
export const HERO_CINEMATIC_TAGLINE = 'Gobernanza 2.0';
export const HERO_CINEMATIC_SUBLINE =
  'Kernel de evidencia · FREEZE · apps operativas (EGS…). El LLM es opcional — y siempre subordinado al Centinela.';
export const HERO_CINEMATIC_LIVE_CAPTION = 'Consola en vivo · datos del entorno de prueba MPPI';

export const HERO_SCREEN_LABELS = ['Demo', 'Ruta', 'Piloto'] as const;

export const HERO_CTA_STAGE_TITLE = 'Empiece por un rubro acotado';
export const HERO_CTA_STAGE_LEAD =
  '90 días. Un ministerio, un rubro, un cierre firmado — comisión solo si hay ahorro verificable.';
export const HERO_CTA_MICRO = 'Entorno de prueba público · sin registro · piloto validado 3×';

export const HERO_TRUST_LINE =
  'Ed25519 · decisión humana · centinela antes de publicar';

export const HERO_TITLE = 'El sistema operativo del Estado moderno';
export const HERO_TITLE_ACCENT = 'Gobernanza 2.0';

export const HERO_LEAD =
  'Herramientas de eficiencia y transparencia para quienes ya gobiernan y sirven.';

export const HERO_CTA_PRIMARY = {
  label: 'Prueba el modelo',
  path: '/modelos/egs/consola',
} as const;

export const HERO_CTA_SECONDARY = {
  label: 'Ver ficha del piloto',
  path: '/modelos/egs',
} as const;

/** @deprecated Usar HERO_TRUST_LINE */
export const HERO_TRUST_SEALS = [
  'Piloto fiscal 3× en el entorno de prueba',
  'Firmas Ed25519',
  'decisión humana',
] as const;

export const HERO_REASSURANCE = [
  {
    id: 'humans',
    title: 'Personas deciden',
    body: 'Firma, acta y responsabilidad — no automatismos opacos.',
  },
  {
    id: 'tools',
    title: 'Encima de lo existente',
    body: 'ERP, planillas y actas que ya usan — sin reemplazar su stack.',
  },
  {
    id: 'trust',
    title: 'Transparencia con criterio',
    body: 'Publicación acordada, sin datos personales expuestos.',
  },
] as const;

export const HERO_FIRST_MODEL = {
  kicker: 'Primer modelo',
  name: 'Trust Pilot Fiscal',
  subtitle: 'Efficiency Gain Share',
  description:
    'Cierre verificable de un rubro en 90 días. comisión solo si hay ahorro real verificado.',
  cta: 'Primer modelo',
  path: '/modelos/egs',
  demoPath: '/modelos/egs/consola',
  demoLabel: 'Abrir consola',
} as const;

export const HERO_GOVERNANCE_COMPARE = {
  kicker: 'Por qué Gobernanza 2.0',
  title: 'La misma institución. Mejor información para decidir.',
  lead:
    'Mismos equipos, mismas leyes — una capa de evidencia que reduce fricción, aumenta legitimidad y protege la gestión.',
  dimensions: [
    {
      id: 'efficiency',
      label: 'Eficiencia',
      traditional: 'Informes tardíos, retrabajo entre tesorería y contraloría',
      governance2: 'Una verdad compartida; cierre trimestral reproducible',
    },
    {
      id: 'results',
      label: 'Resultados',
      traditional: 'Difícil demostrar ahorro real o priorizar obra publicada',
      governance2: 'Ahorro verificable, reparto EGS y comisión solo sobre ahorro certificado',
    },
    {
      id: 'security',
      label: 'Seguridad',
      traditional: 'PDFs sin trazabilidad; versiones del dato por área',
      governance2: 'Firmas Ed25519, centinela FREEZE, actas antes de publicar',
    },
    {
      id: 'citizens',
      label: 'Para el pueblo',
      traditional: 'Transparencia en teatro — datos sin contexto verificable',
      governance2: 'Publicación acordada, sin PII; gestión defendible ante la ciudadanía',
    },
  ],
  traditionalLabel: 'Tradicional',
  governance2Label: 'Gobernanza 2.0',
  cta: 'Explorar el piloto fiscal',
  ctaPath: '/modelos/egs',
} as const;

export const HERO_PIPELINE_STEPS = [
  { id: 'received', label: 'Recibido' },
  { id: 'validated', label: 'Validado' },
  { id: 'decided', label: 'Decidido' },
  { id: 'committed', label: 'Comprometido' },
  { id: 'published', label: 'Publicado' },
] as const;

export const HERO_PIPELINE_CAPTION =
  'Centinela congela si algo no cuadra — antes de publicar como oficial.';

export const HERO_VALUE_STRIP = [
  { label: 'Menos fricción', hint: 'Una verdad para tesorería y contraloría' },
  { label: 'Más legitimidad', hint: 'Gestión publicable, sin teatro' },
  { label: 'Incentivos honestos', hint: 'comisión solo sobre ahorro certificado' },
] as const;

export const LANDING_MODELS_KICKER = 'Modelos modulares';
export const LANDING_MODELS_TITLE = 'Un motor. Distintas funciones del Estado.';
export const LANDING_MODELS_BODY =
  'Empiece por el piloto fiscal; el catálogo crece con actas institucionales, no con promesas.';

export const LANDING_CTA_TITLE = 'Vea el cierre fiscal en su propio ritmo';
export const LANDING_CTA_LEAD =
  'Abra la consola, recorra el catálogo o agende una conversación sobre un rubro concreto.';
export const LANDING_CTA_MICRO = 'Sin compromiso institucional para explorar el entorno de prueba';

/** @deprecated */
export const LANDING_CHALLENGE_KICKER = 'Contexto';
export const LANDING_CHALLENGE_TITLE = LANDING_MODELS_TITLE;
export const LANDING_CHALLENGE_LEAD = LANDING_MODELS_BODY;
export const LANDING_CHALLENGE_BODY = '';
export const HERO_PRICING_STRIP = HERO_VALUE_STRIP;
export const HERO_INSPIRATION_LINE = '';
export const LANDING_EXECUTION_KICKER = 'Ejecución';
export const LANDING_EXECUTION_TITLE = 'Pipeline institucional';
export const LANDING_EXECUTION_BODY = HERO_PIPELINE_CAPTION;
export const LANDING_INFRA_KICKER = LANDING_EXECUTION_KICKER;
export const LANDING_INFRA_TITLE = LANDING_EXECUTION_TITLE;
export const LANDING_INFRA_BODY = LANDING_EXECUTION_BODY;
