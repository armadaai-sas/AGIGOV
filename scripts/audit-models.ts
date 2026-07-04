#!/usr/bin/env tsx
/**
 * Auditoría automática de modelos AGIGOV — 3 etapas:
 * 1 técnica · 2 operacional · 3 comercial
 *
 * Genera data/model-validation-report.json y src/citizen/platform/modelValidationState.ts
 * Opcional: sincroniza status en agigovModels.ts (--sync, default ON)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  MODEL_EXECUTION_PROFILES,
  MODEL_JUSTIFICATION_SCORES,
  type ValidationStageKey,
} from '../src/citizen/platform/modelExecutionProfiles.js';

type StageResult = 'pass' | 'partial' | 'fail' | 'pending';

type ModelStatus = 'disponible' | 'beta' | 'roadmap';

type ModelAudit = {
  modelId: string;
  validatedAt: string;
  stages: Record<ValidationStageKey, StageResult>;
  approved: boolean;
  recommendedStatus: ModelStatus;
  notes: string[];
  missingPaths: string[];
  missingApi: string[];
};

const ROOT = process.cwd();
const PUBLIC_API = join(ROOT, 'src/server/public-api.ts');
const MODELS_TS = join(ROOT, 'src/citizen/platform/agigovModels.ts');

const STATUS_RANK: Record<ModelStatus, number> = {
  roadmap: 0,
  beta: 1,
  disponible: 2,
};

const args = process.argv.slice(2);
const syncEnabled = !args.includes('--no-sync');

function fileExists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

function apiRouteExists(routePrefix: string): boolean {
  if (!fileExists('src/server/public-api.ts')) return false;
  const src = readFileSync(PUBLIC_API, 'utf8');
  const needle = routePrefix.replace(/\/$/, '');
  return src.includes(needle);
}

function scoreStage(count: number, total: number): StageResult {
  if (total === 0) return 'pending';
  if (count === total) return 'pass';
  if (count > 0) return 'partial';
  return 'fail';
}

function deriveRecommendedStatus(stages: Record<ValidationStageKey, StageResult>): ModelAudit['recommendedStatus'] {
  const vals = Object.values(stages);
  if (vals.every((s) => s === 'pass')) return 'disponible';
  if (vals.filter((s) => s === 'pass' || s === 'partial').length >= 2) return 'beta';
  return 'roadmap';
}

function shouldSyncStatus(
  current: ModelStatus,
  recommended: ModelStatus,
  approved: boolean,
): boolean {
  if (current === recommended) return false;
  if (STATUS_RANK[current] > STATUS_RANK[recommended]) return true;
  if (approved && STATUS_RANK[recommended] > STATUS_RANK[current]) return true;
  return false;
}

function readCurrentStatus(modelId: string, src: string): ModelStatus | undefined {
  const blockRegex = new RegExp(
    `id:\\s*'${modelId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?status:\\s*'(disponible|beta|roadmap)'`,
  );
  const match = src.match(blockRegex);
  return match?.[1] as ModelStatus | undefined;
}

function syncAgigovModelsStatus(audits: ModelAudit[]): string[] {
  if (!existsSync(MODELS_TS)) return [];
  let src = readFileSync(MODELS_TS, 'utf8');
  const updated: string[] = [];

  for (const audit of audits) {
    const current = readCurrentStatus(audit.modelId, src);
    if (!current) continue;
    if (!shouldSyncStatus(current, audit.recommendedStatus, audit.approved)) continue;

    const blockRegex = new RegExp(
      `(id:\\s*'${audit.modelId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?status:\\s*)'(disponible|beta|roadmap)'`,
    );
    const next = src.replace(blockRegex, `$1'${audit.recommendedStatus}'`);
    if (next !== src) {
      src = next;
      updated.push(`${audit.modelId}: ${current} → ${audit.recommendedStatus}`);
    }
  }

  if (updated.length > 0) {
    writeFileSync(MODELS_TS, src);
  }
  return updated;
}

function auditModel(profile: (typeof MODEL_EXECUTION_PROFILES)[number]): ModelAudit {
  const notes: string[] = [];
  const missingPaths: string[] = [];
  const missingApi: string[] = [];

  const required = profile.requiredPaths ?? [];
  const foundPaths = required.filter((p) => {
    const ok = fileExists(p);
    if (!ok) missingPaths.push(p);
    return ok;
  });

  let tecnica = scoreStage(foundPaths.length, required.length);

  const optional = profile.optionalPaths ?? [];
  if (optional.length > 0 && tecnica === 'partial') {
    const optFound = optional.filter((p) => fileExists(p)).length;
    if (optFound > 0) {
      tecnica = 'pass';
      notes.push(`Etapa técnica elevada por ${optFound} ruta(s) opcional(es).`);
    }
  }

  const apiRoutes = profile.requiredApiRoutes ?? [];
  const foundApi = apiRoutes.filter((r) => {
    const ok = apiRouteExists(r);
    if (!ok) missingApi.push(r);
    return ok;
  });

  let operacional: StageResult = 'pending';
  if (apiRoutes.length === 0 && profile.consolePath) {
    operacional = fileExists('src/citizen/CitizenApp.tsx') ? 'partial' : 'fail';
    notes.push('Sin API dedicada; consola declarada en perfil.');
  } else {
    operacional = scoreStage(foundApi.length, apiRoutes.length);
  }

  if (profile.consolePath && operacional !== 'fail') {
    const appSrc = fileExists('src/citizen/CitizenApp.tsx')
      ? readFileSync(join(ROOT, 'src/citizen/CitizenApp.tsx'), 'utf8')
      : '';
    const pathFragment = profile.consolePath.split('?')[0]!;
    if (!appSrc.includes(pathFragment.replace(/^\//, '')) && !appSrc.includes(pathFragment)) {
      if (operacional === 'pass') operacional = 'partial';
      notes.push(`Consola ${profile.consolePath} no verificada en rutas PWA.`);
    }
  }

  // SET / consulta: demo cifrado OK pero nunca operación electoral plena
  if (profile.modelId === 'set' || profile.modelId === 'consulta-ciudadana') {
    if (!fileExists('src/pilot/set-vote.ts')) {
      operacional = operacional === 'pass' ? 'partial' : operacional;
      notes.push('Falta módulo set-vote.ts (cifrado + ledger commit).');
    } else {
      notes.push(
        'SET demo: boleta cifrada + commit firmado + recuento reproducible — no elección nacional.',
      );
      if (operacional === 'pass') operacional = 'partial';
    }
  }

  // IaaU: metering demo — conciliación ledger producción pendiente
  if (profile.modelId === 'iaau') {
    const hasMetering = fileExists('src/billing/metering.ts');
    if (!hasMetering) {
      operacional = 'fail';
      notes.push('Sin módulo metering IaaU en código.');
    } else {
      notes.push('Metering demo activo — conciliación ledger producción pendiente.');
      if (operacional === 'pass') operacional = 'partial';
    }
  }

  // Data Trust: pipeline demo — dictamen soberano + sandbox legal pendiente
  if (profile.modelId === 'data-trust') {
    const hasPipeline = fileExists('src/data-trust/aggregation.ts');
    if (!hasPipeline) {
      operacional = 'fail';
      notes.push('Data Trust bloqueado P2 — sin pipeline agregación.');
    } else {
      notes.push('Pipeline demo k-anonymized — dictamen soberano + sandbox legal pendiente.');
      if (operacional === 'pass') operacional = 'partial';
    }
  }

  const score = MODEL_JUSTIFICATION_SCORES[profile.modelId] ?? 0;
  const minScore = profile.minJustificationScore ?? 28;
  const docs = profile.businessDocPaths ?? [];
  const docsOk = docs.filter((d) => fileExists(d)).length;

  let comercial: StageResult = 'fail';
  if (score >= minScore && docsOk === docs.length) {
    comercial = 'pass';
  } else if (score >= minScore || docsOk > 0) {
    comercial = 'partial';
    notes.push(`Score justificación ${score}/${minScore}; docs ${docsOk}/${docs.length}.`);
  } else {
    notes.push(`Score justificación ${score} < ${minScore}.`);
  }

  const stages = { tecnica, operacional, comercial };
  const approved =
    tecnica === 'pass' &&
    operacional === 'pass' &&
    (comercial === 'pass' || (comercial === 'partial' && score >= minScore));

  return {
    modelId: profile.modelId,
    validatedAt: new Date().toISOString(),
    stages,
    approved,
    recommendedStatus: deriveRecommendedStatus(stages),
    notes,
    missingPaths,
    missingApi,
  };
}

function main() {
  const audits = MODEL_EXECUTION_PROFILES.map(auditModel);
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: audits.length,
      approved: audits.filter((a) => a.approved).length,
      disponible: audits.filter((a) => a.recommendedStatus === 'disponible').length,
      beta: audits.filter((a) => a.recommendedStatus === 'beta').length,
      roadmap: audits.filter((a) => a.recommendedStatus === 'roadmap').length,
    },
    models: audits,
  };

  const dataDir = join(ROOT, 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  const jsonPath = join(dataDir, 'model-validation-report.json');
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

  const tsPath = join(ROOT, 'src/citizen/platform/modelValidationState.ts');
  const tsBody = `/** AUTO-GENERATED — npm run models:audit — no editar a mano */
