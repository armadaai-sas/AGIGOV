import { useEffect, useState } from 'react';
import { ArrowRight, Building2, Landmark, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { JURISDICTIONS, type JurisdictionIso } from '../../../config/sovereign/jurisdictions.js';
import type { MessageKey } from '../../../i18n/index.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  registerInstitutionAuth,
} from '../../institutional/institutionAuth.js';
import {
  isInstitutionRegistrationComplete,
  loadInstitutionRegistration,
  saveInstitutionRegistration,
  type InstitutionEntityType,
  type InstitutionRegistration,
} from '../../institutional/institutionRegistration.js';
import { profileFromIso, slugifyInstitution } from '../../institutional/institutionProfile.js';
import { saveInstitutionProfile } from '../../institutional/institutionProfile.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';

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

type Props = {
  onComplete?: () => void;
};

/** Registro institucional — acceso tipo exchange/KYC para gobierno. */
export function InstitutionRegistrationForm({ onComplete }: Props) {
  const { t, sovereign, setSovereignPref } = useSovereignConfig();
  const navigate = useNavigate();
  const { refresh } = useInstitutionAuth();
  const [form, setForm] = useState<InstitutionRegistration>(() => loadInstitutionRegistration());
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [iso, setIso] = useState<JurisdictionIso>(sovereign.iso);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isGovernmentTier =
    form.entityType === 'ministry' || form.entityType === 'governorship';

  useEffect(() => {
    if (isInstitutionRegistrationComplete()) onComplete?.();
  }, [onComplete]);

  function patch(partial: Partial<InstitutionRegistration>) {
    setForm((prev) => ({ ...prev, ...partial }));
    setError(null);
  }

  function onCountryChange(nextIso: JurisdictionIso) {
    setIso(nextIso);
    setSovereignPref({ iso: nextIso });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.legalName.trim()) {
      setError(t('reg.error.legalName'));
      return;
    }
    if (!form.officialEmail.trim() || !form.officialEmail.includes('@')) {
      setError(t('reg.error.email'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.error.passwordShort'));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('auth.error.passwordMatch'));
      return;
    }
    if (!form.acceptedTerms) {
      setError(t('reg.error.terms'));
      return;
    }

    setBusy(true);
    try {
      const authResult = await registerInstitutionAuth({
        email: form.officialEmail.trim(),
        password,
        institutionName: form.legalName.trim(),
        entityType: form.entityType,
        officialCode: form.officialCode,
        contactName: form.contactName,
        contactRole: form.contactRole,
      });
      if (authResult.ok === false) {
        if (authResult.error === 'email_already_registered') {
          setError(t('auth.error.unknownEmail'));
        } else if (authResult.error === 'password_too_short') {
          setError(t('auth.error.passwordShort'));
        } else {
          setError(t('auth.error.badPassword'));
        }
        return;
      }

      saveInstitutionRegistration({ ...form, passwordHash: 'server-managed' });

      const profile = profileFromIso(iso);
      const ministryPrefix =
        form.entityType === 'municipality'
          ? 'ALC'
          : form.entityType === 'ministry'
            ? 'MIN'
            : form.entityType === 'governorship'
              ? 'GOB'
              : 'AGY';
      const code = slugifyInstitution(form.legalName).slice(0, 8).toUpperCase().replace(/-/g, '') || 'PILOT';
      const ministryCode = `${ministryPrefix}${code}`.slice(0, 12);

      saveInstitutionProfile({
        ...profile,
        iso,
        displayName: form.legalName.trim(),
        ministryCode,
        slug: slugifyInstitution(`${form.legalName}-trust-pilot`),
        contactName: form.contactName.trim(),
        contactEmail: form.officialEmail.trim(),
        programName:
          form.entityType === 'municipality'
            ? 'Mantenimiento urbano verificable — Piloto EGS'
            : profile.programName,
      });

      await refresh();
      onComplete?.();
      navigate(INSTITUTION_ROUTES.pilot, { replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inst-reg-shell">
      <div className="inst-reg-hero agigov-card">
        <div className="inst-reg-hero-badge">
          <ShieldCheck className="h-5 w-5 text-sky-400" aria-hidden />
          <span>{t('reg.badge')}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-agigov-text">{t('reg.title')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-agigov-text-muted">{t('reg.lead')}</p>
        <ul className="mt-4 space-y-1 text-xs text-agigov-text-muted">
          <li>· {t('reg.point1')}</li>
          <li>· {t('reg.point2')}</li>
          <li>· {t('reg.point3')}</li>
        </ul>
        {isGovernmentTier ? (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
            {t('reg.governmentChannel')}
          </p>
        ) : null}
      </div>

      <form className="agigov-card inst-reg-form" onSubmit={submit}>
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
                  onChange={() => patch({ entityType: id })}
                />
                <Icon className="h-5 w-5 text-sky-400" aria-hidden />
                <span className="font-medium text-agigov-text">{t(labelKey)}</span>
                <span className="text-xs text-agigov-text-muted">{t(hintKey)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="text-agigov-text-muted">{t('reg.legalName')}</span>
            <input
              required
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
              value={form.legalName}
              onChange={(e) => patch({ legalName: e.target.value })}
              placeholder={t('reg.legalNamePlaceholder')}
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.jurisdiction')}</span>
            <select
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
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

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.officialCode')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 font-mono text-sm text-agigov-text"
              value={form.officialCode}
              onChange={(e) => patch({ officialCode: e.target.value })}
              placeholder="RIF / código rubro"
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="text-agigov-text-muted">{t('reg.officialEmail')}</span>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
              value={form.officialEmail}
              onChange={(e) => patch({ officialEmail: e.target.value })}
              placeholder="finanzas@alcaldia.gob.ve"
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.contactName')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
              value={form.contactName}
              onChange={(e) => patch({ contactName: e.target.value })}
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.contactRole')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
              value={form.contactRole}
              onChange={(e) => patch({ contactRole: e.target.value })}
              placeholder={t('reg.contactRolePlaceholder')}
            />
          </label>
          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('auth.password')}</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('auth.passwordConfirm')}</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </label>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.acceptedTerms}
            onChange={(e) => patch({ acceptedTerms: e.target.checked })}
          />
          <span className="text-agigov-text-muted">{t('reg.terms')}</span>
        </label>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="ds-btn-app" disabled={busy}>
            {t('reg.submit')}
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link to={INSTITUTION_ROUTES.login} className="text-sm text-agigov-text-muted no-underline hover:text-sky-500">
            {t('auth.alreadyHaveAccount')}
          </Link>
          <Link to={INSTITUTION_ROUTES.hub} className="text-sm text-agigov-text-muted no-underline hover:text-sky-500">
            {t('reg.backInstitutional')}
          </Link>
        </div>
      </form>
    </div>
  );
}
