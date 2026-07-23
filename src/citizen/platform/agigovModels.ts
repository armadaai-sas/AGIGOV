import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Building2,
  Coins,
  Database,
  FileText,
  Landmark,
  Scale,
  Server,
  ShieldCheck,
  TrendingDown,
  Users,
  Vote,
} from 'lucide-react';

/** Audiencia principal del modelo AGIGOV. */
export type ModelAudience = 'gubernamental' | 'empresarial' | 'ciudadano';

export type ModelStatus = 'disponible' | 'beta' | 'roadmap';

export type AgigovModel = {
  id: string;
  name: string;
  shortName: string;
  audience: ModelAudience;
  status: ModelStatus;
  icon: LucideIcon;
  tagline: string;
  /** Problema de eficiencia / confianza que resuelve. */
  problem: string;
  /** Para qué sirve en una frase operativa. */
  purpose: string;
  /** Por qué es vital para el Estado, la empresa o el ciudadano. */
  whyVital: string;
  benefits: readonly string[];
  howItWorks: readonly string[];
  businessModel: {
    payer: string;
    mechanism: string;
    metric: string;
  };
  operationalModel: {
    agents: string;
    flow: string;
    evidence: string;
  };
  productPath: string;
  consolePath?: string;
  keywords: string;
};

const BASE = '/modelos';

export const EGS_MODEL_PATH = `${BASE}/egs`;
export const EGS_CONSOLE_PATH = `${BASE}/egs/consola`;

