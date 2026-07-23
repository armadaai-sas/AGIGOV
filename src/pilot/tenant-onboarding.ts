import { getCoreDb } from '../db/client.js';
import { isoFromMinistryCode } from './pilot-jurisdiction-profiles.js';
import {
  buildInstitutionSigners,
  generateInstitutionKeys,
  institutionKeysPath,
  loadInstitutionKeys,
  mergeInstitutionKeysIntoRegistry,
  saveInstitutionKeys,
} from './tenant-institution.js';
import {
  getTenantBaselineStatus,
  initTenantBaselineMultisig,
  ratifyTenantBaselineWithInstitutionKeys,
} from './tenant-baseline-multisig.js';
import { getPilotTenantBySlug } from './tenant-provision.js';

export type OnboardTenantResult = {
  slug: string;
  ministryCode: string;
  institutionSigners: string[];
  institutionKeysPath: string;
  baselineActaProcessId: string;
  onboardingStatus: string;
};

function tenantIso(ministryCode: string) {
  return isoFromMinistryCode(ministryCode);
}

/** Fase B — registro institucional + DID + borrador baseline multi-sig. */
export async function onboardPilotTenant(slug: string): Promise<OnboardTenantResult> {
  const tenant = await getPilotTenantBySlug(slug);
  if (!tenant) throw new Error(`Tenant desconocido: ${slug}`);
  if (tenant.status !== 'active') {
    throw new Error(`Tenant ${slug} no está active (status=${tenant.status})`);
  }

  const iso = tenantIso(tenant.ministryCode);

  if (tenant.onboardingStatus === 'ingest_ready') {
    const status = await getTenantBaselineStatus(slug);
    return {
      slug,
      ministryCode: tenant.ministryCode,
      institutionSigners: buildInstitutionSigners(tenant.ministryCode, iso),
      institutionKeysPath: '',
      baselineActaProcessId: tenant.baselineActaProcessId ?? '',
      onboardingStatus: status?.onboardingStatus ?? 'ingest_ready',
    };
  }

  const existingKeys = loadInstitutionKeys(slug);
  const keysFile =
    existingKeys ?? generateInstitutionKeys(slug, tenant.ministryCode);
  const keysPath = existingKeys ? institutionKeysPath(slug) : saveInstitutionKeys(keysFile);
  mergeInstitutionKeysIntoRegistry(keysFile);

  const signers = buildInstitutionSigners(tenant.ministryCode, iso);
  const db = getCoreDb();

  await db.pilotTenant.update({
    where: { id: tenant.id },
    data: {
      institutionSigners: signers,
      onboardingStatus: 'registered',
    },
  });

  const draft = await initTenantBaselineMultisig(slug);

  return {
    slug,
    ministryCode: tenant.ministryCode,
    institutionSigners: signers,
    institutionKeysPath: keysPath,
    baselineActaProcessId: draft.processId,
    onboardingStatus: 'baseline_pending',
  };
}

/** Fase B — ratificación baseline con claves institucionales (no demo keygen). */
export async function ratifyPilotTenantBaseline(slug: string) {
  return ratifyTenantBaselineWithInstitutionKeys(slug);
}

export { getTenantBaselineStatus };
