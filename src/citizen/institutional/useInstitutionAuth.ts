import { useCallback, useEffect, useState } from 'react';

import { isInstitutionRegistrationComplete } from './institutionRegistration.js';
import {
  loadInstitutionSession,
  logoutInstitution,
  refreshInstitutionSessionFromServer,
  type InstitutionSession,
} from './institutionAuth.js';

export function useInstitutionAuth() {
  const [session, setSession] = useState<InstitutionSession | null>(() => loadInstitutionSession());
  const [registered, setRegistered] = useState(() => isInstitutionRegistrationComplete());

  const refresh = useCallback(async () => {
    const next = await refreshInstitutionSessionFromServer();
    setSession(next ?? loadInstitutionSession());
    setRegistered(isInstitutionRegistrationComplete());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === 'agigov-institution-session-v1' ||
        e.key === 'agigov-institution-registration-v1'
      ) {
          void refresh();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const logout = useCallback(async () => {
    await logoutInstitution();
    await refresh();
  }, [refresh]);

  return {
    session,
    isAuthenticated: session !== null,
    /** Perfil local espejo; auth real = isAuthenticated (server session). */
    isRegistered: session !== null || registered,
    refresh,
    logout,
  };
}