export const AGIGOV_MODELS: readonly AgigovModel[] = [
  {
    id: 'egs',
    name: 'Efficiency Gain Share',
    shortName: 'EGS',
    audience: 'gubernamental',
    status: 'disponible',
    icon: TrendingDown,
    tagline: 'Fee solo sobre ahorro fiscal verificado',
    problem:
      'El Estado ejecuta presupuesto con opacidad: pagos sin hito, sobrecostos no detectados y cierres trimestrales manuales propensos a discrepancia.',
    purpose:
      'Reconciliar baseline presupuestario vs gasto trazado en ledger, calcular el ahorro verificado y repartirlo bajo reglas publicadas (re-inversión, mérito, fee del operador).',
    whyVital:
      'Permite defender ante contraloría y ciudadanía que cada unidad monetaria ahorrada es auditable — sin fee si no hay ahorro real. Alinea incentivos del operador con eficiencia, no con gasto.',
    benefits: [
      'Cierre trimestral automático con centinela',
      'Smart Escrow ligado a hitos verificables',
      'Reparto configurable sobre ahorro verificado (ej. 70/20/10)',
      'Congelamiento humano ante discrepancia',
    ],
    howItWorks: [
      'Acta baseline multi-sig fija el techo presupuestario',
      'Logístico registra ejecución e hitos en escrow',
      'Centinela reconcilia antes del Q-Close',
      'Comunicador publica ahorro y reparto en dashboard',
    ],
    businessModel: {
      payer: 'Entidad pública (tesorería / ministerio)',
      mechanism: 'Success fee sobre ahorro certificado — típico 5–15% del ahorro',
      metric: 'Ahorro neto verificable vs baseline firmada',
    },
    operationalModel: {
      agents: 'Centinela · Logístico · Soberano · Comunicador',
      flow: 'Baseline → ejecución → reconciliación → Q-Close → reparto',
      evidence: 'Ledger inmutable + acta multi-sig + hashes de hitos',
    },
    productPath: `${BASE}/egs`,
    consolePath: `${BASE}/egs/consola`,
    keywords: 'presupuesto ahorro escrow quarter close eficiencia fiscal',
  },
  {
    id: 'set',
    name: 'Sistema Electoral Tokenizado',
    shortName: 'SET',
    audience: 'gubernamental',
    status: 'beta',
    icon: Vote,
    tagline: 'Emisión, recuento y auditoría de votos verificables',
    problem:
      'Los procesos electorales tradicionales concentran confianza en actas opacas, recuentos no reproducibles y vulnerabilidad a fraude cibernético o manipulación manual.',
    purpose:
      'Emitir votos cifrados, registrar commits en ledger sin PII pública, permitir recuento reproducible y verificación ciudadana del sufragio sin comprometer el secreto del voto.',
    whyVital:
      'La legitimidad del Estado depende de elecciones auditables. SET separa identidad (off-chain) de boleta (hash-linked) y congela el proceso ante anomalías — requisito para democracia verificable en era digital.',
    benefits: [
      'Voto cifrado end-to-end sin PII en ledger público',
      'Recuento reproducible por auditores independientes',
      'Receipt verificable por el ciudadano',
      'FREEZE centinela ante patrones anómalos',
    ],
    howItWorks: [
      'Ciudadano emite voto con DID wallet-less',
      'Cola edge tolera desconexión',
      'Core consolida con multi-sig de la autoridad electoral',
      'Agregados publicados; detalle cifrado hasta cierre legal',
    ],
    businessModel: {
      payer: 'Autoridad electoral / Estado',
      mechanism: 'Licencia por proceso electoral + módulo de auditoría continua',
      metric: 'Elecciones certificadas sin incidente centinela material',
    },
    operationalModel: {
      agents: 'Centinela · Soberano · Comunicador',
      flow: 'Emisión → commit → recuento → publicación → auditoría',
      evidence: 'Hash chain por mesa/territorio + acta multi-sig',
    },
    productPath: `${BASE}/set`,
    keywords: 'elecciones voto recuento auditoría electoral',
  },
  {
    id: 'escrow-institucional',
    name: 'Escrow Institucional',
    shortName: 'Escrow',
    audience: 'gubernamental',
    status: 'disponible',
    icon: ShieldCheck,
    tagline: 'Pagos públicos liberados solo con evidencia de hito',
    problem:
      'Contratos públicos pagan por adelantado o sin trazabilidad de entrega: capital inmovilizado, sobrefacturación y disputas sin prueba compartida.',
    purpose:
      'Bloquear fondos en smart escrow, liberar tramos solo cuando centinela valida evidencia (IoT, documental, auditores), manteniendo cadena de custodia publicable.',
    whyVital:
      'Reduce corrupcción estructural en cadena de pagos: el proveedor cobra al cumplir, el Estado no pierde leverage y la contraloría ve el mismo ledger que el ministerio.',
    benefits: [
      'LOCKED → VALIDATED → RELEASED por hito',
      'Multi-sig antes de liberaciones irreversibles',
      'Cadena de custodia por contrato',
      'Integración con sensores y auditores',
    ],
    howItWorks: [
      'Soberano valida marco contractual',
      'Logístico programa liberaciones',
      'Centinela valida evidencia por hito',
      'Comunicador publica estado por contrato',
    ],
    businessModel: {
      payer: 'Ministerio / entidad contratante',
      mechanism: 'Fee por contrato activo o % sobre monto liberado verificado',
      metric: 'Hitos liberados sin discrepancia centinela',
    },
    operationalModel: {
      agents: 'Logístico · Centinela · Conciliador (disputas)',
      flow: 'Contrato → escrow → hitos → validación → pago',
      evidence: 'Evidencia firmada + validators triple (centinela, IoT, ciudadanos)',
    },
    productPath: `${BASE}/escrow-institucional`,
    consolePath: '/contratos',
    keywords: 'contratos hitos pagos cadena custodia licitación',
  },
  {
    id: 'gestion-verificable',
    name: 'Gestión Pública Verificable',
    shortName: 'Ledger',
    audience: 'gubernamental',
    status: 'disponible',
    icon: Landmark,
    tagline: 'Telemetría de gestión publicada sin datos personales',
    problem:
      'Ciudadanos y contralorías no pueden distinguir gestión real de relato institucional: reportes tardíos, agregados no reproducibles y opacidad selectiva.',
    purpose:
      'Publicar telemetría de actos institucionales (propuestas, commits, reportes) desde ledger verificable, con pipeline received → validated → decided → published.',
    whyVital:
      'Sin rendición de cuentas verificable no hay confianza fiscal ni política. Este modelo es la capa de transparencia mínima antes de EGS o escrow avanzado.',
    benefits: [
      'Dashboard público sin PII',
      'Pipeline institucional auditable',
      'Sincronización offline-first en nodos',
      'Base para auditoría continua',
    ],
    howItWorks: [
      'Agentes procesan actos con evidenceBundle',
      'Solo estado published llega a API pública',
      'Centinela bloquea irregularidades (FREEZE)',
      'Comunicador renderiza telemetría ciudadana',
    ],
    businessModel: {
      payer: 'Estado / contraloría',
      mechanism: 'Suscripción anual de auditoría continua + despliegue nodo',
      metric: 'Cero discrepancias material centinela en periodo',
    },
    operationalModel: {
      agents: 'Comunicador · Centinela · Soberano',
      flow: 'Acto → validación → commit → publicación',
      evidence: 'Ledger entries + reportes publicados',
    },
    productPath: `${BASE}/gestion-verificable`,
    consolePath: '/gestion',
    keywords: 'transparencia telemetría dashboard ledger público',
  },
  {
    id: 'iaau',
    name: 'Infraestructura como Utilidad',
    shortName: 'IaaU',
    audience: 'empresarial',
    status: 'beta',
    icon: Server,
    tagline: 'Pago por unidad de confianza verificada',
    problem:
      'Governments e integradores compran suites monolíticas caras con baja utilización; el costo marginal de una firma, un hito o un sync no está alineado al uso real.',
    purpose:
      'Facturar micro-unidades verificables: firma IAP, commit ledger, validación hito, sync nodo, consulta API certificada — modelo cloud utility sobre protocolo AGIGOV.',
    whyVital:
      'Escala adopción sin CAPEX inicial: estados pequeños e integradores pagan lo que consumen; AGIGOV sostiene infra sin depender de un solo success fee fiscal.',
    benefits: [
      'Costo predecible por volumen',
      'Metering auditable vs ledger',
      'API tier para integradores certificados',
      'Sin lock-in de licencia anual opaca',
    ],
    howItWorks: [
      'Ejecución genera evento metered',
      'Centinela cruza metering ↔ ledger',
      'Factura mensual jurisdicción / integrador',
      'Topes definidos en carta institucional',
    ],
    businessModel: {
      payer: 'Estado + integradores B2G',
      mechanism: 'Micro-fee por unidad verificada (firma, hito, sync, API)',
      metric: 'Tx/día firmadas vs costo infra + margen',
    },
    operationalModel: {
      agents: 'Logístico · Centinela',
      flow: 'Uso → metering → conciliación → factura',
      evidence: 'Registro metering + hash ledger',
    },
    productPath: `${BASE}/iaau`,
    keywords: 'api nodo utility metering integradores',
  },
  {
    id: 'data-trust',
    name: 'Data Trust Partnership',
    shortName: 'Data Trust',
    audience: 'empresarial',
    status: 'beta',
    icon: Database,
    tagline: 'Agregados verificables sin PII para decisiones de mercado',
    problem:
      'Empresas operan con datos país/sector poco confiables; el Estado tiene agregados útiles pero no puede compartirlos sin riesgo de re-identificación o captura.',
    purpose:
      'Publicar agregados k-anonymizados derivados del ledger (tiempos de pago, ejecución por rubro, índices de integridad) bajo licencia y dictamen soberano.',
    whyVital:
      'Monetiza transparencia sin vender ciudadanos: financia infra pública y mejora ecosistema B2G cuando marco legal y centinela garantizan privacidad.',
    benefits: [
      'k-anonymity obligatorio',
      'Auditoría anti re-identificación',
      'API enterprise tier',
      'Ingreso al tesoro o DAO sectorial',
    ],
    howItWorks: [
      'Pipeline ETL de agregación',
      'Centinela + dictamen soberano previo',
      'Licencia por sector / dataset',
      'Publicación de metadatos de uso en ledger',
    ],
    businessModel: {
      payer: 'Empresas privadas (analytics, seguros, logística)',
      mechanism: 'Suscripción API premium + revenue share opcional con DAO',
      metric: 'Revenue positivo mes 6; 0 incidentes re-ID',
    },
    operationalModel: {
      agents: 'Centinela · Soberano · Comunicador',
      flow: 'Agregación → auditoría → licencia → API',
      evidence: 'Dictamen conforme + logs de acceso',
    },
    productPath: `${BASE}/data-trust`,
    keywords: 'datos agregados privacidad enterprise analytics',
  },
  {
    id: 'evidencia-certificada',
    name: 'API de Evidencia Certificada',
    shortName: 'Evidencia API',
    audience: 'empresarial',
    status: 'disponible',
    icon: Building2,
    tagline: 'Contratistas demuestran hitos sin fricción administrativa',
    problem:
      'Proveedores del Estado pierden meses cobrando: evidencia en silos, validación manual y disputas sin formato común de prueba.',
    purpose:
      'Permitir que integradores certificados envíen evidencia firmada (IAP) consumible por escrow institucional y centinela — acelerando liberación de pagos.',
    whyVital:
      'Conecta capacidad privada con controles públicos: menos capital inmovilizado, más competencia real en licitaciones trazables.',
    benefits: [
      'Envelopes IAP firmados',
      'Anti-replay y DID registry',
      'Webhook a escrow al validar',
      'OpenAPI para integradores',
    ],
    howItWorks: [
      'Integrador registra DID en registry',
      'Envía evidencia vía API / bus MQTT',
      'Centinela valida firma y frescura',
      'Escrow recibe señal de liberación',
    ],
    businessModel: {
      payer: 'Integradores / contratistas certificados',
      mechanism: 'Certificación anual + fee por evidencia aceptada',
      metric: 'Tiempo medio validación hito ↓ vs manual',
    },
    operationalModel: {
      agents: 'Centinela · Logístico',
      flow: 'Evidencia → validación → señal escrow',
      evidence: 'SignedAgentEnvelope v1',
    },
    productPath: `${BASE}/evidencia-certificada`,
    consolePath: '/desarrolladores',
    keywords: 'api integradores contratistas openapi iap',
  },
  {
    id: 'dao-ciudadano',
    name: 'Prosperidad Compartida (DAO)',
    shortName: 'DAO',
    audience: 'ciudadano',
    status: 'disponible',
    icon: Coins,
    tagline: 'Proyectos co-financiados con escrow visible',
    problem:
      'Comunidades aportan a obras o causas sin visibilidad del destino del dinero: desconfianza, duplicidad de esfuerzos y captura de fondos.',
    purpose:
      'Agrupar aportes ciudadanos en escrow programático, liberar por hitos publicados y mostrar avance en dashboard — democratizando inversión social trazable.',
    whyVital:
      'Recupera confianza horizontal entre ciudadanos cuando el vertical institucional falla; complementa presupuesto público sin opacidad de crowdfunding tradicional.',
    benefits: [
      'Aportes trazables por proyecto',
      'Escrow LOCKED hasta hito',
      'Voto DAO sobre propuestas',
      'Recibos verificables de aporte',
    ],
    howItWorks: [
      'Propuesta publicada tras dictamen',
      'Ciudadanos aportan (demo o fiat según marco)',
      'Escrow acumula hasta umbral',
      'Hitos liberan fondos con evidencia',
    ],
    businessModel: {
      payer: 'Ciudadanos + patrocinadores institucionales',
      mechanism: 'Fee simbólico sobre aporte o patrocinio institucional del pool',
      metric: 'Fondos liberados / fondos comprometidos',
    },
    operationalModel: {
      agents: 'Soberano · Logístico · Comunicador',
      flow: 'Propuesta → aporte → escrow → hitos → publicación',
      evidence: 'Contribution receipt + ledger entry',
    },
    productPath: `${BASE}/dao-ciudadano`,
    consolePath: '/proyectos?tab=dao',
    keywords: 'dao aportes proyectos escrow ciudadano',
  },
  {
    id: 'participacion',
    name: 'Participación y Dictamen Ciudadano',
    shortName: 'Participación',
    audience: 'ciudadano',
    status: 'disponible',
    icon: FileText,
    tagline: 'Propuestas con trazabilidad hasta resolución publicada',
    problem:
      'La participación ciudadana termina en buzones sin respuesta: propuestas no tienen estado, dictamen ni prueba de que fueron leídas por el aparato estatal.',
    purpose:
      'Canalizar propuestas con pipeline institucional, dictamen soberano y publicación — cerrando el ciclo received → validated → decided → published.',
    whyVital:
      'Sin cierre visible del ciclo participativo, la democracia deliberativa es teatro. Este modelo obliga al Estado a responder con hechos en ledger, no con comunicados.',
    benefits: [
      'Estado visible por propuesta',
      'Dictamen vinculante según carta',
      'Anti-spam y firmas verificables',
      'Histórico público de resoluciones',
    ],
    howItWorks: [
      'Ciudadano envía propuesta firmada',
      'Soberano evalúa vs marco normativo',
      'Conciliador media disputas entre actores',
      'Comunicador publica resolución',
    ],
    businessModel: {
      payer: 'Jurisdicción (licencia AGIGOV)',
      mechanism: 'Incluido en despliegue institucional; premium por volumen',
      metric: 'Tiempo medio resolución publicada',
    },
    operationalModel: {
      agents: 'Soberano · Conciliador · Comunicador',
      flow: 'Propuesta → dictamen → commit → publicación',
      evidence: 'evidenceBundle + dictamen hash',
    },
    productPath: `${BASE}/participacion`,
    consolePath: '/propuestas',
    keywords: 'propuestas dictamen participación ciudadana',
  },
  {
    id: 'consulta-ciudadana',
    name: 'Consulta Ciudadana Verificable',
    shortName: 'Consulta',
    audience: 'ciudadano',
    status: 'beta',
    icon: Users,
    tagline: 'Consultas vinculantes o deliberativas con recuento auditable',
    problem:
      'Consultas populares ad hoc carecen de estándar técnico: resultados disputados, baja participación por desconfianza y sin interoperabilidad con procesos formales.',
    purpose:
      'Ejecutar consultas territoriales con emisión verificable, agregación publicada y opcional vinculación normativa — reutilizando capa SET simplificada.',
    whyVital:
      'Permite decisiones legítimas en barrio, municipio o sector sin costo de elección plena; puente entre participación continua y sufragio formal.',
    benefits: [
      'Recuento reproducible',
      'Participación remote + edge offline',
      'Resultados publicados en PWA',
      'Escalable a consultas no electorales',
    ],
    howItWorks: [
      'Autoridad convoca consulta con quórum definido',
      'Ciudadanos emiten preferencia cifrada',
      'Centinela valida integridad del proceso',
      'Resultado publicado con acta multi-sig',
    ],
    businessModel: {
      payer: 'Municipio / ente convocante',
      mechanism: 'Fee por consulta + módulo SET lite',
      metric: 'Consultas cerradas sin incidente FREEZE',
    },
    operationalModel: {
      agents: 'Centinela · Comunicador · Soberano',
      flow: 'Convocatoria → emisión → cierre → publicación',
      evidence: 'Acta + agregados + hashes de urna digital',
    },
    productPath: `${BASE}/consulta-ciudadana`,
    consolePath: '/cne',
    keywords: 'consulta referendo participación territorial',
  },
] as const;

