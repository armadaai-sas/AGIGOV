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

/** Registro institucional — catálogo por jurisdicción + verificación async. */
export function InstitutionRegistrationForm({ onComplete }: Props) {
  const { t, sovereign, setSovereignPref } = useSovereignConfig();
  const navigate = useNavigate();
  const { refresh } = useInstitutionAuth();
  const [form, setForm] = useState<InstitutionRegistration>(() => loadInstitutionRegistration());
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
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
  const [busy, setBusy] = useState(false);

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
    if (!isOtherEntity && regions.length > 0 && !entityCatalogId) {
      setError(t('reg.error.entityRequired'));
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
        iso,
        regionCode: regionCode || undefined,
        entityCatalogId: entityCatalogId || undefined,
        phone: form.phone?.trim() || undefined,
        phoneCountryCode: phoneCode,
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
      const ministryPrefix =
        form.entityType === 'municipality'
          ? 'ALC'
          : form.entityType === 'ministry'
            ? 'MIN'
            : form.entityType === 'governorship'
              ? 'GOB'
              : 'AGY';
      const code =
        slugifyInstitution(form.legalName).slice(0, 8).toUpperCase().replace(/-/g, '') || 'PILOT';
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
          <ShieldCheck className="h-5 w-5 text-sky-700" aria-hidden />
          <span>{t('reg.badge')}</span>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-agigov-text-muted">
          <li>· {t('reg.point1')}</li>
          <li>· {t('reg.point2')}</li>
          <li>· {t('reg.point3')}</li>
        </ul>
        {isGovernmentTier ? (
          <p className="mt-4 rounded-lg border border-amber-600/35 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950">
            {t('reg.governmentChannel')}
          </p>
        ) : null}
      </div>

      <form className="agigov-card inst-reg-form" onSubmit={(e) => void submit(e)}>
        <p className="mb-4 rounded-lg border border-sky-600/30 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-950">
          {t('reg.verificationNotice')}
        </p>

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
                <Icon className="h-5 w-5 text-sky-400" aria-hidden />
                <span className="font-medium text-agigov-text">{t(labelKey)}</span>
                <span className="text-xs text-agigov-text-muted">{t(hintKey)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

          <label className="block text-sm sm:col-span-2">
            <span className="text-agigov-text-muted">{t('reg.legalName')}</span>
            <input
              required
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
              value={form.legalName}
              onChange={(e) => patch({ legalName: e.target.value })}
              placeholder={t('reg.legalNamePlaceholder')}
              readOnly={!isOtherEntity && Boolean(entityCatalogId)}
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.officialCode')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 font-mono text-sm text-agigov-text"
              value={form.officialCode}
              onChange={(e) => patch({ officialCode: e.target.value })}
              placeholder="RIF / código rubro"
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.phone')}</span>
            <div className="mt-1 flex gap-2">
              <input
                className="w-20 rounded-xl border border-agigov-border bg-agigov-surface px-2 py-2.5 font-mono text-sm text-agigov-text"
                value={phoneCode}
                onChange={(e) => patch({ phoneCountryCode: e.target.value })}
                aria-label={t('reg.phoneCode')}
              />
              <input
                type="tel"
                className="min-w-0 flex-1 rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
                value={form.phone ?? ''}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder={t('reg.phonePlaceholder')}
              />
            </div>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="text-agigov-text-muted">{t('reg.officialEmail')}</span>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
              value={form.officialEmail}
              onChange={(e) => patch({ officialEmail: e.target.value })}
              placeholder="finanzas@alcaldia.gob.ve"
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.contactName')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
              value={form.contactName}
              onChange={(e) => patch({ contactName: e.target.value })}
            />
          </label>

          <label className="block text-sm">
            <span className="text-agigov-text-muted">{t('reg.contactRole')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
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
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
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
              className="mt-1 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text"
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
