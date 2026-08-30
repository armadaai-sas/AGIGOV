import { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  loginInstitution,
  verifyInstitutionMagicLinkToken,
} from '../../institutional/institutionAuth.js';
import { resolvePostLoginRedirect } from '../../institutional/authRedirect.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';

/** Inicio de sesión institucional — correo + contraseña. */
export function InstitutionLoginForm() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { refresh, applySession } = useInstitutionAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [magicBusy, setMagicBusy] = useState(false);

  const redirectTo = resolvePostLoginRedirect(
    searchParams.get('redirect') ??
      (location.state as { from?: string } | null)?.from ??
      null,
  );
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
        applySession(result.session);
        navigate(redirectTo, { replace: true });
        void refresh();
      } else {
        setError(t('auth.error.invalidCredentials'));
        setMagicBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, redirectTo, refresh, applySession, t]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setErrorCode(null);
    try {
      const result = await loginInstitution(email.trim(), password);
      if (result.ok) {
        applySession(result.session);
        navigate(redirectTo, { replace: true });
        void refresh();
      } else {
        setErrorCode(result.error);
        setError(
          result.error === 'invalid_credentials'
            ? t('auth.error.invalidCredentials')
            : result.error === 'password_not_set'
              ? t('auth.error.passwordNotSet')
              : result.error === 'network_error'
                ? t('auth.error.networkError')
                : t('auth.error.serverError'),
        );
      }
    } finally {
      setBusy(false);
    }
  }

  if (magicBusy) {
    return (
      <div className="inst-auth-panel">
        <div className="inst-auth-card inst-auth-card--busy">
          <Loader2 className="h-5 w-5 animate-spin text-agigov-text-muted" aria-hidden />
          <p>{t('auth.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inst-auth-panel">
      <form className="inst-auth-card" onSubmit={(e) => void submit(e)}>
        {loggedOut ? (
          <p className="inst-auth-banner inst-auth-banner--ok" role="status">
            {t('auth.loggedOut')}
          </p>
        ) : null}

        <label className="inst-auth-field">
          <span>{t('reg.officialEmail')}</span>
          <input
            type="email"
            required
            autoComplete="username"
            autoFocus
            className="inst-auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="finanzas@ministerio.gob.ve"
            disabled={busy}
          />
        </label>

        <label className="inst-auth-field">
          <span>{t('auth.password')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            minLength={8}
            className="inst-auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
        </label>

        {error ? (
          <p className="inst-auth-banner inst-auth-banner--error" role="alert">
            {error}
          </p>
        ) : null}

        {errorCode === 'password_not_set' ? (
          <p className="inst-auth-footnote">
            <Link to={INSTITUTION_ROUTES.register}>{t('auth.goRegister')}</Link>
          </p>
        ) : null}

        <button type="submit" className="desk-page-primary-btn w-full justify-center" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t('auth.redirecting')}
            </>
          ) : (
            <>
              {t('auth.submit')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>

        <p className="inst-auth-footnote inst-auth-footnote--center">
          {t('auth.needRegister')}{' '}
          <Link to={INSTITUTION_ROUTES.register}>{t('auth.goRegister')}</Link>
        </p>

        <p className="inst-auth-security">{t('auth.securityNote')}</p>
      </form>
    </div>
  );
}
