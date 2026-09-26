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

/** Registro e inicio de sesión: relato amplio a la izquierda, formulario en calma a la derecha. */
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
          <AgigovLogo size="sm" variant="light" showWordmark />
        </Link>
        <div className="auth-stage-story-body">
          <p className="auth-stage-kicker">{offer.product}</p>
          <h1 className="auth-stage-headline">{selected.headline}</h1>
          <p className="auth-stage-purpose">{selected.purpose}</p>
          <div className="auth-stage-roles" role="tablist" aria-label={offer.choose}>
            {offer.roles.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === selected.id}
                className={`auth-stage-role${item.id === selected.id ? ' is-on' : ''}`}
                onClick={() => setPersona(item.id)}
              >
                <span className="auth-stage-role-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="auth-stage-role-copy">
                  <span className="auth-stage-role-label">{item.label}</span>
                  <span className="auth-stage-role-hint">{item.tile}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="auth-stage-proof">
          <p className="auth-stage-innovation">
            <span>{offer.innovationLabel}. </span>
            {offer.innovation}
          </p>
          <p className="auth-stage-why">
            <span>{offer.whyLabel}. </span>
            {offer.why}
          </p>
          <ul className="auth-stage-actions" aria-label={offer.canLabel}>
            {selected.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="auth-stage-form">
        <div className="auth-stage-sheet">
          <header className="auth-stage-sheet-head">
            <p className="auth-stage-sheet-kicker">
              {kicker} · {selected.label}
            </p>
            <h2>{mode === 'register' ? selected.open : selected.enter}</h2>
            <p className="auth-stage-sheet-lead">
              {mode === 'register' ? offer.assurance : selected.purpose}
            </p>
          </header>
          {children}
        </div>
      </section>
    </div>
  );
}