import type { ModelStatus } from './agigovModels.js';

export type ValidationStageResult = 'pass' | 'partial' | 'fail' | 'pending';

export type ModelValidationRecord = {
  modelId: string;
  validatedAt: string;
  stages: {
    tecnica: ValidationStageResult;
    operacional: ValidationStageResult;
    comercial: ValidationStageResult;
  };
  approved: boolean;
  recommendedStatus: ModelStatus;
  notes: readonly string[];
};

export const MODEL_VALIDATION_GENERATED_AT = ${JSON.stringify(report.generatedAt)} as const;

export const MODEL_VALIDATION: Record<string, ModelValidationRecord> = ${JSON.stringify(
    Object.fromEntries(
      audits.map((a) => [
        a.modelId,
        {
          modelId: a.modelId,
          validatedAt: a.validatedAt,
          stages: a.stages,
          approved: a.approved,
          recommendedStatus: a.recommendedStatus,
          notes: a.notes,
        },
      ]),
    ),
    null,
    2,
  )};

export function getModelValidation(modelId: string): ModelValidationRecord | undefined {
  return MODEL_VALIDATION[modelId];
}
`;

  writeFileSync(tsPath, tsBody);

  let synced: string[] = [];
  if (syncEnabled) {
    synced = syncAgigovModelsStatus(audits);
  }

  console.log('\n=== AGIGOV Model Audit ===\n');
  console.log(`Report: ${jsonPath}`);
  console.log(`State:  ${tsPath}`);
  if (syncEnabled) {
    console.log(`Sync:   agigovModels.ts (${synced.length} cambio(s))`);
  } else {
    console.log('Sync:   omitido (--no-sync)');
  }
  console.log('');
  for (const a of audits) {
    const icon = a.approved ? '✓' : '○';
    console.log(
      `${icon} ${a.modelId.padEnd(22)} T:${a.stages.tecnica.padEnd(7)} O:${a.stages.operacional.padEnd(7)} C:${a.stages.comercial.padEnd(7)} → ${a.recommendedStatus}`,
    );
  }
  if (synced.length > 0) {
    console.log('\nStatus sincronizados:');
    for (const line of synced) console.log(`  · ${line}`);
  }
  console.log(
    `\nAprobados: ${report.summary.approved}/${report.summary.total} · recomendado disponible: ${report.summary.disponible}\n`,
  );
}

main();
