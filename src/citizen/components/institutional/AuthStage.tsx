import type { ReactNode } from 'react';

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

/** Registro e inicio de sesión: el relato del rol a la izquierda, el formulario a la derecha. */
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
      <aside className="auth-stage-brand">
        <AgigovLogo size="sm" variant="dark" showWordmark />
        <p className="auth-stage-product">{offer.product}</p>
        <div>
          <p className="auth-stage-kicker">{offer.choose}</p>
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
                <span className="auth-stage-role-label">{item.label}</span>
                <span className="auth-stage-role-hint">{item.tile}</span>
              </button>
            ))}
          </div>
        </div>
        <h1 className="auth-stage-headline">{selected.headline}</h1>
        <ul className="auth-stage-facts">
          <li>
            <span className="auth-stage-fact-label">{offer.innovationLabel}</span>
            <p>{offer.innovation}</p>
          </li>
          <li>
            <span className="auth-stage-fact-label">{offer.whyLabel}</span>
            <p>{offer.why}</p>
          </li>
          <li>
            <span className="auth-stage-fact-label">{offer.canLabel}</span>
            <p>{selected.can}</p>
          </li>
        </ul>
      </aside>
      <div className="auth-stage-form">
        <div className="auth-stage-sheet">
          <header className="auth-stage-sheet-head">
            <p className="auth-stage-sheet-kicker">
              {kicker} · {selected.label}
            </p>
            <h2>{mode === 'register' ? selected.open : selected.enter}</h2>
            <p className="auth-stage-sheet-lead">{selected.purpose}</p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
