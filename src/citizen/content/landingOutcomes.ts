/** Copy landing — hoy → resultado (utilidad general y por modelo). */

export const LANDING_UTILITY_GENERAL = {
  title: 'Hacia dónde llegamos',
  lead:
    'Gobernar con más eficiencia y transparencia. Hoy el Estado arrastra procesos opacos; el ciudadano no ve el beneficio concreto. AGIGOV despliega modelos multi-agente para que el resultado sea más organización verificable en lo público y beneficio claro en lo ciudadano — no otro chatbot que opina.',
} as const;

export const LANDING_OPEN_SOURCE = {
  title: 'Código abierto',
  lead:
    'Protocolo, modelos y reglas en GitHub — auditables por cualquiera. Estados e integradores proponen mejoras; la ciudadanía verifica lo publicado. Construcción continua con transparencia, no caja negra.',
  repoUrl: 'https://github.com/armadaai-sas/AGIGOV',
  repoLabel: 'Repositorio en GitHub',
  repoMeta: 'Issues, PRs y documentación del protocolo',
  devPath: '/desarrolladores',
  devLabel: 'Desarrolladores',
  devMeta: 'API, health del nodo e integradores',
} as const;

export type ModelOutcomeCopy = {
  modelId: string;
  today: string;
  outcome: string;
  citizen: string;
  state: string;
};

/** Orden catálogo en home — alineado a modelos desplegables. */
export const MODEL_OUTCOME_COPIES: readonly ModelOutcomeCopy[] = [
  {
    modelId: 'egs',
    today: 'Gasto sin hito claro y cierres trimestrales manuales.',
    outcome: 'Cierre publicado con ahorro verificado y reparto acordado.',
    citizen: 'Ve el ahorro y cómo se reinvierte.',
    state: 'Defiende el rubro ante auditoría con acta y registro.',
  },
  {
    modelId: 'escrow-institucional',
    today: 'Pagos adelantados o retenidos sin reglas visibles.',
    outcome: 'Liberación solo cuando la evidencia del hito sostiene el pago.',
    citizen: 'Confía de que el dinero sigue el contrato.',
    state: 'Compras y tesorería alineadas al mismo rubro.',
  },
  {
    modelId: 'gestion-verificable',
    today: 'Informes dispersos o sin telemetría comparable.',
    outcome: 'Panel de gestión publicado sin datos personales crudos.',
    citizen: 'Consulta resultados sin depender de rumores.',
    state: 'Transparencia operativa con custodia de lo sensible.',
  },
  {
    modelId: 'evidencia-certificada',
    today: 'Meses validando PDFs en silos entre contratista y pagador.',
    outcome: 'Evidencia firmada consumible por custodia y centinela.',
    citizen: 'Obras y servicios pagados más rápido si cumplen.',
    state: 'Menos fricción administrativa en cada hito.',
  },
  {
    modelId: 'participacion',
    today: 'Propuestas ciudadanas sin seguimiento publicado.',
    outcome: 'Trazabilidad hasta dictamen y resolución en registro.',
    citizen: 'Sabe qué pasó con su propuesta.',
    state: 'Participación con reglas, no solo buzones.',
  },
  {
    modelId: 'set',
    today: 'Recuento opaco — confianza solo en el acta final.',
    outcome: 'Sufragio auditable con recuento reproducible.',
    citizen: 'Puede verificar que su voto contó.',
    state: 'Legitimidad electoral demostrable.',
  },
] as const;
