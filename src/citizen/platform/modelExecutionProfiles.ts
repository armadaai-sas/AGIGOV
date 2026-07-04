/**
 * Perfil de ejecución esperado por modelo — usado por `scripts/audit-models.ts`.
 * No promete producción; define qué evidencia técnica debe existir en repo.
 */

export type ValidationStageKey = 'tecnica' | 'operacional' | 'comercial';

export type ModelExecutionProfile = {
  modelId: string;
  /** Rutas de código que deben existir para etapa técnica. */
  requiredPaths: readonly string[];
  /** Rutas opcionales que elevan técnica a pass si existen. */
  optionalPaths?: readonly string[];
  /** Prefijos de ruta API pública (`/api/public/...`). */
  requiredApiRoutes?: readonly string[];
  /** Consola PWA (sin host). */
  consolePath?: string;
  /** Docs de negocio / pricing referenciados. */
  businessDocPaths?: readonly string[];
  /** Score mínimo justificación (INVESTIGACION-NEGOCIO) para etapa comercial pass. */
  minJustificationScore?: number;
};

export const MODEL_EXECUTION_PROFILES: readonly ModelExecutionProfile[] = [
  {
    modelId: 'egs',
    requiredPaths: [
      'src/db/egs/quarter-close.ts',
      'src/db/egs/reconcile-quarter-close.ts',
      'src/pilot/egs-public.ts',
    ],
    requiredApiRoutes: ['/api/public/egs/ministry-health'],
    consolePath: '/modelos/egs/consola',
    businessDocPaths: ['docs/AGIGOV/INVESTIGACION-NEGOCIO-GANAR-GANAR.md'],
    minJustificationScore: 32,
  },
  {
    modelId: 'escrow-institucional',
    requiredPaths: ['src/db/ledger/index.ts', 'src/agents/handlers/centinela.ts'],
    requiredApiRoutes: ['/api/public/egs/contracts/'],
    consolePath: '/contratos',
    businessDocPaths: ['docs/AGIGOV/MODELOS-SERVICIOS.md'],
    minJustificationScore: 32,
  },
  {
    modelId: 'gestion-verificable',
    requiredPaths: ['src/server/public-api.ts'],
    requiredApiRoutes: ['/api/public/dashboard'],
    consolePath: '/gestion',
    minJustificationScore: 28,
  },
  {
    modelId: 'set',
    requiredPaths: ['src/pilot/cne-consulta.ts', 'src/pilot/set-vote.ts'],
    requiredApiRoutes: ['/api/public/cne/consultation', '/api/public/cne/vote'],
    consolePath: '/cne',
    businessDocPaths: ['docs/AGIGOV/CNE-TOKENIZADO.md'],
    minJustificationScore: 28,
  },
  {
    modelId: 'participacion',
    requiredPaths: ['src/pilot/citizen-proposals.ts', 'src/agents/handlers/soberano.ts'],
    requiredApiRoutes: ['/api/public/proposals'],
    consolePath: '/propuestas',
    minJustificationScore: 28,
  },
  {
    modelId: 'dao-ciudadano',
    requiredPaths: ['src/pilot/projects-public.ts'],
    requiredApiRoutes: ['/api/public/projects', '/api/public/contributions'],
    consolePath: '/proyectos',
    businessDocPaths: ['docs/AGIGOV/ECONOMIA-DAO.md'],
    minJustificationScore: 25,
  },
  {
    modelId: 'consulta-ciudadana',
    requiredPaths: ['src/pilot/cne-consulta.ts'],
    requiredApiRoutes: ['/api/public/cne/consultation'],
    consolePath: '/cne',
    minJustificationScore: 28,
  },
  {
    modelId: 'evidencia-certificada',
    requiredPaths: ['src/protocol/envelope.ts', 'src/server/public-api.ts'],
    optionalPaths: ['src/bus/run-worker.ts'],
    requiredApiRoutes: ['/api/public/openapi.json'],
    consolePath: '/desarrolladores',
    minJustificationScore: 32,
  },
  {
    modelId: 'iaau',
    requiredPaths: ['src/billing/metering.ts'],
    requiredApiRoutes: ['/api/public/billing/usage'],
    businessDocPaths: [
      'docs/AGIGOV/INVESTIGACION-NEGOCIO-GANAR-GANAR.md',
      'docs/innovation/2026-07-03-cuadro-modelos-monetizacion-agigov.md',
    ],
    minJustificationScore: 31,
  },
  {
    modelId: 'data-trust',
    requiredPaths: ['src/data-trust/aggregation.ts'],
    requiredApiRoutes: ['/api/public/data-trust/datasets'],
    businessDocPaths: ['docs/AGIGOV/INVESTIGACION-NEGOCIO-GANAR-GANAR.md'],
    minJustificationScore: 22,
  },
] as const;

/** Scorecard justificación estática (INVESTIGACION-NEGOCIO-GANAR-GANAR §2.1). */
export const MODEL_JUSTIFICATION_SCORES: Record<string, number> = {
  egs: 33,
  'escrow-institucional': 33,
  'gestion-verificable': 30,
  set: 30,
  participacion: 29,
  'dao-ciudadano': 25,
  'consulta-ciudadana': 29,
  'evidencia-certificada': 33,
  iaau: 31,
  'data-trust': 22,
};

export function getExecutionProfile(modelId: string): ModelExecutionProfile | undefined {
  return MODEL_EXECUTION_PROFILES.find((p) => p.modelId === modelId);
}
