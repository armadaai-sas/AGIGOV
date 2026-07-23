import { useEffect, useState } from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  loginInstitution,
  verifyInstitutionMagicLinkToken,
} from '../../institutional/institutionAuth.js';
import { loadInstitutionRegistration } from '../../institutional/institutionRegistration.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';

/** Inicio de sesión institucional — post-registro o retorno. */
export function InstitutionLoginForm() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { refresh, isRegistered } = useInstitutionAuth();
  const savedEmail = loadInstitutionRegistration().officialEmail.trim();
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [magicBusy, setMagicBusy] = useState(false);

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? INSTITUTION_ROUTES.pilot;
  const loggedOut = Boolean((location.state as { loggedOut?: boolean } | null)?.loggedOut);

  useEffect(() => {
    const magic = searchParams.get('magic')?.trim();
    if (!magic) return;
    let cancelled = false;
    setMagicBusy(true);
    void (async () => {
      const result = await verifyInstitutionMagicLinkToken(magic);
      if (cancelled) return;
      if (result.ok) {
        await refresh();
        navigate(redirectTo, { replace: true });
      } else {
        setError(t('auth.error.badPassword'));
        setMagicBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, redirectTo, refresh, t]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setErrorCode(null);
    try {
      const result = await loginInstitution(email, password);
      switch (result.ok) {
        case true:
          void refresh();
          navigate(redirectTo, { replace: true });
          break;
        case false:
          setErrorCode(result.error);
          if (result.error === 'invalid_credentials') {
            setError(t('auth.error.badPassword'));
          } else {
            setError(t('auth.error.badPassword'));
          }
          break;
      }
    } finally {
      setBusy(false);
    }
  }

  if (magicBusy) {
    return (
      <div className="inst-reg-shell">
        <div className="agigov-card p-6 text-sm text-agigov-text-muted">
          {t('auth.redirecting')}
        </div>
      </div>
    );
  }

  return (
    <div className="inst-reg-shell">
      <div className="inst-reg-hero agigov-card">
        <div className="inst-reg-hero-badge">
          <LogIn className="h-5 w-5 text-sky-400" aria-hidden />
          <span>{t('auth.badge')}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-agigov-text">{t('auth.title')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-agigov-text-muted">{t('auth.lead')}</p>
        <ol className="mt-4 space-y-1 text-xs text-agigov-text-muted">
          <li>1. {t('auth.step.register')}</li>
          <li>2. {t('auth.step.login')}</li>
          <li>3. {t('auth.step.pilot')}</li>
        </ol>
      </div>

      <form className="agigov-card inst-reg-form" onSubmit={(e) => void submit(e)}>
        {loggedOut ? (
          <p className="mb-4 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-100/90">
            {t('auth.loggedOut')}
          </p>
        ) : null}

        {!isRegistered ? (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
            {t('auth.needRegister')}{' '}
            <Link to={INSTITUTION_ROUTES.register} className="text-sky-300 underline-offset-2 hover:underline">
              {t('auth.goRegister')}
            </Link>
          </p>
        ) : null}

        <label className="block text-sm">
          <span className="text-agigov-text-muted">{t('reg.officialEmail')}</span>
          <input
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm">
          <span className="text-agigov-text-muted">{t('auth.password')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            minLength={8}
            className="mt-1 w-full rounded-xl border border-agigov-border bg-white/[0.03] px-3 py-2.5 text-agigov-text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        {errorCode === 'password_not_set' ? (
          <p className="mt-2">
            <Link to={INSTITUTION_ROUTES.register} className="text-sm text-sky-400 underline-offset-2 hover:underline">
              {t('auth.goRegister')}
            </Link>
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="ds-btn-app" disabled={busy}>
            {t('auth.submit')}
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            to={INSTITUTION_ROUTES.register}
            className="text-sm text-agigov-text-muted no-underline hover:text-sky-500"
          >
            {t('auth.createAccount')}
          </Link>
        </div>
      </form>
    </div>
  );
}
