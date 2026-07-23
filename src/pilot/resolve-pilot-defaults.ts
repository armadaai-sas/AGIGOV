import { loadNodeSovereignEnv } from '../config/sovereign/node-config.js';
import type { JurisdictionIso } from '../config/sovereign/jurisdictions.js';
import {
  getPilotProfileForIso,
  type PilotJurisdictionProfile,
} from './pilot-jurisdiction-profiles.js';

/** Slug piloto por defecto según nodo (`AGIGOV_ISO`) o override CLI. */
export function resolveDefaultPilotSlug(isoOverride?: string): string {
  const iso = isoOverride?.trim() || loadNodeSovereignEnv().iso;
  return getPilotProfileForIso(iso).slug;
}

export function resolvePilotProfile(isoOverride?: string): PilotJurisdictionProfile {
  const iso = (isoOverride?.trim() || loadNodeSovereignEnv().iso) as JurisdictionIso;
  return getPilotProfileForIso(iso);
}
