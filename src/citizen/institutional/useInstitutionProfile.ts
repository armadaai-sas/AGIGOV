import { useCallback, useEffect, useState } from 'react';

import type { JurisdictionIso } from '../../config/sovereign/jurisdictions.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import {
  loadInstitutionProfile,
  profileFromIso,
  saveInstitutionProfile,
  type InstitutionProfileDraft,
} from './institutionProfile.js';

export function useInstitutionProfile() {
  const { sovereign } = useSovereignConfig();
  const [profile, setProfile] = useState<InstitutionProfileDraft>(() =>
    loadInstitutionProfile(sovereign.iso),
  );

  useEffect(() => {
    setProfile(loadInstitutionProfile(sovereign.iso));
  }, [sovereign.iso]);

  const resetToCountry = useCallback((iso: JurisdictionIso) => {
    setProfile(profileFromIso(iso));
  }, []);

  const patch = useCallback((partial: Partial<InstitutionProfileDraft>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  }, []);

  const persist = useCallback(() => {
    saveInstitutionProfile(profile);
  }, [profile]);

  return { profile, setProfile, patch, persist, resetToCountry, sovereign };
}
