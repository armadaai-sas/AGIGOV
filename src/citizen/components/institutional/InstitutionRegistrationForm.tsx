import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building2, Landmark, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { JURISDICTIONS, type JurisdictionIso } from '../../../config/sovereign/jurisdictions.js';
import type { MessageKey } from '../../../i18n/index.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  defaultPhoneCountryCode,
  ENTITY_CATALOG_OTHER_ID,
  findCatalogEntity,
  getRegionsForType,
} from '../../institutional/entity-catalog/index.js';
import { registerInstitutionAuth } from '../../institutional/institutionAuth.js';
import { bootstrapInstitutionTrialEnv } from '../../api.js';
import {
  isInstitutionRegistrationComplete,
  loadInstitutionRegistration,
  saveInstitutionRegistration,
  type InstitutionEntityType,
  type InstitutionRegistration,
} from '../../institutional/institutionRegistration.js';
import {
  profileFromIso,
  saveInstitutionProfile,
  slugifyInstitution,
} from '../../institutional/institutionProfile.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { accountNameLabel } from './authOffer.js';
import { useSelectedAuthRole } from './AuthStage.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';

type RegistrationMode = 'trial' | 'full';

type Props = {
  onComplete?: () => void;
  /** trial = registro corto + datos Q1 automáticos (default). */
  mode?: RegistrationMode;
};

const ENTITY_TYPES: Array<{
  id: InstitutionEntityType;
  labelKey: MessageKey;
  hintKey: MessageKey;
  icon: typeof Building2;
}> = [
  { id: 'municipality', labelKey: 'reg.entity.municipality', hintKey: 'reg.entity.municipalityHint', icon: Building2 },
  { id: 'ministry', labelKey: 'reg.entity.ministry', hintKey: 'reg.entity.ministryHint', icon: Landmark },
  { id: 'governorship', labelKey: 'reg.entity.governorship', hintKey: 'reg.entity.governorshipHint', icon: Landmark },
  { id: 'agency', labelKey: 'reg.entity.agency', hintKey: 'reg.entity.agencyHint', icon: ShieldCheck },
  { id: 'other', labelKey: 'reg.entity.other', hintKey: 'reg.entity.otherHint', icon: Building2 },
];

