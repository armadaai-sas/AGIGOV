import { getCoreDb } from '../db/client.js';
import { reconcileQuarterClose } from '../db/egs/reconcile-quarter-close.js';
import { getPilotProfileForIso } from './pilot-jurisdiction-profiles.js';
import { getMinistryHealth } from './egs-public.js';
import { onboardPilotTenant, ratifyPilotTenantBaseline } from './tenant-onboarding.js';
import { provisionPilotTenant } from './tenant-provision.js';

export type BootstrapTrialInput = {
  iso: string;
  slug: string;
  ministryCode: string;
  displayName: string;
  budgetCode?: string;
  programName?: string;
  territoryCode?: string;
  fiscalYear?: number;
  quarter?: number;
  annualBaseline?: number;
};

export type BootstrapTrialResult = {
  slug: string;
  ministryCode: string;
  consoleUrl: string;
  reconcileOk: boolean;
  published: boolean;
  calculoAhorroFinal: string | null;
};

/** Tras registro: provisiona piloto EGS Q1 con hitos de ejemplo para la cuenta del usuario. */
export async function bootstrapInstitutionTrial(
  input: BootstrapTrialInput,
): Promise<BootstrapTrialResult> {
  const iso = (input.iso?.trim() || 'VEN').toUpperCase();
  const profile = getPilotProfileForIso(iso);
  const ministryCode = input.ministryCode.trim().toUpperCase();
  const slug = input.slug.trim().toLowerCase();

  const provision = await provisionPilotTenant({
    iso: profile.iso,
    slug,
    ministryCode,
    budgetCode: input.budgetCode?.trim() || profile.budgetCode,
    displayName: input.displayName.trim(),
    programName: input.programName?.trim() || `Programa piloto Q1 — ${input.displayName.trim()}`,
    territoryCode: input.territoryCode?.trim() || profile.territoryCode,
    fiscalYear: input.fiscalYear ?? 2026,
    quarter: input.quarter ?? 1,
    annualBaseline:
      typeof input.annualBaseline === 'number' && input.annualBaseline > 0
        ? input.annualBaseline
        : undefined,
    skipMultisigInit: true,
  });

  await onboardPilotTenant(slug);
  await ratifyPilotTenantBaseline(slug);

  const reconcile = await reconcileQuarterClose(getCoreDb(), provision.quarterCloseId);
  const health = await getMinistryHealth(ministryCode);

  return {
    slug: provision.slug,
    ministryCode: provision.ministryCode,
    consoleUrl: provision.consoleUrl,
    reconcileOk: reconcile.ok,
    published: health?.published ?? false,
    calculoAhorroFinal: health?.calculoAhorroFinal ?? null,
  };
}
