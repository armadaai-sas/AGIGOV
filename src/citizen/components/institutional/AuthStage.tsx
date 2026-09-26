import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { AgigovLogo } from '../AgigovLogo.js';
import { useDeskPersonaOptional, useDeskShell } from '../../context/DeskShellContext.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { authOffer, type AuthOffer, type AuthRoleOffer } from './authOffer.js';

type Props = {
  mode: 'register' | 'login';
  children: ReactNode;
};

export function useSelectedAuthRole(): { offer: AuthOffer; selected: AuthRoleOffer } {
  const { sovereign } = useSovereignConfig();
  const persona = useDeskPersonaOptional();
  const offer = authOffer(sovereign.locale);
  const selected = offer.roles.find((item) => item.id === persona) ?? offer.roles[0];
  return { offer, selected };
}

/** Alta e inicio: panel de marca a pantalla completa y formulario centrado. */
export function AuthStage({ mode, children }: Props) {
  const { sovereign } = useSovereignConfig();
  const { setPersona } = useDeskShell();
  const { offer, selected } = useSelectedAuthRole();
  const en = sovereign.locale.toLowerCase().startsWith('en');
  const kicker = en
    ? mode === 'register'
      ? 'Create account'
      : 'Sign in'
    : mode === 'register'
      ? 'Crear cuenta'
      : 'Iniciar sesión';

  return (
    <div className="auth-stage">
      <section className="auth-stage-story">
        <Link to="/" className="auth-stage-logo" aria-label="AGIGOV">
          <AgigovLogo size="sm" variant="dark" showWordmark />
        </Link>
        <div className="auth-stage-story-body">
          <h1 className="auth-stage-headline">{selected.headline}</h1>
          <p className="auth-stage-purpose">{selected.purpose}</p>
          <div className="auth-stage-roles" role="tablist" aria-label={offer.choose}>
            {offer.roles.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === selected.id}
                className={`auth-stage-role${item.id === selected.id ? ' is-on' : ''}`}
                onClick={() => setPersona(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p className="auth-stage-proof">
          {offer.innovation}
          <span>{selected.actions.join(' · ')}</span>
        </p>
      </section>

      <section className="auth-stage-form">
        <div className="auth-stage-sheet">
          <header className="auth-stage-sheet-head">
            <p className="auth-stage-sheet-kicker">{selected.label}</p>
            <h2>{kicker}</h2>
            <p className="auth-stage-sheet-lead">
              {mode === 'register' ? offer.assurance : selected.can}
            </p>
          </header>
          {children}
        </div>
      </section>
    </div>
  );
}