export const MODEL_AUDIENCE_LABEL: Record<ModelAudience, string> = {
  gubernamental: 'Gubernamental',
  empresarial: 'Empresarial',
  ciudadano: 'Ciudadano',
};

export const MODEL_AUDIENCE_ORDER: readonly ModelAudience[] = [
  'gubernamental',
  'empresarial',
  'ciudadano',
];

export function getAgigovModel(id: string): AgigovModel | undefined {
  return AGIGOV_MODELS.find((m) => m.id === id);
}

export function modelsByAudience(audience: ModelAudience): readonly AgigovModel[] {
  return AGIGOV_MODELS.filter((m) => m.audience === audience);
}

export function filterModels(query: string): AgigovModel[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...AGIGOV_MODELS];
  return AGIGOV_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.shortName.toLowerCase().includes(q) ||
      m.tagline.toLowerCase().includes(q) ||
      m.keywords.toLowerCase().includes(q) ||
      MODEL_AUDIENCE_LABEL[m.audience].toLowerCase().includes(q),
  );
}

/** @deprecated Usar `LEGACY_VEN_REDIRECTS` en `./legacyRedirects.js` */
export { LEGACY_VEN_REDIRECT_TARGETS as LEGACY_VEN_REDIRECTS } from './legacyRedirects.js';