/** Registro institucional — prueba EGS (trial) o alta completa. */
export function InstitutionRegistrationForm({ onComplete, mode = 'trial' }: Props) {
  const isTrial = mode === 'trial';
  const { t, sovereign, setSovereignPref } = useSovereignConfig();
  const { selected: authRole } = useSelectedAuthRole();
  const navigate = useNavigate();
  const { refresh, applySession } = useInstitutionAuth();
  const [form, setForm] = useState<InstitutionRegistration>(() => ({
    ...loadInstitutionRegistration(),
    entityType: 'ministry',
  }));
  const [bootstrapBusy, setBootstrapBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const initialIso: JurisdictionIso = (() => {
    const fromForm = form.iso as JurisdictionIso | undefined;
    if (fromForm && ['VEN', 'COL', 'USA'].includes(fromForm)) return fromForm;
    if (['VEN', 'COL', 'USA'].includes(sovereign.iso)) return sovereign.iso as JurisdictionIso;
    return 'VEN';
  })();
  const [iso, setIso] = useState<JurisdictionIso>(initialIso);
  const [regionCode, setRegionCode] = useState(form.regionCode ?? '');
  const [entityCatalogId, setEntityCatalogId] = useState(form.entityCatalogId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState(false);
  const [busy, setBusy] = useState(false);
  const en = sovereign.locale.toLowerCase().startsWith('en');
  const stepLabel = en ? `Step ${step} of 2` : `Paso ${step} de 2`;

  const isGovernmentTier =
    form.entityType === 'ministry' || form.entityType === 'governorship';

  const regions = useMemo(
    () => getRegionsForType(iso, form.entityType),
    [iso, form.entityType],
  );
  const entities = useMemo(
    () => regions.find((r) => r.code === regionCode)?.entities ?? [],
    [regions, regionCode],
  );
  const isOtherEntity = entityCatalogId === ENTITY_CATALOG_OTHER_ID || form.entityType === 'other';
  const phoneCode = form.phoneCountryCode || defaultPhoneCountryCode(iso);

  useEffect(() => {
    if (isInstitutionRegistrationComplete()) onComplete?.();
  }, [onComplete]);

  function patch(partial: Partial<InstitutionRegistration>) {
    setForm((prev) => ({ ...prev, ...partial }));
    setError(null);
    setEmailAlreadyRegistered(false);
  }

  function onCountryChange(nextIso: JurisdictionIso) {
    setIso(nextIso);
    setSovereignPref({ iso: nextIso });
    setRegionCode('');
    setEntityCatalogId('');
    patch({
      iso: nextIso,
      regionCode: '',
      entityCatalogId: '',
      phoneCountryCode: defaultPhoneCountryCode(nextIso),
      legalName: '',
      officialCode: '',
    });
  }

  function onEntityTypeChange(id: InstitutionEntityType) {
    setRegionCode('');
    setEntityCatalogId('');
    patch({
      entityType: id,
      regionCode: '',
      entityCatalogId: '',
      legalName: id === 'other' ? form.legalName : '',
      officialCode: '',
    });
  }

  function onRegionChange(code: string) {
    setRegionCode(code);
    setEntityCatalogId('');
    patch({ regionCode: code, entityCatalogId: '', legalName: '', officialCode: '' });
  }

  function onEntityChange(id: string) {
    setEntityCatalogId(id);
    if (id === ENTITY_CATALOG_OTHER_ID) {
      patch({ entityCatalogId: id, legalName: '', officialCode: '' });
      return;
    }
    const hit = findCatalogEntity(iso, form.entityType, id);
    if (hit) {
      patch({
        entityCatalogId: id,
        legalName: hit.entity.name,
        officialCode: hit.entity.officialCode ?? '',
        regionCode: hit.region.code,
      });
    }
  }

  function accountStepReady(): boolean {
    if (!form.officialEmail.trim() || !form.officialEmail.includes('@')) {
      setError(t('reg.error.email'));
      return false;
    }
    if (password.length < 8) {
      setError(t('auth.error.passwordShort'));
      return false;
    }
    if (password !== passwordConfirm) {
      setError(t('auth.error.passwordMatch'));
      return false;
    }
    return true;
  }

  function continueAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!accountStepReady()) return;
    setError(null);
    setStep(2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isTrial && step === 1) {
      continueAccount(e);
      return;
    }
    if (!form.legalName.trim()) {
      setError(t('reg.error.legalName'));
      return;
    }
    if (!accountStepReady()) return;
    if (!form.acceptedTerms) {
      setError(t('reg.error.terms'));
      return;
    }
    if (!isOtherEntity && !isTrial && regions.length > 0 && !entityCatalogId) {
      setError(t('reg.error.entityRequired'));
      return;
    }

    setBusy(true);
    try {
      const entityType = isTrial ? 'ministry' : form.entityType;
      const authResult = await registerInstitutionAuth({
        email: form.officialEmail.trim(),
        password,
        institutionName: form.legalName.trim(),
        entityType,
        officialCode: form.officialCode,
        contactName: form.contactName,
        contactRole: form.contactRole,
        iso,
        regionCode: regionCode || undefined,
        entityCatalogId: entityCatalogId || undefined,
        phone: form.phone?.trim() || undefined,
        phoneCountryCode: phoneCode,
      });
      if (authResult.ok === false) {
        if (authResult.error === 'email_already_registered') {
          setEmailAlreadyRegistered(true);
          setError(t('auth.error.emailAlreadyRegistered'));
        } else if (authResult.error === 'password_too_short') {
          setError(t('auth.error.passwordShort'));
        } else {
          setError(t('auth.error.serverError'));
        }
        return;
      }

      saveInstitutionRegistration({
        ...form,
        iso,
        regionCode,
        entityCatalogId,
        phoneCountryCode: phoneCode,
        passwordHash: 'server-managed',
        verificationStatus: 'pending_verification',
      });

      const profile = profileFromIso(iso);
      const ministryPrefix = 'MIN';
      const code =
        slugifyInstitution(form.legalName).slice(0, 8).toUpperCase().replace(/-/g, '') || 'PILOT';
      const ministryCode = `${ministryPrefix}${code}`.slice(0, 12);
      const slug = slugifyInstitution(
        `${form.legalName}-${form.officialEmail.split('@')[0] || 'trial'}`,
      );

      const savedProfile = {
        ...profile,
        iso,
        displayName: form.legalName.trim(),
        ministryCode,
        slug,
        contactName: form.contactName.trim(),
        contactEmail: form.officialEmail.trim(),
        programName: isTrial
          ? t('trial.defaultProgram')
          : form.entityType === 'municipality'
            ? 'Mantenimiento urbano verificable — Piloto de ahorro'
            : profile.programName,
        fiscalYear: 2026,
        quarter: 1,
      };

      saveInstitutionProfile(savedProfile);

      applySession(authResult.session);

      if (isTrial) {
        setBootstrapBusy(true);
        try {
          await bootstrapInstitutionTrialEnv({
            iso,
            slug: savedProfile.slug,
            ministryCode: savedProfile.ministryCode,
            budgetCode: savedProfile.budgetCode,
            displayName: savedProfile.displayName,
            programName: savedProfile.programName,
            territoryCode: savedProfile.territoryCode,
            fiscalYear: savedProfile.fiscalYear,
            quarter: savedProfile.quarter,
            annualBaseline: savedProfile.annualBaselineEstimate,
          });
        } catch {
          /* La cuenta ya existe. El escritorio abre aunque el ejemplo no cargue. */
        } finally {
          setBootstrapBusy(false);
        }
      }

      await refresh();
      onComplete?.();
      navigate(INSTITUTION_ROUTES.desk, { replace: true });
    } finally {
      setBusy(false);
    }
  }

  const submitting = busy || bootstrapBusy;

  return (
    <div className={isTrial ? 'inst-auth-panel' : 'inst-reg-shell inst-reg-shell--simple'}>
      <form className={isTrial ? 'inst-auth-card' : 'agigov-card inst-reg-form'} onSubmit={(e) => void submit(e)}>
        {!isTrial && isGovernmentTier ? (
          <p className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700">
            {t('reg.governmentChannel')}
          </p>
        ) : null}
        {!isTrial ? (
          <p className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
            {t('reg.verificationNotice')}
          </p>
        ) : null}

        {!isTrial ? (
          <fieldset>
            <legend className="text-sm font-semibold text-agigov-text">{t('reg.entityType')}</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {ENTITY_TYPES.map(({ id, labelKey, hintKey, icon: Icon }) => (
                <label
                  key={id}
                  className={`inst-reg-entity ${form.entityType === id ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="entityType"
                    className="sr-only"
                    checked={form.entityType === id}
                    onChange={() => onEntityTypeChange(id)}
                  />
                  <Icon className="h-5 w-5 text-zinc-500" aria-hidden />
                  <span className="font-medium text-agigov-text">{t(labelKey)}</span>
                  <span className="text-xs text-agigov-text-muted">{t(hintKey)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className={isTrial ? 'auth-fields' : 'mt-6 grid gap-4 sm:grid-cols-2'}>
          {!isTrial ? (
            <>
              <label className="block text-sm">
                <span className="text-agigov-text-muted">{t('reg.jurisdiction')}</span>
                <select
                  className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
                  value={iso}
                  onChange={(e) => onCountryChange(e.target.value as JurisdictionIso)}
                >
                  {(['VEN', 'COL', 'USA'] as JurisdictionIso[]).map((code) => (
                    <option key={code} value={code}>
                      {JURISDICTIONS[code].label}
                    </option>
                  ))}
                </select>
              </label>

              {regions.length > 0 && form.entityType !== 'other' ? (
                <label className="block text-sm">
                  <span className="text-agigov-text-muted">{t('reg.region')}</span>
                  <select
                    className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
                    value={regionCode}
                    onChange={(e) => onRegionChange(e.target.value)}
                    required
                  >
                    <option value="">{t('reg.regionPlaceholder')}</option>
                    {regions.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {regionCode && form.entityType !== 'other' ? (
                <label className="block text-sm sm:col-span-2">
                  <span className="text-agigov-text-muted">{t('reg.catalogEntity')}</span>
                  <select
                    className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
                    value={entityCatalogId}
                    onChange={(e) => onEntityChange(e.target.value)}
                    required
                  >
                    <option value="">{t('reg.catalogEntityPlaceholder')}</option>
                    {entities.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.name}
                      </option>
                    ))}
                    <option value={ENTITY_CATALOG_OTHER_ID}>{t('reg.catalogOther')}</option>
                  </select>
                </label>
              ) : null}
            </>
          ) : step === 2 ? (
            <label className="auth-field">
              <span>{t('reg.jurisdiction')}</span>
              <select
                className="inst-auth-input"
                value={iso}
                onChange={(e) => onCountryChange(e.target.value as JurisdictionIso)}
              >
                {(['VEN', 'COL', 'USA'] as JurisdictionIso[]).map((code) => (
                  <option key={code} value={code}>
                    {JURISDICTIONS[code].label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {(!isTrial || step === 2) ? (
          <label className={isTrial ? 'auth-field' : 'block text-sm sm:col-span-2'}>
            <span className={isTrial ? undefined : 'text-agigov-text-muted'}>
              {isTrial ? accountNameLabel(authRole.id, sovereign.locale) : t('reg.legalName')}
            </span>
            <input
              required
              className={isTrial ? 'inst-auth-input' : 'mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2'}
              value={form.legalName}
              onChange={(e) => patch({ legalName: e.target.value })}
              placeholder={isTrial ? authRole.nameHint : t('reg.legalNamePlaceholder')}
              readOnly={!isTrial && !isOtherEntity && Boolean(entityCatalogId)}
            />
          </label>
          ) : null}

          {(!isTrial || step === 1) ? (
          <label className={isTrial ? 'auth-field' : 'block text-sm sm:col-span-2'}>
            <span className={isTrial ? undefined : 'text-agigov-text-muted'}>{t('auth.email')}</span>
            <input
              type="email"
              required
              autoComplete="username"
              className={isTrial ? 'inst-auth-input' : 'mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2'}
              value={form.officialEmail}
              onChange={(e) => patch({ officialEmail: e.target.value })}
              placeholder={isTrial ? authRole.emailHint : 'finanzas@ministerio.gob.ve'}
            />
          </label>
          ) : null}

          {(!isTrial || step === 1) ? (
          <label className={isTrial ? 'auth-field' : 'block text-sm'}>
            <span className={isTrial ? undefined : 'text-agigov-text-muted'}>{t('auth.password')}</span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              className={isTrial ? 'inst-auth-input' : 'mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="inst-auth-hint">{t('auth.passwordHint')}</span>
          </label>
          ) : null}

          {(!isTrial || step === 1) ? (
          <label className={isTrial ? 'auth-field' : 'block text-sm'}>
            <span className={isTrial ? undefined : 'text-agigov-text-muted'}>{t('auth.passwordConfirm')}</span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              className={isTrial ? 'inst-auth-input' : 'mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2'}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </label>
          ) : null}

          {isTrial && step === 1 ? (
            <button type="button" className="auth-reveal" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            </button>
          ) : null}
        </div>

        {!isTrial ? (
        <details className="mt-6 rounded-xl border border-agigov-border bg-agigov-surface/50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-agigov-text">
            {t('reg.optionalDetails')}
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="text-agigov-text-muted">{t('reg.officialCode')}</span>
              <input
                className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 font-mono text-sm text-agigov-text outline-none ring-zinc-500/40 focus:ring-2"
                value={form.officialCode}
                onChange={(e) => patch({ officialCode: e.target.value })}
                placeholder="RIF / código rubro"
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="text-agigov-text-muted">{t('reg.phone')}</span>
              <div className="mt-1 flex gap-2">
                <input
                  className="w-20 rounded-xl border border-agigov-border bg-agigov-surface px-2 py-2.5 font-mono text-sm text-agigov-text outline-none ring-zinc-500/40 focus:ring-2"
                  value={phoneCode}
                  onChange={(e) => patch({ phoneCountryCode: e.target.value })}
                  aria-label={t('reg.phoneCode')}
                />
                <input
                  type="tel"
                  className="min-w-0 flex-1 rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2"
                  value={form.phone ?? ''}
                  onChange={(e) => patch({ phone: e.target.value })}
                  placeholder={t('reg.phonePlaceholder')}
                />
              </div>
            </label>

            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('reg.contactName')}</span>
              <input
                className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2"
                value={form.contactName}
                onChange={(e) => patch({ contactName: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-agigov-text-muted">{t('reg.contactRole')}</span>
              <input
                className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-zinc-500/40 focus:ring-2"
                value={form.contactRole}
                onChange={(e) => patch({ contactRole: e.target.value })}
                placeholder={t('reg.contactRolePlaceholder')}
              />
            </label>
          </div>
        </details>
        ) : null}

        {(!isTrial || step === 2) ? (
        <label className={`flex cursor-pointer items-start gap-3 text-sm ${isTrial ? 'mt-2' : 'mt-6'}`}>
          <input
            type="checkbox"
            className="mt-1"
            checked={form.acceptedTerms}
            onChange={(e) => patch({ acceptedTerms: e.target.checked })}
          />
          <span className="text-agigov-text-muted">{t('reg.terms')}</span>
        </label>
        ) : null}

        {error ? (
          <p className="inst-auth-banner inst-auth-banner--error" role="alert">
            {error}
          </p>
        ) : null}
        {emailAlreadyRegistered ? (
          <p className="mt-2">
            <Link
              to={INSTITUTION_ROUTES.login}
              className="text-sm font-medium text-zinc-700 underline-offset-2 hover:underline"
            >
              {t('auth.alreadyHaveAccount')}
            </Link>
          </p>
        ) : null}

        {isTrial && step === 1 ? (
          <div className="auth-submit-row">
            <button type="submit" className="desk-page-primary-btn justify-center">
              {t('auth.continue')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <span className="auth-step">{stepLabel}</span>
          </div>
        ) : null}
        {isTrial && step === 2 ? (
          <div className="auth-submit-row">
            <button type="button" className="ds-btn-secondary" onClick={() => setStep(1)}>
              {t('pilot.nav.back')}
            </button>
            <button type="submit" className="desk-page-primary-btn justify-center" disabled={submitting}>
              {submitting ? t('trial.bootstrapBusy') : t('trial.submit')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <span className="auth-step">{stepLabel}</span>
          </div>
        ) : null}
        {!isTrial ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="ds-btn-app" disabled={submitting}>
              {t('reg.submit')}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link to={INSTITUTION_ROUTES.login} className="text-sm text-agigov-text-muted no-underline hover:text-zinc-900">
              {t('auth.alreadyHaveAccount')}
            </Link>
            <Link to={INSTITUTION_ROUTES.hub} className="text-sm text-agigov-text-muted no-underline hover:text-zinc-900">
              {t('reg.backInstitutional')}
            </Link>
          </div>
        ) : null}

        {isTrial ? (
          <p className="inst-auth-footnote">
            <Link to={INSTITUTION_ROUTES.login}>{t('auth.alreadyHaveAccount')}</Link>
          </p>
        ) : null}
      </form>
    </div>
  );
}
