import { useMemo } from 'react';

import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from './useInstitutionAuth.js';
import { useInstitutionProfile } from './useInstitutionProfile.js';

/** Ministerio activo en consola EGS — perfil institucional si hay sesión, si no nodo/jurisdicción. */
export function useEgsMinistryScope() {
  const { sovereign } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();
  const { profile } = useInstitutionProfile();

  return useMemo(() => {
    const scoped = isAuthenticated && profile.ministryCode?.trim();
    return {
      ministryCode: scoped ? profile.ministryCode : sovereign.ministryCode,
      slug: profile.slug,
      displayName: profile.displayName,
      programName: profile.programName,
      isPersonalScope: Boolean(scoped),
    };
  }, [isAuthenticated, profile, sovereign.ministryCode]);
}
