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

/** Cuenta: una tarjeta. El escritorio se elige dentro; el formulario cierra el mismo ancho. */
export function AuthStage({ mode, children }: Props) {
  const { sovereign } = useSovereignConfig();
  const { setPersona } = useDeskShell();
  const { offer, selected } = useSelectedAuthRole();
  const en = sovereign.locale.toLowerCase().startsWith('en');
  const register = mode === 'register';
  const title = en ? (register ? 'Create account' : 'Sign in') : register ? 'Crear cuenta' : 'Iniciar sesión';
  const roles = ROLE_ORDER.map((id) => offer.roles.find((item) => item.id === id)).filter(
    (item): item is AuthRoleOffer => Boolean(item),
  );

  return (
    <div className="auth-stage">
      <div className="auth-frame">
        <header className="auth-mast">
          <Link to="/" className="auth-mast-logo" aria-label="AGIGOV">
            <AgigovLogo size="sm" variant="light" showWordmark />
          </Link>
          <nav className="auth-mast-nav" aria-label={en ? 'Account' : 'Cuenta'}>
            <Link to="/escritorio">{en ? 'Desk' : 'Escritorio'}</Link>
            {register ? (
              <Link to={INSTITUTION_ROUTES.login}>{en ? 'Sign in' : 'Iniciar sesión'}</Link>
            ) : (
              <Link to={INSTITUTION_ROUTES.register}>{en ? 'Create account' : 'Crear cuenta'}</Link>
            )}
          </nav>
        </header>

        <main className="auth-card">
          <h1>{title}</h1>
          <p className="auth-product">
            {offer.product}
            {register ? ` ${offer.why}` : ''}
          </p>
          <p className="auth-choose" id="auth-choose-label">
            {offer.choose}
          </p>
          <div className="auth-roles" role="tablist" aria-labelledby="auth-choose-label">
            {roles.map((item) => {
              const on = item.id === selected.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`auth-role${on ? ' is-on' : ''}`}
                  onClick={() => setPersona(item.id)}
                >
                  <span className="auth-role-name">{item.label}</span>
                  <span className="auth-role-tile">{item.tile}</span>
                </button>
              );
            })}
          </div>
          <p className="auth-lead">{selected.purpose}</p>
          {register ? <p className="auth-can">{selected.actions.join(' · ')}</p> : null}
          <div className="auth-form">{children}</div>
          {register ? <p className="auth-note">{offer.assurance}</p> : null}
        </main>
      </div>
    </div>
  );
}
