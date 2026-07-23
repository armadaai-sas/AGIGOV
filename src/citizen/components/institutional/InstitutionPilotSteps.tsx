import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  fetchMinistryHealth,
  ingestPilotMilestones,
  onboardPilotTenant,
  ratifyPilotBaseline,
  runPilotQClose,
} from '../../api.js';
import { useCachedFetch } from '../../hooks/useCitizenData.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionPilot } from '../../institutional/InstitutionPilotContext.js';
import { MinistryHealthPanel } from '../egs/MinistryHealthPanel.js';
import { LoadingState } from '../PageShell.js';
import { PilotStepPrerequisite } from './PilotStepPrerequisite.js';
import { InstitutionFileIngestPanel } from './InstitutionFileIngestPanel.js';
import type { DeliveryRow } from '../../institutional/parseDeliveryFiles.js';

export function WizardStepFooter({
  onContinue,
  continueDisabled,
  showBack = true,
}: {
  onContinue?: () => void;
  continueDisabled?: boolean;
  showBack?: boolean;
}) {
  const { goBack, goNext, canAdvanceFromStep, activeStep } = useInstitutionPilot();
  const { t } = useSovereignConfig();

  return (
    <div className="inst-pilot-footer">
      {showBack && activeStep > 0 ? (
        <button type="button" className="ds-btn-secondary ds-btn-app-shape" onClick={goBack}>
          {t('pilot.nav.back')}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        className="ds-btn-app"
        disabled={continueDisabled ?? !canAdvanceFromStep(activeStep)}
        onClick={onContinue ?? goNext}
      >
        {t('pilot.nav.continue')}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function InstitutionModelStep() {
  const { updateSession, goNext, session } = useInstitutionPilot();
  const { t } = useSovereignConfig();
  const [selected, setSelected] = useState('egs');

  if (!session.slug) {
    return (
      <PilotStepPrerequisite targetStep={0} message={t('pilot.gate.profile')} />
    );
  }

  function confirm() {
    updateSession({ modelId: selected, maxStepReached: Math.max(2, session.maxStepReached) });
    goNext();
  }

  return (
    <div className="agigov-card inst-pilot-step">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <TrendingDown className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Trust Pilot Fiscal · EGS</h3>
          <p className="mt-1 text-sm text-agigov-text-muted">{t('pilot.model.lead')}</p>
          <ul className="mt-3 space-y-1 text-sm text-agigov-text-muted">
            <li>· {t('pilot.model.point1')}</li>
            <li>· {t('pilot.model.point2')}</li>
            <li>· {t('pilot.model.point3')}</li>
          </ul>
          <Link to="/modelos/egs" className="mt-3 inline-flex text-sm text-sky-400 no-underline hover:text-sky-300">
            {t('pilot.model.brief')}
          </Link>
        </div>
      </div>
      <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <input
          type="radio"
          name="model"
          checked={selected === 'egs'}
          onChange={() => setSelected('egs')}
        />
        <span className="text-sm font-medium">Efficiency Gain Share (EGS)</span>
        <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-400" />
      </label>
      <WizardStepFooter onContinue={confirm} continueDisabled={false} />
    </div>
  );
}

export function InstitutionBaselineStep() {
  const { session, onboarding, refreshOnboarding } = useInstitutionPilot();
  const { t } = useSovereignConfig();
  const [busy, setBusy] = useState<'onboard' | 'ratify' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!session.slug) {
    return <PilotStepPrerequisite targetStep={0} message={t('pilot.gate.profile')} />;
  }
  if (session.modelId !== 'egs') {
    return <PilotStepPrerequisite targetStep={1} message={t('pilot.gate.model')} />;
  }

  async function runOnboard() {
    if (!session.slug) return;
    setBusy('onboard');
    setError(null);
    try {
      await onboardPilotTenant(session.slug);
      await refreshOnboarding();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(null);
    }
  }

  async function runRatify() {
    if (!session.slug) return;
    setBusy('ratify');
    setError(null);
    try {
      await ratifyPilotBaseline(session.slug);
      await refreshOnboarding();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(null);
    }
  }

  const status = onboarding?.onboardingStatus ?? 'pending';

  return (
    <div className="agigov-card inst-pilot-step">
      <p className="text-sm text-agigov-text-muted">{t('pilot.baseline.lead')}</p>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 font-mono text-sm">
        <p>
          {t('pilot.baseline.status')}: <span className="text-sky-300">{status}</span>
        </p>
        {Array.isArray(onboarding?.institutionSigners) ? (
          <ul className="mt-2 space-y-1 text-xs text-agigov-text-muted">
            {(onboarding.institutionSigners as string[]).map((did) => (
              <li key={did}>{did}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="ds-btn-secondary ds-btn-app-shape"
          disabled={busy !== null || status !== 'pending'}
          onClick={() => void runOnboard()}
        >
          {busy === 'onboard' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {t('pilot.baseline.onboard')}
        </button>
        <button
          type="button"
          className="ds-btn-app"
          disabled={busy !== null || status !== 'baseline_pending'}
          onClick={() => void runRatify()}
        >
          {busy === 'ratify' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t('pilot.baseline.ratify')}
        </button>
      </div>
      <WizardStepFooter />
    </div>
  );
}

export function InstitutionIngestStep() {
  const { session, updateSession, onboarding } = useInstitutionPilot();
  const { t, formatMoney: fmt } = useSovereignConfig();
  const [contractRef, setContractRef] = useState(session.firstEscrowRef ?? '');
  const [milestoneIndex, setMilestoneIndex] = useState(9001);
  const [amount, setAmount] = useState(
    session.slug?.includes('mintrans') ? '16400000' : session.slug?.includes('usdot') ? '4100' : '1200',
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [fileRows, setFileRows] = useState<DeliveryRow[]>([]);
  const [skipReasons, setSkipReasons] = useState<string[]>([]);

  if (!session.slug || !session.ingestToken) {
    return <PilotStepPrerequisite targetStep={0} message={t('pilot.gate.token')} />;
  }
  if (onboarding?.onboardingStatus !== 'ingest_ready') {
    return <PilotStepPrerequisite targetStep={2} message={t('pilot.gate.baseline')} />;
  }

  async function submitRows(rows: Array<{ contractRef: string; milestoneIndex: number; amount: string; evidenceRef?: string }>) {
    if (!session.slug || !session.ingestToken) return;
    setBusy(true);
    setError(null);
    try {
      const result = await ingestPilotMilestones(session.slug, session.ingestToken, rows);
      setMsg(t('pilot.ingest.ok', { accepted: String(result.accepted), skipped: String(result.skipped) }));
      updateSession({
        ingestAccepted: session.ingestAccepted + result.accepted,
        reconcileOk: result.centinela?.reconcileOk ?? null,
        reconcileStatus: result.centinela?.status ?? null,
        calculoAhorroFinal: result.centinela?.calculoAhorroFinal ?? null,
        discrepancies: result.centinela?.discrepancies ?? [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    await submitRows([
      {
        contractRef,
        milestoneIndex,
        amount,
        evidenceRef: `wizard-ingest-${Date.now()}`,
      },
    ]);
  }

  async function submitFromFiles() {
    if (fileRows.length === 0) {
      setError(t('pilot.ingest.filesMissing'));
      return;
    }
    await submitRows(
      fileRows.map((r) => ({
        contractRef: r.contractRef,
        milestoneIndex: r.milestoneIndex,
        amount: r.amount,
        evidenceRef: r.evidenceRef ?? `file-ingest-${Date.now()}`,
      })),
    );
  }

  return (
    <div className="agigov-card inst-pilot-step">
      <InstitutionFileIngestPanel
        onRowsReady={(rows, skips) => {
          setFileRows(rows);
          setSkipReasons(skips);
          if (rows[0]) {
            setContractRef(rows[0].contractRef);
            setMilestoneIndex(rows[0].milestoneIndex);
            setAmount(rows[0].amount);
          }
        }}
      />

      {skipReasons.length > 0 ? (
        <p className="mt-3 text-xs text-amber-300/90">
          {t('pilot.ingest.skipReasons')}: {skipReasons.join(', ')}
        </p>
      ) : null}

      {fileRows.length > 0 ? (
        <button type="button" className="ds-btn-app mt-4" disabled={busy} onClick={() => void submitFromFiles()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t('pilot.ingest.submitFiles', { count: String(fileRows.length) })}
        </button>
      ) : null}

      <hr className="my-6 border-white/10" />

      <p className="text-sm text-agigov-text-muted">{t('pilot.ingest.manualLead')}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="text-agigov-text-muted">{t('pilot.ingest.contract')}</span>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm"
            value={contractRef}
            onChange={(e) => setContractRef(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-agigov-text-muted">{t('pilot.ingest.milestone')}</span>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono"
            value={milestoneIndex}
            onChange={(e) => setMilestoneIndex(Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-agigov-text-muted">{t('pilot.ingest.amount')}</span>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-agigov-text-muted">
        {t('pilot.ingest.hint')} · {fmt(Number(amount) || 0, { showCode: true })}
      </p>
      {msg ? <p className="mt-3 text-sm text-emerald-400">{msg}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <button type="button" className="ds-btn-app mt-4" disabled={busy} onClick={() => void submit()}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t('pilot.ingest.submit')}
      </button>
      <WizardStepFooter />
    </div>
  );
}

export function InstitutionReconcileStep() {
  const { session, updateSession } = useInstitutionPilot();
  const { t } = useSovereignConfig();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blocked = !session.slug || session.ingestAccepted <= 0;

  async function rerun() {
    if (!session.slug) return;
    setBusy(true);
    setError(null);
    try {
      const result = await runPilotQClose(session.slug, false);
      updateSession({
        reconcileOk: result.reconcileOk,
        reconcileStatus: result.status,
        calculoAhorroFinal: result.calculoAhorroFinal,
        discrepancies: result.discrepancies,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (blocked || session.reconcileOk !== null) return;
    void rerun();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-reconcile al entrar
  }, [blocked, session.reconcileOk]);

  if (!session.slug) {
    return <PilotStepPrerequisite targetStep={0} message={t('pilot.gate.profile')} />;
  }
  if (session.ingestAccepted <= 0) {
    return <PilotStepPrerequisite targetStep={3} message={t('pilot.gate.ingest')} />;
  }

  const ok = session.reconcileOk;

  return (
    <div className="agigov-card inst-pilot-step">
      <p className="text-sm text-agigov-text-muted">{t('pilot.reconcile.lead')}</p>
      <div
        className={`mt-4 rounded-xl border p-4 ${ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}
      >
        <p className="font-mono text-sm">
          {t('pilot.reconcile.status')}: {session.reconcileStatus ?? '—'}
        </p>
        <p className="mt-2 font-mono text-lg text-emerald-400">
          {t('pilot.reconcile.savings')}: {session.calculoAhorroFinal ?? '—'}
        </p>
        {session.discrepancies.length > 0 ? (
          <ul className="mt-2 text-xs text-red-300">
            {session.discrepancies.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <button type="button" className="ds-btn-secondary ds-btn-app-shape mt-4" disabled={busy} onClick={() => void rerun()}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t('pilot.reconcile.rerun')}
      </button>
      <WizardStepFooter />
    </div>
  );
}

export function InstitutionQCloseStep() {
  const { session, updateSession } = useInstitutionPilot();
  const { t } = useSovereignConfig();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session.slug) {
    return <PilotStepPrerequisite targetStep={0} message={t('pilot.gate.profile')} />;
  }
  if (session.reconcileOk !== true) {
    return <PilotStepPrerequisite targetStep={4} message={t('pilot.gate.reconcile')} />;
  }

  async function publish() {
    if (!session.slug) return;
    setBusy(true);
    setError(null);
    try {
      const result = await runPilotQClose(session.slug, true);
      updateSession({ published: result.published, reconcileOk: result.reconcileOk });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="agigov-card inst-pilot-step">
      <p className="text-sm text-agigov-text-muted">{t('pilot.close.lead')}</p>
      <p className="mt-3 font-mono text-sm">
        {t('pilot.close.published')}: {session.published ? t('common.yes') : t('common.no')}
      </p>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <button type="button" className="ds-btn-app mt-4" disabled={busy || session.published} onClick={() => void publish()}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t('pilot.close.publish')}
      </button>
      <WizardStepFooter />
    </div>
  );
}

export function InstitutionDashboardStep() {
  const { session } = useInstitutionPilot();
  const { t } = useSovereignConfig();
  const ministry = session.ministryCode ?? 'MPPI';
  const health = useCachedFetch(`pilot-dash-${ministry}`, () => fetchMinistryHealth(ministry), 10_000);

  if (!session.published) {
    return <PilotStepPrerequisite targetStep={5} message={t('pilot.gate.publish')} />;
  }

  return (
    <div className="inst-pilot-step space-y-6">
      <div className="agigov-card">
        <p className="text-sm text-agigov-text-muted">{t('pilot.dashboard.lead')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/modelos/egs/consola" className="ds-btn-app">
            {t('pilot.dashboard.console')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/gestion" className="ds-btn-secondary ds-btn-app-shape">
            {t('pilot.dashboard.telemetry')}
          </Link>
        </div>
      </div>
      {health.state === 'syncing' && !health.data ? (
        <LoadingState label={t('pilot.dashboard.loading')} />
      ) : health.data ? (
        <MinistryHealthPanel data={health.data} />
      ) : null}
    </div>
  );
}
