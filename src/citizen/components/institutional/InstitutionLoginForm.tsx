import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  loginInstitution,
  verifyInstitutionMagicLinkToken,
} from '../../institutional/institutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';

/** Inicio de sesión institucional — solo correo + contraseña (sin hero engañoso). */
export function InstitutionLoginForm() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { refresh } = useInstitutionAuth();
  const [email, setEmail] = useState('');
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
          await refresh();
          navigate(redirectTo, { replace: true });
          break;
        case false:
          setErrorCode(result.error);
          setError(t('auth.error.badPassword'));
          break;
      }
    } finally {
      setBusy(false);
    }
  }

  if (magicBusy) {
    return (
      <div className="mx-auto max-w-md">
        <div className="agigov-card p-6 text-sm text-agigov-text-muted">{t('auth.redirecting')}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form className="agigov-card space-y-5 p-6 sm:p-8" onSubmit={(e) => void submit(e)}>
        {loggedOut ? (
          <p className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-800 dark:text-sky-100/90">
            {t('auth.loggedOut')}
          </p>
        ) : null}

        <label className="block text-sm">
          <span className="font-medium text-agigov-text">{t('reg.officialEmail')}</span>
          <input
            type="email"
            required
            autoComplete="username"
            autoFocus
            className="mt-1.5 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-sky-500/40 focus:ring-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="finanzas@alcaldia.gob.ve"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-agigov-text">{t('auth.password')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            minLength={8}
            className="mt-1.5 w-full rounded-xl border border-agigov-border bg-agigov-surface px-3 py-2.5 text-agigov-text outline-none ring-sky-500/40 focus:ring-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {errorCode === 'password_not_set' ? (
          <p>
            <Link
              to={INSTITUTION_ROUTES.register}
              className="text-sm text-sky-600 underline-offset-2 hover:underline"
            >
              {t('auth.goRegister')}
            </Link>
          </p>
        ) : null}

        <button type="submit" className="ds-btn-app w-full justify-center" disabled={busy}>
          {busy ? t('auth.redirecting') : t('auth.submit')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>

        <p className="text-center text-sm text-agigov-text-muted">
          {t('auth.needRegister')}{' '}
          <Link
            to={INSTITUTION_ROUTES.register}
            className="font-medium text-sky-600 underline-offset-2 hover:underline"
          >
            {t('auth.goRegister')}
          </Link>
        </p>
      </form>
    </div>
  );
}
