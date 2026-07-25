import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';

import { JURISDICTIONS, type JurisdictionIso } from '../../../config/sovereign/jurisdictions.js';
import {
  fetchPilotTenants,
  provisionPilotFromProfile,
  type PilotTenantSummary,
} from '../../api.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionPilot } from '../../institutional/InstitutionPilotContext.js';
import { profileFromIso, slugifyInstitution } from '../../institutional/institutionProfile.js';
import { useInstitutionProfile } from '../../institutional/useInstitutionProfile.js';
import { WizardStepFooter } from './InstitutionPilotSteps.js';

export function InstitutionProfileStep() {
  const { t, setSovereignPref, formatMoney } = useSovereignConfig();
  const { profile, patch, persist } = useInstitutionProfile();
  const { updateSession, goNext, session } = useInstitutionPilot();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tokenHint, setTokenHint] = useState<string | null>(null);
  const [existingTenants, setExistingTenants] = useState<PilotTenantSummary[]>([]);
  const [resumeBusy, setResumeBusy] = useState<string | null>(null);

  const pilotCountries: JurisdictionIso[] = ['VEN', 'COL', 'USA'];

  useEffect(() => {
    void fetchPilotTenants()
      .then((r) => setExistingTenants(r.tenants))
      .catch(() => setExistingTenants([]));
  }, []);

  function onCountryChange(iso: JurisdictionIso) {
    const next = profileFromIso(iso);
    patch(next);
    setSovereignPref({ iso });
    setMessage(null);
    setError(null);
    setTokenHint(null);
  }

  function handleSave() {
    persist();
    setMessage(t('pilot.profile.saved'));
    setError(null);
  }

  async function handleProvision() {
    setBusy(true);
    setError(null);
    setMessage(null);
    setTokenHint(null);
    try {
      persist();
      const result = await provisionPilotFromProfile({
        iso: profile.iso,
        slug: profile.slug,
        ministryCode: profile.ministryCode,
        budgetCode: profile.budgetCode,
        displayName: profile.displayName,
        programName: profile.programName,
        territoryCode: profile.territoryCode,
        fiscalYear: profile.fiscalYear,
        quarter: profile.quarter,
        annualBaseline: profile.annualBaselineEstimate,
      });
      setMessage(t('pilot.profile.provisionOk'));
      setTokenHint(result.ingestToken);
      updateSession({
        slug: result.slug,
        ingestToken: result.ingestToken,
        firstEscrowRef: result.firstEscrowRef,
        ministryCode: result.ministryCode,
        maxStepReached: 1,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('pilot.profile.provisionErr'));
    } finally {
      setBusy(false);
    }
  }

  async function handleReconnect(tenant: PilotTenantSummary) {
    setResumeBusy(tenant.slug);
    setError(null);
    setMessage(null);
    setTokenHint(null);
    try {
      patch({
        slug: tenant.slug,
        ministryCode: tenant.ministry,
        displayName: tenant.displayName,
        fiscalYear: tenant.fiscalYear,
        quarter: tenant.quarter,
      });
      persist();
      const result = await provisionPilotFromProfile({
        iso: profile.iso,
        slug: tenant.slug,
        ministryCode: tenant.ministry,
        budgetCode: profile.budgetCode,
        displayName: tenant.displayName,
        programName: profile.programName,
        territoryCode: profile.territoryCode,
        fiscalYear: tenant.fiscalYear,
        quarter: tenant.quarter,
      });
      setMessage(t('pilot.profile.provisionOk'));
      setTokenHint(result.ingestToken);
      updateSession({
        slug: result.slug,
        ingestToken: result.ingestToken,
        firstEscrowRef: result.firstEscrowRef,
        ministryCode: result.ministryCode,
        maxStepReached: Math.max(session.maxStepReached, 1),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('pilot.profile.provisionErr'));
    } finally {
      setResumeBusy(null);
    }
  }

  return (
    <div className="agigov-card inst-pilot-profile">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('pilot.profile.jurisdiction')}</span>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
              value={profile.iso}
              onChange={(e) => onCountryChange(e.target.value as JurisdictionIso)}
            >
              {pilotCountries.map((iso) => (
                <option key={iso} value={iso}>
                  {JURISDICTIONS[iso].label} · {JURISDICTIONS[iso].jurisdictionCode}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('pilot.profile.displayName')}</span>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
              value={profile.displayName}
              onChange={(e) => patch({ displayName: e.target.value })}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('pilot.profile.ministry')}</span>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-agigov-text"
                value={profile.ministryCode}
                onChange={(e) =>
                  patch({
                    ministryCode: e.target.value.toUpperCase(),
                    slug: slugifyInstitution(`${e.target.value}-trust-pilot`),
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('pilot.profile.budgetCode')}</span>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-agigov-text"
                value={profile.budgetCode}
                onChange={(e) => patch({ budgetCode: e.target.value })}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('pilot.profile.program')}</span>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
              value={profile.programName}
              onChange={(e) => patch({ programName: e.target.value })}
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('pilot.profile.slug')}</span>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm text-agigov-text"
              value={profile.slug}
              onChange={(e) => patch({ slug: slugifyInstitution(e.target.value) })}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('pilot.profile.fiscalYear')}</span>
              <input
                type="number"
                min={2024}
                max={2030}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
                value={profile.fiscalYear}
                onChange={(e) => patch({ fiscalYear: Number(e.target.value) || 2026 })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('pilot.profile.quarter')}</span>
              <select
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
                value={profile.quarter}
                onChange={(e) => patch({ quarter: Number(e.target.value) })}
              >
                {[1, 2, 3, 4].map((q) => (
                  <option key={q} value={q}>
                    Q{q}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('pilot.profile.contactName')}</span>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
                value={profile.contactName}
                onChange={(e) => patch({ contactName: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('pilot.profile.contactEmail')}</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
                value={profile.contactEmail}
                onChange={(e) => patch({ contactEmail: e.target.value })}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('pilot.profile.annualBaseline')}</span>
            <input
              type="number"
              min={1}
              step={1}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-agigov-text"
              value={profile.annualBaselineEstimate}
              onChange={(e) =>
                patch({
                  annualBaselineEstimate: Math.max(1, Number(e.target.value) || 0),
                })
              }
            />
            <span className="mt-1 block text-xs text-agigov-text-muted">
              {t('pilot.profile.annualBaselineHint')}
            </span>
          </label>
        </div>

        <aside className="inst-pilot-preview">
          <p className="text-xs font-semibold uppercase tracking-widest text-agigov-text-muted">
            {profile.jurisdictionCode}
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold text-agigov-text">{profile.displayName}</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-agigov-text-muted">{t('pilot.profile.currency')}</dt>
              <dd className="font-mono text-agigov-text">{profile.currency}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-agigov-text-muted">{t('pilot.profile.annualBaseline')}</dt>
              <dd className="font-mono text-emerald-400">
                {formatMoney(profile.annualBaselineEstimate, { showCode: true })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-agigov-text-muted">{t('pilot.profile.ministry')}</dt>
              <dd className="font-mono">{profile.ministryCode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-agigov-text-muted">{t('pilot.profile.budgetCode')}</dt>
              <dd className="font-mono">{profile.budgetCode}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-agigov-text-muted">{t('pilot.profile.hint')}</p>
        </aside>
      </div>

      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      {tokenHint ? (
        <p className="mt-2 break-all font-mono text-xs text-amber-300/90">
          Bearer (guardar): {tokenHint}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="ds-btn-secondary ds-btn-app-shape" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {t('pilot.profile.save')}
        </button>
        <button
          type="button"
          className="ds-btn-app"
          disabled={busy}
          onClick={() => void handleProvision()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? t('pilot.profile.provisioning') : t('pilot.profile.provision')}
        </button>
      </div>

      {existingTenants.length > 0 ? (
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm font-medium text-agigov-text">{t('pilot.profile.resume')}</p>
          <p className="mt-1 text-xs text-agigov-text-muted">{t('pilot.profile.resumeHint')}</p>
          <ul className="mt-4 space-y-2">
            {existingTenants.map((tenant) => (
              <li
                key={tenant.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm text-sky-300">{tenant.slug}</p>
                  <p className="text-xs text-agigov-text-muted">
                    {tenant.ministry} · {tenant.onboardingStatus} · Q{tenant.quarter}
                  </p>
                </div>
                <button
                  type="button"
                  className="ds-btn-secondary ds-btn-app-shape text-xs"
                  disabled={resumeBusy !== null}
                  onClick={() => void handleReconnect(tenant)}
                >
                  {resumeBusy === tenant.slug ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {t('pilot.profile.reconnect')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <WizardStepFooter showBack={false} continueDisabled={!session.slug} onContinue={goNext} />
    </div>
  );
}
