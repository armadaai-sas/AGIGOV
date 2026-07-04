/** AUTO-GENERATED — npm run models:audit — no editar a mano */
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

export const MODEL_VALIDATION_GENERATED_AT = "2026-07-04T16:24:31.556Z" as const;

export const MODEL_VALIDATION: Record<string, ModelValidationRecord> = {
  "egs": {
    "modelId": "egs",
    "validatedAt": "2026-07-04T16:24:31.517Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "pass",
      "comercial": "pass"
    },
    "approved": true,
    "recommendedStatus": "disponible",
    "notes": []
  },
  "escrow-institucional": {
    "modelId": "escrow-institucional",
    "validatedAt": "2026-07-04T16:24:31.554Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "pass",
      "comercial": "pass"
    },
    "approved": true,
    "recommendedStatus": "disponible",
    "notes": []
  },
  "gestion-verificable": {
    "modelId": "gestion-verificable",
    "validatedAt": "2026-07-04T16:24:31.554Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "pass",
      "comercial": "pass"
    },
    "approved": true,
    "recommendedStatus": "disponible",
    "notes": []
  },
  "set": {
    "modelId": "set",
    "validatedAt": "2026-07-04T16:24:31.554Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "partial",
      "comercial": "pass"
    },
    "approved": false,
    "recommendedStatus": "beta",
    "notes": [
      "SET demo: boleta cifrada + commit firmado + recuento reproducible — no elección nacional."
    ]
  },
  "participacion": {
    "modelId": "participacion",
    "validatedAt": "2026-07-04T16:24:31.555Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "pass",
      "comercial": "pass"
    },
    "approved": true,
    "recommendedStatus": "disponible",
    "notes": []
  },
  "dao-ciudadano": {
    "modelId": "dao-ciudadano",
    "validatedAt": "2026-07-04T16:24:31.555Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "pass",
      "comercial": "pass"
    },
    "approved": true,
    "recommendedStatus": "disponible",
    "notes": []
  },
  "consulta-ciudadana": {
    "modelId": "consulta-ciudadana",
    "validatedAt": "2026-07-04T16:24:31.555Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "partial",
      "comercial": "pass"
    },
    "approved": false,
    "recommendedStatus": "beta",
    "notes": [
      "SET demo: boleta cifrada + commit firmado + recuento reproducible — no elección nacional."
    ]
  },
  "evidencia-certificada": {
    "modelId": "evidencia-certificada",
    "validatedAt": "2026-07-04T16:24:31.555Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "pass",
      "comercial": "pass"
    },
    "approved": true,
    "recommendedStatus": "disponible",
    "notes": []
  },
  "iaau": {
    "modelId": "iaau",
    "validatedAt": "2026-07-04T16:24:31.556Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "partial",
      "comercial": "pass"
    },
    "approved": false,
    "recommendedStatus": "beta",
    "notes": [
      "Metering demo activo — conciliación ledger producción pendiente."
    ]
  },
  "data-trust": {
    "modelId": "data-trust",
    "validatedAt": "2026-07-04T16:24:31.556Z",
    "stages": {
      "tecnica": "pass",
      "operacional": "partial",
      "comercial": "pass"
    },
    "approved": false,
    "recommendedStatus": "beta",
    "notes": [
      "Pipeline demo k-anonymized — dictamen soberano + sandbox legal pendiente."
    ]
  }
};

export function getModelValidation(modelId: string): ModelValidationRecord | undefined {
  return MODEL_VALIDATION[modelId];
}
