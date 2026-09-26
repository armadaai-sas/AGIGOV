import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { AgigovLogo } from '../AgigovLogo.js';
import { useDeskPersonaOptional, useDeskShell } from '../../context/DeskShellContext.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import type { DeskPersonaId } from '../../platform/deskNav.js';
import { authOffer, type AuthOffer, type AuthRoleOffer } from './authOffer.js';

type Props = {
  mode: 'register' | 'login';
  children: ReactNode;
};

const ROLE_ORDER: DeskPersonaId[] = ['state', 'citizen', 'enterprise', 'integrator'];

export function useSelectedAuthRole(): { offer: AuthOffer; selected: AuthRoleOffer } {
  const { sovereign } = useSovereignConfig();
  const persona = useDeskPersonaOptional();
  const offer = authOffer(sovereign.locale);
  const selected = offer.roles.find((item) => item.id === persona) ?? offer.roles[0];
  return { offer, selected };
}

/** Cuenta: una sola pieza. El escritorio se elige arriba; el formulario cierra el mismo ancho. */
export function AuthStage({ mode, children }: Props) {
  const { sovereign } = useSovereignConfig();
  const { setPersona } = useDeskShell();
  const { offer, selected } = useSelectedAuthRole();
  const en = sovereign.locale.toLowerCase().startsWith('en');
  const title = en
    ? mode === 'register'
      ? 'Create account'
      : 'Sign in'
    : mode === 'register'
      ? 'Crear cuenta'
      : 'Iniciar sesión';
  const roles = ROLE_ORDER.map((id) => offer.roles.find((item) => item.id === id)).filter(
    (item): item is AuthRoleOffer => Boolean(item),
  );

  return (
    <div className="auth-stage">
      <header className="auth-bar">
        <div className="auth-bar-inner">
          <Link to="/" className="auth-bar-logo" aria-label="AGIGOV">
            <AgigovLogo size="sm" variant="light" showWordmark />
          </Link>
          <nav className="auth-bar-nav" aria-label={en ? 'Account' : 'Cuenta'}>
            <Link to="/escritorio">{en ? 'Desk' : 'Escritorio'}</Link>
            {mode === 'register' ? (
              <Link to={INSTITUTION_ROUTES.login}>{en ? 'Sign in' : 'Iniciar sesión'}</Link>
            ) : (
              <Link to={INSTITUTION_ROUTES.register}>{en ? 'Create account' : 'Crear cuenta'}</Link>
            )}
          </nav>
        </div>
      </header>

      <div className="auth-sheet-wrap">
        <main className="auth-sheet">
          <h1>{title}</h1>
          <p className="auth-lead">{selected.purpose}</p>
          <div className="auth-roles" role="tablist" aria-label={offer.choose}>
            {roles.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === selected.id}
                className={`auth-role${item.id === selected.id ? ' is-on' : ''}`}
                onClick={() => setPersona(item.id)}
              >
                <span className="auth-role-name">{item.label}</span>
                <span className="auth-role-tile">{item.tile}</span>
              </button>
            ))}
          </div>
          <div className="auth-form">{children}</div>
          {mode === 'register' ? <p className="auth-note">{offer.assurance}</p> : null}
        </main>
      </div>
    </div>
  );
}
