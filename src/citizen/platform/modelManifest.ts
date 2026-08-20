/**
 * Model Manifest v1 — contrato tipado para apps del OS AGIGOV.
 * Spec humana: docs/AGIGOV/MODEL-MANIFEST-v1.md
 */

export const MODEL_MANIFEST_VERSION = '1.0.0' as const;

export type ModelManifestAudience = 'gubernamental' | 'empresarial' | 'ciudadano';

export type ModelManifestStatus = 'roadmap' | 'beta' | 'disponible';

/** Mecanismos alineados a docs/commercial/billing-p0-catalog.md */
export type ModelBillingMechanism =
  | 'egs-delta'
  | 'saas-license'
  | 'iaau-milestone'
  | 'iaau-api'
  | 'b2b-evidence'
  | 'none';

export type ModelBillingSpec = {
  mechanism: ModelBillingMechanism;
  payer: 'tenant' | 'contractor' | 'citizen' | 'none';
  metric: string;
  unit: 'currency' | 'count' | 'seat-year' | 'none';
  /** Fracciones del fee del protocolo; deben sumar ~1. */
  protocolShareOfFee: number;
  builderShareOfFee: number;
  reserveShareOfFee: number;
};

export type ModelRuntimeSpec = {
  requires: readonly string[];
  agents: readonly string[];
  hooks: readonly string[];
};

export type ModelEvidenceSpec = {
  required: readonly string[];
  publicApi: readonly string[];
};

export type ModelManifestV1 = {
  manifestVersion: typeof MODEL_MANIFEST_VERSION;
  id: string;
  name: string;
  shortName: string;
  /** DID o github:org/user — destino del rev-share. */
  publisherId: string;
  audience: ModelManifestAudience;
  status: ModelManifestStatus;
  tagline: string;
  problem: string;
  purpose: string;
  productPath: string;
  consolePath?: string;
  billing: ModelBillingSpec;
  runtime: ModelRuntimeSpec;
  evidence: ModelEvidenceSpec;
  license: string;
  repo?: string;
};

const SHARE_EPS = 0.001;

export function sharesSumToOne(billing: ModelBillingSpec): boolean {
  const sum =
    billing.protocolShareOfFee + billing.builderShareOfFee + billing.reserveShareOfFee;
  return Math.abs(sum - 1) <= SHARE_EPS;
}

const ID_RE = /^[a-z0-9-]{2,40}$/;

export type ManifestValidationIssue = { path: string; message: string };

/** Validación mínima G-A (sin I/O). */
export function validateModelManifest(m: ModelManifestV1): ManifestValidationIssue[] {
  const issues: ManifestValidationIssue[] = [];

  if (m.manifestVersion !== MODEL_MANIFEST_VERSION) {
    issues.push({ path: 'manifestVersion', message: `expected ${MODEL_MANIFEST_VERSION}` });
  }
  if (!ID_RE.test(m.id)) {
    issues.push({ path: 'id', message: 'slug 2–40 chars [a-z0-9-]' });
  }
  if (!m.publisherId.trim()) {
    issues.push({ path: 'publisherId', message: 'required for rev-share' });
  }
  if (!sharesSumToOne(m.billing)) {
    issues.push({ path: 'billing.*ShareOfFee', message: 'shares must sum to 1.0' });
  }
  if (m.billing.mechanism !== 'none' && m.evidence.required.length === 0) {
    issues.push({ path: 'evidence.required', message: 'required when billing is active' });
  }
  if (m.billing.mechanism === 'none' && m.billing.builderShareOfFee > 0) {
    issues.push({ path: 'billing.builderShareOfFee', message: 'must be 0 when mechanism is none' });
  }

  return issues;
}

/** Ejemplo canónico — EGS (publisher AGIGOV hasta partner split). */
export const EGS_MODEL_MANIFEST: ModelManifestV1 = {
  manifestVersion: MODEL_MANIFEST_VERSION,
  id: 'egs',
  name: 'Efficiency Gain Share',
  shortName: 'EGS',
  publisherId: 'did:agigov:publisher:armada',
  audience: 'gubernamental',
  status: 'disponible',
  tagline: 'Ahorro en gestión y operaciones con evidencia',
  problem:
    'Presupuesto público con opacidad: pagos sin hito y cierres propensos a discrepancia.',
  purpose:
    'Reconciliar baseline vs gasto en ledger, certificar Δ y repartir bajo reglas publicadas.',
  productPath: '/modelos/egs',
  consolePath: '/modelos/egs/consola',
  billing: {
    mechanism: 'egs-delta',
    payer: 'tenant',
    metric: 'delta_certified',
    unit: 'currency',
    protocolShareOfFee: 0.3,
    builderShareOfFee: 0.65,
    reserveShareOfFee: 0.05,
  },
  runtime: {
    requires: ['ledger', 'centinela', 'multisig-baseline'],
    agents: ['centinela', 'logistico', 'soberano', 'comunicador'],
    hooks: ['onBaselineRatified', 'onQuarterClosePublished'],
  },
  evidence: {
    required: ['baselineHash', 'quarterCloseHash'],
    publicApi: ['/api/public/dashboard'],
  },
  license: 'AGIGOV-Model-1.0',
  repo: 'https://github.com/armadaai-sas/Armada-VZLA',
};

/** @deprecated usar EGS_MODEL_MANIFEST */
export const EGS_MANIFEST_EXAMPLE = EGS_MODEL_MANIFEST;

export type ProtocolFeeShare = {
  feeAmount: number;
  builderAmount: number;
  protocolAmount: number;
  reserveAmount: number;
  builderShareOfFee: number;
  protocolShareOfFee: number;
  reserveShareOfFee: number;
};

function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/**
 * Reparte el fee del protocolo (ej. 10% Δ EGS), no el presupuesto bruto.
 * Si fee ≤ 0 → todo en cero.
 */
export function splitProtocolFee(
  feeAmount: number,
  billing: Pick<
    ModelBillingSpec,
    'builderShareOfFee' | 'protocolShareOfFee' | 'reserveShareOfFee'
  >,
): ProtocolFeeShare {
  if (feeAmount <= 0) {
    return {
      feeAmount: 0,
      builderAmount: 0,
      protocolAmount: 0,
      reserveAmount: 0,
      builderShareOfFee: billing.builderShareOfFee,
      protocolShareOfFee: billing.protocolShareOfFee,
      reserveShareOfFee: billing.reserveShareOfFee,
    };
  }
  const builderAmount = round4(feeAmount * billing.builderShareOfFee);
  const protocolAmount = round4(feeAmount * billing.protocolShareOfFee);
  const reserveAmount = round4(feeAmount - builderAmount - protocolAmount);
  return {
    feeAmount: round4(feeAmount),
    builderAmount,
    protocolAmount,
    reserveAmount,
    builderShareOfFee: billing.builderShareOfFee,
    protocolShareOfFee: billing.protocolShareOfFee,
    reserveShareOfFee: billing.reserveShareOfFee,
  };
}

/** Registro de manifests publicados (alpha: solo EGS first-party). */
export const MODEL_MANIFEST_REGISTRY: Readonly<Record<string, ModelManifestV1>> = {
  egs: EGS_MODEL_MANIFEST,
};

export function getModelManifest(id: string): ModelManifestV1 | undefined {
  return MODEL_MANIFEST_REGISTRY[id];
}
